# 🖤 Internet Black Box

<div align="center">

<img src="https://img.shields.io/badge/Internet%20Black%20Box-v2.0-00D4FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01ek0yIDE3bDEwIDUgMTAtNS0xMC01LTEwIDV6Ii8+PC9zdmc+" alt="IBB"/>

**If aircraft have flight recorders, the internet deserves one too.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

<br/>

[🌐 Live Demo](#) &nbsp;·&nbsp;
[📖 Docs](#documentation) &nbsp;·&nbsp;
[🚀 Quick Start](#-quick-start) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/YOUR_GITHUB/internet-black-box/issues) &nbsp;·&nbsp;
[💡 Request Feature](https://github.com/YOUR_GITHUB/internet-black-box/issues)

</div>

---

## 👨‍💻 Authors

<table align="center">
  <tr>
    <td align="center" width="300">
      <img src="https://avatars.githubusercontent.com/YOUR_GITHUB" width="80" style="border-radius:50%"/><br/>
      <b>Deepak Channabasappa Bhandhari</b><br/>
      <sub>PRN: 04423000187</sub><br/>
      <sub>BCA Final Year · TMV University, Pune</sub><br/><br/>
      <a href="https://github.com/YOUR_GITHUB">
        <img src="https://img.shields.io/badge/GitHub-YOUR_GITHUB-181717?style=flat-square&logo=github"/>
      </a><br/>
      <a href="https://linkedin.com/in/YOUR_LINKEDIN">
        <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin"/>
      </a>
    </td>
    <td align="center" width="300">
      <img src="https://avatars.githubusercontent.com/VIJAY_GITHUB" width="80" style="border-radius:50%"/><br/>
      <b>Vijay Waghmode</b><br/>
      <sub>PRN: 04423000169</sub><br/>
      <sub>BCA Final Year · TMV University, Pune</sub><br/><br/>
      <a href="https://github.com/VIJAY_GITHUB">
        <img src="https://img.shields.io/badge/GitHub-VIJAY_GITHUB-181717?style=flat-square&logo=github"/>
      </a><br/>
      <a href="https://linkedin.com/in/VIJAY_LINKEDIN">
        <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin"/>
      </a>
    </td>
  </tr>
</table>

<div align="center">

| Field | Detail |
|---|---|
| 🎓 **Guide** | [Professor / Guide Name Placeholder] |
| 🏫 **Department** | Computer Science |
| 🏛️ **University** | Tilak Maharashtra Vidyapeeth University, Pune |
| 📅 **Academic Year** | 2025 – 2026 |
| 📘 **Degree** | Bachelor of Computer Application (BCA) |

</div>

---

## 📌 What is Internet Black Box?

> *"An aircraft's black box records everything that happens in flight — even the moments before a crash. The internet needs one too."*

**Internet Black Box (IBB)** is a research-oriented web platform that acts as a digital recorder for online information behavior. It continuously ingests content from across the web, runs it through a multi-layer NLP pipeline, and surfaces deep insights about:

- 📊 **Emotional sentiment** — how content makes people feel
- 🔥 **Viral spread** — what goes viral and why
- ⚠️ **Misinformation** — detecting and flagging false narratives
- 🏷️ **Topic patterns** — what subjects are dominating the discourse
- 👁️ **Behavioral trends** — how information propagates across platforms

Unlike platforms that show you *how many* likes a post has, IBB tells you *why* it spread, *what emotion* it triggered, and *whether it's true*.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                  │
│         React 18 · Vite · TailwindCSS · Framer Motion · Zustand         │
│    21 Pages · Role-based UI · WebSocket Feed · Recharts · Dark Mode      │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │  HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────────────────┐
│                         API GATEWAY  (Nginx)                             │
│          SSL · Load Balancing · Rate Limiting · Static Assets            │
└──────┬────────────────────────────────────────────────────────┬─────────┘
       │  REST + WS                                             │  HTTP
┌──────▼────────────────────────────────┐   ┌──────────────────▼──────────┐
│       NODE.JS BACKEND  :5000          │   │   PYTHON AI SERVICE  :8000  │
│  Express · TypeScript · Socket.IO     │   │   FastAPI · Uvicorn         │
│  JWT Auth · RBAC · Zod · Bull Queue   │◄──►   Transformers · spaCy     │
│  8 Modules · 35+ REST Endpoints       │   │   NLTK · Scikit-learn       │
└──────┬────────────────┬───────────────┘   └─────────────────────────────┘
       │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌─────────────────────────────────────┐
│  MongoDB    │  │    Redis    │  │          Bull Queue Workers           │
│  :27017     │  │   :6379     │  │  Analysis · Reports · Email          │
│  9 schemas  │  │  Cache ·   │  │  Notifications · Scraper · Batch     │
│  TTL indexes│  │  Sessions  │  │  Cleanup  (7 queues, async)          │
└─────────────┘  └─────────────┘  └─────────────────────────────────────┘
```

---

## 📦 Modules

This project is split into **3 independent modules**, each with its own README:

<table>
  <tr>
    <th>Module</th>
    <th>Stack</th>
    <th>Port</th>
    <th>README</th>
  </tr>
  <tr>
    <td>🖥️ <b>Frontend</b></td>
    <td>React · Vite · Tailwind · Framer Motion · Zustand</td>
    <td><code>:5173</code></td>
    <td><a href="./frontend/README.md">frontend/README.md</a></td>
  </tr>
  <tr>
    <td>⚙️ <b>Backend</b></td>
    <td>Node.js · Express · MongoDB · Redis · Bull · Socket.IO</td>
    <td><code>:5000</code></td>
    <td><a href="./backend/README.md">backend/README.md</a></td>
  </tr>
  <tr>
    <td>🧠 <b>AI/NLP API</b></td>
    <td>Python · FastAPI · HuggingFace · spaCy · NLTK</td>
    <td><code>:8000</code></td>
    <td><a href="./ai-service/README.md">ai-service/README.md</a></td>
  </tr>
</table>

---

## ✨ Features

### 🔐 Authentication & Access Control
- JWT access + refresh token rotation with Redis blacklisting
- 4 roles: **SuperAdmin → Admin → Researcher → User**
- Account locking after 5 failed login attempts
- Forgot/reset password via email, change password, logout-all

### 📊 Analytics Dashboard
- KPI cards (total content, viral alerts, misinfo flagged, active users)
- 30-day sentiment trend chart
- Category breakdown pie chart
- Per-platform sentiment comparison (Twitter, Reddit, YouTube, News)
- Activity heatmap (day × hour grid)
- Live event stream via WebSocket

### 🔍 Content Analysis
- Paste text, enter a URL, or upload a file
- Multi-layer NLP: sentiment → emotions → misinfo → virality → NER → readability
- Results: polarity score, emotion breakdown, entity list, keyword cloud
- Radar chart — content profile (credibility, negativity, engagement, etc.)

### 🔥 Viral Trend Detection
- Time-series spike detection using modified Z-score (rolling MAD)
- Virality levels: **VIRAL / TRENDING / RISING / STABLE**
- 3-step linear projection
- Per-category virality comparison
- Sorted topic leaderboard with growth rates

### ⚠️ Misinformation Tracker
- 3-layer detection: keyword matching + linguistic analysis + source credibility
- Confidence score (0–100%), risk level (NONE → CRITICAL)
- Misinfo type classification (health, political, technology, conspiracy...)
- Platform spread tracking
- Human-readable recommendation on every flagged item

### 📰 Web Data Fetching
- NewsAPI, GNews, RSS feeds, direct URL scraping
- Auto-analyze fetched articles (sentiment + misinfo + topic)
- Filters: category, language, date range, page size

### 📁 Batch Processing
- Upload CSV / JSON / JSONL datasets (up to 100 MB)
- Async pipeline — queue job, get ID, poll status
- Up to 500 texts per API call
- Background Bull worker with progress tracking

### 📋 Reports
- Generate PDF / CSV / JSON / XLSX reports
- Types: Sentiment, Viral Trends, Misinfo Summary, Full Platform
- 7-day download TTL with auto-expiry
- Download count tracking

### 🔔 Real-time Notifications
- In-app notification centre with unread count
- Types: viral_alert, misinfo_alert, report_ready, system, account
- Mark read / mark all / delete
- WebSocket delivery to online users

### 🛠️ Admin Panel
- Full user management (view, edit role/status, suspend, delete)
- Activity logs with service + severity filtering
- System health dashboard (MongoDB, Redis, Bull queues, AI service)
- Platform-wide aggregated statistics

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| Python | 3.11+ |
| MongoDB | 7.0+ |
| Redis | 7.0+ |
| Docker | 24+ (optional) |

### Option A — Docker (Recommended)

```bash
# 1. Clone
git clone https://github.com/YOUR_GITHUB/internet-black-box.git
cd internet-black-box

# 2. Copy env files
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env

# 3. Start everything
docker-compose up --build -d

# 4. Seed database
docker exec ibb-backend npm run seed
```

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:5000/api |
| AI Service | http://localhost:8000/docs |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

### Option B — Manual (Development)

```bash
# Terminal 1 — Backend
cd backend
npm install
cp .env.example .env        # edit MONGO_URI, REDIS_URL, JWT_SECRET
npm run seed                # seed demo data
npm run dev                 # http://localhost:5000

# Terminal 2 — Python AI Service
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/download_models.py   # one-time model download
python main.py                       # http://localhost:8000

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@ibb.in` | `Admin@1234` |
| 🔬 Researcher | `researcher@ibb.in` | `Research@1234` |
| 👤 User | `user@ibb.in` | `User@1234` |
| Deepak | `deepak@ibb.in` | `Deepak@1234` |
| Vijay | `vijay@ibb.in` | `Vijay@1234` |

---

## 🗄️ Database Schema

```
MongoDB — internet_black_box
├── users           (email, role, status, bcrypt password, refresh tokens)
├── contents        (text, sentiment, virality, misinfo, NER, keywords)
├── sentimentresults (per-content NLP output, model version, timing)
├── trends          (name, virality score, hourly data, growth rate)
├── reports         (type, status, filePath, 7-day TTL)
├── notifications   (userId, type, read, 30-day TTL)
├── activitylogs    (type, service, severity — capped 100MB)
├── datasets        (upload metadata, processing progress)
└── interactions    (view, like, share, comment events)
```

---

## 🌐 API Quick Reference

```
Backend  http://localhost:5000/api
├── POST   /auth/register          Register new user
├── POST   /auth/login             Login → JWT tokens
├── POST   /content/analyze        Analyze text or URL
├── GET    /analytics/dashboard    KPI summary (cached)
├── GET    /analytics/sentiment    Sentiment timeseries
├── GET    /analytics/virality     Top viral content
├── POST   /reports                Generate report (async)
├── GET    /admin/users            List all users (Admin)
├── GET    /api/health             System health check
└── GET    /api/metrics            Prometheus metrics

AI Service  http://localhost:8000/api/v1
├── POST   /analyze-sentiment      Sentiment + emotions
├── POST   /detect-trend           Viral spike detection
├── POST   /classify-topic         10-category classification
├── POST   /detect-misinformation  Multi-layer misinfo check
├── POST   /fetch-web-data         News/RSS/scrape + analyze
├── POST   /analyze                Full NLP pipeline
├── POST   /batch/analyze          Batch 1–500 texts
└── GET    /health                 Model + service status
```

---

## 🧪 Running Tests

```bash
# Backend (TypeScript)
cd backend && npm run typecheck

# Python AI (pytest)
cd ai-service
pytest tests/ -v --tb=short

# Frontend (lint)
cd frontend && npm run lint
```

---

## 📁 Repository Structure

```
internet-black-box/
├── frontend/                   # React + Vite SaaS dashboard
│   ├── src/
│   ├── Dockerfile
│   └── README.md
│
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   ├── docker-compose.yml
│   └── README.md
│
├── ai-service/                 # Python FastAPI NLP service
│   ├── app/
│   ├── tests/
│   └── README.md
│
├── docker-compose.yml          # Full-stack orchestration
└── README.md                   # ← You are here
```

---

## 🛣️ Roadmap

- [x] JWT authentication with refresh token rotation
- [x] Role-based access control (4 levels)
- [x] Sentiment analysis with emotion breakdown
- [x] Viral trend detection (Z-score spike engine)
- [x] Misinformation detection (multi-layer rules)
- [x] Topic classification (zero-shot + TF-IDF)
- [x] WebSocket real-time activity feed
- [x] Batch processing pipeline
- [x] News/RSS web data fetching
- [x] Prometheus metrics + Docker support
- [ ] GraphQL API (in progress)
- [ ] AI-powered fake news verification via fact-check APIs
- [ ] Multilingual sentiment (Hindi, Marathi support)
- [ ] Mobile app (React Native)
- [ ] Kafka event streaming integration
- [ ] Geographic spread visualization (world map heatmap)
- [ ] Automated daily research digest emails

---

## 🤝 Contributing

Contributions are what make open-source projects great. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [HuggingFace Transformers](https://huggingface.co) — pretrained NLP models
- [spaCy](https://spacy.io) — industrial-strength NLP
- [FastAPI](https://fastapi.tiangolo.com) — modern Python API framework
- [Socket.IO](https://socket.io) — real-time event transport
- [Bull](https://docs.bullmq.io) — battle-tested job queues
- [Recharts](https://recharts.org) — composable chart library
- [Framer Motion](https://www.framer.com/motion) — production animation library
- [Lucide Icons](https://lucide.dev) — clean open-source icons
- **Tilak Maharashtra Vidyapeeth University, Pune** — for the opportunity

---

<div align="center">

### 📬 Get In Touch

Have questions about the project? Reach out!

[![Email](https://img.shields.io/badge/Email-deepak%40interndrive.in-EA4335?style=flat-square&logo=gmail)](mailto:deepak@interndrive.in)
[![GitHub](https://img.shields.io/badge/GitHub-YOUR_GITHUB-181717?style=flat-square&logo=github)](https://github.com/YOUR_GITHUB)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Deepak_Bhandhari-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/YOUR_LINKEDIN)

---

<sub>
  Made with ❤️ and lots of ☕ by<br/>
  <b>Deepak Channabasappa Bhandhari</b> (PRN: 04423000187) &
  <b>Vijay Waghmode</b> (PRN: 04423000169)<br/>
  BCA Final Year Project · Department of Computer Science<br/>
  Tilak Maharashtra Vidyapeeth University, Pune · 2025–2026
</sub>

</div>
