import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Shield, TrendingUp, Zap, Database, Globe, ArrowRight, Play, ExternalLink } from 'lucide-react'

const features = [
  { icon: Activity, label: 'Real-Time Sentiment', desc: 'NLP-powered emotion analysis across millions of posts with millisecond latency', color: 'cyan' },
  { icon: TrendingUp, label: 'Viral Intelligence', desc: 'Detect content going viral 2–4 hours before mainstream metrics catch it', color: 'violet' },
  { icon: Shield, label: 'Misinfo Detection', desc: 'AI-driven false information flagging with 94%+ accuracy across 12 categories', color: 'rose' },
  { icon: Database, label: 'Behavioral Archive', desc: 'Immutable audit log of online interactions — your digital black box', color: 'amber' },
  { icon: Globe, label: 'Cross-Platform', desc: 'Ingest data from Twitter, Reddit, YouTube, news APIs, and custom web scraping', color: 'emerald' },
  { icon: Zap, label: 'Real-Time Pipelines', desc: 'Kafka-backed streaming with sub-second event processing at scale', color: 'violet' },
]

const stats = [
  { value: '2.4B+', label: 'Data Points Analyzed' },
  { value: '94.2%', label: 'Misinfo Detection Accuracy' },
  { value: '<50ms', label: 'API Response Latency' },
  { value: '15+', label: 'Integrated Data Sources' },
]

const colorMap: Record<string, string> = {
  cyan: 'text-cyan bg-cyan/10 border-cyan/20',
  violet: 'text-violet-bright bg-violet/10 border-violet/20',
  amber: 'text-amber-bright bg-amber/10 border-amber/20',
  rose: 'text-rose-bright bg-rose/10 border-rose/20',
  emerald: 'text-emerald-bright bg-emerald/10 border-emerald/20',
}

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-void text-signal font-body overflow-x-hidden">
      {/* Ambient bg effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-violet/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[40%] w-[400px] h-[400px] bg-rose/[0.04] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
            <Database size={16} className="text-void" />
          </div>
          <div>
            <div className="text-sm font-mono font-semibold text-cyan">INTERNET BLACK BOX</div>
            <div className="text-[9px] font-mono text-dim">DIGITAL BEHAVIOR INTELLIGENCE</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-dim">
          <a href="#features" className="hover:text-bright transition-colors">Features</a>
          <a href="#research" className="hover:text-bright transition-colors">Research</a>
          <a href="#api" className="hover:text-bright transition-colors">API Docs</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Access</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/10 border border-cyan/30 rounded-full text-cyan text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            Research Platform · v2.0 · TMV University Pune
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
            The Internet's{' '}
            <span className="text-gradient-cyan">Flight Recorder</span>
          </h1>

          <p className="text-lg text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
            An enterprise-grade research platform that records, analyzes, and visualizes
            online behavioral data — tracking sentiment, virality, and misinformation
            across the open web in real time.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-7 py-3">
              Start Research <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost flex items-center gap-2 text-base px-7 py-3">
              <Play size={16} /> Live Demo
            </Link>
          </div>
        </motion.div>

        {/* Mock terminal */}
        <motion.div
          className="mt-16 w-full max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-ink border border-border rounded-xl overflow-hidden shadow-panel-lg">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
              <div className="w-3 h-3 rounded-full bg-rose/60" />
              <div className="w-3 h-3 rounded-full bg-amber/60" />
              <div className="w-3 h-3 rounded-full bg-emerald/60" />
              <span className="ml-2 text-xs text-dim font-mono">ibb-analyzer — real-time stream</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                <span className="text-[10px] text-emerald-bright font-mono">STREAMING</span>
              </div>
            </div>
            <div className="p-5 font-mono text-xs space-y-2 text-left">
              {[
                { t: 'cyan', txt: '> Initializing sentiment pipeline... [NLP v4.2]' },
                { t: 'emerald', txt: '✓ Connected to Kafka stream: content-ingestion-v2' },
                { t: 'dim', txt: '[2024-01-24 14:32:11] Processing batch #4891 · 2,340 posts' },
                { t: 'amber', txt: '⚠ VIRAL ALERT: "AI Regulation Bill" → 94K shares/2h · Score: 97/100' },
                { t: 'rose', txt: '⚡ MISINFO DETECTED: Health cluster · Confidence: 0.967 · Flagging...' },
                { t: 'dim', txt: '[2024-01-24 14:32:14] Sentiment avg: -0.23 (negative trend) ↘' },
                { t: 'emerald', txt: '✓ Report snapshot saved · MongoDB collection: analyses_2024_01' },
                { t: 'cyan', txt: '> Awaiting next event batch... [queue: 18,423 msgs]' },
              ].map((line, i) => (
                <motion.div
                  key={i}
                  className={`text-${line.t}-bright opacity-90`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.9, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  {line.txt}
                </motion.div>
              ))}
              <div className="flex items-center gap-1 text-cyan">
                <span>›</span>
                <motion.span
                  className="w-2 h-4 bg-cyan/70"
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 py-12 border-y border-border/40">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-display font-bold text-gradient-cyan">{s.value}</div>
              <div className="text-sm text-dim mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">
              Research-Grade Infrastructure
            </h2>
            <p className="text-dim max-w-xl mx-auto">
              Built for researchers, journalists, and institutions who need
              production-level insight into digital information ecosystems.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="card-hover group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className={`inline-flex p-2.5 rounded-lg border ${colorMap[f.color]} mb-4`}>
                  <f.icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-signal mb-2">{f.label}</h3>
                <p className="text-sm text-dim leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card cyber-border p-10">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to see inside the black box?</h2>
            <p className="text-dim mb-8">
              Join researchers, media organizations, and government institutions
              already using IBB to understand the digital information landscape.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/register" className="btn-primary flex items-center gap-2">
                Request Access <ArrowRight size={15} />
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost flex items-center gap-2">
                <ExternalLink size={15} /> View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border/40 text-center text-xs text-dim font-mono">
        <div>© 2025 Deepak Bhandhari & Vijay Waghmode · Tilak Maharashtra Vidyapeeth University</div>
        <div className="mt-1 text-ghost">Internet Black Box — BCA Final Year Project · Research Platform v2.0</div>
      </footer>
    </div>
  )
}
