import { createClient, RedisClientType } from 'redis'
import { config } from '../../config'
import { cacheLog } from '../../utils/logger'

class RedisService {
  private client: RedisClientType | null = null
  private isConnected = false
  private reconnectTimer: NodeJS.Timeout | null = null

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: config.redis.url,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) { cacheLog.error('Redis max reconnect attempts'); return false }
            return Math.min(retries * 100, 3000)
          },
        },
      }) as RedisClientType

      this.client.on('connect', () => { cacheLog.info('Redis connected'); this.isConnected = true })
      this.client.on('disconnect', () => { cacheLog.warn('Redis disconnected'); this.isConnected = false })
      this.client.on('error', (err) => cacheLog.error(`Redis error: ${err.message}`))

      await this.client.connect()
    } catch (err: any) {
      cacheLog.error(`Redis connection failed: ${err.message}`)
      // App runs without Redis — cache is skipped gracefully
    }
  }

  get ready(): boolean { return this.isConnected && !!this.client }
  private key = (k: string) => `${config.redis.prefix}${k}`

  async get<T = string>(k: string): Promise<T | null> {
    if (!this.ready) return null
    try {
      const val = await this.client!.get(this.key(k))
      if (!val) return null
      try { return JSON.parse(val) as T } catch { return val as unknown as T }
    } catch (err: any) { cacheLog.error(`Redis GET error: ${err.message}`); return null }
  }

  async set(k: string, value: any, ttl = config.redis.ttl): Promise<void> {
    if (!this.ready) return
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value)
      await this.client!.set(this.key(k), serialized, { EX: ttl })
    } catch (err: any) { cacheLog.error(`Redis SET error: ${err.message}`) }
  }

  async del(k: string): Promise<void> {
    if (!this.ready) return
    try { await this.client!.del(this.key(k)) }
    catch (err: any) { cacheLog.error(`Redis DEL error: ${err.message}`) }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.ready) return
    try {
      const keys = await this.client!.keys(this.key(pattern))
      if (keys.length) await this.client!.del(keys)
    } catch (err: any) { cacheLog.error(`Redis DEL pattern error: ${err.message}`) }
  }

  async incr(k: string, ttl?: number): Promise<number> {
    if (!this.ready) return 0
    try {
      const val = await this.client!.incr(this.key(k))
      if (ttl && val === 1) await this.client!.expire(this.key(k), ttl)
      return val
    } catch { return 0 }
  }

  async hset(hash: string, field: string, value: any): Promise<void> {
    if (!this.ready) return
    try { await this.client!.hSet(this.key(hash), field, JSON.stringify(value)) }
    catch (err: any) { cacheLog.error(`Redis HSET error: ${err.message}`) }
  }

  async hget<T = any>(hash: string, field: string): Promise<T | null> {
    if (!this.ready) return null
    try {
      const val = await this.client!.hGet(this.key(hash), field)
      return val ? JSON.parse(val) : null
    } catch { return null }
  }

  async publish(channel: string, message: any): Promise<void> {
    if (!this.ready) return
    try { await this.client!.publish(channel, JSON.stringify(message)) }
    catch (err: any) { cacheLog.error(`Redis PUBLISH error: ${err.message}`) }
  }

  async ping(): Promise<boolean> {
    try { return (await this.client?.ping()) === 'PONG' }
    catch { return false }
  }

  async disconnect(): Promise<void> {
    if (this.client) { await this.client.quit(); this.isConnected = false }
  }
}

export const redisService = new RedisService()

// ── Cache decorator helper ─────────────────────────────────────────
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl = config.redis.ttl
): Promise<T> => {
  const cached = await redisService.get<T>(key)
  if (cached !== null) { cacheLog.debug(`Cache HIT: ${key}`); return cached }
  const result = await fn()
  await redisService.set(key, result, ttl)
  cacheLog.debug(`Cache MISS: ${key} — cached for ${ttl}s`)
  return result
}
