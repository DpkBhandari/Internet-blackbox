import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { User, Content, Trend, ActivityLog } from '../models'
import { config } from '../config'

const categories = ['Politics', 'Health', 'Technology', 'Science', 'Environment', 'Economy']
const platforms = ['Twitter', 'Reddit', 'YouTube', 'Facebook', 'News', 'Telegram']
const sources = ['BBC', 'Reuters', 'The Hindu', 'NDTV', 'Times of India', 'ANI', 'Twitter']

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

async function seed() {
  await mongoose.connect(config.mongo.uri)
  console.log('✅ Connected to MongoDB')

  // Clear existing seed data
  await Promise.all([
    User.deleteMany({ email: { $regex: /@ibb\.in$|@seed\.com$/ } }),
    Content.deleteMany({ source: { $in: sources } }),
    Trend.deleteMany({}),
    ActivityLog.deleteMany({}),
  ])
  console.log('🗑  Cleared old seed data')

  // ── Users ────────────────────────────────────────────────────────
  const users = await User.create([
    {
      name: 'Kavya Nair',
      email: 'admin@ibb.in',
      password: 'Admin@1234',
      role: 'admin',
      status: 'active',
      institution: 'InternDrive Technologies',
      emailVerified: true,
    },
    {
      name: 'Dr. Priya Sharma',
      email: 'researcher@ibb.in',
      password: 'Research@1234',
      role: 'researcher',
      status: 'active',
      institution: 'IIT Bombay',
      researchFocus: 'Misinformation, Sentiment Analysis',
      emailVerified: true,
    },
    {
      name: 'Rohit Mehta',
      email: 'user@ibb.in',
      password: 'User@1234',
      role: 'user',
      status: 'active',
      emailVerified: true,
    },
    {
      name: 'Deepak Bhandhari',
      email: 'deepak@ibb.in',
      password: 'Deepak@1234',
      role: 'researcher',
      status: 'active',
      institution: 'TMV University, Pune',
      researchFocus: 'Viral Content, Behavioral Analysis',
      emailVerified: true,
    },
    {
      name: 'Vijay Waghmode',
      email: 'vijay@ibb.in',
      password: 'Vijay@1234',
      role: 'researcher',
      status: 'active',
      institution: 'TMV University, Pune',
      researchFocus: 'Social Media Analytics',
      emailVerified: true,
    },
  ])
  console.log(`👤 Created ${users.length} users`)

  // ── Content ──────────────────────────────────────────────────────
  const sampleTexts = [
    'Scientists discover a breakthrough treatment for aggressive brain tumors using AI-guided nanoparticles.',
    'Government secretly implanting tracking chips in COVID vaccines according to whistleblower reports circulating on social media.',
    'India surpasses China as the fastest growing major economy with 8.4% GDP growth in Q3 2024.',
    'New study confirms 5G towers are completely safe and pose no health risks to humans or wildlife.',
    'BREAKING: Massive earthquake measuring 7.8 hits coastal region, thousands feared missing.',
    'OpenAI unveils GPT-6 with unprecedented reasoning capabilities, sparking debate among AI researchers.',
    'Climate scientists warn that Arctic ice sheets could collapse within a decade, accelerating sea level rise.',
    'Political leaders accused of orchestrating election fraud through manipulation of electronic voting machines.',
    'Local students develop app to track misinformation spread in real-time, wins national innovation award.',
    'Cryptocurrency market crashes 40% overnight as regulatory crackdown intensifies globally.',
    'Herbal remedy claims to cure cancer in 7 days — doctors warn this is dangerous misinformation.',
    'India lands third rover on Moon surface, becoming first nation to land near lunar south pole.',
    'Tech companies agree to new AI safety regulations after pressure from international community.',
    'Rising wheat prices threaten food security for millions in developing nations amid global supply chain crisis.',
    'Viral video shows police brutality incident sparking nationwide protests and calls for reform.',
  ]

  const contentDocs = await Content.create(
    sampleTexts.map((text, i) => {
      const sentimentScore = randomBetween(-0.9, 0.9)
      const viralityScore = Math.floor(randomBetween(20, 100))
      const misinoConf = randomBetween(0, 1)
      const daysAgo = Math.floor(randomBetween(0, 30))
      const createdAt = new Date(Date.now() - daysAgo * 86400000)

      return {
        text,
        title: text.slice(0, 100),
        source: pick(sources),
        platform: pick(platforms),
        category: pick(categories),
        language: 'en',
        sentiment: {
          score: parseFloat(sentimentScore.toFixed(4)),
          label: sentimentScore > 0.2 ? 'positive' : sentimentScore < -0.2 ? 'negative' : 'neutral',
          confidence: parseFloat(randomBetween(0.65, 0.98).toFixed(4)),
          emotions: new Map([
            ['joy', randomBetween(0, 40)],
            ['anger', randomBetween(0, 50)],
            ['fear', randomBetween(0, 40)],
            ['trust', randomBetween(0, 30)],
          ]),
        },
        virality: {
          score: viralityScore,
          level: viralityScore >= 90 ? 'VIRAL' : viralityScore >= 70 ? 'TRENDING' : viralityScore >= 50 ? 'RISING' : 'STABLE',
          shares: Math.floor(randomBetween(100, 200000)),
          reach: Math.floor(randomBetween(1000, 500000)),
          velocity: parseFloat(randomBetween(0.1, 10).toFixed(2)),
        },
        misinfo: {
          flagged: misinoConf > 0.7,
          confidence: parseFloat(misinoConf.toFixed(4)),
          type: misinoConf > 0.7 ? pick(['health_misinfo', 'political_misinfo', 'technology_misinfo']) : undefined,
          signals: misinoConf > 0.7 ? ['Sensational language detected', 'Unverified source'] : [],
        },
        keywords: text.toLowerCase().split(' ').filter(w => w.length > 4).slice(0, 8),
        entities: [],
        toxicity: parseFloat(randomBetween(0, 0.8).toFixed(4)),
        wordCount: text.split(' ').length,
        readabilityGrade: parseFloat(randomBetween(6, 14).toFixed(1)),
        analyzedBy: pick(users)._id,
        isPublic: true,
        createdAt,
        updatedAt: createdAt,
      }
    })
  )
  console.log(`📄 Created ${contentDocs.length} content items`)

  // ── Trends ───────────────────────────────────────────────────────
  const trendData = [
    { name: 'AI Regulation Bill', category: 'Politics', virality: 97, sentiment: 0.32, misinoRisk: false },
    { name: 'COVID Vaccine Update', category: 'Health', virality: 76, sentiment: -0.18, misinoRisk: true },
    { name: 'India GDP Growth', category: 'Economy', virality: 74, sentiment: 0.61, misinoRisk: false },
    { name: 'Climate Summit 2024', category: 'Environment', virality: 81, sentiment: -0.38, misinoRisk: false },
    { name: '5G Health Conspiracy', category: 'Health', virality: 63, sentiment: -0.91, misinoRisk: true },
    { name: 'Chandrayaan-4 Mission', category: 'Science', virality: 88, sentiment: 0.82, misinoRisk: false },
    { name: 'Crypto Regulation', category: 'Technology', virality: 79, sentiment: -0.44, misinoRisk: false },
    { name: 'Election Fraud Claims', category: 'Politics', virality: 92, sentiment: -0.71, misinoRisk: true },
  ]

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  await Trend.create(trendData.map(t => ({
    ...t,
    slug: slugify(t.name),
    keywords: t.name.toLowerCase().split(' '),
    postCount: Math.floor(randomBetween(5000, 400000)),
    growthRate: parseFloat(randomBetween(50, 800).toFixed(1)),
    platforms: [pick(platforms), pick(platforms)],
    firstSeen: new Date(Date.now() - Math.floor(randomBetween(1, 14)) * 86400000),
    lastUpdated: new Date(),
  })))
  console.log(`📈 Created ${trendData.length} trends`)

  // ── Activity logs ─────────────────────────────────────────────────
  const logTypes = [
    { type: 'content_analyzed', action: 'Content analyzed', severity: 'info', service: 'analysis' },
    { type: 'misinfo_flagged', action: 'Misinformation detected', severity: 'warning', service: 'system' },
    { type: 'user_login', action: 'User logged in', severity: 'info', service: 'auth' },
    { type: 'viral_alert', action: 'Viral content detected', severity: 'warning', service: 'system' },
    { type: 'scraper_run', action: 'Scraper completed', severity: 'info', service: 'scraper' },
  ]

  await ActivityLog.create(
    Array.from({ length: 30 }, (_, i) => {
      const logType = pick(logTypes)
      return {
        ...logType,
        userId: pick(users)._id,
        metadata: { index: i },
        ip: `192.168.1.${Math.floor(randomBetween(1, 254))}`,
        createdAt: new Date(Date.now() - i * 3600000),
      }
    })
  )
  console.log(`📝 Created 30 activity log entries`)

  console.log('\n✅ Seed complete!\n')
  console.log('Demo credentials:')
  console.log('  Admin:      admin@ibb.in      / Admin@1234')
  console.log('  Researcher: researcher@ibb.in  / Research@1234')
  console.log('  User:       user@ibb.in        / User@1234')
  console.log('  Deepak:     deepak@ibb.in      / Deepak@1234')
  console.log('  Vijay:      vijay@ibb.in       / Vijay@1234\n')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
