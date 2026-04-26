import cluster from 'cluster'
import os from 'os'
import { logger } from './utils/logger'

const WORKERS = process.env.WEB_CONCURRENCY
  ? parseInt(process.env.WEB_CONCURRENCY)
  : Math.min(os.cpus().length, 4)

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} starting ${WORKERS} workers`)

  for (let i = 0; i < WORKERS; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`)
    cluster.fork()
  })

  cluster.on('online', (worker) => {
    logger.info(`Worker ${worker.process.pid} online`)
  })
} else {
  require('./server')
}
