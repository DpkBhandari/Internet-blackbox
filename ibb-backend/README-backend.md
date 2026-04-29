# 🖤 Internet Black Box — Backend API

<div align="center">

![IBB Banner](https://img.shields.io/badge/Internet%20Black%20Box-Backend-7C3AED?style=for-the-badge&logo=node.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Production-grade REST API + WebSocket server for the IBB research platform.**  
Microservices-ready architecture with JWT auth, RBAC, Bull queues, and Prometheus metrics.

[🌐 Live API](#) · [📖 API Docs](#) · [🐛 Report Bug](https://github.com/YOUR_GITHUB/ibb-backend/issues) · [💡 Request Feature](https://github.com/YOUR_GITHUB/ibb-backend/issues)

</div>

---

## 👨‍💻 Authors

<table>
  <tr>
    <td align="center">
      <b>Deepak Channabasappa Bhandhari</b><br/>
      <sub>PRN: 04423000187</sub><br/>
      BCA Final Year · TMV University, Pune<br/>
      <a href="https://github.com/YOUR_GITHUB">GitHub</a> ·
      <a href="https://linkedin.com/in/YOUR_LINKEDIN">LinkedIn</a>
    </td>
    <td align="center">
      <b>Vijay Waghmode</b><br/>
      <sub>PRN: 04423000169</sub><br/>
      BCA Final Year · TMV University, Pune<br/>
      <a href="https://github.com/VIJAY_GITHUB">GitHub</a> ·
      <a href="https://linkedin.com/in/VIJAY_LINKEDIN">LinkedIn</a>
    </td>
  </tr>
</table>

> **Guided by:** [Professor / Guide Name Placeholder]  
> **Department:** Computer Science · Tilak Maharashtra Vidyapeeth University, Pune  
> **Academic Year:** 2025–2026

---

## 📌 About The Project

The **Backend API** is the data engine of the Internet Black Box platform. It handles authentication, content analysis orchestration, real-time WebSocket events, background job processing, web scraping pipelines, and analytics aggregation — all in a single, modular Express application that is designed to scale horizontally.

### ✨ Key Highlights

- **8 feature modules** (auth, user, content, analytics, reports, notifications, admin, scraper)
- **JWT + refresh token** rotation with Redis blacklisting
- **RBAC** — 4 roles: superadmin, admin, researcher, user
- **7 Bull queues** for async work (analysis, reports, email, notifications, scraper, batch, cleanup)
- **Socket.IO WebSocket** with per-user, per-role, and per-topic rooms
- **Prometheus metrics** at `/api/metrics`
- **9 MongoDB collections** with proper indexes (TTL, capped, text, compound)
- **Winston** daily-rotating logs, per-service child loggers
- **Zod** input validation on every route

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4.18 + TypeScript 5.3 |
| Database | MongoDB 7.0 (Mongoose 8) |
| Cache | Redis 7 (ioredis) |
| Queue | Bull 4 (Redis-backed) |
| Real-time | Socket.IO 4 |
| Auth | JWT (access + refresh) + bcrypt |
| Validation | Zod + express-validator |
| Logging | Winston + daily-rotate-file |
| Metrics | prom-client (Prometheus) |
| Security | Helmet, CORS, express-mongo-sanitize |
| Rate Limit | express-rate-limit |
| Scraping | Axios + Cheerio |
| Scheduler | node-cron |
| Docs | Swagger / OpenAPI |

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── server.ts                    # Entry point + graceful shutdown
│   ├── cluster.ts                   # PM2 cluster mode
│   ├── config/
│   │   ├── index.ts                 # Centralised env config
│   │   └── database.ts              # MongoDB connection + retry logic
│   ├── types/index.ts               # All TypeScript interfaces
│   ├── models/index.ts              # 9 Mongoose schemas
│   ├── middleware/index.ts          # Auth, RBAC, rate limiters, error handler
│   ├── modules/
│   │   ├── auth/index.ts            # Register, login, logout, password reset
│   │   ├── content/index.ts         # Analyze, batch, CRUD, search
│   │   ├── analytics/index.ts       # 9 aggregation endpoints
│   │   └── modules.ts               # User, Notification, Report, Admin,
│   │                                #  Scraper, Dataset modules
│   ├── gateway/index.ts             # API Gateway — mounts all modules
│   ├── services/
│   │   ├── redis/index.ts           # Cache service + withCache()
│   │   ├── bull/index.ts            # 7 queues + addXxxJob() helpers
│   │   ├── ai/index.ts              # Python AI service client + fallback
│   │   ├── websocket/index.ts       # Socket.IO server + emitXxx() helpers
│   │   └── metrics/index.ts         # Prometheus counters, histograms, gauges
│   ├── jobs/workers.ts              # All Bull job processors
│   ├── validators/index.ts          # Zod schemas + zodValidate() middleware
│   └── utils/
│       ├── logger.ts                # Winston + child loggers
│       ├── helpers.ts               # sendSuccess, sendPaginated, etc.
│       └── seed.ts                  # Database seeder
├── .env.example
├── Dockerfile
├── docker-compose.yml               # Mongo, Redis, Kafka, Prometheus, Grafana
├── nodemon.json
└── tsconfig.json
```

---

## 🌐 API Reference

**Base URL:** `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/register` | Public | Register user |
| POST | `/login` | Public | Login → JWT pair |
| POST | `/refresh` | Public | Rotate access token |
| POST | `/logout` | 🔒 | Blacklist token |
| POST | `/logout-all` | 🔒 | Kill all sessions |
| POST | `/forgot-password` | Public | Send reset email |
| POST | `/reset-password/:token` | Public | Reset password |
| GET | `/me` | 🔒 | Current user |
| PATCH | `/change-password` | 🔒 | Change password |

### Content — `/api/content`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/analyze` | 🔒 | Analyze text / URL |
| POST | `/analyze/batch` | 🔒 Researcher+ | Queue batch (100 max) |
| GET | `/` | 🔒 | List (paginated, filtered) |
| GET | `/my` | 🔒 | My content |
| GET | `/search?q=` | 🔒 | Full-text search |
| GET | `/:id` | 🔒 | By ID |
| DELETE | `/:id` | 🔒 | Delete (owner/admin) |

### Analytics — `/api/analytics`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | KPIs + category breakdown |
| GET | `/sentiment?days=30` | Sentiment timeseries |
| GET | `/virality?days=7` | Top viral content |
| GET | `/misinfo?days=30` | Misinfo stats + timeline |
| GET | `/emotions` | Emotion breakdown |
| GET | `/trends` | Trending topics |
| GET | `/platforms` | Per-platform comparison |
| GET | `/heatmap` | Activity heatmap |
| GET | `/summary` | Overall platform summary |

### Other Modules

| Module | Prefix | Key Routes |
|--------|--------|------------|
| Reports | `/api/reports` | POST (generate), GET, GET/:id, GET/:id/download |
| Notifications | `/api/notifications` | GET, PATCH/:id/read, POST /mark-all-read |
| Admin | `/api/admin` | GET /users, PATCH /users/:id, GET /logs, GET /status |
| Scraper | `/api/scraper` | POST /run, GET /status |
| Datasets | `/api/datasets` | POST /upload, GET |
| System | `/api/health` | Health check, readiness, metrics, queue stats |

---

## ⚙️ Bull Queues

| Queue | Workers | Timeout | Purpose |
|-------|---------|---------|---------|
| `content-analysis` | 5 | 30s | Per-item AI analysis |
| `report-generation` | 2 | 120s | PDF/CSV/JSON reports |
| `email-delivery` | 10 | 30s | Transactional email |
| `notifications` | 10 | 15s | In-app push |
| `web-scraper` | 3 | 60s | News/RSS scraping |
| `batch-processing` | 1 | 300s | Dataset file ingestion |
| `cleanup` | 1 | 60s | Stale data removal |

---

## 🔐 Middleware Flow

```
Request
  → requestId          (UUID trace header)
  → cors + helmet      (security headers)
  → compression        (gzip)
  → mongoSanitize      (NoSQL injection prevention)
  → morgan             (HTTP logging)
  → metricsMiddleware  (Prometheus timing)
  → globalLimiter      (200 req/min)
  → authenticate       (JWT verify + Redis blacklist)
  → authorize          (RBAC role check)
  → zodValidate        (input validation)
  → Controller         (business logic)
  → errorHandler       (global catch)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7.0
- Redis 7.0

### Installation

```bash
# 1. Clone
git clone https://github.com/YOUR_GITHUB/ibb-backend.git
cd ibb-backend

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit .env — set MONGO_URI, REDIS_URL, JWT_SECRET

# 4. Seed database
npm run seed

# 5. Run dev server
npm run dev
```

API available at [http://localhost:5000/api](http://localhost:5000/api)

### Docker (Full Stack)

```bash
# Start MongoDB + Redis only
docker-compose up mongo redis -d

# Or full stack including Prometheus + Grafana
docker-compose --profile monitoring up -d
```

### Production

```bash
npm run build
npm start                 # single process
npm run start:cluster     # multi-core cluster mode
```

---

## 🗄 MongoDB Collections

| Collection | Key Indexes | Notes |
|---|---|---|
| `users` | email, role+status, apiKey | Account locking, refresh token rotation |
| `contents` | category+createdAt, virality.score, $text | Full-text search |
| `sentimentresults` | label+createdAt | Separate analytics store |
| `trends` | virality+lastUpdated | Auto-updated by pipeline |
| `reports` | generatedBy, expiresAt (TTL) | 7-day auto-expiry |
| `notifications` | userId+read, createdAt (TTL) | 30-day auto-expiry |
| `activitylogs` | severity+createdAt | Capped at 100MB |
| `datasets` | uploadedBy, status | Pipeline progress |
| `interactions` | contentId+type | Engagement tracking |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@ibb.in` | `Admin@1234` |
| 🔬 Researcher | `researcher@ibb.in` | `Research@1234` |
| 👤 User | `user@ibb.in` | `User@1234` |
| Deepak | `deepak@ibb.in` | `Deepak@1234` |
| Vijay | `vijay@ibb.in` | `Vijay@1234` |

---

## 📈 Scalability Notes

- Stateless API — scale horizontally with a load balancer
- Redis handles sessions, rate limiting, pub/sub, and cache
- Bull offloads all CPU-intensive work off the main thread
- MongoDB indexes on every query field to keep analytics fast
- Cluster mode uses all available CPU cores via Node.js `cluster`

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add something great'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📜 License

MIT License. See `LICENSE` for details.

---

## 🙏 Acknowledgements

- [Mongoose](https://mongoosejs.com) — MongoDB ODM
- [BullMQ / Bull](https://docs.bullmq.io) — job queues
- [Socket.IO](https://socket.io) — real-time transport
- [Winston](https://github.com/winstonjs/winston) — logging
- Tilak Maharashtra Vidyapeeth University, Pune

---

<div align="center">
  Made with ❤️ by <b>Deepak Bhandhari</b> & <b>Vijay Waghmode</b><br/>
  BCA Final Year Project · TMV University Pune · 2025–26
</div>
