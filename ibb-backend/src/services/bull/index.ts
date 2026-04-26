import Bull, { Queue, Job, JobOptions } from 'bull'
import { config } from '../../config'
import { jobLog } from '../../utils/logger'

const defaultJobOptions: JobOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { count: 100, age: 24 * 3600 },
  removeOnFail: { count: 50 },
}

const queueConfig = { redis: config.bull.redisUrl }

// ── Queue definitions ───────────────────────────────────────────────
export const analysisQueue  = new Bull('content-analysis', queueConfig)
export const reportQueue    = new Bull('report-generation', queueConfig)
export const emailQueue     = new Bull('email-delivery', queueConfig)
export const notifQueue     = new Bull('notifications', queueConfig)
export const scraperQueue   = new Bull('web-scraper', queueConfig)
export const batchQueue     = new Bull('batch-processing', queueConfig)
export const cleanupQueue   = new Bull('cleanup', queueConfig)

const allQueues = [analysisQueue, reportQueue, emailQueue, notifQueue, scraperQueue, batchQueue, cleanupQueue]

// ── Global event hooks ──────────────────────────────────────────────
allQueues.forEach(q => {
  q.on('completed', (job: Job) =>
    jobLog.info(`Job completed: [${q.name}] #${job.id}`)
  )
  q.on('failed', (job: Job, err: Error) =>
    jobLog.error(`Job failed: [${q.name}] #${job.id} — ${err.message}`)
  )
  q.on('stalled', (job: Job) =>
    jobLog.warn(`Job stalled: [${q.name}] #${job.id}`)
  )
  q.on('error', (err: Error) =>
    jobLog.error(`Queue error [${q.name}]: ${err.message}`)
  )
})

// ── Add jobs ────────────────────────────────────────────────────────
export const addAnalysisJob = (data: {
  contentId: string; text: string; userId?: string
}) => analysisQueue.add('analyze', data, defaultJobOptions)

export const addReportJob = (data: {
  reportId: string; type: string; period: string; config: Record<string, any>
}) => reportQueue.add('generate', data, { ...defaultJobOptions, timeout: 120000 })

export const addEmailJob = (data: {
  to: string; subject: string; template: string; context: Record<string, any>
}) => emailQueue.add('send', data, { ...defaultJobOptions, delay: 0 })

export const addNotifJob = (data: {
  userId: string; type: string; title: string; message: string
  data?: Record<string, any>; channels?: string[]; priority?: string
}) => notifQueue.add('notify', data, defaultJobOptions)

export const addScraperJob = (data: {
  source: string; category?: string; limit?: number
}) => scraperQueue.add('scrape', data, {
  ...defaultJobOptions,
  timeout: 60000,
  jobId: `scraper-${data.source}-${Date.now()}`,
})

export const addBatchJob = (data: {
  datasetId: string; filePath: string; fileType: string
}) => batchQueue.add('process-dataset', data, {
  ...defaultJobOptions,
  timeout: 300000, // 5 min for large files
})

// ── Queue health ────────────────────────────────────────────────────
export const getQueueStats = async () => {
  const stats = await Promise.all(allQueues.map(async q => ({
    name: q.name,
    waiting: await q.getWaitingCount(),
    active: await q.getActiveCount(),
    completed: await q.getCompletedCount(),
    failed: await q.getFailedCount(),
    delayed: await q.getDelayedCount(),
  })))
  return stats
}

export const gracefulShutdown = async () => {
  jobLog.info('Gracefully closing all Bull queues...')
  await Promise.all(allQueues.map(q => q.close()))
  jobLog.info('All queues closed')
}
