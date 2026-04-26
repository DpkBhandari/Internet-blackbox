import { Request, Response, Router } from 'express'
import { body, query, param } from 'express-validator'
import multer from 'multer'
import path from 'path'
import { Content, SentimentResult, ActivityLog, Trend } from '../../models'
import { aiService } from '../../services/ai'
import { redisService, withCache } from '../../services/redis'
import { addAnalysisJob } from '../../services/bull'
import { contentLog } from '../../utils/logger'
import { sendSuccess, sendError, sendPaginated, parsePagination, buildDateFilter } from '../../utils/helpers'
import { authenticate, authorize, uploadLimiter, validate } from '../../middleware'
import { AuthRequest, ContentCategory } from '../../types'
import { config } from '../../config'

// ── File upload ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: config.upload.dir,
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['.txt', '.csv', '.json', '.jsonl', '.xlsx']
    const ext = path.extname(file.originalname).toLowerCase()
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Unsupported file type'))
  },
})

// ══════════════════════════════════════════════════════════════════
// CONTROLLERS
// ══════════════════════════════════════════════════════════════════

// POST /content/analyze
export const analyzeContent = async (req: AuthRequest, res: Response) => {
  const { text, url, source = 'manual', category = 'General', isPublic = false, tags } = req.body
  const contentText = text?.trim()
  if (!contentText && !url) return sendError(res, 'Provide text or url', 400)

  const startTime = Date.now()

  // Call AI service
  const analysis = await aiService.analyze(contentText || `URL: ${url}`)

  const content = await Content.create({
    title: contentText?.split('\n')[0]?.slice(0, 200),
    text: contentText || `URL: ${url}`,
    url,
    source,
    category,
    language: analysis.language,
    sentiment: {
      score: analysis.sentiment.score,
      label: analysis.sentiment.label,
      confidence: analysis.sentiment.confidence,
      emotions: new Map(Object.entries(analysis.sentiment.emotions)),
    },
    virality: {
      score: analysis.virality.score,
      level: analysis.virality.level,
      shares: Math.floor(Math.random() * 10000),
      reach: Math.floor(Math.random() * 50000),
      velocity: Math.random() * 5,
    },
    misinfo: {
      flagged: analysis.misinfo.flagged,
      confidence: analysis.misinfo.confidence,
      type: analysis.misinfo.type,
      signals: analysis.misinfo.signals,
    },
    keywords: analysis.keywords,
    entities: analysis.entities,
    toxicity: analysis.toxicity,
    wordCount: analysis.word_count,
    readabilityGrade: analysis.readability_grade,
    analyzedBy: req.user!._id,
    isPublic,
    tags: tags || [],
  })

  // Persist sentiment result separately for analytics
  await SentimentResult.create({
    contentId: content._id,
    score: analysis.sentiment.score,
    label: analysis.sentiment.label,
    confidence: analysis.sentiment.confidence,
    emotions: new Map(Object.entries(analysis.sentiment.emotions)),
    toxicity: analysis.toxicity,
    virality: analysis.virality.score,
    keywords: analysis.keywords,
    entities: analysis.entities,
    modelVersion: 'v2.0',
    processingTimeMs: Date.now() - startTime,
  })

  // Update user stats
  await req.user!.updateOne({ $inc: { 'stats.analysesRun': 1 } })

  // Invalidate dashboard cache
  await redisService.delPattern('cache:analytics:*')
  await redisService.delPattern('cache:dashboard:*')

  // Log activity
  await ActivityLog.create({
    type: 'content_analyzed',
    action: `Content analyzed: ${analysis.word_count} words, sentiment: ${analysis.sentiment.label} (${analysis.sentiment.score.toFixed(2)})`,
    userId: req.user!._id,
    service: 'content',
    severity: analysis.misinfo.flagged ? 'warning' : 'info',
    metadata: { contentId: content._id, category, viralityScore: analysis.virality.score },
  })

  contentLog.info(`Content analyzed: ${content._id} [${category}] by ${req.user!.email}`)

  sendSuccess(res, content, 'Content analyzed successfully', 201)
}

