import client from 'prom-client'
import { Request, Response, Router } from 'express'
import { config } from '../../config'
import { logger } from '../../utils/logger'

// ── Default metrics (CPU, memory, event loop) ─────────────────────
client.collectDefaultMetrics({ prefix: 'ibb_' })

// ── Custom metrics ────────────────────────────────────────────────
export const httpRequestDuration = new client.Histogram({
  name: 'ibb_http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
})

export const httpRequestCounter = new client.Counter({
  name: 'ibb_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
})

export const contentAnalyzedCounter = new client.Counter({
  name: 'ibb_content_analyzed_total',
  help: 'Total content items analyzed',
  labelNames: ['category', 'sentiment'],
})

export const viralAlertsCounter = new client.Counter({
  name: 'ibb_viral_alerts_total',
  help: 'Total viral content alerts triggered',
})

export const misinfoFlaggedCounter = new client.Counter({
  name: 'ibb_misinfo_flagged_total',
  help: 'Total misinformation items flagged',
  labelNames: ['category'],
})

export const activeWebSocketGauge = new client.Gauge({
  name: 'ibb_websocket_connections_active',
  help: 'Number of active WebSocket connections',
})

export const cacheHitCounter = new client.Counter({
  name: 'ibb_redis_cache_hits_total',
  help: 'Total Redis cache hits',
})

export const cacheMissCounter = new client.Counter({
  name: 'ibb_redis_cache_misses_total',
  help: 'Total Redis cache misses',
})

export const queueJobCounter = new client.Counter({
  name: 'ibb_queue_jobs_total',
  help: 'Total Bull queue jobs processed',
  labelNames: ['queue', 'status'],
})

export const aiServiceLatency = new client.Histogram({
  name: 'ibb_ai_service_latency_ms',
  help: 'Latency of AI service calls in ms',
  buckets: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
})

// ── HTTP timing middleware ─────────────────────────────────────────
export const metricsMiddleware = (req: Request, res: Response, next: Function) => {
  if (!config.metrics.enabled) return next()
  const start = Date.now()
  const route = req.route?.path || req.path

  res.on('finish', () => {
    const duration = Date.now() - start
    const labels = { method: req.method, route, status_code: res.statusCode }
    httpRequestDuration.observe(labels, duration)
    httpRequestCounter.inc(labels)
  })

  next()
}

// ── Metrics endpoint ──────────────────────────────────────────────
export const metricsRouter = Router()

metricsRouter.get('/metrics', async (_req: Request, res: Response) => {
  if (!config.metrics.enabled) return res.status(404).json({ message: 'Metrics disabled' })
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

metricsRouter.get('/metrics/json', async (_req: Request, res: Response) => {
  const metrics = await client.register.getMetricsAsJSON()
  res.json({ success: true, data: metrics, timestamp: new Date() })
})

logger.info('Prometheus metrics initialized')
