import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import multer from 'multer'
import cron from 'node-cron'
import axios from 'axios'
import { User, Content, Report, Notification, ActivityLog, Dataset, Trend } from '../models/index'
import { redisService, withCache } from '../services/redis/index'
import { addReportJob, addEmailJob, addNotifJob, addScraperJob, addBatchJob, getQueueStats } from '../services/bull/index'
import { config } from '../config/index'
import { authLog, userLog, reportLog, notifLog, scraperLog, adminLog } from '../utils/logger'
import { sendSuccess, sendError, sendPaginated, parsePagination, randomToken } from '../utils/helpers'
import { authenticate, authorize, uploadLimiter, strictLimiter, validate } from '../middleware/index'
import { AuthRequest } from '../types/index'
import path from 'path'

// ══════════════════════════════════════════════════════════════════
// USER MODULE
// ══════════════════════════════════════════════════════════════════

const userController = {
  getProfile: async (req: AuthRequest, res: Response) => {
    sendSuccess(res, req.user)
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    const allowed = ['name', 'institution', 'researchFocus', 'bio', 'preferences']
    const update: any = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k] })

    const user = await User.findByIdAndUpdate(req.user!._id, update, { new: true, runValidators: true })
    await redisService.del(`session:${req.user!._id}`)

    userLog.info(`Profile updated: ${req.user!.email}`)
    sendSuccess(res, user, 'Profile updated')
  },

  getStats: async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id
    const [contentCount, reportCount] = await Promise.all([
      Content.countDocuments({ analyzedBy: userId }),
      Report.countDocuments({ generatedBy: userId }),
    ])
    sendSuccess(res, { ...req.user!.stats, contentCount, reportCount })
  },

  regenerateApiKey: async (req: AuthRequest, res: Response) => {
    const apiKey = `ibb_sk_${randomToken(24)}`
    await User.findByIdAndUpdate(req.user!._id, { apiKey })
    userLog.info(`API key regenerated: ${req.user!.email}`)
    sendSuccess(res, { apiKey }, 'API key regenerated. Save it — it will not be shown again.')
  },

  getApiKey: async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!._id).select('+apiKey')
    sendSuccess(res, { apiKey: user?.apiKey || null })
  },
}

export const userRouter = Router()
userRouter.get('/profile',          authenticate, userController.getProfile)
userRouter.patch('/profile',        authenticate, userController.updateProfile)
userRouter.get('/stats',            authenticate, userController.getStats)
userRouter.get('/api-key',          authenticate, userController.getApiKey)
userRouter.post('/api-key/regenerate', authenticate, strictLimiter, userController.regenerateApiKey)

// ══════════════════════════════════════════════════════════════════
// NOTIFICATION MODULE
// ══════════════════════════════════════════════════════════════════

const notifController = {
  getNotifications: async (req: AuthRequest, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const { unread, type } = req.query
    const filter: any = { userId: req.user!._id }
    if (unread === 'true') filter.read = false
    if (type) filter.type = type

    const [items, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user!._id, read: false }),
    ])

    sendPaginated(res, items, total, { page, limit }, 'Notifications fetched')
  },

  markRead: async (req: AuthRequest, res: Response) => {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { read: true }
    )
    sendSuccess(res, null, 'Marked as read')
  },

  markAllRead: async (req: AuthRequest, res: Response) => {
    const result = await Notification.updateMany(
      { userId: req.user!._id, read: false },
      { read: true }
    )
    sendSuccess(res, { updated: result.modifiedCount }, 'All notifications marked as read')
  },

  deleteNotification: async (req: AuthRequest, res: Response) => {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
    sendSuccess(res, null, 'Notification deleted')
  },

  getUnreadCount: async (req: AuthRequest, res: Response) => {
    const count = await Notification.countDocuments({ userId: req.user!._id, read: false })
    sendSuccess(res, { count })
  },

  // Internal: send notification to user
  send: async (userId: string, type: string, title: string, message: string, data?: any) => {
    await Notification.create({
      userId, type, title, message, data,
      channels: ['in_app'],
      priority: type.includes('alert') ? 'high' : 'medium',
    })
    notifLog.info(`Notification sent to ${userId}: ${title}`)
  },
}