// POST /content/analyze/batch (queue job)
export const analyzeBatch = async (req: AuthRequest, res: Response) => {
  const { texts, source = 'batch', category = 'General' } = req.body
  if (!Array.isArray(texts) || texts.length === 0) return sendError(res, 'texts array required', 400)
  if (texts.length > 100) return sendError(res, 'Maximum 100 texts per batch', 400)

  // Queue analysis jobs
  const jobs = await Promise.all(
    texts.map((text: string) => addAnalysisJob({ contentId: 'pending', text, userId: req.user!._id.toString() }))
  )

  sendSuccess(res, {
    jobCount: jobs.length,
    jobIds: jobs.map(j => j.id),
    message: 'Batch queued for processing',
  }, 'Batch analysis queued', 202)
}

// GET /content
export const getContents = async (req: AuthRequest, res: Response) => {
  const { page, limit, sort } = parsePagination(req.query as any)
  const { category, misinfo, label, platform, source, days } = req.query

  const filter: any = {}
  if (category) filter.category = category
  if (misinfo !== undefined) filter['misinfo.flagged'] = misinfo === 'true'
  if (label) filter['sentiment.label'] = label
  if (platform) filter.platform = platform
  if (source) filter.source = source
  if (!req.user || req.user.role === 'user') filter.isPublic = true

  const dateFilter = buildDateFilter(days as string)
  Object.assign(filter, dateFilter)

  const [items, total] = await Promise.all([
    Content.find(filter)
      .sort(sort || '-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('analyzedBy', 'name email')
      .lean(),
    Content.countDocuments(filter),
  ])

  sendPaginated(res, items, total, { page, limit, sort })
}

// GET /content/:id
export const getContentById = async (req: AuthRequest, res: Response) => {
  const cacheKey = `cache:content:${req.params.id}`
  const cached = await redisService.get(cacheKey)
  if (cached) return sendSuccess(res, cached)

  const content = await Content.findById(req.params.id)
    .populate('analyzedBy', 'name email role')

  if (!content) return sendError(res, 'Content not found', 404)
  if (!content.isPublic && req.user?.role === 'user' && content.analyzedBy?._id?.toString() !== req.user._id.toString()) {
    return sendError(res, 'Access denied', 403)
  }

  await redisService.set(cacheKey, content, 120)
  sendSuccess(res, content)
}

// GET /content/search
export const searchContent = async (req: AuthRequest, res: Response) => {
  const { q, page = 1, limit = 20 } = req.query
  if (!q || String(q).length < 2) return sendError(res, 'Query must be at least 2 characters', 400)

  const items = await Content.find(
    { $text: { $search: q as string }, ...(req.user?.role === 'user' ? { isPublic: true } : {}) },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean()

  sendSuccess(res, { query: q, results: items, count: items.length })
}

// DELETE /content/:id
export const deleteContent = async (req: AuthRequest, res: Response) => {
  const content = await Content.findById(req.params.id)
  if (!content) return sendError(res, 'Content not found', 404)

  const isOwner = content.analyzedBy?.toString() === req.user!._id.toString()
  const isAdmin = ['admin', 'superadmin'].includes(req.user!.role)
  if (!isOwner && !isAdmin) return sendError(res, 'Not authorised', 403)

  await content.deleteOne()
  await SentimentResult.deleteOne({ contentId: content._id })
  await redisService.del(`cache:content:${content._id}`)

  contentLog.info(`Content deleted: ${content._id} by ${req.user!.email}`)
  sendSuccess(res, null, 'Content deleted')
}

// GET /content/my
export const getMyContent = async (req: AuthRequest, res: Response) => {
  const { page, limit, sort } = parsePagination(req.query as any)
  const [items, total] = await Promise.all([
    Content.find({ analyzedBy: req.user!._id })
      .sort(sort || '-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Content.countDocuments({ analyzedBy: req.user!._id }),
  ])
  sendPaginated(res, items, total, { page, limit, sort })
}

// ══════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════
const router = Router()

router.post('/analyze',
  authenticate,
  body('text').optional().isString().isLength({ min: 10, max: 100000 }),
  body('url').optional().isURL(),
  body('category').optional().isIn(['Politics','Health','Technology','Entertainment','Education','Economy','Environment','Science','Sports','General']),
  validate,
  analyzeContent
)

router.post('/analyze/batch',
  authenticate, authorize('admin', 'researcher', 'superadmin'),
  body('texts').isArray({ min: 1, max: 100 }),
  validate,
  analyzeBatch
)

router.get('/',         authenticate, getContents)
router.get('/my',       authenticate, getMyContent)
router.get('/search',   authenticate, searchContent)
router.get('/:id',      authenticate, getContentById)
router.delete('/:id',   authenticate, deleteContent)

export default router
