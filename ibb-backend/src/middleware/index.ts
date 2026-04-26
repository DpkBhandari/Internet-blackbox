import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { v4 as uuidv4 } from 'uuid'
import { validationResult } from 'express-validator'
import { User } from '../models'
import { redisService } from '../services/redis'
import { config } from '../config'
import { logger, authLog } from '../utils/logger'
import { AuthRequest } from '../types'
import { sendError } from '../utils/helpers'

// ═══════════════════════════════════════════════════════════════════
// REQUEST ID — attach unique ID to every request for log tracing
// ═══════════════════════════════════════════════════════════════════
export const requestId = (req: AuthRequest, _res: Response, next: NextFunction) => {
  req.requestId = req.headers['x-request-id'] as string || uuidv4()
  _res.setHeader('X-Request-ID', req.requestId)
  next()
}

// ═══════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) return sendError(res, 'Access token required', 401)

    // Check token blacklist in Redis
    const isBlacklisted = await redisService.get(`blacklist:${token}`)
    if (isBlacklisted) return sendError(res, 'Token has been revoked', 401)

    const decoded = jwt.verify(token, config.jwt.secret) as { id: string; iat: number }
    const user = await User.findById(decoded.id)

    if (!user) return sendError(res, 'User not found', 401)
    if (user.status === 'banned') return sendError(res, 'Account has been banned', 403)
    if (user.status === 'suspended') return sendError(res, 'Account suspended. Contact support.', 403)
    if (user.isLocked()) return sendError(res, 'Account temporarily locked due to failed logins', 423)

    req.user = user
    authLog.debug(`Authenticated: ${user.email} [${user.role}]`, { requestId: req.requestId })
    next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401)
    if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401)
    authLog.error(`Auth error: ${err.message}`)
    return sendError(res, 'Authentication failed', 401)
  }
}

// ═══════════════════════════════════════════════════════════════════
// AUTHORIZATION — role-based access control
// ═══════════════════════════════════════════════════════════════════
export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 'Not authenticated', 401)
    if (!roles.includes(req.user.role)) {
      authLog.warn(`Unauthorized: ${req.user.email} tried to access ${req.path} (needs: ${roles.join('|')})`)
      return sendError(res, `Insufficient permissions. Required: ${roles.join(' or ')}`, 403)
    }
    next()
  }

// ═══════════════════════════════════════════════════════════════════
// OPTIONAL AUTH — attach user if token present, continue either way
// ═══════════════════════════════════════════════════════════════════
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.slice(7)
    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as { id: string }
      req.user = await User.findById(decoded.id) || undefined
    }
  } catch { /* silently continue */ }
  next()
}

// ═══════════════════════════════════════════════════════════════════
// API KEY AUTH — for external integrations
// ═══════════════════════════════════════════════════════════════════
export const apiKeyAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string
  if (!apiKey) return sendError(res, 'API key required', 401)

  const user = await User.findOne({ apiKey }).select('+apiKey')
  if (!user || user.status !== 'active') return sendError(res, 'Invalid or inactive API key', 401)

  req.user = user
  next()
}

// ═══════════════════════════════════════════════════════════════════
// RATE LIMITERS
// ═══════════════════════════════════════════════════════════════════
const limiterOptions = (max: number) => ({
  windowMs: config.rateLimit.windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  skip: (req: Request) => req.ip === '127.0.0.1', // skip localhost in dev
})

export const globalLimiter  = rateLimit(limiterOptions(config.rateLimit.max))
export const authLimiter    = rateLimit({ ...limiterOptions(config.rateLimit.authMax), windowMs: 15 * 60 * 1000 })
export const uploadLimiter  = rateLimit(limiterOptions(config.rateLimit.uploadMax))
export const strictLimiter  = rateLimit(limiterOptions(30)) // for sensitive ops

// ═══════════════════════════════════════════════════════════════════
// VALIDATION — express-validator result handler
// ═══════════════════════════════════════════════════════════════════
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: (e as any).path, message: e.msg })),
    })
  }
  next()
}

// ═══════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════
export const errorHandler = (
  err: any, req: AuthRequest, res: Response, _next: NextFunction
) => {
  const status = err.statusCode || err.status || 500
  const requestId = req.requestId

  // Log every error
  if (status >= 500) {
    logger.error(`[${status}] ${req.method} ${req.path} — ${err.message}`, {
      requestId, stack: err.stack, userId: req.user?._id,
    })
  } else {
    logger.warn(`[${status}] ${req.method} ${req.path} — ${err.message}`, { requestId })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => ({ field: e.path, message: e.message }))
    return res.status(422).json({ success: false, message: 'Validation error', errors })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({ success: false, message: `${field} already exists` })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token', 401)
  if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401)

  res.status(status).json({
    success: false,
    message: config.isProd && status === 500 ? 'Internal server error' : err.message,
    requestId,
    ...(config.isDev && { stack: err.stack }),
  })
}

// ═══════════════════════════════════════════════════════════════════
// NOT FOUND
// ═══════════════════════════════════════════════════════════════════
export const notFound = (req: Request, res: Response) =>
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })

// ═══════════════════════════════════════════════════════════════════
// REQUEST LOGGER MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════
export const requestLogger = (req: AuthRequest, res: Response, next: NextFunction) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http'
    logger.log(level, `${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
      requestId: req.requestId,
      userId: req.user?._id,
      ip: req.ip,
    })
  })
  next()
}
