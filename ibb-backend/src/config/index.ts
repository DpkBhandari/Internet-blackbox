import dotenv from 'dotenv'
dotenv.config()

const get = (key: string, fallback = '') => process.env[key] ?? fallback
const getNum = (key: string, fallback: number) => parseInt(process.env[key] ?? String(fallback), 10)
const getBool = (key: string, fallback = false) => (process.env[key] ?? String(fallback)) === 'true'

export const config = {
  env: get('NODE_ENV', 'development'),
  port: getNum('PORT', 5000),
  clientUrl: get('CLIENT_URL', 'http://localhost:5173'),

  mongo: {
    uri: get('MONGO_URI', 'mongodb://localhost:27017/internet_black_box'),
    poolSize: getNum('MONGO_POOL_SIZE', 10),
  },

  jwt: {
    secret: get('JWT_SECRET', 'dev_secret_min_32_chars_long_change!!'),
    refreshSecret: get('JWT_REFRESH_SECRET', 'dev_refresh_min_32_chars_long!!'),
    expire: get('JWT_EXPIRE', '15m'),
    refreshExpire: get('JWT_REFRESH_EXPIRE', '7d'),
  },

  redis: {
    url: get('REDIS_URL', 'redis://localhost:6379'),
    prefix: get('REDIS_PREFIX', 'ibb:'),
    ttl: getNum('CACHE_TTL_SECONDS', 60),
  },

  bull: {
    redisUrl: get('BULL_REDIS_URL', 'redis://localhost:6379'),
  },

  kafka: {
    enabled: getBool('KAFKA_ENABLED', false),
    brokers: get('KAFKA_BROKERS', 'localhost:9092').split(','),
    clientId: get('KAFKA_CLIENT_ID', 'ibb-backend'),
    groupId: get('KAFKA_GROUP_ID', 'ibb-consumers'),
  },

  ai: {
    url: get('AI_SERVICE_URL', 'http://localhost:8000'),
    timeoutMs: getNum('AI_SERVICE_TIMEOUT_MS', 15000),
  },

  rateLimit: {
    windowMs: getNum('RATE_LIMIT_WINDOW_MS', 60000),
    max: getNum('RATE_LIMIT_MAX', 200),
    authMax: getNum('AUTH_LIMIT_MAX', 20),
    uploadMax: getNum('UPLOAD_LIMIT_MAX', 10),
  },

  log: {
    level: get('LOG_LEVEL', 'info'),
    dir: get('LOG_DIR', './logs'),
  },

  upload: {
    maxSizeMb: getNum('MAX_FILE_SIZE_MB', 100),
    dir: get('UPLOAD_DIR', './uploads'),
  },

  email: {
    host: get('SMTP_HOST', 'smtp.gmail.com'),
    port: getNum('SMTP_PORT', 587),
    user: get('SMTP_USER', ''),
    pass: get('SMTP_PASS', ''),
    from: get('EMAIL_FROM', 'noreply@interndrive.in'),
  },

  metrics: {
    port: getNum('METRICS_PORT', 9090),
    enabled: getBool('ENABLE_METRICS', true),
  },

  scraper: {
    intervalMin: getNum('SCRAPER_INTERVAL_MIN', 15),
    newsApiKey: get('NEWS_API_KEY', ''),
  },

  security: {
    bcryptRounds: getNum('BCRYPT_ROUNDS', 12),
    cookieSecret: get('COOKIE_SECRET', 'change_me'),
  },

  isDev: get('NODE_ENV', 'development') === 'development',
  isProd: get('NODE_ENV', 'development') === 'production',
  isTest: get('NODE_ENV', 'development') === 'test',
}
