import mongoose, { Schema, Document, Types, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { config } from '../config'
import {
  IUserDocument, IContent, IInteraction, ITrend,
  ISentimentResult, IReport, INotification, IActivityLog, IDataset,
} from '../types'

// ══════════════════════════════════════════════════════════════════════
// USER MODEL
// ══════════════════════════════════════════════════════════════════════
const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['superadmin', 'admin', 'researcher', 'user'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended', 'pending', 'banned'], default: 'pending' },
    institution: { type: String, trim: true },
    researchFocus: String,
    bio: { type: String, maxlength: 500 },
    avatar: String,
    apiKey: { type: String, unique: true, sparse: true, select: false },
    refreshTokens: { type: [String], select: false, default: [] },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    emailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    preferences: {
      emailAlerts: { type: Boolean, default: true },
      viralAlerts: { type: Boolean, default: true },
      misinfoAlerts: { type: Boolean, default: true },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    },
    stats: {
      analysesRun: { type: Number, default: 0 },
      reportsGenerated: { type: Number, default: 0 },
      misinfoFlagged: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1, status: 1 })
UserSchema.index({ apiKey: 1 }, { sparse: true })

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, config.security.bcryptRounds)
  next()
})

UserSchema.methods.comparePassword = async function (pwd: string): Promise<boolean> {
  return bcrypt.compare(pwd, this.password)
}

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date())
}

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  const LOCK_TIME = 2 * 60 * 60 * 1000 // 2 hours
  const MAX_ATTEMPTS = 5
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({ $set: { failedLoginAttempts: 1 }, $unset: { lockUntil: 1 } })
    return
  }
  const update: any = { $inc: { failedLoginAttempts: 1 } }
  if (this.failedLoginAttempts + 1 >= MAX_ATTEMPTS && !this.isLocked()) {
    update.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) }
  }
  await this.updateOne(update)
}

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password; delete ret.refreshTokens; delete ret.apiKey
    delete ret.emailVerifyToken; delete ret.passwordResetToken; delete ret.passwordResetExpires
    return ret
  },
})

export const User = mongoose.model<IUserDocument>('User', UserSchema)

// ══════════════════════════════════════════════════════════════════════
// CONTENT MODEL
// ══════════════════════════════════════════════════════════════════════
const ContentSchema = new Schema<IContent & Document>(
  {
    title: { type: String, trim: true, maxlength: 500 },
    text: { type: String, required: true, maxlength: 100000 },
    url: { type: String, trim: true },
    source: { type: String, required: true, default: 'manual', trim: true },
    platform: String,
    category: {
      type: String,
      enum: ['Politics','Health','Technology','Entertainment','Education','Economy','Environment','Science','Sports','General'],
      default: 'General',
    },
    language: { type: String, default: 'en' },
    sentiment: {
      score: { type: Number, default: 0, min: -1, max: 1 },
      label: { type: String, enum: ['positive','negative','neutral'], default: 'neutral' },
      confidence: { type: Number, default: 0, min: 0, max: 1 },
      emotions: { type: Map, of: Number, default: {} },
    },
    virality: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      level: { type: String, enum: ['VIRAL','TRENDING','RISING','STABLE'], default: 'STABLE' },
      shares: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      velocity: { type: Number, default: 0 },
    },
    misinfo: {
      flagged: { type: Boolean, default: false },
      confidence: { type: Number, default: 0 },
      type: String,
      signals: [String],
    },
    keywords: [String],
    entities: [String],
    toxicity: { type: Number, default: 0, min: 0, max: 1 },
    wordCount: { type: Number, default: 0 },
    readabilityGrade: { type: Number, default: 0 },
    analyzedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    batchId: String,
    isPublic: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
)

ContentSchema.index({ category: 1, createdAt: -1 })
ContentSchema.index({ 'virality.score': -1 })
ContentSchema.index({ 'misinfo.flagged': 1, createdAt: -1 })
ContentSchema.index({ 'sentiment.label': 1, createdAt: -1 })
ContentSchema.index({ analyzedBy: 1 })
ContentSchema.index({ batchId: 1 })
ContentSchema.index({ '$**': 'text' })

export const Content = mongoose.model<IContent & Document>('Content', ContentSchema)

// ══════════════════════════════════════════════════════════════════════
// INTERACTION MODEL
// ══════════════════════════════════════════════════════════════════════
const InteractionSchema = new Schema<IInteraction & Document>(
  {
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['view','like','dislike','share','comment','report'], required: true },
    metadata: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
)

InteractionSchema.index({ contentId: 1, type: 1 })
InteractionSchema.index({ userId: 1, createdAt: -1 })
InteractionSchema.index({ type: 1, createdAt: -1 })

export const Interaction = mongoose.model<IInteraction & Document>('Interaction', InteractionSchema)