export const notifRouter = Router()
notifRouter.get('/',             authenticate, notifController.getNotifications)
notifRouter.get('/unread-count', authenticate, notifController.getUnreadCount)
notifRouter.patch('/:id/read',   authenticate, notifController.markRead)
notifRouter.post('/mark-all-read', authenticate, notifController.markAllRead)
notifRouter.delete('/:id',       authenticate, notifController.deleteNotification)

// ══════════════════════════════════════════════════════════════════
// REPORTING MODULE
// ══════════════════════════════════════════════════════════════════

const reportController = {
  create: async (req: AuthRequest, res: Response) => {
    const { type, period, category, format, title, startDate, endDate } = req.body
    const reportTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report — ${period}`

    const report = await Report.create({
      title: reportTitle,
      type, period, category: category || 'all',
      format: format || 'pdf',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      generatedBy: req.user!._id,
      status: 'processing',
      config: req.body,
      expiresAt: new Date(Date.now() + 7 * 86400000), // 7-day TTL
    })

    // Queue report job
    const job = await addReportJob({
      reportId: report._id.toString(),
      type, period,
      config: req.body,
    })

    await req.user!.updateOne({ $inc: { 'stats.reportsGenerated': 1 } })

    reportLog.info(`Report queued: ${report._id} [${type}] by ${req.user!.email}`)
    sendSuccess(res, { ...report.toJSON(), jobId: job.id }, 'Report generation started', 202)
  },

  getAll: async (req: AuthRequest, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const filter: any = ['admin', 'superadmin'].includes(req.user!.role)
      ? {}
      : { generatedBy: req.user!._id }
    if (req.query.status) filter.status = req.query.status

    const [items, total] = await Promise.all([
      Report.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit)
        .populate('generatedBy', 'name email'),
      Report.countDocuments(filter),
    ])
    sendPaginated(res, items, total, { page, limit })
  },

  getById: async (req: AuthRequest, res: Response) => {
    const report = await Report.findById(req.params.id).populate('generatedBy', 'name email')
    if (!report) return sendError(res, 'Report not found', 404)
    const isOwner = report.generatedBy._id.toString() === req.user!._id.toString()
    if (!isOwner && !['admin', 'superadmin'].includes(req.user!.role)) return sendError(res, 'Access denied', 403)
    sendSuccess(res, report)
  },

  download: async (req: AuthRequest, res: Response) => {
    const report = await Report.findById(req.params.id)
    if (!report || report.status !== 'ready') return sendError(res, 'Report not ready', 400)
    await report.updateOne({ $inc: { downloadCount: 1 } })
    sendSuccess(res, { downloadUrl: `/uploads/reports/${report._id}.${report.format}`, expires: report.expiresAt })
  },

  delete: async (req: AuthRequest, res: Response) => {
    const report = await Report.findById(req.params.id)
    if (!report) return sendError(res, 'Report not found', 404)
    const isOwner = report.generatedBy.toString() === req.user!._id.toString()
    if (!isOwner && !['admin', 'superadmin'].includes(req.user!.role)) return sendError(res, 'Access denied', 403)
    await report.deleteOne()
    sendSuccess(res, null, 'Report deleted')
  },
}

export const reportRouter = Router()
reportRouter.post('/',        authenticate, authorize('admin', 'researcher', 'superadmin'),
  body('type').isIn(['sentiment', 'viral', 'misinfo', 'full', 'custom']),
  body('period').notEmpty(),
  validate,
  reportController.create
)
reportRouter.get('/',         authenticate, reportController.getAll)
reportRouter.get('/:id',      authenticate, reportController.getById)
reportRouter.get('/:id/download', authenticate, reportController.download)
reportRouter.delete('/:id',   authenticate, reportController.delete)

// ══════════════════════════════════════════════════════════════════
// ADMIN MODULE
// ══════════════════════════════════════════════════════════════════

const adminController = {
  getUsers: async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const filter: any = {}
    if (req.query.role) filter.role = req.query.role
    if (req.query.status) filter.status = req.query.status
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: 'i' } },
        { email: { $regex: req.query.q, $options: 'i' } },
      ]
    }
    const [items, total] = await Promise.all([
      User.find(filter).sort(req.query.sort as string || '-createdAt').skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ])
    sendPaginated(res, items, total, { page, limit })
  },

  updateUser: async (req: AuthRequest, res: Response) => {
    const allowed = ['status', 'role', 'institution', 'researchFocus']
    const update: any = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k] })

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!user) return sendError(res, 'User not found', 404)

    await redisService.del(`session:${user._id}`)
    await ActivityLog.create({
      type: 'admin_user_update', action: `Admin updated user: ${user.email} — ${JSON.stringify(update)}`,
      userId: req.user!._id, service: 'admin', severity: 'info',
    })

    adminLog.info(`User updated by admin: ${user.email}`)
    sendSuccess(res, user, 'User updated')
  },

  deleteUser: async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id)
    if (!user) return sendError(res, 'User not found', 404)
    if (user._id.toString() === req.user!._id.toString()) return sendError(res, 'Cannot delete yourself', 400)

    await user.deleteOne()
    await redisService.del(`session:${user._id}`)
    adminLog.warn(`User deleted by admin: ${user.email}`)
    sendSuccess(res, null, 'User deleted')
  },

  getLogs: async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const filter: any = {}
    if (req.query.severity) filter.severity = req.query.severity
    if (req.query.service) filter.service = req.query.service
    if (req.query.type) filter.type = req.query.type

    const [items, total] = await Promise.all([
      ActivityLog.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit)
        .populate('userId', 'name email'),
      ActivityLog.countDocuments(filter),
    ])
    sendPaginated(res, items, total, { page, limit })
  },

  getSystemStatus: async (_req: Request, res: Response) => {
    const [queueStats, redisOk, dbStats] = await Promise.all([
      getQueueStats(),
      redisService.ping(),
      import('mongoose').then(m => m.default.connection.db?.stats()),
    ])

    const services = [
      { name: 'API Gateway', status: 'operational', latency: 42 },
      { name: 'MongoDB', status: dbStats ? 'operational' : 'degraded', collections: dbStats?.collections },
      { name: 'Redis', status: redisOk ? 'operational' : 'down' },
      { name: 'Bull Queue', status: 'operational', queues: queueStats },
    ]

    sendSuccess(res, { services, timestamp: new Date() })
  },

  getDatasets: async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const [items, total] = await Promise.all([
      Dataset.find().sort('-createdAt').skip((page - 1) * limit).limit(limit).populate('uploadedBy', 'name email'),
      Dataset.countDocuments(),
    ])
    sendPaginated(res, items, total, { page, limit })
  },

  getPlatformStats: async (_req: Request, res: Response) => {
    const [users, content, reports, datasets] = await Promise.all([
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Content.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, avgSentiment: { $avg: '$sentiment.score' } } }]),
      Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Dataset.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ])
    sendSuccess(res, { users, content, reports, datasets })
  },
}

export const adminRouter = Router()
const adminGuard = [authenticate, authorize('admin', 'superadmin')]
adminRouter.get('/users',          ...adminGuard, adminController.getUsers)
adminRouter.patch('/users/:id',    ...adminGuard, adminController.updateUser)
adminRouter.delete('/users/:id',   ...adminGuard, adminController.deleteUser)
adminRouter.get('/logs',           ...adminGuard, adminController.getLogs)
adminRouter.get('/status',         ...adminGuard, adminController.getSystemStatus)
adminRouter.get('/datasets',       ...adminGuard, adminController.getDatasets)
adminRouter.get('/platform-stats', ...adminGuard, adminController.getPlatformStats)

// ══════════════════════════════════════════════════════════════════
// SCRAPER MODULE
// ══════════════════════════════════════════════════════════════════

export const scraperService = {
  // Fetch from NewsAPI
  fetchFromNewsApi: async (category = 'general', pageSize = 20): Promise<any[]> => {
    if (!config.scraper.newsApiKey) {
      scraperLog.warn('NEWS_API_KEY not set — using mock data')
      return scraperService.getMockArticles(category)
    }
    try {
      const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: { category, country: 'in', pageSize, apiKey: config.scraper.newsApiKey },
        timeout: 10000,
      })
      return data.articles || []
    } catch (err: any) {
      scraperLog.error(`NewsAPI error: ${err.message}`)
      return scraperService.getMockArticles(category)
    }
  },

  getMockArticles: (category: string): any[] => {
    const sources = ['Reuters', 'BBC', 'The Hindu', 'Times of India', 'NDTV']
    return Array.from({ length: 5 }, (_, i) => ({
      title: `[Mock] ${category} article ${i + 1}`,
      description: `This is a mock ${category} article for development purposes. Real data requires a valid NEWS_API_KEY.`,
      url: `https://example.com/article-${i}`,
      source: { name: sources[i % sources.length] },
      publishedAt: new Date().toISOString(),
    }))
  },

  // Main scrape runner
  run: async (source: string, category = 'General', limit = 20) => {
    scraperLog.info(`Scraper started: ${source} [${category}]`)
    const articles = await scraperService.fetchFromNewsApi(category.toLowerCase(), limit)
    let saved = 0

    for (const article of articles) {
      if (!article.description && !article.title) continue
      const text = `${article.title || ''}. ${article.description || ''}`.trim()
      if (text.length < 20) continue

      try {
        await Content.create({
          title: article.title,
          text,
          url: article.url,
          source: article.source?.name || source,
          category,
          platform: 'news',
          isPublic: true,
        })
        saved++
      } catch (e: any) {
        if (e.code !== 11000) scraperLog.error(`Save error: ${e.message}`)
      }
    }

    scraperLog.info(`Scraper completed: ${source} — saved ${saved}/${articles.length} articles`)
    return { source, category, fetched: articles.length, saved }
  },
}

