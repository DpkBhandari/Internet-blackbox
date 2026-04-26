import Bull from 'bull'
import {
  analysisQueue, reportQueue, emailQueue,
  notifQueue, scraperQueue, batchQueue, cleanupQueue,
} from '../services/bull'
import { aiService } from '../services/ai'
import { Content, SentimentResult, Report, Notification, Dataset, ActivityLog } from '../models'
import { scraperService } from '../modules/modules'
import { jobLog, reportLog, notifLog, scraperLog } from '../utils/logger'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

// ══════════════════════════════════════════════════════════════════
// ANALYSIS WORKER
// ══════════════════════════════════════════════════════════════════
analysisQueue.process('analyze', 5, async (job: Bull.Job) => {
  const { text, userId, batchId } = job.data
  jobLog.debug(`Processing analysis job #${job.id}`)

  const start = Date.now()
  const analysis = await aiService.analyze(text)

  const words = text.split(/\s+/).filter(Boolean)

  const content = await Content.create({
    text,
    source: 'batch',
    category: 'General',
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
      shares: 0, reach: 0, velocity: 0,
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
    wordCount: words.length,
    readabilityGrade: analysis.readability_grade,
    analyzedBy: userId || null,
    batchId: batchId || null,
    isPublic: false,
  })

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
    processingTimeMs: Date.now() - start,
  })

  await job.progress(100)
  return { contentId: content._id, sentiment: analysis.sentiment.label, virality: analysis.virality.score }
})

// ══════════════════════════════════════════════════════════════════
// REPORT WORKER
// ══════════════════════════════════════════════════════════════════
reportQueue.process('generate', 2, async (job: Bull.Job) => {
  const { reportId, type, period, config: reportConfig } = job.data
  reportLog.info(`Generating report #${reportId} [${type}]`)

  const report = await Report.findById(reportId)
  if (!report) throw new Error(`Report ${reportId} not found`)

  await Report.findByIdAndUpdate(reportId, { status: 'processing' })
  await job.progress(10)

  try {
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30
    const since = new Date(Date.now() - days * 86400000)
    const filter: any = { createdAt: { $gte: since } }
    if (reportConfig.category && reportConfig.category !== 'all') filter.category = reportConfig.category

    await job.progress(20)

    // Gather data
    const [totalContent, sentimentDist, viralTopics, misinfoItems] = await Promise.all([
      Content.countDocuments(filter),
      Content.aggregate([
        { $match: filter },
        { $group: { _id: '$sentiment.label', count: { $sum: 1 }, avgScore: { $avg: '$sentiment.score' } } },
      ]),
      Content.find({ ...filter, 'virality.score': { $gte: 70 } }).sort('-virality.score').limit(10).lean(),
      Content.find({ ...filter, 'misinfo.flagged': true }).sort('-misinfo.confidence').limit(10).lean(),
    ])

    await job.progress(60)

    const avgSentiment = sentimentDist.reduce((sum, s) => sum + s.avgScore * s.count, 0) / Math.max(1, totalContent)

    const summary = {
      totalContent,
      avgSentiment: parseFloat(avgSentiment.toFixed(4)),
      viralTopics: viralTopics.length,
      misinoItems: misinfoItems.length,
    }

    // Build report data payload (in production: render to PDF/CSV via puppeteer/papaparse)
    const reportData = {
      summary,
      sentimentDistribution: sentimentDist,
      viralTopics: viralTopics.map(t => ({ title: t.title, virality: t.virality, category: t.category })),
      misinfoItems: misinfoItems.map(m => ({ text: m.text?.slice(0, 200), confidence: m.misinfo.confidence, category: m.category })),
      generatedAt: new Date().toISOString(),
      period, type,
    }

    // Save JSON representation (replace with PDF render in production)
    const dir = path.join(process.cwd(), 'uploads', 'reports')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filePath = path.join(dir, `${reportId}.json`)
    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2))
    const fileSize = fs.statSync(filePath).size

    await job.progress(90)

    await Report.findByIdAndUpdate(reportId, {
      status: 'ready',
      filePath,
      fileSize,
      summary,
    })

    // Notify user
    await Notification.create({
      userId: report.generatedBy,
      type: 'report_ready',
      title: 'Report Ready',
      message: `Your report "${report.title}" is ready to download.`,
      data: { reportId },
      read: false,
      priority: 'medium',
      channels: ['in_app'],
    })

    await job.progress(100)
    reportLog.info(`Report generated: ${reportId}`)
    return { reportId, status: 'ready', fileSize }

  } catch (err: any) {
    await Report.findByIdAndUpdate(reportId, { status: 'failed' })
    reportLog.error(`Report failed: ${reportId} — ${err.message}`)
    throw err
  }
})

