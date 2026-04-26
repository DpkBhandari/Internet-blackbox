import React from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Activity, TrendingUp, AlertTriangle, FileText,
  Database, Zap, Globe, Users
} from 'lucide-react'
import { StatCard, LiveIndicator, SentimentMeter, ViralityBadge, ProgressBar } from '../../components/ui'
import { mockSentimentData, mockTopics, mockActivityStream } from '../../utils/mockData'
import { useAuthStore } from '../../store'

const severityConfig: Record<string, { cls: string; dot: string }> = {
  info: { cls: 'text-cyan', dot: 'bg-cyan' },
  warning: { cls: 'text-amber-bright', dot: 'bg-amber' },
  error: { cls: 'text-rose-bright', dot: 'bg-rose' },
  success: { cls: 'text-emerald-bright', dot: 'bg-emerald' },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-panel border border-border rounded-lg px-3 py-2 text-xs shadow-panel">
      <div className="text-dim mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-neutral capitalize">{p.name}:</span>
          <span className="text-signal font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const topTopics = mockTopics.slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">
            Good morning, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-dim mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <span className="text-xs text-dim font-mono">Streaming active · 18,423 msgs queued</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Content Analyzed" value="2.41M" change="+12.4% today" changeType="up" icon={<FileText size={14} />} color="cyan" />
        <StatCard label="Viral Alerts" value="23" change="5 in last hour" changeType="up" icon={<TrendingUp size={14} />} color="amber" />
        <StatCard label="Misinfo Flagged" value="147" change="-8.2% vs yesterday" changeType="down" icon={<AlertTriangle size={14} />} color="rose" />
        <StatCard label="Active Researchers" value="38" change="+4 this week" changeType="up" icon={<Users size={14} />} color="emerald" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sentiment trend */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-signal">Sentiment Trend — 30 Days</h3>
              <p className="text-xs text-dim mt-0.5">Aggregated emotional polarity across all ingested content</p>
            </div>
            <div className="badge-cyan text-[10px]">LIVE</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockSentimentData}>
              <defs>
                <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FB7185" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FB7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" />
              <XAxis dataKey="date" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#6B7A9F' }} />
              <Area type="monotone" dataKey="positive" stroke="#34D399" fill="url(#posGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="negative" stroke="#FB7185" fill="url(#negGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="neutral" stroke="#FCD34D" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="card">
          <h3 className="font-display font-semibold text-signal mb-5">Content by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Politics', value: 31 },
                  { name: 'Technology', value: 24 },
                  { name: 'Health', value: 19 },
                  { name: 'Environment', value: 14 },
                  { name: 'Other', value: 12 },
                ]}
                cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                dataKey="value" paddingAngle={3}
              >
                {['#00D4FF', '#7C3AED', '#F59E0B', '#10B981', '#3D4560'].map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Politics', value: 31, color: '#00D4FF' },
              { label: 'Technology', value: 24, color: '#7C3AED' },
              { label: 'Health', value: 19, color: '#F59E0B' },
              { label: 'Environment', value: 14, color: '#10B981' },
            ].map(item => (
              <ProgressBar key={item.label} value={item.value} label={item.label} color={item.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top trending topics */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-signal">Trending Topics</h3>
            <a href="/viral-trends" className="text-xs text-cyan hover:underline">View all →</a>
          </div>
          <div className="space-y-3">
            {topTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border/50 hover:border-ghost transition-all"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ghost">#{i + 1}</span>
                    <span className="text-sm font-medium text-signal truncate">{topic.name}</span>
                    {topic.misinfo && <span className="badge-rose text-[9px]">MISINFO</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-dim">{topic.category}</span>
                    <SentimentMeter value={topic.sentiment} size="sm" />
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <ViralityBadge score={topic.virality} />
                  <div className="text-xs text-emerald-bright mt-1">{topic.growth}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-signal">Live Activity</h3>
              <LiveIndicator />
            </div>
            <a href="/activity" className="text-xs text-cyan hover:underline">Full monitor →</a>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-hide">
            {mockActivityStream.map((item, i) => {
              const cfg = severityConfig[item.severity]
              return (
                <motion.div
                  key={item.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface/50 transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-neutral truncate">{item.action}</div>
                    <div className="text-[10px] text-dim mt-0.5 font-mono">{item.user} · {item.time}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* System health strip */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-signal">System Health</h3>
          <a href="/api-status" className="text-xs text-cyan hover:underline">Full status →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'API Gateway', value: 99.98, latency: '42ms', color: '#34D399' },
            { label: 'AI/ML Service', value: 99.81, latency: '218ms', color: '#34D399' },
            { label: 'Kafka Queue', value: 98.40, latency: '450ms', color: '#FCD34D' },
            { label: 'MongoDB', value: 99.97, latency: '12ms', color: '#34D399' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-surface rounded-lg border border-border/50">
              <div className="text-xs text-dim mb-1">{s.label}</div>
              <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.value}%</div>
              <div className="text-[10px] text-dim mt-0.5">latency: {s.latency}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