// Scraper routes
export const scraperRouter = Router()

scraperRouter.post('/run',
  authenticate, authorize('admin', 'researcher', 'superadmin'),
  async (req: AuthRequest, res: Response) => {
    const { source = 'news', category = 'General', limit = 20 } = req.body
    const job = await addScraperJob({ source, category, limit })
    sendSuccess(res, { jobId: job.id, source, category }, 'Scraper job queued', 202)
  }
)

scraperRouter.get('/status',
  authenticate, authorize('admin', 'superadmin'),
  async (_req: Request, res: Response) => {
    const stats = await getQueueStats()
    const scraperStat = stats.find(s => s.name === 'web-scraper')
    sendSuccess(res, scraperStat)
  }
)

// Dataset upload router
const uploadStorage = multer.diskStorage({
  destination: config.upload.dir,
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const uploadMiddleware = multer({
  storage: uploadStorage,
  limits: { fileSize: config.upload.maxSizeMb * 1024 * 1024 },
})

export const datasetRouter = Router()

datasetRouter.post('/upload',
  uploadLimiter, authenticate,
  uploadMiddleware.single('file'),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) return sendError(res, 'No file uploaded', 400)
    const { label, type } = req.body
    const dataset = await Dataset.create({
      name: req.file.originalname,
      label: label || req.file.originalname,
      type: type || 'Social Media Posts',
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user!._id,
    })
    const job = await addBatchJob({ datasetId: dataset._id.toString(), filePath: req.file.path, fileType: req.file.mimetype })
    await Dataset.findByIdAndUpdate(dataset._id, { processingJobId: job.id.toString(), status: 'queued' })
    scraperLog.info(`Dataset uploaded: ${req.file.originalname} by ${req.user!.email}`)
    sendSuccess(res, dataset, 'Dataset uploaded and queued for processing', 201)
  }
)

