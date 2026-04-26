import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'
import { config } from '../config'

const { combine, timestamp, printf, colorize, errors, json } = winston.format

const COLORS = {
  error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m',
  http: '\x1b[35m', debug: '\x1b[37m', reset: '\x1b[0m',
}

const consoleFormat = combine(
  errors({ stack: true }),
  timestamp({ format: 'HH:mm:ss.SSS' }),
  printf(({ level, message, timestamp: ts, service, stack, requestId }) => {
    const c = COLORS[level as keyof typeof COLORS] || ''
    const svc = service ? `[${service}]` : ''
    const rid = requestId ? ` (${requestId})` : ''
    return `${c}${ts} ${level.toUpperCase().padEnd(5)} ${svc}${rid}: ${stack || message}${COLORS.reset}`
  })
)

const fileFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json()
)

const rotateBase = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  dirname: path.resolve(config.log.dir),
}

export const logger = winston.createLogger({
  level: config.log.level,
  defaultMeta: { service: 'ibb-api' },
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new DailyRotateFile({ ...rotateBase, filename: 'error-%DATE%.log', level: 'error', format: fileFormat }),
    new DailyRotateFile({ ...rotateBase, filename: 'combined-%DATE%.log', format: fileFormat }),
    new DailyRotateFile({ ...rotateBase, filename: 'http-%DATE%.log', level: 'http', format: fileFormat }),
  ],
})

// ── Child logger factory ───────────────────────────────────────────
export const createLogger = (service: string) => logger.child({ service })

export const authLog    = createLogger('auth')
export const userLog    = createLogger('user')
export const contentLog = createLogger('content')
export const analyticsLog = createLogger('analytics')
export const reportLog  = createLogger('reporting')
export const notifLog   = createLogger('notification')
export const scraperLog = createLogger('scraper')
export const cacheLog   = createLogger('redis')
export const jobLog     = createLogger('bull-queue')
export const kafkaLog   = createLogger('kafka')
export const aiLog      = createLogger('ai-service')
export const adminLog   = createLogger('admin')

// ── Morgan HTTP stream ─────────────────────────────────────────────
export const morganStream = {
  write: (msg: string) => logger.http(msg.trim(), { service: 'http' }),
}
