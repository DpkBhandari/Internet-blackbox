import { Request, Response, Router } from 'express'
import { Content, SentimentResult, Trend, ActivityLog, User } from '../../models'
import { redisService, withCache } from '../../services/redis'
import { analyticsLog } from '../../utils/logger'
import { sendSuccess, sendError, buildDateFilter } from '../../utils/helpers'
import { authenticate, authorize } from '../../middleware'
import { AuthRequest } from '../../types'

// ══════════════════════════════════════════════════════════════════
// CONTROLLERS
// ══════════════════════════════════════════════════════════════════

// GET /analytics/dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  const cacheKey = `cache:dashboard:${req.user!.role}`

  const data = await withCache(cacheKey, async () => {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const weekAgo = new Date(Date.now() - 7 * 86400000)

    const [
      totalContent,
      todayContent,
      weekContent,
      totalUsers,
      viralAlerts,
      misinfoFlagged,
      sentimentOverview,
      categoryBreakdown,
      recentActivity,
    ] = await Promise.all([
      Content.countDocuments(),
      Content.countDocuments({ createdAt: { $gte: today } }),
      Content.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ status: 'active' }),
      Content.countDocuments({ 'virality.score': { $gte: 85 } }),
      Content.countDocuments({ 'misinfo.flagged': true }),

      Content.aggregate([
        {
          $group: {
            _id: '$sentiment.label',
            count: { $sum: 1 },
            avgScore: { $avg: '$sentiment.score' },
          },
        },
      ]),

      Content.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, avgVirality: { $avg: '$virality.score' } } },
        { $sort: { count: -1 } },
      ]),

      ActivityLog.find().sort('-createdAt').limit(10).populate('userId', 'name'),
    ])

    return {
      kpis: { totalContent, todayContent, weekContent, totalUsers, viralAlerts, misinfoFlagged },
      sentiment: sentimentOverview,
      categories: categoryBreakdown,
      recentActivity,
    }
  }, 60)

  sendSuccess(res, data)
}

// GET /analytics/sentiment?days=30&category=Health
export const getSentimentTrend = async (req: AuthRequest, res: Response) => {
  const { days = 30, category, granularity = 'day' } = req.query
  const cacheKey = `cache:analytics:sentiment:${days}:${category}:${granularity}`

  const data = await withCache(cacheKey, async () => {
    const since = new Date(Date.now() - Number(days) * 86400000)
    const match: any = { createdAt: { $gte: since } }
    if (category) match.category = category

    const format = granularity === 'hour' ? '%Y-%m-%dT%H:00' : '%Y-%m-%d'

    const pipeline: any[] = [
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format, date: '$createdAt' } },
          avgScore: { $avg: '$sentiment.score' },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment.label', 'positive'] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment.label', 'negative'] }, 1, 0] } },
          neutral:  { $sum: { $cond: [{ $eq: ['$sentiment.label', 'neutral']  }, 1, 0] } },
          total: { $sum: 1 },
          avgVirality: { $avg: '$virality.score' },
          misinfoCount: { $sum: { $cond: ['$misinfo.flagged', 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]

    return Content.aggregate(pipeline)
  }, 120)

  sendSuccess(res, data)
}

// GET /analytics/virality?limit=20
export const getViralityStats = async (req: AuthRequest, res: Response) => {
  const { limit = 20, days = 7 } = req.query
  const cacheKey = `cache:analytics:virality:${days}:${limit}`

  const data = await withCache(cacheKey, async () => {
    const since = new Date(Date.now() - Number(days) * 86400000)
    const [topViral, viralByCategory, viralTimeline] = await Promise.all([
      Content.find({ createdAt: { $gte: since } })
        .sort('-virality.score')
        .limit(Number(limit))
        .select('title category virality sentiment misinfo keywords createdAt source')
        .lean(),

      Content.aggregate([
        { $match: { 'virality.score': { $gte: 70 }, createdAt: { $gte: since } } },
        { $group: { _id: '$category', count: { $sum: 1 }, avgVirality: { $avg: '$virality.score' }, maxVirality: { $max: '$virality.score' } } },
        { $sort: { avgVirality: -1 } },
      ]),

      Content.aggregate([
        { $match: { 'virality.level': { $in: ['VIRAL', 'TRENDING'] }, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, avgScore: { $avg: '$virality.score' } } },
        { $sort: { _id: 1 } },
      ]),
    ])

    return { topViral, viralByCategory, viralTimeline }
  }, 60)

  sendSuccess(res, data)
}

