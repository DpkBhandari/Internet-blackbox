import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { Upload, Link2, FileText, Loader2, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { SentimentMeter, ViralityBadge, AlertBanner, Tag } from '../../components/ui'

const emotionData = [
  { emotion: 'Joy', score: 22 },
  { emotion: 'Anger', score: 38 },
  { emotion: 'Fear', score: 29 },
  { emotion: 'Trust', score: 15 },
  { emotion: 'Surprise', score: 18 },
  { emotion: 'Disgust', score: 31 },
  { emotion: 'Sadness', score: 24 },
  { emotion: 'Anticipation', score: 12 },
]

const radarData = [
  { subject: 'Credibility', value: 42 },
  { subject: 'Virality', value: 78 },
  { subject: 'Negativity', value: 65 },
  { subject: 'Engagement', value: 85 },
  { subject: 'Reach', value: 61 },
  { subject: 'Factuality', value: 38 },
]

const sampleResult = {
  sentiment: -0.42,
  viralityScore: 78,
  category: 'Health',
  keywords: ['vaccine', 'microchip', '5G', 'conspiracy', 'government', 'surveillance'],
  misinfo: true,
  misinoConfidence: 0.89,
  toxicity: 0.62,
  readability: 'Grade 8',
  wordCount: 412,
  emotionalLoad: 'High',
  entities: ['WHO', 'Bill Gates', 'Pfizer', 'CDC'],
}

export const ContentAnalysisPage: React.FC = () => {
  const [tab, setTab] = useState<'text' | 'url' | 'file'>('text')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setLoading(true)
    setAnalyzed(false)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)
    setAnalyzed(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Content Analysis</h1>
        <p className="text-sm text-dim mt-1">Submit text, URLs, or files for deep NLP analysis — sentiment, emotion, misinfo detection</p>
      </div>

      {/* Input tabs */}
      <div className="card">
        <div className="flex gap-1 mb-5 p-1 bg-surface rounded-lg w-fit">
          {(['text', 'url', 'file'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${tab === t ? 'bg-panel text-signal border border-border shadow-sm' : 'text-dim hover:text-bright'}`}
            >
              {t === 'text' ? <><FileText size={13} className="inline mr-1.5" />Text</> : t === 'url' ? <><Link2 size={13} className="inline mr-1.5" />URL</> : <><Upload size={13} className="inline mr-1.5" />File</>}
            </button>
          ))}
        </div>

        {tab === 'text' && (
          <textarea
            className="input min-h-[160px] resize-y font-mono text-xs leading-relaxed"
            placeholder="Paste any article, social media post, news excerpt, or any textual content here for analysis..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        )}
        {tab === 'url' && (
          <input
            className="input"
            placeholder="https://example.com/article"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        )}
        {tab === 'file' && (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-ghost transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-dim mb-3" />
            <p className="text-sm text-dim">Drop your file here or <span className="text-cyan">browse</span></p>
            <p className="text-xs text-ghost mt-1">Supports .txt, .pdf, .docx, .csv (max 10MB)</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-dim font-mono">
            {input.length > 0 && `${input.split(/\s+/).filter(Boolean).length} words · ${input.length} chars`}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</> : <><Zap size={14} /> Analyze Content</>}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card">
          <div className="space-y-3">
            {['Tokenizing & preprocessing text...', 'Running transformer sentiment model...', 'Detecting emotional patterns...', 'Cross-referencing misinfo database...', 'Calculating virality indicators...'].map((step, i) => (
              <motion.div
                key={step}
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
              >
                <Loader2 size={12} className="animate-spin text-cyan flex-shrink-0" />
                <span className="font-mono text-xs text-dim">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {analyzed && !loading && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertBanner
            type={sampleResult.misinfo ? 'error' : 'success'}
            message={sampleResult.misinfo
              ? `⚠ Potential misinformation detected with ${(sampleResult.misinoConfidence * 100).toFixed(0)}% confidence. Content flagged for review.`
              : '✓ Content appears credible. No misinformation signals detected.'
            }
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card text-center">
              <div className="text-xs text-dim mb-2 uppercase tracking-wider">Sentiment Score</div>
              <div className="text-3xl font-mono font-bold text-rose-bright mb-2">{sampleResult.sentiment.toFixed(2)}</div>
              <SentimentMeter value={sampleResult.sentiment} />
            </div>
            <div className="card text-center">
              <div className="text-xs text-dim mb-2 uppercase tracking-wider">Virality Score</div>
              <div className="text-3xl font-mono font-bold text-amber-bright mb-2">{sampleResult.viralityScore}/100</div>
              <ViralityBadge score={sampleResult.viralityScore} />
            </div>
            <div className="card text-center">
              <div className="text-xs text-dim mb-2 uppercase tracking-wider">Toxicity Level</div>
              <div className="text-3xl font-mono font-bold text-rose-bright mb-2">{(sampleResult.toxicity * 100).toFixed(0)}%</div>
              <div className="badge-rose text-xs">HIGH</div>
            </div>
            <div className="card text-center">
              <div className="text-xs text-dim mb-2 uppercase tracking-wider">Category</div>
              <div className="text-xl font-display font-bold text-signal mb-2">{sampleResult.category}</div>
              <div className="badge-cyan text-xs">AUTO-DETECTED</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            {/* Emotion breakdown */}
            <div className="card">
              <h3 className="font-display font-semibold text-signal mb-4">Emotion Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={emotionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} />
                  <YAxis dataKey="emotion" type="category" tick={{ fill: '#9BA8C4', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: '#181C2A', border: '1px solid #1F2435', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="score" fill="#00D4FF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar */}
            <div className="card">
              <h3 className="font-display font-semibold text-signal mb-4">Content Profile Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1F2435" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7A9F', fontSize: 10 }} />
                  <Radar dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Keywords & entities */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-display font-semibold text-signal mb-3">Extracted Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {sampleResult.keywords.map(k => <Tag key={k} label={k} />)}
              </div>
            </div>
            <div className="card">
              <h3 className="font-display font-semibold text-signal mb-3">Named Entities (NER)</h3>
              <div className="flex flex-wrap gap-2">
                {sampleResult.entities.map(e => <span key={e} className="badge-violet text-xs">{e}</span>)}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-xs"><span className="text-dim">Word Count</span><span className="font-mono text-neutral">{sampleResult.wordCount}</span></div>
                <div className="flex justify-between text-xs"><span className="text-dim">Readability</span><span className="font-mono text-neutral">{sampleResult.readability}</span></div>
                <div className="flex justify-between text-xs"><span className="text-dim">Emotional Load</span><span className="font-mono text-rose-bright">{sampleResult.emotionalLoad}</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
