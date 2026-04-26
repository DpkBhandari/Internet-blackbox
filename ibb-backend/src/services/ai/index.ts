import axios, { AxiosInstance } from 'axios'
import { config } from '../../config'
import { aiLog } from '../../utils/logger'

interface AIAnalysisResult {
  sentiment: { score: number; label: string; confidence: number; emotions: Record<string, number> }
  misinfo: { flagged: boolean; confidence: number; type?: string; signals: string[] }
  virality: { score: number; level: string; factors: Record<string, number> }
  keywords: string[]
  entities: string[]
  toxicity: number
  word_count: number
  readability_grade: number
  language: string
  processed_at: string
}

class AIServiceClient {
  private http: AxiosInstance
  private available = false

  constructor() {
    this.http = axios.create({
      baseURL: config.ai.url,
      timeout: config.ai.timeoutMs,
      headers: { 'Content-Type': 'application/json' },
    })

    this.http.interceptors.request.use(req => {
      aiLog.debug(`AI request: ${req.method?.toUpperCase()} ${req.url}`)
      return req
    })

    this.http.interceptors.response.use(
      res => res,
      err => {
        aiLog.error(`AI service error: ${err.message}`)
        return Promise.reject(err)
      }
    )
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.http.get('/health', { timeout: 3000 })
      if (!this.available) { aiLog.info('AI service is available'); this.available = true }
      return true
    } catch {
      if (this.available) { aiLog.warn('AI service unavailable — using fallback analysis'); this.available = false }
      return false
    }
  }

  async analyze(text: string, language = 'en'): Promise<AIAnalysisResult> {
    if (!this.available) return this.fallbackAnalysis(text)
    try {
      const start = Date.now()
      const { data } = await this.http.post<AIAnalysisResult>('/analyze', { text, language })
      aiLog.debug(`AI analysis completed in ${Date.now() - start}ms`)
      return data
    } catch {
      return this.fallbackAnalysis(text)
    }
  }

  async analyzeBatch(texts: string[]): Promise<any[]> {
    if (!this.available) return texts.map(t => this.fallbackAnalysis(t))
    try {
      const { data } = await this.http.post('/analyze/batch', { texts })
      return data.results
    } catch {
      return texts.map(t => this.fallbackAnalysis(t))
    }
  }

  async sentimentOnly(text: string): Promise<AIAnalysisResult['sentiment']> {
    if (!this.available) return this.fallbackAnalysis(text).sentiment
    try {
      const { data } = await this.http.post('/sentiment', { text })
      return data
    } catch {
      return this.fallbackAnalysis(text).sentiment
    }
  }

  // ── Fallback when AI service is down ────────────────────────────
  private fallbackAnalysis(text: string): AIAnalysisResult {
    const negWords = ['bad', 'terrible', 'danger', 'kill', 'hate', 'fraud', 'fake', 'lie', 'corrupt']
    const posWords = ['good', 'great', 'success', 'win', 'peace', 'safe', 'love', 'hope']
    const words = text.toLowerCase().split(/\s+/)
    const neg = words.filter(w => negWords.includes(w)).length
    const pos = words.filter(w => posWords.includes(w)).length
    const score = Math.max(-1, Math.min(1, (pos - neg * 1.2) / Math.max(1, words.length) * 10))
    const label = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'
    const viralityScore = Math.floor(Math.abs(score) * 50 + Math.random() * 30)

    return {
      sentiment: {
        score: parseFloat(score.toFixed(4)),
        label,
        confidence: 0.65,
        emotions: { joy: pos * 10, anger: neg * 15, fear: neg * 8, trust: 20 },
      },
      misinfo: {
        flagged: false,
        confidence: 0,
        signals: [],
      },
      virality: {
        score: viralityScore,
        level: viralityScore >= 90 ? 'VIRAL' : viralityScore >= 70 ? 'TRENDING' : viralityScore >= 50 ? 'RISING' : 'STABLE',
        factors: {},
      },
      keywords: words.filter(w => w.length > 4).slice(0, 10),
      entities: [],
      toxicity: Math.max(0, -score * 0.4),
      word_count: words.length,
      readability_grade: 8,
      language: 'en',
      processed_at: new Date().toISOString(),
    }
  }
}

export const aiService = new AIServiceClient()
