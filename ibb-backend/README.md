# 🖤 Internet Black Box — Backend API v2.0

> **Node.js + Express + MongoDB + Redis + Bull + WebSocket**  
> Production-grade, microservices-ready backend for the IBB research platform.

---

## 📁 Folder Structure

```
ibb-backend/
├── src/
│   ├── server.ts                  ← Entry point, app bootstrap
│   ├── cluster.ts                 ← PM2 cluster mode (production)
│   │
│   ├── config/
│   │   ├── index.ts               ← Centralised env config
│   │   └── database.ts            ← MongoDB connection + retry logic
│   │
│   ├── types/
│   │   └── index.ts               ← All TypeScript interfaces
│   │
│   ├── models/
│   │   └── index.ts               ← All 7 Mongoose schemas
│   │                                 Users, Content, Interactions,
│   │                                 Trends, SentimentResults,
│   │                                 Reports, Notifications,
│   │                                 ActivityLogs, Datasets
│   │
│   ├── middleware/
│   │   └── index.ts               ← Auth, RBAC, rate limiters,
│   │                                 validation, error handler,
│   │                                 request ID, request logger
│   │
│   ├── modules/                   ← Feature modules (microservices-ready)
│   │   ├── auth/index.ts          ← Register, login, refresh, logout,
│   │   │                            forgot/reset password, change password
│   │   ├── content/index.ts       ← Analyze, batch, CRUD, search
│   │   ├── analytics/index.ts     ← Dashboard, sentiment, virality,
│   │   │                            misinfo, emotions, heatmap, trends
│   │   └── modules.ts             ← User, Notification, Report,
│   │                                 Admin, Scraper, Dataset modules
│   │
│   ├── gateway/
│   │   └── index.ts               ← API Gateway router (mounts all modules)
│   │
│   ├── services/
│   │   ├── redis/index.ts         ← Redis client, cache helpers, withCache()
│   │   ├── bull/index.ts          ← 7 Bull queues + add job helpers
│   │   ├── ai/index.ts            ← AI service client + fallback
│   │   ├── websocket/index.ts     ← Socket.IO server + emit helpers
│   │   └── metrics/index.ts       ← Prometheus metrics + middleware
│   │
│   ├── jobs/
│   │   └── workers.ts             ← All Bull processors:
│   │                                 analysis, report, email,
│   │                                 notification, scraper, batch, cleanup
│   │
│   ├── validators/
│   │   └── index.ts               ← Zod schemas + zodValidate() middleware
│   │
│   └── utils/
│       ├── logger.ts              ← Winston + child loggers per service
│       ├── helpers.ts             ← sendSuccess, sendPaginated, asyncHandler, etc.
│       └── seed.ts                ← Database seeder with demo data
│
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── nodemon.json
├── tsconfig.json
└── package.json
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start services (MongoDB + Redis)
```bash
# Option A: Docker (recommended)
docker-compose up mongo redis -d

# Option B: Local
mongod --dbpath ~/data/db
redis-server
```

### 4. Seed database
```bash
npm run seed
```

### 5. Run development server
```bash
npm run dev
```

### 6. Production build
```bash
npm run build
npm start
# OR cluster mode:
npm run start:cluster
```

---

## 🌐 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require:
```
Authorization: Bearer <access_token>
```
Or API key:
```
X-API-Key: ibb_sk_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Auth Module `/api/auth`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login → JWT tokens |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | 🔒 | Logout (blacklist token) |
| POST | `/logout-all` | 🔒 | Invalidate all sessions |
| POST | `/forgot-password` | Public | Send password reset email |
| POST | `/reset-password/:token` | Public | Reset password |
| GET | `/me` | 🔒 | Get current user |
| PATCH | `/change-password` | 🔒 | Change password |

