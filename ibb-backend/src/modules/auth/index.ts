import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { body } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import { User, ActivityLog, Notification } from '../../models'
import { redisService } from '../../services/redis'
import { addEmailJob, addNotifJob } from '../../services/bull'
import { config } from '../../config'
import { authLog } from '../../utils/logger'
import { sendSuccess, sendError, randomToken } from '../../utils/helpers'
import { authenticate, authLimiter, validate } from '../../middleware'
import { AuthRequest } from '../../types'

// ── JWT helpers ───────────────────────────────────────────────────
const signAccess  = (id: string) => jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expire as any })
const signRefresh = (id: string) => jwt.sign({ id }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpire as any })

const issueTokens = (id: string) => ({
  accessToken: signAccess(id),
  refreshToken: signRefresh(id),
})

// ── Validators ────────────────────────────────────────────────────
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain letters and numbers'),
  body('role').optional().isIn(['researcher', 'user']),
  body('institution').optional().trim().isLength({ max: 200 }),
]

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
]

// ══════════════════════════════════════════════════════════════════
// CONTROLLERS
// ══════════════════════════════════════════════════════════════════

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, institution } = req.body

  const existing = await User.findOne({ email })
  if (existing) return sendError(res, 'Email is already registered', 409)

  const apiKey = `ibb_sk_${uuidv4().replace(/-/g, '').slice(0, 24)}`
  const emailVerifyToken = randomToken(48)

  const user = await User.create({
    name, email, password,
    role: role === 'researcher' ? 'researcher' : 'user',
    status: role === 'researcher' ? 'pending' : 'active',
    institution,
    apiKey,
    emailVerifyToken: crypto.createHash('sha256').update(emailVerifyToken).digest('hex'),
  })

  // Queue verification email
  await addEmailJob({
    to: email,
    subject: 'Verify your IBB account',
    template: 'verify-email',
    context: { name, token: emailVerifyToken, role: user.role },
  })

  await ActivityLog.create({
    type: 'user_registered', action: `New ${user.role} registered: ${email}`,
    service: 'auth', severity: 'info', ip: req.ip,
  })

  authLog.info(`User registered: ${email} [${user.role}]`)

  sendSuccess(res, { id: user._id, email: user.email, role: user.role, status: user.status },
    role === 'researcher'
      ? 'Registration successful. Your researcher account is pending approval.'
      : 'Registration successful. Please verify your email.',
    201
  )
}

// POST /auth/login
export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body
  const ip = req.ip
  const ua = req.headers['user-agent']

  const user = await User.findOne({ email }).select('+password +refreshTokens +failedLoginAttempts +lockUntil')

  if (!user) {
    authLog.warn(`Login failed: unknown email ${email}`)
    return sendError(res, 'Invalid credentials', 401)
  }

  if (user.isLocked()) {
    authLog.warn(`Login attempt on locked account: ${email}`)
    return sendError(res, 'Account locked. Try again later or reset your password.', 423)
  }

  if (user.status === 'banned') return sendError(res, 'Account has been banned', 403)
  if (user.status === 'suspended') return sendError(res, 'Account suspended. Contact support.', 403)
  if (user.status === 'pending') return sendError(res, 'Account pending approval.', 403)

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    await user.incrementLoginAttempts()
    authLog.warn(`Failed login attempt #${user.failedLoginAttempts + 1}: ${email}`)
    return sendError(res, 'Invalid credentials', 401)
  }

  const { accessToken, refreshToken } = issueTokens(user._id.toString())

  // Store refresh token hash
  const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const MAX_SESSIONS = 5
  const tokens = [...(user.refreshTokens || []).slice(-(MAX_SESSIONS - 1)), hashedRefresh]

  await User.findByIdAndUpdate(user._id, {
    lastLogin: new Date(),
    $inc: { loginCount: 1 },
    failedLoginAttempts: 0,
    $unset: { lockUntil: 1 },
    refreshTokens: tokens,
  })

  await ActivityLog.create({
    type: 'user_login', action: `User logged in: ${email}`,
    userId: user._id, service: 'auth', severity: 'info', ip, userAgent: ua,
  })

  authLog.info(`Login success: ${email} [${user.role}]`)

  // Cache user session
  await redisService.set(`session:${user._id}`, { id: user._id, role: user.role, status: user.status }, 900)

  sendSuccess(res, {
    accessToken,
    refreshToken,
    user: {
      id: user._id, name: user.name, email: user.email,
      role: user.role, institution: user.institution,
      emailVerified: user.emailVerified, createdAt: user.createdAt,
    },
  }, 'Login successful')
}

