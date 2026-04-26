import { Request } from 'express'
import { Document, Types } from 'mongoose'

export type UserRole = 'superadmin' | 'admin' | 'researcher' | 'user'
export type UserStatus = 'active' | 'suspended' | 'pending' | 'banned'
export type ContentCategory = 'Politics' | 'Health' | 'Technology' | 'Entertainment' | 'Education' | 'Economy' | 'Environment' | 'Science' | 'Sports' | 'General'
export type SentimentLabel = 'positive' | 'negative' | 'neutral'
export type ViralityLevel = 'VIRAL' | 'TRENDING' | 'RISING' | 'STABLE'
export type MisinfoStatus = 'confirmed' | 'investigating' | 'cleared' | 'escalated'
export type ReportStatus = 'pending' | 'processing' | 'ready' | 'failed'
export type DatasetStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
export type LogSeverity = 'info' | 'warning' | 'error' | 'success' | 'debug'

// ── Extended Request ────────────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: IUserDocument
  requestId?: string
}

// ── User ─────────────────────────────────────────────────────────────────
export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
  status: UserStatus
  institution?: string
  researchFocus?: string
  bio?: string
  avatar?: string
  apiKey: string
  refreshTokens: string[]
  lastLogin?: Date
  loginCount: number
  failedLoginAttempts: number
  lockUntil?: Date
  emailVerified: boolean
  emailVerifyToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  preferences: {
    emailAlerts: boolean
    viralAlerts: boolean
    misinfoAlerts: boolean
    theme: 'dark' | 'light'
  }
  stats: {
    analysesRun: number
    reportsGenerated: number
    misinfoFlagged: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
  comparePassword(pwd: string): Promise<boolean>
  isLocked(): boolean
  incrementLoginAttempts(): Promise<void>
}

// ── Content ───────────────────────────────────────────────────────────────
export interface IContent {
  title?: string
  text: string
  url?: string
  source: string
  platform?: string
  category: ContentCategory
  language: string
  sentiment: {
    score: number
    label: SentimentLabel
    confidence: number
    emotions: Map<string, number>
  }
  virality: {
    score: number
    level: ViralityLevel
    shares: number
    reach: number
    velocity: number
  }
  misinfo: {
    flagged: boolean
    confidence: number
    type?: string
    signals: string[]
  }
  keywords: string[]
  entities: string[]
  toxicity: number
  wordCount: number
  readabilityGrade: number
  analyzedBy?: Types.ObjectId
  batchId?: string
  isPublic: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// ── Interaction ────────────────────────────────────────────────────────────
export interface IInteraction {
  contentId: Types.ObjectId
  userId?: Types.ObjectId
  type: 'view' | 'like' | 'dislike' | 'share' | 'comment' | 'report'
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt: Date
}

// ── Trend ──────────────────────────────────────────────────────────────────
export interface ITrend {
  name: string
  slug: string
  category: ContentCategory
  keywords: string[]
  sentiment: number
  virality: number
  postCount: number
  growthRate: number
  misinoRisk: boolean
  platforms: string[]
  hourlyData: { hour: Date; count: number; sentiment: number }[]
  peakTime?: Date
  firstSeen: Date
  lastUpdated: Date
}

// ── Sentiment Result ───────────────────────────────────────────────────────
export interface ISentimentResult {
  contentId: Types.ObjectId
  score: number
  label: SentimentLabel
  confidence: number
  emotions: Map<string, number>
  toxicity: number
  virality: number
  keywords: string[]
  entities: string[]
  modelVersion: string
  processingTimeMs: number
  createdAt: Date
}

// ── Report ─────────────────────────────────────────────────────────────────
export interface IReport {
  title: string
  type: 'sentiment' | 'viral' | 'misinfo' | 'full' | 'custom'
  period: string
  startDate?: Date
  endDate?: Date
  category?: ContentCategory | 'all'
  format: 'pdf' | 'csv' | 'json' | 'xlsx'
  filePath?: string
  fileSize?: number
  status: ReportStatus
  generatedBy: Types.ObjectId
  config: Record<string, any>
  summary?: {
    totalContent: number
    avgSentiment: number
    viralTopics: number
    misinoItems: number
  }
  downloadCount: number
  expiresAt?: Date
  createdAt: Date
}

// ── Notification ───────────────────────────────────────────────────────────
export interface INotification {
  userId: Types.ObjectId
  type: 'viral_alert' | 'misinfo_alert' | 'report_ready' | 'system' | 'account'
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  channels: ('in_app' | 'email' | 'push')[]
  sentChannels: string[]
  createdAt: Date
}

// ── Activity Log ────────────────────────────────────────────────────────────
export interface IActivityLog {
  type: string
  action: string
  userId?: Types.ObjectId
  service: string
  severity: LogSeverity
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  duration?: number
  createdAt: Date
}

// ── Dataset ─────────────────────────────────────────────────────────────────
export interface IDataset {
  name: string
  label: string
  type: string
  filePath: string
  fileSize: number
  mimeType: string
  status: DatasetStatus
  recordCount?: number
  processedCount: number
  uploadedBy: Types.ObjectId
  processingJobId?: string
  processingStarted?: Date
  processingCompleted?: Date
  errorMessage?: string
  config?: Record<string, any>
  createdAt: Date
}

// ── API Response helpers ─────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  meta?: Record<string, any>
}

export interface PaginationOptions {
  page: number
  limit: number
  sort?: string
}
