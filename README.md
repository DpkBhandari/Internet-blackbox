# 🌐 Internet Blackbox (TypeScript Version)

## A Secure Web-Based Platform for Digital Information Management

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Project Overview

**Internet Blackbox** is a comprehensive web-based platform engineered to provide users with a secure, encrypted environment for managing sensitive digital information. Now fully migrated to **TypeScript**, the system ensures strict type-safety and robust error handling. 

The platform serves as a modern demonstration of secure authentication, real-time activity monitoring via WebSockets, and high-performance caching using Redis.

### Key Highlights
- **Type-Safe Architecture:** End-to-end TypeScript implementation.
- **Security-First:** JWT-based authentication with Redis-backed session management.
- **Real-Time Updates:** WebSocket integration for live system notifications.
- **Containerized:** Fully Dockerized for seamless deployment and scaling.

---

## ⚙️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite-powered)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern & Responsive)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Primary Data Store)
- **Caching:** Redis (Session invalidation & Rate limiting)
- **Real-time:** WebSockets (Socket.io)

---

## 📁 Project Structure (TS Optimized)

```text
internet-blackbox/
├── frontend/                # React TypeScript Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom TS hooks (useAuth, useTheme)
│   │   ├── types/           # Shared interface & type definitions
│   │   ├── context/         # Auth & Theme State Providers
│   │   └── utils/           # API interceptors & helper functions
│   └── Dockerfile
├── backend/                 # Node.js TypeScript API
│   ├── src/
│   │   ├── controllers/     # Business logic handlers
│   │   ├── middleware/      # JWT, Auth guards, & Validation
│   │   ├── models/          # Mongoose schemas & TypeScript models
│   │   ├── services/        # External logic (Redis, WebSockets)
│   │   └── config/          # DB & Environment configurations
│   ├── docker-compose.yml
│   └── Dockerfile
└── .github/                 # CI/CD Workflows
```

## 🚀 Setup & Run

### 1. Frontend (Standalone Docker)
To build and run the frontend interface manually in a container:

```bash
cd frontend
docker build -t ibb-frontend .
docker run -d -p 5173:80 ibb-frontend  
```

### 2. Backend & Infrastructure (Docker Compose)
The backend requires MongoDB and Redis to function. Use Docker Compose to spin up the entire ecosystem simultaneously:

```bash
cd backend
docker-compose up --build 
```



## 🔒 Security Implementation
- Hashing: Passwords secured via bcrypt with 12 salt rounds for high entropy.

- Authentication: JWT (JSON Web Tokens) with short expiration and Redis-backed refresh tokens for secure session invalidation.

- Sanitization: Strict input validation via express-validator to prevent XSS and NoSQL injection.

- Throttling: Redis-based rate limiting to mitigate brute-force attacks and ensure system availability.




## 👨‍💻 Developers

| Name               | PRN         | Role                                      |
|--------------------|------------|-------------------------------------------|
| Deepak C. Bhandari | 04423000187 | Backend Developer (Backend/Infra)           |
| Vijay N. Waghmode  | 04423000169 | Frontend Developer (TS/React)      |