// ══════════════════════════════════════════════════════════════════════
// TREND MODEL
// ══════════════════════════════════════════════════════════════════════
const TrendSchema = new Schema<ITrend & Document>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    keywords: [String],
    sentiment: { type: Number, default: 0 },
    virality: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    growthRate: { type: Number, default: 0 },
    misinoRisk: { type: Boolean, default: false },
    platforms: [String],
    hourlyData: [{
      hour: Date,
      count: { type: Number, default: 0 },
      sentiment: { type: Number, default: 0 },
    }],
    peakTime: Date,
    firstSeen: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

TrendSchema.index({ virality: -1, lastUpdated: -1 })
TrendSchema.index({ category: 1, virality: -1 })
TrendSchema.index({ slug: 1 }, { unique: true })

export const Trend = mongoose.model<ITrend & Document>('Trend', TrendSchema)

// ══════════════════════════════════════════════════════════════════════
// SENTIMENT RESULT MODEL
// ══════════════════════════════════════════════════════════════════════
const SentimentResultSchema = new Schema<ISentimentResult & Document>(
  {
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, unique: true },
    score: { type: Number, required: true },
    label: { type: String, enum: ['positive','negative','neutral'], required: true },
    confidence: { type: Number, required: true },
    emotions: { type: Map, of: Number, default: {} },
    toxicity: { type: Number, default: 0 },
    virality: { type: Number, default: 0 },
    keywords: [String],
    entities: [String],
    modelVersion: { type: String, default: 'v2.0' },
    processingTimeMs: { type: Number, default: 0 },
  },
  { timestamps: true }
)

SentimentResultSchema.index({ label: 1, createdAt: -1 })
SentimentResultSchema.index({ score: 1 })

export const SentimentResult = mongoose.model<ISentimentResult & Document>('SentimentResult', SentimentResultSchema)

// ══════════════════════════════════════════════════════════════════════
// REPORT MODEL
// ══════════════════════════════════════════════════════════════════════
const ReportSchema = new Schema<IReport & Document>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['sentiment','viral','misinfo','full','custom'], required: true },
    period: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    category: { type: String, default: 'all' },
    format: { type: String, enum: ['pdf','csv','json','xlsx'], default: 'pdf' },
    filePath: String,
    fileSize: Number,
    status: { type: String, enum: ['pending','processing','ready','failed'], default: 'pending' },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    config: { type: Schema.Types.Mixed, default: {} },
    summary: {
      totalContent: Number,
      avgSentiment: Number,
      viralTopics: Number,
      misinoItems: Number,
    },
    downloadCount: { type: Number, default: 0 },
    expiresAt: Date,
  },
  { timestamps: true }
)

ReportSchema.index({ generatedBy: 1, createdAt: -1 })
ReportSchema.index({ status: 1 })
ReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index

export const Report = mongoose.model<IReport & Document>('Report', ReportSchema)

// ══════════════════════════════════════════════════════════════════════
// NOTIFICATION MODEL
// ══════════════════════════════════════════════════════════════════════
const NotificationSchema = new Schema<INotification & Document>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['viral_alert','misinfo_alert','report_ready','system','account'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: Schema.Types.Mixed,
    read: { type: Boolean, default: false },
    priority: { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
    channels: [{ type: String, enum: ['in_app','email','push'] }],
    sentChannels: { type: [String], default: [] },
  },
  { timestamps: true }
)

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 })
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 86400 }) // 30-day TTL

export const Notification = mongoose.model<INotification & Document>('Notification', NotificationSchema)

// ══════════════════════════════════════════════════════════════════════
// ACTIVITY LOG MODEL
// ══════════════════════════════════════════════════════════════════════
const ActivityLogSchema = new Schema<IActivityLog & Document>(
  {
    type: { type: String, required: true },
    action: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    service: { type: String, default: 'api-gateway' },
    severity: { type: String, enum: ['info','warning','error','success','debug'], default: 'info' },
    metadata: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
    duration: Number,
  },
  { timestamps: true, capped: { size: 100 * 1024 * 1024, max: 100000 } } // 100MB capped
)

ActivityLogSchema.index({ severity: 1, createdAt: -1 })
ActivityLogSchema.index({ userId: 1, createdAt: -1 })
ActivityLogSchema.index({ service: 1, createdAt: -1 })

export const ActivityLog = mongoose.model<IActivityLog & Document>('ActivityLog', ActivityLogSchema)

// ══════════════════════════════════════════════════════════════════════
// DATASET MODEL
// ══════════════════════════════════════════════════════════════════════
const DatasetSchema = new Schema<IDataset & Document>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    status: { type: String, enum: ['queued','processing','completed','failed'], default: 'queued' },
    recordCount: Number,
    processedCount: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    processingJobId: String,
    processingStarted: Date,
    processingCompleted: Date,
    errorMessage: String,
    config: Schema.Types.Mixed,
  },
  { timestamps: true }
)

DatasetSchema.index({ uploadedBy: 1, createdAt: -1 })
DatasetSchema.index({ status: 1 })

export const Dataset = mongoose.model<IDataset & Document>('Dataset', DatasetSchema)
