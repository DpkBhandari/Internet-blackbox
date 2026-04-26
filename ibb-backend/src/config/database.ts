import mongoose from 'mongoose'
import { config } from './index'
import { logger } from '../utils/logger'

let retryCount = 0
const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', false)

  mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
    retryCount = 0
  })

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err.message}`)
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected')
    if (!config.isTest) scheduleReconnect()
  })

  await attemptConnect()
}

async function attemptConnect(): Promise<void> {
  try {
    await mongoose.connect(config.mongo.uri, {
      maxPoolSize: config.mongo.poolSize,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    })
  } catch (err: any) {
    logger.error(`MongoDB connection attempt ${retryCount + 1} failed: ${err.message}`)
    if (config.isProd) scheduleReconnect()
    else logger.warn('Running without MongoDB in dev mode')
  }
}

function scheduleReconnect(): void {
  if (retryCount >= MAX_RETRIES) {
    logger.error('Max MongoDB reconnection attempts reached. Exiting.')
    process.exit(1)
  }
  retryCount++
  const delay = RETRY_DELAY_MS * retryCount
  logger.info(`Reconnecting to MongoDB in ${delay / 1000}s (attempt ${retryCount}/${MAX_RETRIES})...`)
  setTimeout(attemptConnect, delay)
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close()
  logger.info('MongoDB connection closed')
}

// Helper for transactions
export async function withTransaction<T>(
  fn: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const result = await fn(session)
    await session.commitTransaction()
    return result
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}