// ══════════════════════════════════════════════════════════════════
// EMAIL WORKER
// ══════════════════════════════════════════════════════════════════
emailQueue.process('send', 10, async (job: Bull.Job) => {
  const { to, subject, template, context } = job.data

  // In production: use nodemailer + handlebars template rendering
  // For dev: just log
  jobLog.info(`[EMAIL] To: ${to} | Subject: ${subject} | Template: ${template}`)

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@interndrive.in',
      to,
      subject,
      text: `${subject}\n\n${JSON.stringify(context, null, 2)}`, // replace with HTML template
    })
  }

  return { to, subject, sent: true }
})

// ══════════════════════════════════════════════════════════════════
// NOTIFICATION WORKER
// ══════════════════════════════════════════════════════════════════
notifQueue.process('notify', 10, async (job: Bull.Job) => {
  const { userId, type, title, message, data, channels = ['in_app'], priority = 'medium' } = job.data

  const notif = await Notification.create({
    userId, type, title, message, data, read: false,
    priority, channels, sentChannels: ['in_app'],
  })

  // Emit via WebSocket if user is online (handled by socket server)
  // io.to(`user:${userId}`).emit('notification', notif)

  notifLog.info(`Notification delivered: ${userId} — ${title}`)
  return { notifId: notif._id, userId, type }
})

// ══════════════════════════════════════════════════════════════════
// SCRAPER WORKER
// ══════════════════════════════════════════════════════════════════
scraperQueue.process('scrape', 3, async (job: Bull.Job) => {
  const { source, category, limit } = job.data
  scraperLog.info(`Scraper job started: ${source} [${category}] limit=${limit}`)

  const result = await scraperService.run(source, category, limit)

  await ActivityLog.create({
    type: 'scraper_run',
    action: `Scraper completed: ${source} — ${result.saved} articles saved`,
    service: 'scraper',
    severity: 'info',
    metadata: result,
  })

  await job.progress(100)
  return result
})

