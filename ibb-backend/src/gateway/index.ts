import { Router, Request, Response } from 'express'
import authRouter from '../modules/auth'
import contentRouter from '../modules/content'
import analyticsRouter from '../modules/analytics'
import {
  userRouter, notifRouter, reportRouter,
  adminRouter, scraperRouter, datasetRouter,
} from '../modules/modules'
import { metricsRouter } from '../services/metrics'
import { getQueueStats } from '../services/bull'
import { redisService } from '../services/redis'
import { aiService } from '../services/ai'
import { getOnlineCount } from '../services/websocket'
import { authenticate, authorize } from '../middleware'
import { logger } from '../utils/logger'
import mongoose from 'mongoose'

const router = Router()

// ── Health check (public) ──────────────────────────────────────────
router.get('/health', async (_req: Request, res: Response) => {
  const [redisOk, aiOk] = await Promise.all([
    redisService.ping(),
    aiService.healthCheck(),
  ])

  const dbState = mongoose.connection.readyState
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected'

  const status = redisOk && dbState === 1 ? 'ok' : 'degraded'

  res.status(status === 'ok' ? 200 : 207).json({
    status,
    version: '2.0.0',
    service: 'internet-black-box-api',
    timestamp: new Date(),
    services: {
      mongodb: { status: dbStatus },
      redis: { status: redisOk ? 'connected' : 'disconnected' },
      aiService: { status: aiOk ? 'connected' : 'unavailable' },
      websocket: { connections: getOnlineCount() },
    },
  })
})

// ── Readiness probe (for Kubernetes) ──────────────────────────────
router.get('/ready', (_req: Request, res: Response) => {
  const isReady = mongoose.connection.readyState === 1
  res.status(isReady ? 200 : 503).json({ ready: isReady })
})

// ── API info ──────────────────────────────────────────────────────
router.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Internet Black Box API',
    version: '2.0.0',
    description: 'Research platform for digital behavioral analysis',
    docs: '/api/docs',
    health: '/api/health',
    modules: [
      'auth', 'users', 'content', 'analytics',
      'reports', 'notifications', 'admin', 'scraper', 'datasets',
    ],
  })
})

// ── Module routes ─────────────────────────────────────────────────
router.use('/auth',          authRouter)
router.use('/users',         userRouter)
router.use('/content',       contentRouter)
router.use('/analytics',     analyticsRouter)
router.use('/reports',       reportRouter)
router.use('/notifications', notifRouter)
router.use('/admin',         adminRouter)
router.use('/scraper',       scraperRouter)
router.use('/datasets',      datasetRouter)

// ── Queue status (admin only) ─────────────────────────────────────
router.get('/queues',
  authenticate, authorize('admin', 'superadmin'),
  async (_req: Request, res: Response) => {
    const stats = await getQueueStats()
    res.json({ success: true, data: stats })
  }
)

// ── Metrics ───────────────────────────────────────────────────────
router.use('/', metricsRouter)

logger.info('API Gateway routes registered')
export default router