### User Module `/api/users`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/profile` | 🔒 | Get profile |
| PATCH | `/profile` | 🔒 | Update profile |
| GET | `/stats` | 🔒 | Get usage stats |
| GET | `/api-key` | 🔒 | View API key |
| POST | `/api-key/regenerate` | 🔒 | Regenerate API key |

### Content Module `/api/content`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/analyze` | 🔒 | Analyze text or URL |
| POST | `/analyze/batch` | 🔒 Researcher+ | Queue batch analysis (100 max) |
| GET | `/` | 🔒 | List content (paginated, filtered) |
| GET | `/my` | 🔒 | My analyzed content |
| GET | `/search?q=` | 🔒 | Full-text search |
| GET | `/:id` | 🔒 | Get by ID |
| DELETE | `/:id` | 🔒 | Delete (owner or admin) |

### Analytics Module `/api/analytics`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard` | 🔒 | KPIs + summary (cached 60s) |
| GET | `/sentiment?days=30&category=Health` | 🔒 | Sentiment timeseries |
| GET | `/virality?days=7&limit=20` | 🔒 | Virality stats + timeline |
| GET | `/misinfo?days=30` | 🔒 | Misinfo overview + timeline |
| GET | `/emotions?days=30` | 🔒 | Emotion breakdown (aggregated) |
| GET | `/trends?limit=10` | 🔒 | Trending topics |
| GET | `/platforms?days=30` | 🔒 | Per-platform comparison |
| GET | `/heatmap?days=7` | 🔒 | Activity heatmap data |
| GET | `/summary` | 🔒 | Overall platform summary |

### Reports Module `/api/reports`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/` | 🔒 Researcher+ | Generate report (async) |
| GET | `/` | 🔒 | List reports |
| GET | `/:id` | 🔒 | Get report details |
| GET | `/:id/download` | 🔒 | Get download URL |
| DELETE | `/:id` | 🔒 | Delete report |

### Notifications Module `/api/notifications`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | 🔒 | List notifications |
| GET | `/unread-count` | 🔒 | Unread count |
| PATCH | `/:id/read` | 🔒 | Mark one as read |
| POST | `/mark-all-read` | 🔒 | Mark all as read |
| DELETE | `/:id` | 🔒 | Delete notification |

### Admin Module `/api/admin`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/users` | 🔒 Admin | List all users |
| PATCH | `/users/:id` | 🔒 Admin | Update user status/role |
| DELETE | `/users/:id` | 🔒 Admin | Delete user |
| GET | `/logs` | 🔒 Admin | Activity logs |
| GET | `/status` | 🔒 Admin | System health + queue stats |
| GET | `/datasets` | 🔒 Admin | All datasets |
| GET | `/platform-stats` | 🔒 Admin | Aggregated platform statistics |