datasetRouter.get('/',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const { page, limit } = parsePagination(req.query as any)
    const filter: any = ['admin', 'superadmin'].includes(req.user!.role) ? {} : { uploadedBy: req.user!._id }
    const [items, total] = await Promise.all([
      Dataset.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit).populate('uploadedBy', 'name email'),
      Dataset.countDocuments(filter),
    ])
    sendPaginated(res, items, total, { page, limit })
  }
)

// ══════════════════════════════════════════════════════════════════
// SCHEDULED SCRAPER CRON
// ══════════════════════════════════════════════════════════════════
export const startScraperCron = () => {
  const interval = config.scraper.intervalMin
  scraperLog.info(`Scraper cron scheduled every ${interval} minutes`)

  cron.schedule(`*/${interval} * * * *`, async () => {
    scraperLog.info('Cron: running scheduled scraper')
    const categories = ['Politics', 'Health', 'Technology', 'Science', 'Environment']
    for (const cat of categories) {
      await addScraperJob({ source: 'newsapi', category: cat, limit: 10 })
    }
  })

  // Daily trend cleanup
  cron.schedule('0 2 * * *', async () => {
    scraperLog.info('Cron: cleaning up old trend data')
    const cutoff = new Date(Date.now() - 90 * 86400000)
    await Trend.deleteMany({ lastUpdated: { $lt: cutoff }, virality: { $lt: 30 } })
  })
}
