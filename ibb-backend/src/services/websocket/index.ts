import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { config } from '../../config'
import { logger } from '../../utils/logger'
import { User } from '../../models'

let io: SocketServer

// ── Online user tracking ───────────────────────────────────────────
const onlineUsers = new Map<string, Set<string>>() // userId → Set<socketId>

export const initWebSocket = (server: HttpServer): SocketServer => {
  io = new SocketServer(server, {
    path: '/ws',
    cors: { origin: config.clientUrl, methods: ['GET', 'POST'], credentials: true },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  })

  // ── Auth middleware ───────────────────────────────────────────────
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.slice(7)
      if (!token) return next(new Error('Authentication token required'))

      const decoded = jwt.verify(token, config.jwt.secret) as { id: string }
      const user = await User.findById(decoded.id).select('name email role status')
      if (!user || user.status !== 'active') return next(new Error('Invalid user'))

      socket.data.user = user
      next()
    } catch {
      next(new Error('Invalid or expired token'))
    }
  })

  // ── Connection handler ────────────────────────────────────────────
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user
    logger.info(`WS connected: ${user.email} [${socket.id}]`)

    // Track online users
    if (!onlineUsers.has(user._id.toString())) {
      onlineUsers.set(user._id.toString(), new Set())
    }
    onlineUsers.get(user._id.toString())!.add(socket.id)

    // Join personal room
    socket.join(`user:${user._id}`)

    // Join role rooms
    socket.join(`role:${user.role}`)

    // Global activity room
    socket.join('activity')

    // Acknowledge connection
    socket.emit('connected', {
      message: 'Connected to Internet Black Box real-time feed',
      userId: user._id,
      role: user.role,
      onlineCount: onlineUsers.size,
    })

    // Broadcast new online user to admins
    io.to('role:admin').emit('user_online', { userId: user._id, name: user.name, role: user.role })

    // ── Client events ──────────────────────────────────────────────
    socket.on('subscribe:topic', (topicId: string) => {
      socket.join(`topic:${topicId}`)
      socket.emit('subscribed', { topic: topicId })
    })

    socket.on('unsubscribe:topic', (topicId: string) => {
      socket.leave(`topic:${topicId}`)
    })

    socket.on('subscribe:category', (category: string) => {
      socket.join(`category:${category}`)
    })

    socket.on('ping', () => socket.emit('pong', { timestamp: Date.now() }))

    // ── Disconnect ─────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      const sockets = onlineUsers.get(user._id.toString())
      if (sockets) {
        sockets.delete(socket.id)
        if (sockets.size === 0) onlineUsers.delete(user._id.toString())
      }
      logger.info(`WS disconnected: ${user.email} [${reason}]`)
      io.to('role:admin').emit('user_offline', { userId: user._id })
    })

    socket.on('error', (err) => logger.error(`WS error [${user.email}]: ${err.message}`))
  })

  // ── Live event simulator (dev only) ──────────────────────────────
  if (config.isDev) {
    startEventSimulator()
  }

  logger.info(`WebSocket server ready on path /ws`)
  return io
}

export const getIO = (): SocketServer => {
  if (!io) throw new Error('WebSocket not initialized')
  return io
}

// ── Broadcast helpers (called from controllers/workers) ───────────
export const emitToUser = (userId: string, event: string, data: any) => {
  getIO().to(`user:${userId}`).emit(event, data)
}

export const emitToRole = (role: string, event: string, data: any) => {
  getIO().to(`role:${role}`).emit(event, data)
}

export const emitToAll = (event: string, data: any) => {
  getIO().to('activity').emit(event, data)
}

export const emitViralAlert = (topic: string, score: number, category: string) => {
  const payload = {
    id: Date.now().toString(),
    type: 'viral_alert',
    severity: 'warning',
    service: 'system',
    action: `Viral alert: "${topic}" reached score ${score}`,
    category,
    time: 'just now',
    timestamp: new Date().toISOString(),
  }
  getIO().to('activity').emit('activity', payload)
  getIO().to('role:researcher').emit('viral_alert', payload)
  getIO().to('role:admin').emit('viral_alert', payload)
}

export const emitMisinfoAlert = (content: string, confidence: number) => {
  const payload = {
    id: Date.now().toString(),
    type: 'misinfo_flagged',
    severity: 'error',
    service: 'system',
    action: `Misinfo detected (${(confidence * 100).toFixed(0)}% confidence): "${content.slice(0, 80)}..."`,
    time: 'just now',
    timestamp: new Date().toISOString(),
  }
  getIO().to('activity').emit('activity', payload)
  getIO().to('role:admin').emit('misinfo_alert', payload)
}

export const emitContentAnalyzed = (userId: string, contentId: string, sentiment: string) => {
  getIO().to('activity').emit('activity', {
    id: Date.now().toString(),
    type: 'content_analyzed',
    severity: 'info',
    service: 'analysis',
    action: `Content analyzed — sentiment: ${sentiment}`,
    contentId,
    time: 'just now',
    timestamp: new Date().toISOString(),
  })
}

// ── Dev event simulator ───────────────────────────────────────────
const eventTypes = [
  { type: 'content_analyzed', severity: 'info', service: 'analysis', actions: ['Batch analyzed: 2,340 posts', 'URL analyzed from Reuters', 'Text snippet analyzed by researcher'] },
  { type: 'viral_alert', severity: 'warning', service: 'system', actions: ['Topic "AI Bill" hit virality 94', '"Climate Summit" trending globally', '"Crypto Crash" approaching viral threshold'] },
  { type: 'misinfo_flagged', severity: 'error', service: 'system', actions: ['High-confidence misinfo in Health cluster', 'Coordinated inauthentic behavior detected', 'Fact-checked falsehood spreading on WhatsApp'] },
  { type: 'scraper_run', severity: 'info', service: 'scraper', actions: ['Scraped 892 articles from 15 sources', 'NewsAPI fetch: 50 articles (Technology)', 'Reddit scrape completed: 1.2K posts'] },
  { type: 'user_joined', severity: 'success', service: 'auth', actions: ['New researcher approved: dr.xyz@iit.ac.in', 'User login: priya@iit.ac.in', 'API key generated for external client'] },
]

function startEventSimulator() {
  setInterval(() => {
    if (!io) return
    const evt = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const action = evt.actions[Math.floor(Math.random() * evt.actions.length)]
    io.to('activity').emit('activity', {
      id: Date.now().toString(),
      type: evt.type,
      severity: evt.severity,
      service: evt.service,
      action,
      user: 'system',
      time: 'just now',
      timestamp: new Date().toISOString(),
    })
  }, 4000)
}

export const getOnlineCount = () => onlineUsers.size
export const isUserOnline = (userId: string) => onlineUsers.has(userId)