### Scraper & Data Module

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/scraper/run` | 🔒 Researcher+ | Queue scraper job |
| GET | `/api/scraper/status` | 🔒 Admin | Scraper queue status |
| POST | `/api/datasets/upload` | 🔒 | Upload dataset file |
| GET | `/api/datasets` | 🔒 | List datasets |

### System

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | Public | Full health check |
| GET | `/api/ready` | Public | Kubernetes readiness |
| GET | `/api/metrics` | Public | Prometheus metrics |
| GET | `/api/queues` | 🔒 Admin | Bull queue stats |
| GET | `/api/` | Public | API info |

---

## 🔒 Role-Based Access Control

| Role | Level | Permissions |
|------|-------|-------------|
| `superadmin` | 4 | Full access including role management |
| `admin` | 3 | User management, all analytics, logs |
| `researcher` | 2 | Batch analysis, reports, misinfo flagging, scraper |
| `user` | 1 | Single content analysis, own reports |

---

## ⚙️ Bull Queue Architecture

| Queue | Workers | Timeout | Purpose |
|-------|---------|---------|---------|
| `content-analysis` | 5 concurrent | 30s | AI analysis jobs |
| `report-generation` | 2 concurrent | 120s | PDF/CSV report generation |
| `email-delivery` | 10 concurrent | 30s | Transactional emails |
| `notifications` | 10 concurrent | 15s | In-app + push notifications |
| `web-scraper` | 3 concurrent | 60s | News/social media scraping |
| `batch-processing` | 1 concurrent | 300s | Dataset file processing |
| `cleanup` | 1 concurrent | 60s | Stale data removal |

All queues: **3 retry attempts** with exponential backoff.

---

## 🗄 MongoDB Collections

| Collection | Indexes | Notes |
|------------|---------|-------|
| `users` | email, role+status, apiKey | Bcrypt password, refresh token rotation |
| `contents` | category+createdAt, virality.score, misinfo.flagged, $text | Full-text search enabled |
| `sentimentresults` | label+createdAt, score | Separate from content for analytics |
| `trends` | virality+lastUpdated, slug | Auto-updated by pipeline |
| `reports` | generatedBy+createdAt, expiresAt (TTL) | 7-day auto-expiry |
| `notifications` | userId+read+createdAt, createdAt (TTL) | 30-day auto-expiry |
| `activitylogs` | severity+createdAt, userId+createdAt | Capped at 100MB/100K docs |
| `datasets` | uploadedBy+createdAt, status | Tracks pipeline progress |
| `interactions` | contentId+type, userId+createdAt | User engagement tracking |

---

## 🔄 Middleware Flow

```
Request
  → requestId (attach UUID for log tracing)
  → cors + helmet (security headers)
  → compression (gzip)
  → mongoSanitize (NoSQL injection prevention)
  → morgan + requestLogger (HTTP logging)
  → metricsMiddleware (Prometheus timing)
  → globalLimiter (rate limiting: 200/min)
  → Route Handler
      → authenticate (JWT verify + blacklist check)
      → authorize (RBAC role check)
      → zodValidate / express-validator (input validation)
      → Controller
          → Redis cache check (withCache)
          → MongoDB query
          → Bull job queue
          → WebSocket emit
          → Response
  → errorHandler (global error catch)
  → notFound (404 handler)
```

---

## 📡 WebSocket Events

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `connected` | `{ userId, role, onlineCount }` | Auth confirmed |
| `activity` | `{ type, severity, action, timestamp }` | Live activity feed |
| `viral_alert` | `{ topic, score, category }` | Viral threshold crossed |
| `misinfo_alert` | `{ content, confidence }` | Misinfo detected |
| `notification` | `{ title, message, type }` | Personal notification |
| `user_online` | `{ userId, name }` | User connected (admin only) |
| `pong` | `{ timestamp }` | Keepalive response |

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `subscribe:topic` | `topicId` | Subscribe to topic updates |
| `unsubscribe:topic` | `topicId` | Unsubscribe from topic |
| `subscribe:category` | `category` | Subscribe to category feed |
| `ping` | — | Keepalive |

---

## 📈 Scalability Notes

- **Stateless API** — horizontal scaling with load balancer
- **Redis** for sessions, caching, rate limiting, pub/sub
- **Bull queues** for all async work (CPU-intensive ops off main thread)
- **MongoDB indexes** on all query fields; compound indexes for analytics
- **Capped collection** for ActivityLog (prevents unbounded growth)
- **TTL indexes** on Notifications (30 days) and Reports (7 days)
- **Cluster mode** (`npm run start:cluster`) uses all CPU cores
- **Connection pooling** — MongoDB (10 connections), Redis (automatic)
- **Prometheus metrics** for latency histograms, error rates, queue depth

---

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ibb.in | Admin@1234 |
| Researcher | researcher@ibb.in | Research@1234 |
| User | user@ibb.in | User@1234 |
| Deepak | deepak@ibb.in | Deepak@1234 |
| Vijay | vijay@ibb.in | Vijay@1234 |

---

*Internet Black Box Backend — Built for TMV University BCA Final Year Project 2025–26*