// GET /analytics/misinfo
export const getMisinfoStats = async (req: AuthRequest, res: Response) => {
  const { days = 30 } = req.query
  const since = new Date(Date.now() - Number(days) * 86400000)

  const data = await withCache(`cache:analytics:misinfo:${days}`, async () => {
    const [overview, byCategory, timeline, topKeywords] = await Promise.all([
      Content.aggregate([
        { $match: { 'misinfo.flagged': true, createdAt: { $gte: since } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgConfidence: { $avg: '$misinfo.confidence' },
            highConfidence: { $sum: { $cond: [{ $gte: ['$misinfo.confidence', 0.8] }, 1, 0] } },
          },
        },
      ]),

      Content.aggregate([
        { $match: { 'misinfo.flagged': true, createdAt: { $gte: since } } },
        { $group: { _id: '$category', count: { $sum: 1 }, avgConfidence: { $avg: '$misinfo.confidence' } } },
        { $sort: { count: -1 } },
      ]),

      Content.aggregate([
        { $match: { 'misinfo.flagged': true, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      Content.aggregate([
        { $match: { 'misinfo.flagged': true, createdAt: { $gte: since } } },
        { $unwind: '$keywords' },
        { $group: { _id: '$keywords', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ])

    return { overview: overview[0], byCategory, timeline, topKeywords }
  }, 120)

  sendSuccess(res, data)
}

// GET /analytics/emotions
export const getEmotionBreakdown = async (req: AuthRequest, res: Response) => {
  const { days = 30 } = req.query
  const since = new Date(Date.now() - Number(days) * 86400000)

  const data = await withCache(`cache:analytics:emotions:${days}`, async () => {
    return SentimentResult.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $project: {
          emotions: { $objectToArray: '$emotions' },
        },
      },
      { $unwind: '$emotions' },
      {
        $group: {
          _id: '$emotions.k',
          avgScore: { $avg: '$emotions.v' },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
    ])
  }, 120)

  sendSuccess(res, data)
}

// GET /analytics/trends
export const getTrends = async (req: AuthRequest, res: Response) => {
  const { limit = 10, category } = req.query
  const cacheKey = `cache:analytics:trends:${limit}:${category}`

  const data = await withCache(cacheKey, async () => {
    const filter: any = { virality: { $gte: 70 } }
    if (category) filter.category = category
    return Trend.find(filter).sort('-virality -lastUpdated').limit(Number(limit)).lean()
  }, 30)

  sendSuccess(res, data)
}

// GET /analytics/platform-comparison
export const getPlatformComparison = async (req: AuthRequest, res: Response) => {
  const { days = 30 } = req.query
  const since = new Date(Date.now() - Number(days) * 86400000)

  const data = await withCache(`cache:analytics:platforms:${days}`, async () => {
    return Content.aggregate([
      { $match: { createdAt: { $gte: since }, platform: { $ne: null } } },
      {
        $group: {
          _id: '$platform',
          count: { $sum: 1 },
          avgSentiment: { $avg: '$sentiment.score' },
          avgVirality: { $avg: '$virality.score' },
          misinoCount: { $sum: { $cond: ['$misinfo.flagged', 1, 0] } },
          positiveCount: { $sum: { $cond: [{ $eq: ['$sentiment.label', 'positive'] }, 1, 0] } },
          negativeCount: { $sum: { $cond: [{ $eq: ['$sentiment.label', 'negative'] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ])
  }, 120)

  sendSuccess(res, data)
}

// GET /analytics/heatmap
export const getHeatmapData = async (req: AuthRequest, res: Response) => {
  const { days = 7, metric = 'count' } = req.query
  const since = new Date(Date.now() - Number(days) * 86400000)

  const data = await withCache(`cache:analytics:heatmap:${days}:${metric}`, async () => {
    return Content.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            hour: { $hour: '$createdAt' },
          },
          count: { $sum: 1 },
          avgSentiment: { $avg: '$sentiment.score' },
          avgVirality: { $avg: '$virality.score' },
        },
      },
      { $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 } },
    ])
  }, 300)

  sendSuccess(res, data)
}

// GET /analytics/summary — overall platform stats
export const getPlatformSummary = async (_req: Request, res: Response) => {
  const data = await withCache('cache:analytics:summary', async () => {
    const [contentStats, userStats, sentimentDist] = await Promise.all([
      Content.aggregate([{
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgSentiment: { $avg: '$sentiment.score' },
          avgVirality: { $avg: '$virality.score' },
          avgToxicity: { $avg: '$toxicity' },
          misinfoTotal: { $sum: { $cond: ['$misinfo.flagged', 1, 0] } },
          viralTotal: { $sum: { $cond: [{ $gte: ['$virality.score', 70] }, 1, 0] } },
        },
      }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Content.aggregate([{ $group: { _id: '$sentiment.label', count: { $sum: 1 } } }]),
    ])
    return { content: contentStats[0], users: userStats, sentiment: sentimentDist }
  }, 300)

  sendSuccess(res, data)
}

// ══════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════
const router = Router()

router.get('/dashboard',            authenticate, getDashboard)
router.get('/sentiment',            authenticate, getSentimentTrend)
router.get('/virality',             authenticate, getViralityStats)
router.get('/misinfo',              authenticate, getMisinfoStats)
router.get('/emotions',             authenticate, getEmotionBreakdown)
router.get('/trends',               authenticate, getTrends)
router.get('/platforms',            authenticate, getPlatformComparison)
router.get('/heatmap',              authenticate, getHeatmapData)
router.get('/summary',              authenticate, getPlatformSummary)

export default router
