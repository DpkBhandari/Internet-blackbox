# 🖤 Internet Black Box — Frontend

<div align="center">

![IBB Banner](https://img.shields.io/badge/Internet%20Black%20Box-Frontend-00D4FF?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-38BDF8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.x-FF0055?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A research-grade SaaS dashboard for digital behavioral intelligence.**  
Track sentiment, viral trends, and misinformation across the open web — in real time.

[🌐 Live Demo](#) · [📖 Docs](#) · [🐛 Report Bug](https://github.com/YOUR_GITHUB/ibb-frontend/issues) · [💡 Request Feature](https://github.com/YOUR_GITHUB/ibb-frontend/issues)

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

**Internet Black Box** is a final-year BCA project inspired by the concept of an aircraft's flight recorder — applied to the internet. Just as a flight data recorder captures everything happening in a cockpit, IBB captures and analyzes digital behavioral data: what content people consume, how they react emotionally, what spreads virally, and what is potentially false.

The **Frontend** is the user-facing dashboard of this platform — built for researchers, journalists, educators, and analysts who need production-quality insight into online information ecosystems.

### ✨ Key Highlights

- **21 pages** across 3 role-based views (Admin / Researcher / User)
- **Dark-first design system** with custom Tailwind tokens
- **Real-time WebSocket** activity feed
- **Interactive charts** — area, bar, pie, radar, scatter (Recharts)
- **Activity heatmap** (day × hour grid)
- Skeleton loaders, error boundaries, framer-motion transitions
- Collapsible sidebar, global search, notification centre

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 (custom design tokens) |
| Animation | Framer Motion 10 |
| State | Zustand 4 |
| Data Fetching | Axios + React Query |
| Charts | Recharts |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Real-time | Socket.IO Client |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public hero + feature showcase
│   │   ├── auth/
│   │   │   └── AuthPages.tsx        # Login + Register
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx    # KPI cards, sentiment chart, live feed
│   │   ├── content/
│   │   │   └── ContentAnalysisPage.tsx  # NLP analysis UI
│   │   ├── analytics/
│   │   │   └── SentimentPage.tsx    # Heatmap, scatter, platform comparison
│   │   └── AllPages.tsx             # Viral, Misinfo, Activity, Feed,
│   │                                #  Search, Reports, Logs, Admin, etc.
│   ├── components/
│   │   ├── ui/index.tsx             # StatCard, Modal, DataTable, Skeleton...
│   │   └── layout/
│   │       ├── Sidebar.tsx          # Collapsible nav with role filtering
│   │       ├── Topbar.tsx           # Search modal, notifications, user menu
│   │       └── AppLayout.tsx        # Shell with animated sidebar offset
│   ├── store/
│   │   └── index.ts                 # Zustand: auth, ui, notifications
│   └── utils/
│       └── mockData.ts              # Dev mock data (swap for real API)
├── tailwind.config.js               # Custom palette (void/ink/cyan/violet...)
├── vite.config.ts
└── Dockerfile                       # Nginx SPA container
```

---

## 🖥 Pages Overview

| # | Page | Route | Role |
|---|------|-------|------|
| 1 | Landing | `/` | Public |
| 2 | Login | `/login` | Public |
| 3 | Register | `/register` | Public |
| 4 | Dashboard | `/dashboard` | All |
| 5 | Content Analysis | `/content-analysis` | All |
| 6 | Sentiment Viz | `/sentiment` | All |
| 7 | Viral Trends | `/viral-trends` | All |
| 8 | Misinfo Tracker | `/misinformation` | All |
| 9 | Live Activity | `/activity` | All |
| 10 | Content Feed | `/feed` | All |
| 11 | Search & Explore | `/explore` | All |
| 12 | Notifications | `/notifications` | All |
| 13 | Report Generator | `/reports` | Researcher+ |
| 14 | Data Upload | `/upload` | All |
| 15 | Collaboration | `/collaboration` | Researcher+ |
| 16 | API Status | `/api-status` | All |
| 17 | Logs Viewer | `/logs` | Researcher+ |
| 18 | Error Monitor | `/errors` | Admin |
| 19 | Admin Panel | `/admin` | Admin |
| 20 | Profile | `/profile` | All |
| 21 | Settings | `/settings` | All |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_GITHUB/ibb-frontend.git
cd ibb-frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Logins

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@ibb.in` | `admin123` |
| 🔬 Researcher | `researcher@ibb.in` | `research123` |
| 👤 User | `user@ibb.in` | `user123` |

### Build for Production

```bash
npm run build
# Output in dist/ — serve with Nginx or Vercel
```

### Docker

```bash
docker build -t ibb-frontend .
docker run -p 80:80 ibb-frontend
```

---

## 🔌 Backend Integration

Update `vite.config.ts` proxy to point to your backend:

```ts
proxy: {
  '/api': { target: 'http://localhost:5000', changeOrigin: true },
  '/ws':  { target: 'ws://localhost:5000',  ws: true },
}
```

Replace mock data in `src/utils/mockData.ts` with real API calls using Axios.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 🙏 Acknowledgements

- [HuggingFace](https://huggingface.co) — NLP models
- [Recharts](https://recharts.org) — chart library
- [Lucide Icons](https://lucide.dev) — icon set
- [Framer Motion](https://framer.com/motion) — animations
- Tilak Maharashtra Vidyapeeth University, Pune

---

<div align="center">
  Made with ❤️ by <b>Deepak Bhandhari</b> & <b>Vijay Waghmode</b><br/>
  BCA Final Year Project · TMV University Pune · 2025–26
</div>