// POST /auth/refresh
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) return sendError(res, 'Refresh token required', 400)

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string }
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex')

    const user = await User.findById(decoded.id).select('+refreshTokens')
    if (!user || !user.refreshTokens.includes(hashedToken)) {
      return sendError(res, 'Invalid refresh token', 401)
    }
    if (user.status !== 'active') return sendError(res, 'Account inactive', 403)

    const { accessToken, refreshToken: newRefreshToken } = issueTokens(user._id.toString())
    const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')

    // Rotate refresh token
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: hashedToken },
      $push: { refreshTokens: newHash },
    })

    sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed')
  } catch {
    return sendError(res, 'Invalid or expired refresh token', 401)
  }
}

// POST /auth/logout
export const logout = async (req: AuthRequest, res: Response) => {
  const token = req.headers.authorization?.slice(7)
  const { refreshToken } = req.body

  if (token) {
    const decoded = jwt.decode(token) as any
    const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 900
    if (ttl > 0) await redisService.set(`blacklist:${token}`, '1', ttl)
  }

  if (refreshToken && req.user) {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await User.findByIdAndUpdate(req.user._id, { $pull: { refreshTokens: hash } })
  }

  await redisService.del(`session:${req.user?._id}`)
  authLog.info(`User logged out: ${req.user?.email}`)
  sendSuccess(res, null, 'Logged out successfully')
}

// POST /auth/logout-all (invalidate all sessions)
export const logoutAll = async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(req.user!._id, { refreshTokens: [] })
  await redisService.del(`session:${req.user!._id}`)
  authLog.info(`All sessions invalidated: ${req.user!.email}`)
  sendSuccess(res, null, 'All sessions terminated')
}

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  // Always respond 200 to prevent email enumeration
  if (!user) return sendSuccess(res, null, 'If that email exists, a reset link has been sent')

  const resetToken = randomToken(48)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  await User.findByIdAndUpdate(user._id, {
    passwordResetToken: hashedToken,
    passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 min
  })

  await addEmailJob({
    to: email,
    subject: 'Reset your IBB password',
    template: 'reset-password',
    context: { name: user.name, token: resetToken },
  })

  authLog.info(`Password reset requested for: ${email}`)
  sendSuccess(res, null, 'If that email exists, a reset link has been sent')
}

// POST /auth/reset-password/:token
export const resetPassword = async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires')

  if (!user) return sendError(res, 'Invalid or expired reset token', 400)

  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  user.failedLoginAttempts = 0
  user.lockUntil = undefined
  user.refreshTokens = []
  await user.save()

  authLog.info(`Password reset successful: ${user.email}`)
  sendSuccess(res, null, 'Password reset successfully. Please log in.')
}

// GET /auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  sendSuccess(res, req.user)
}

// PATCH /auth/change-password
export const changePassword = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).select('+password')
  if (!user) return sendError(res, 'User not found', 404)

  const isMatch = await user.comparePassword(req.body.currentPassword)
  if (!isMatch) return sendError(res, 'Current password is incorrect', 400)

  user.password = req.body.newPassword
  user.refreshTokens = [] // invalidate all sessions on password change
  await user.save()

  authLog.info(`Password changed: ${user.email}`)
  sendSuccess(res, null, 'Password changed. Please log in again.')
}

// ══════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════
const router = Router()

router.post('/register',        authLimiter, registerValidator, validate, register)
router.post('/login',           authLimiter, loginValidator,    validate, login)
router.post('/refresh',         authLimiter, refresh)
router.post('/logout',          authenticate, logout)
router.post('/logout-all',      authenticate, logoutAll)
router.post('/forgot-password', authLimiter, body('email').isEmail(), validate, forgotPassword)
router.post('/reset-password/:token', authLimiter,
  body('password').isLength({ min: 8 }), validate, resetPassword)
router.get('/me',               authenticate, getMe)
router.patch('/change-password', authenticate,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  validate, changePassword)

export default router