// ══════════════════════════════════════════════════════════════════
// BATCH DATASET WORKER
// ══════════════════════════════════════════════════════════════════
batchQueue.process('process-dataset', 1, async (job: Bull.Job) => {
  const { datasetId, filePath, fileType } = job.data
  jobLog.info(`Processing dataset: ${datasetId}`)

  const dataset = await Dataset.findById(datasetId)
  if (!dataset) throw new Error('Dataset not found')

  await Dataset.findByIdAndUpdate(datasetId, { status: 'processing', processingStarted: new Date() })

  let processed = 0
  let recordCount = 0
  const batchId = `batch-${datasetId}`
  const batchSize = 20

  try {
    // CSV processing
    if (fileType.includes('csv') || filePath.endsWith('.csv')) {
      const rows: any[] = []

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => { rows.push(row); recordCount++ })
          .on('end', resolve)
          .on('error', reject)
      })

      await Dataset.findByIdAndUpdate(datasetId, { recordCount })

      // Process in batches
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize)
        const texts = batch
          .map((r: any) => r.text || r.content || r.description || r.title || '')
          .filter((t: string) => t.length >= 10)

        if (texts.length > 0) {
          const analyses = await aiService.analyzeBatch(texts)

          for (let j = 0; j < texts.length; j++) {
            const a = analyses[j]
            if (!a) continue
            await Content.create({
              text: texts[j],
              source: dataset.label,
              category: 'General',
              batchId,
              isPublic: false,
              sentiment: {
                score: a.sentiment?.score || 0,
                label: a.sentiment?.label || 'neutral',
                confidence: a.sentiment?.confidence || 0.5,
                emotions: new Map(Object.entries(a.sentiment?.emotions || {})),
              },
              virality: { score: a.virality?.score || 0, level: a.virality?.level || 'STABLE', shares: 0, reach: 0, velocity: 0 },
              misinfo: { flagged: a.misinfo?.flagged || false, confidence: a.misinfo?.confidence || 0, signals: a.misinfo?.signals || [] },
              keywords: a.keywords || [],
              entities: a.entities || [],
              toxicity: a.toxicity || 0,
              wordCount: texts[j].split(/\s+/).length,
            })
            processed++
          }
        }

        await Dataset.findByIdAndUpdate(datasetId, { processedCount: processed })
        await job.progress(Math.floor((processed / recordCount) * 100))
        jobLog.debug(`Batch progress: ${processed}/${recordCount}`)
      }
    } else if (filePath.endsWith('.json') || filePath.endsWith('.jsonl')) {
      // JSON/JSONL processing
      const raw = fs.readFileSync(filePath, 'utf-8')
      let items: any[] = []

      if (filePath.endsWith('.jsonl')) {
        items = raw.split('\n').filter(Boolean).map(l => JSON.parse(l))
      } else {
        const parsed = JSON.parse(raw)
        items = Array.isArray(parsed) ? parsed : [parsed]
      }

      recordCount = items.length
      await Dataset.findByIdAndUpdate(datasetId, { recordCount })

      for (const item of items) {
        const text = item.text || item.content || item.body || ''
        if (text.length < 10) continue
        const a = await aiService.analyze(text)
        await Content.create({
          text, source: dataset.label, category: 'General', batchId, isPublic: false,
          sentiment: { score: a.sentiment.score, label: a.sentiment.label, confidence: a.sentiment.confidence, emotions: new Map(Object.entries(a.sentiment.emotions)) },
          virality: { score: a.virality.score, level: a.virality.level, shares: 0, reach: 0, velocity: 0 },
          misinfo: { flagged: a.misinfo.flagged, confidence: a.misinfo.confidence, signals: a.misinfo.signals },
          keywords: a.keywords, entities: a.entities, toxicity: a.toxicity, wordCount: text.split(/\s+/).length,
        })
        processed++
        await job.progress(Math.floor((processed / recordCount) * 90))
      }
    }

    await Dataset.findByIdAndUpdate(datasetId, {
      status: 'completed',
      processedCount: processed,
      recordCount,
      processingCompleted: new Date(),
    })

    await ActivityLog.create({
      type: 'dataset_processed',
      action: `Dataset processed: ${dataset.name} — ${processed}/${recordCount} records`,
      service: 'pipeline',
      severity: 'success',
      metadata: { datasetId, processed, recordCount, batchId },
    })

    await job.progress(100)
    jobLog.info(`Dataset complete: ${datasetId} — ${processed}/${recordCount} records`)
    return { datasetId, processed, recordCount, batchId }

  } catch (err: any) {
    await Dataset.findByIdAndUpdate(datasetId, { status: 'failed', errorMessage: err.message })
    throw err
  }
})

// ══════════════════════════════════════════════════════════════════
// CLEANUP WORKER — runs via cron, removes stale data
// ══════════════════════════════════════════════════════════════════
cleanupQueue.process('cleanup', 1, async (job: Bull.Job) => {
  jobLog.info('Running cleanup job...')
  const cutoff = new Date(Date.now() - 90 * 86400000)

  const [deletedLogs, deletedReports] = await Promise.all([
    ActivityLog.deleteMany({ createdAt: { $lt: cutoff }, severity: 'debug' }),
    Report.deleteMany({ expiresAt: { $lt: new Date() } }),
  ])

  const result = {
    deletedLogs: deletedLogs.deletedCount,
    deletedReports: deletedReports.deletedCount,
    ran: new Date().toISOString(),
  }
  jobLog.info(`Cleanup complete: ${JSON.stringify(result)}`)
  return result
})

jobLog.info('All Bull workers registered')
