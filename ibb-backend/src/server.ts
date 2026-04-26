import 'express-async-errors'
import express, { Application } from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import mongoSanitize from 'express-mongo-sanitize'
import path from 'path'
import fs from 'fs'

import { config } from './config'
import { connectDB } from './config/database'
import { logger, morganStream } from './utils/logger'
import { redisService } from './services/redis'
import { aiService } from './services/ai'
import { initWebSocket } from './services/websocket'
import { metricsMiddleware } from './services/metrics'
import { gracefulShutdown } from './services/bull'
import { startScraperCron } from './modules/modules'
import apiGateway from './gateway'
import {
  requestId,
  requestLogger,
  globalLimiter,
  errorHandler,
  notFound,
} from './middleware'

// ── Import workers (registers Bull processors) ────────────────────
import './jobs/workers'

// ── Ensure upload directories exist ──────────────────────────────
const uploadDirs = [config.upload.dir, './uploads/reports', config.log.dir]
uploadDirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) })

// ══════════════════════════════════════════════════════════════════
// APP SETUP
// ══════════════════════════════════════════════════════════════════
const app: Application = express()
const server = http.createServer(app)

// ── Security middleware ────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: config.isProd,
  crossOriginEmbedderPolicy: false,
}))

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000']
    if (!origin || allowed.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
}))

// ── Request middleware ─────────────────────────────────────────────
app.use(requestId)
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(mongoSanitize())  // Prevent NoSQL injection
app.use(morgan('combined', { stream: morganStream, skip: (req) => req.path === '/api/health' }))
app.use(requestLogger)
app.use(metricsMiddleware)
app.use(globalLimiter)

// ── Static files ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// ── API Gateway ────────────────────────────────────────────────────
app.use('/api', apiGateway)

// ── Error handling ─────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ══════════════════════════════════════════════════════════════════
// STARTUP
// ══════════════════════════════════════════════════════════════════
async function start() {
  // 1. Database
  await connectDB()

  // 2. Redis
  await redisService.connect()

  // 3. WebSocket
  initWebSocket(server)

  // 4. AI service health check (non-blocking)
  aiService.healthCheck().then(ok => {
    if (!ok) logger.warn('AI service unavailable at startup — fallback analysis will be used')
  })

  // 5. Start cron jobs
  if (config.isProd || process.env.ENABLE_CRON === 'true') {
    startScraperCron()
  }

  // 6. Listen
  server.listen(config.port, () => {
    logger.info(`
╔═══════════════════════════════════════════════════════════╗
║         INTERNET BLACK BOX — Backend API v2.0             ║
╠═══════════════════════════════════════════════════════════╣
║  REST API   : http://localhost:${config.port}/api                ║
║  WebSocket  : ws://localhost:${config.port}/ws                   ║
║  Health     : http://localhost:${config.port}/api/health         ║
║  Metrics    : http://localhost:${config.port}/api/metrics        ║
║  Env        : ${config.env.padEnd(45)}║
╚═══════════════════════════════════════════════════════════╝
    `)
  })
}

// ══════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ══════════════════════════════════════════════════════════════════
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — starting graceful shutdown`)

  server.close(async () => {
    await gracefulShutdown()
    await redisService.disconnect()
    const { disconnectDB } = await import('./config/database')
    await disconnectDB()
    logger.info('Graceful shutdown complete')
    process.exit(0)
  })

  // Force exit after 30s
  setTimeout(() => {
    logger.error('Forced shutdown after 30s timeout')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
process.on('uncaughtException',  (err) => { logger.error('Uncaught exception:', err); process.exit(1) })
process.on('unhandledRejection', (err) => { logger.error('Unhandled rejection:', err) })

start()

export { app, server }
