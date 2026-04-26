import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, AlertTriangle, Radio, Search, Bell, Settings, User,
  Shield, Download, Upload, Users, Terminal, Bug, Wifi,
  Filter, RefreshCw, ExternalLink, ChevronRight, CheckCircle,
  Clock, Database, Zap, Globe, Lock, Key, Palette, Bell as BellIcon,
  Play, Pause, Trash2, Eye, Edit3, XCircle, MoreVertical, FileText
} from 'lucide-react'
import {
  StatCard, LiveIndicator, SentimentMeter, ViralityBadge,
  DataTable, AlertBanner, Spinner, ProgressBar, Modal, EmptyState
} from "../components/ui/index.tsx"
import {
  mockViralData, mockTopics, mockMisinfoItems, mockActivityStream,
  mockApiStatus, mockContentFeed, mockUsers, mockLogs, mockSystemMetrics
} from '../utils/mockData.ts'
import { useAuthStore, useNotificationStore } from '../store'

// ======= VIRAL TRENDS =======
export const ViralTrendsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'virality' | 'posts' | 'growth'>('virality')
  const sorted = [...mockTopics].sort((a, b) => b[sortBy] - (typeof a[sortBy] === 'string' ? 0 : a[sortBy] as number))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Viral Trends</h1>
        <p className="text-sm text-dim mt-1">Content spreading faster than baseline — updated every 60 seconds</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <StatCard label="Active Viral Topics" value="23" change="+7 in last 2h" changeType="up" icon={<TrendingUp size={14} />} color="amber" />
        <StatCard label="Peak Shares/Hour" value="94.2K" change="Topic: Gaza Ceasefire" changeType="up" icon={<Globe size={14} />} color="rose" />
        <StatCard label="Avg Spread Rate" value="4.2x" change="vs 24h baseline" changeType="up" icon={<Zap size={14} />} color="cyan" />
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-signal mb-5">Virality Curve — Live Stream</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={mockViralData}>
            <defs>
              <linearGradient id="viralGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" />
            <XAxis dataKey="time" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ background: '#181C2A', border: '1px solid #1F2435', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="shares" stroke="#F59E0B" fill="url(#viralGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="reach" stroke="#7C3AED" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-signal">Trending Topics</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dim">Sort by:</span>
            {(['virality', 'posts', 'growth'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`px-3 py-1 rounded text-xs capitalize transition-all ${sortBy === s ? 'bg-amber/10 text-amber-bright border border-amber/30' : 'text-dim hover:text-bright'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <DataTable headers={['#', 'Topic', 'Category', 'Sentiment', 'Virality', 'Posts', 'Growth', 'Misinfo']}>
          {sorted.map((t, i) => (
            <tr key={t.id}>
              <td><span className="font-mono text-ghost">#{i + 1}</span></td>
              <td><span className="font-medium text-signal">{t.name}</span></td>
              <td><span className="badge-cyan text-[10px]">{t.category}</span></td>
              <td><SentimentMeter value={t.sentiment} size="sm" /></td>
              <td><ViralityBadge score={t.virality} /></td>
              <td><span className="font-mono text-neutral">{t.posts.toLocaleString()}</span></td>
              <td><span className="text-emerald-bright text-xs">{t.growth}</span></td>
              <td>{t.misinfo ? <span className="badge-rose text-[10px]">YES</span> : <span className="text-ghost text-xs">—</span>}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}

// ======= MISINFORMATION TRACKER =======
export const MisinfoPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'investigating'>('all')
  const filtered = filter === 'all' ? mockMisinfoItems : mockMisinfoItems.filter(m => m.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Misinformation Tracker</h1>
        <p className="text-sm text-dim mt-1">AI-flagged false information with propagation paths and confidence scores</p>
      </div>

      <AlertBanner type="warning" message="3 high-confidence misinfo clusters detected in Health and Politics categories in the last 6 hours" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Confirmed Misinfo" value="147" change="+12 today" changeType="up" icon={<AlertTriangle size={14} />} color="rose" />
        <StatCard label="Under Investigation" value="34" change="8 newly flagged" changeType="up" icon={<Eye size={14} />} color="amber" />
        <StatCard label="Avg Spread" value="28.4K" change="shares per item" changeType="neutral" icon={<Globe size={14} />} color="violet" />
        <StatCard label="Detection Accuracy" value="94.2%" change="Model v3.1" changeType="up" icon={<Shield size={14} />} color="emerald" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-signal">Flagged Items</h3>
          <div className="flex gap-2">
            {(['all', 'confirmed', 'investigating'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-xs capitalize transition-all ${filter === f ? 'bg-rose/10 text-rose-bright border border-rose/30' : 'text-dim hover:text-bright border border-transparent'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} className="p-4 bg-surface border border-border rounded-xl hover:border-ghost transition-all"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={item.status === 'confirmed' ? 'badge-rose' : 'badge-amber'}>{item.status.toUpperCase()}</span>
                    <span className="badge-cyan">{item.category}</span>
                    <span className="text-xs text-dim font-mono">Confidence: <span className="text-rose-bright">{(item.confidence * 100).toFixed(0)}%</span></span>
                  </div>
                  <p className="text-sm text-signal font-medium mb-3">"{item.content}"</p>
                  <div className="flex items-center gap-4 text-xs text-dim">
                    <span>First seen: {item.firstSeen}</span>
                    <span>Spread: <span className="text-neutral">{item.spread.toLocaleString()} shares</span></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {item.platforms.map(p => <span key={p} className="badge-violet text-[10px]">{p}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-xs text-dim mb-1">Spread Severity</div>
                    <div className="w-24"><ProgressBar value={Math.min(100, (item.spread / 50000) * 100)} color="#FB7185" /></div>
                  </div>
                  <button className="btn-danger text-xs py-1 px-3">Flag Report</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======= LIVE ACTIVITY =======
export const LiveActivityPage: React.FC = () => {
  const [paused, setPaused] = useState(false)
  const [events, setEvents] = useState(mockActivityStream)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now().toString(),
        type: 'live_update',
        user: 'system',
        action: `Processed batch #${Math.floor(Math.random() * 9999)} · ${Math.floor(Math.random() * 5000)} posts`,
        time: 'just now',
        severity: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)] as any,
      }
      setEvents(prev => [newEvent, ...prev.slice(0, 49)])
    }, 3000)
    return () => clearInterval(interval)
  }, [paused])

  const severityColors: Record<string, string> = {
    info: '#00D4FF', warning: '#F59E0B', error: '#FB7185', success: '#34D399',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">Live Activity Monitor</h1>
          <p className="text-sm text-dim mt-1">Real-time system event stream via WebSocket</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator />
          <button onClick={() => setPaused(!paused)} className="btn-ghost flex items-center gap-2 text-xs">
            {paused ? <><Play size={12} /> Resume</> : <><Pause size={12} /> Pause</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Events/min" value="342" changeType="neutral" icon={<Zap size={14} />} color="cyan" />
        <StatCard label="Active Streams" value="12" changeType="neutral" icon={<Radio size={14} />} color="violet" />
        <StatCard label="Errors (last 1h)" value="7" changeType="neutral" icon={<Bug size={14} />} color="rose" />
        <StatCard label="Queue Depth" value="18.4K" changeType="neutral" icon={<Database size={14} />} color="amber" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-signal">Event Stream</h3>
          <div className="flex items-center gap-2 text-xs font-mono text-dim">
            {paused ? <span className="text-amber-bright">⏸ PAUSED</span> : <span className="text-emerald-bright animate-pulse">● LIVE</span>}
          </div>
        </div>
        <div className="space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-hide font-mono text-xs">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-surface/40 hover:bg-surface transition-colors"
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: severityColors[event.severity] }} />
                <div className="flex-1">
                  <span style={{ color: severityColors[event.severity] }} className="mr-2">[{event.severity.toUpperCase()}]</span>
                  <span className="text-neutral">{event.action}</span>
                  <div className="text-ghost text-[10px] mt-0.5">{event.user} · {event.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ======= CONTENT FEED =======
export const ContentFeedPage: React.FC = () => {
  const [category, setCategory] = useState('All')
  const categories = ['All', 'Technology', 'Politics', 'Health', 'Environment', 'Economy']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Content Feed</h1>
        <p className="text-sm text-dim mt-1">Aggregated content from tracked sources with real-time analysis overlay</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${category === c ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'bg-surface border border-border text-dim hover:text-bright'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {mockContentFeed.map((item, i) => (
          <motion.div key={item.id} className="card-hover"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="badge-cyan text-[10px]">{item.category}</span>
                  {item.misinfo && <span className="badge-rose text-[10px]">⚠ MISINFO RISK</span>}
                  <span className="text-xs text-dim">{item.source}</span>
                  <span className="text-xs text-ghost">·</span>
                  <span className="text-xs text-dim">{item.timestamp}</span>
                </div>
                <h3 className="font-medium text-signal mb-3">{item.title}</h3>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex-1 min-w-[160px]">
                    <SentimentMeter value={item.sentiment} size="sm" />
                  </div>
                  <ViralityBadge score={item.virality} />
                  <span className="text-xs text-dim">{item.shares.toLocaleString()} shares</span>
                  <button className="text-xs text-cyan hover:underline flex items-center gap-1">
                    Analyze <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ======= SEARCH & EXPLORE =======
export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Search & Explore</h1>
        <p className="text-sm text-dim mt-1">Full-text search across all analyzed content, topics, and reports</p>
      </div>

      <div className="card">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
            <input
              className="input pl-10 text-base py-3"
              placeholder="Search topics, keywords, content, users..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearched(true)}
            />
          </div>
          <button className="btn-primary px-6" onClick={() => setSearched(true)}>
            <Search size={16} />
          </button>
        </div>

        {!searched && (
          <div className="mt-5">
            <div className="text-xs text-dim mb-2 uppercase tracking-wider">Trending searches</div>
            <div className="flex flex-wrap gap-2">
              {['AI regulation', 'vaccine misinformation', 'climate change', 'Gaza conflict', 'cryptocurrency fraud', 'election interference'].map(t => (
                <button key={t} onClick={() => { setQuery(t); setSearched(true) }}
                  className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-dim hover:text-bright hover:border-ghost transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {searched && (
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-xs text-dim">Found <span className="text-signal font-semibold">24 results</span> for "{query}"</div>
          {mockTopics.filter(t => !query || t.name.toLowerCase().includes(query.toLowerCase()) || query.length < 2).slice(0, 5).map((topic, i) => (
            <div key={topic.id} className="card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <span className="badge-cyan text-[10px] mr-2">{topic.category}</span>
                  <span className="font-medium text-signal">{topic.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ViralityBadge score={topic.virality} />
                  <button className="text-xs text-cyan hover:underline">View →</button>
                </div>
              </div>
              <div className="mt-2"><SentimentMeter value={topic.sentiment} size="sm" /></div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ======= NOTIFICATIONS =======
export const NotificationsPage: React.FC = () => {
  const { notifications, markRead, markAllRead, clearAll } = useNotificationStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">Notifications</h1>
          <p className="text-sm text-dim mt-1">System alerts, viral events, and research updates</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs" onClick={markAllRead}>Mark all read</button>
          <button className="btn-danger text-xs" onClick={clearAll}>Clear all</button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <EmptyState title="All caught up!" description="No notifications at this time." icon={<Bell size={32} />} />
        ) : notifications.map((n, i) => (
          <motion.div key={n.id}
            className={`card-hover cursor-pointer ${!n.read ? 'border-cyan/20 bg-cyan/5' : ''}`}
            onClick={() => markRead(n.id)}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-start gap-3">
              {!n.read && <div className="w-2 h-2 rounded-full bg-cyan mt-1.5 flex-shrink-0" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={n.type === 'error' ? 'badge-rose' : n.type === 'warning' ? 'badge-amber' : n.type === 'success' ? 'badge-emerald' : 'badge-cyan'}>
                    {n.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-dim font-mono">{new Date(n.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="font-medium text-signal text-sm">{n.title}</div>
                <div className="text-xs text-dim mt-0.5">{n.message}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ======= SETTINGS =======
export const SettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [viralAlerts, setViralAlerts] = useState(true)
  const [misinoAlerts, setMisinoAlerts] = useState(true)
  const [apiKey] = useState('ibb_sk_' + Math.random().toString(36).slice(2, 18))

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-cyan' : 'bg-muted'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-void rounded-full transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Settings</h1>
        <p className="text-sm text-dim mt-1">Manage your account, preferences, and API access</p>
      </div>

      <div className="card space-y-5">
        <h3 className="font-display font-semibold text-signal flex items-center gap-2"><BellIcon size={16} className="text-cyan" /> Alert Preferences</h3>
        {[
          { label: 'Email Alerts', desc: 'Receive email summaries for critical events', value: emailAlerts, set: setEmailAlerts },
          { label: 'Viral Content Alerts', desc: 'Notify when virality score exceeds 85', value: viralAlerts, set: setViralAlerts },
          { label: 'Misinformation Alerts', desc: 'Real-time alerts for high-confidence flags', value: misinoAlerts, set: setMisinoAlerts },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <div className="text-sm text-signal font-medium">{item.label}</div>
              <div className="text-xs text-dim">{item.desc}</div>
            </div>
            <Toggle value={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        <h3 className="font-display font-semibold text-signal flex items-center gap-2"><Key size={16} className="text-cyan" /> API Access</h3>
        <div>
          <div className="text-xs text-dim mb-2">Your API Key</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 input font-mono text-xs text-cyan">{apiKey}</code>
            <button className="btn-ghost text-xs">Copy</button>
            <button className="btn-ghost text-xs">Rotate</button>
          </div>
          <div className="text-xs text-dim mt-2">Rate limit: 1000 req/min · Keep this secret</div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-display font-semibold text-signal flex items-center gap-2"><Palette size={16} className="text-cyan" /> Appearance</h3>
        <div className="flex items-center gap-3">
          {['Dark', 'Light', 'System'].map(t => (
            <button key={t}
              className={`px-4 py-2 rounded-lg border text-sm transition-all ${t === 'Dark' ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-border text-dim hover:border-ghost'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-display font-semibold text-rose-bright flex items-center gap-2"><XCircle size={16} /> Danger Zone</h3>
        <div className="flex items-center justify-between p-3 bg-rose/5 border border-rose/20 rounded-lg">
          <div>
            <div className="text-sm text-signal">Delete Account</div>
            <div className="text-xs text-dim">This action is permanent and cannot be undone</div>
          </div>
          <button className="btn-danger text-xs">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ======= PROFILE =======
export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-signal">Profile</h1>

      <div className="card flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-void text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-signal">{user?.name}</h2>
          <div className="text-sm text-dim">{user?.email}</div>
          <span className={`badge mt-2 ${user?.role === 'admin' ? 'badge-rose' : user?.role === 'researcher' ? 'badge-violet' : 'badge-cyan'}`}>
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Analyses Run" value="142" changeType="neutral" icon={<FileText size={14} />} color="cyan" />
        <StatCard label="Reports Generated" value="28" changeType="neutral" icon={<Download size={14} />} color="violet" />
        <StatCard label="Days Active" value="47" changeType="neutral" icon={<Clock size={14} />} color="emerald" />
      </div>

      <div className="card space-y-4">
        <h3 className="font-display font-semibold text-signal">Edit Profile</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-xs text-dim mb-1.5">Full Name</label><input className="input" defaultValue={user?.name} /></div>
          <div><label className="block text-xs text-dim mb-1.5">Email</label><input className="input" defaultValue={user?.email} /></div>
          <div><label className="block text-xs text-dim mb-1.5">Institution</label><input className="input" placeholder="University / Organization" /></div>
          <div><label className="block text-xs text-dim mb-1.5">Research Focus</label><input className="input" placeholder="e.g., Misinformation, Sentiment" /></div>
        </div>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  )
}

// ======= ADMIN PANEL =======
export const AdminPage: React.FC = () => {
  const { user } = useAuthStore()
  if (user?.role !== 'admin') return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <EmptyState title="Access Denied" description="Admin role required to access this panel." icon={<Lock size={40} />} />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Admin Panel</h1>
        <p className="text-sm text-dim mt-1">User management, system configuration, and platform oversight</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="234" change="+12 this month" changeType="up" icon={<Users size={14} />} color="cyan" />
        <StatCard label="Researchers" value="47" changeType="neutral" icon={<User size={14} />} color="violet" />
        <StatCard label="Suspended" value="3" changeType="neutral" icon={<XCircle size={14} />} color="rose" />
        <StatCard label="Pending Approval" value="8" change="Review needed" changeType="neutral" icon={<Clock size={14} />} color="amber" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-signal">User Management</h3>
          <button className="btn-primary text-xs">+ Invite User</button>
        </div>
        <DataTable headers={['Name', 'Email', 'Role', 'Status', 'Analyses', 'Joined', 'Actions']}>
          {mockUsers.map(u => (
            <tr key={u.id}>
              <td><span className="font-medium text-signal">{u.name}</span></td>
              <td><span className="font-mono text-xs">{u.email}</span></td>
              <td><span className={u.role === 'admin' ? 'badge-rose' : u.role === 'researcher' ? 'badge-violet' : 'badge-cyan'}>{u.role}</span></td>
              <td><span className={u.status === 'active' ? 'text-emerald-bright' : 'text-rose-bright'} >{u.status}</span></td>
              <td><span className="font-mono">{u.analyses}</span></td>
              <td><span className="text-dim text-xs">{u.joined}</span></td>
              <td>
                <div className="flex items-center gap-2">
                  <button className="text-cyan hover:underline text-xs">Edit</button>
                  <button className="text-rose-bright hover:underline text-xs">Suspend</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}

// ======= REPORT GENERATOR =======
export const ReportPage: React.FC = () => {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [form, setForm] = useState({ type: 'sentiment', period: '30d', format: 'pdf', category: 'all' })

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerated(false)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Report Generator</h1>
        <p className="text-sm text-dim mt-1">Generate structured research reports with charts and analysis</p>
      </div>

      <div className="card space-y-5">
        <h3 className="font-display font-semibold text-signal">Configure Report</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-dim mb-1.5">Report Type</label>
            <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="sentiment">Sentiment Analysis</option>
              <option value="viral">Viral Trends</option>
              <option value="misinfo">Misinformation Summary</option>
              <option value="full">Full Platform Report</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-dim mb-1.5">Time Period</label>
            <select className="input" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-dim mb-1.5">Content Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="all">All Categories</option>
              <option value="politics">Politics</option>
              <option value="health">Health</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-dim mb-1.5">Export Format</label>
            <select className="input" value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
              <option value="pdf">PDF Report</option>
              <option value="csv">CSV Data</option>
              <option value="json">JSON Raw Data</option>
              <option value="xlsx">Excel Spreadsheet</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {generating ? <><Spinner size={14} /> Generating report...</> : <><FileText size={14} /> Generate Report</>}
        </button>

        {generated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-emerald/10 border border-emerald/30 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-bright" />
              <div>
                <div className="text-sm font-medium text-signal">Report Ready</div>
                <div className="text-xs text-dim">sentiment_report_30d.{form.format} · 2.4 MB</div>
              </div>
            </div>
            <button className="btn-primary text-xs flex items-center gap-1">
              <Download size={12} /> Download
            </button>
          </motion.div>
        )}
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-signal mb-4">Recent Reports</h3>
        <div className="space-y-2">
          {[
            { name: 'Monthly Sentiment Summary — Jan 2024', size: '4.2 MB', date: '2024-01-24', format: 'PDF' },
            { name: 'Viral Trends Analysis — Q4 2023', size: '2.8 MB', date: '2024-01-10', format: 'PDF' },
            { name: 'Health Misinformation Dataset', size: '18.4 MB', date: '2023-12-28', format: 'CSV' },
          ].map(r => (
            <div key={r.name} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-dim" />
                <div>
                  <div className="text-sm text-signal">{r.name}</div>
                  <div className="text-xs text-dim">{r.date} · {r.size} · {r.format}</div>
                </div>
              </div>
              <button className="btn-ghost text-xs flex items-center gap-1">
                <Download size={12} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======= DATA UPLOAD =======
export const UploadPage: React.FC = () => {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = async () => {
    setUploading(true)
    await new Promise(r => setTimeout(r, 2000))
    setUploading(false)
    setUploaded(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Data Upload</h1>
        <p className="text-sm text-dim mt-1">Ingest datasets for batch analysis via the pipeline</p>
      </div>

      <div className="card">
        <div className="border-2 border-dashed border-border rounded-xl p-16 text-center hover:border-cyan/50 transition-colors cursor-pointer">
          <Upload size={40} className="mx-auto text-dim mb-4" />
          <h3 className="font-display font-semibold text-neutral mb-2">Drop files here to upload</h3>
          <p className="text-sm text-dim mb-4">Supports CSV, JSON, JSONL, TXT, XLSX (max 100MB)</p>
          <button className="btn-ghost text-sm">Browse Files</button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs text-dim mb-1.5">Data Source Label</label>
            <input className="input" placeholder="e.g., Twitter_Jan2024_HealthTweets" />
          </div>
          <div>
            <label className="block text-xs text-dim mb-1.5">Dataset Type</label>
            <select className="input">
              <option>Social Media Posts</option>
              <option>News Articles</option>
              <option>Forum Discussions</option>
              <option>Custom / Other</option>
            </select>
          </div>
          <button onClick={handleUpload} disabled={uploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {uploading ? <><Spinner size={14} /> Uploading & queuing...</> : <><Zap size={14} /> Upload & Process</>}
          </button>
        </div>

        {uploaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <AlertBanner type="success" message="Dataset uploaded and queued for processing. Estimated completion: 4–8 minutes." />
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ======= COLLABORATION =======
export const CollaborationPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold text-signal">Team Collaboration</h1>
      <p className="text-sm text-dim mt-1">Share analyses, annotate findings, and coordinate with your research team</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-display font-semibold text-signal mb-4">Active Researchers</h3>
        {mockUsers.filter(u => u.role === 'researcher' || u.role === 'admin').map(u => (
          <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-void text-sm font-bold">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-signal">{u.name}</div>
              <div className="text-xs text-dim">{u.email}</div>
            </div>
            <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-emerald' : 'bg-ghost'}`} />
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-signal mb-4">Shared Analyses</h3>
        <div className="space-y-2">
          {['Health Misinfo Cluster Analysis', 'Q4 Political Sentiment Report', 'AI Regulation Twitter Study'].map(a => (
            <div key={a} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-cyan" />
                <span className="text-sm text-signal">{a}</span>
              </div>
              <button className="text-xs text-cyan hover:underline">Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// ======= API STATUS =======
export const ApiStatusPage: React.FC = () => {
  const statusColor: Record<string, string> = {
    operational: 'text-emerald-bright',
    degraded: 'text-amber-bright',
    down: 'text-rose-bright',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">API Status Monitor</h1>
          <p className="text-sm text-dim mt-1">Real-time health of all system services and microservices</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
          <span className="text-xs text-emerald-bright font-mono">7/8 OPERATIONAL</span>
        </div>
      </div>

      <div className="space-y-3">
        {mockApiStatus.map((s, i) => (
          <motion.div key={s.name} className="card-hover"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.status === 'operational' ? 'bg-emerald animate-pulse' : s.status === 'degraded' ? 'bg-amber' : 'bg-rose'}`} />
                <div>
                  <div className="font-medium text-signal text-sm">{s.name}</div>
                  <div className="text-xs text-dim">latency: <span className="font-mono text-neutral">{s.latency}ms</span></div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-right">
                  <div className="text-xs text-dim">Uptime</div>
                  <div className="font-mono text-neutral">{s.uptime}%</div>
                </div>
                <div className="w-24"><ProgressBar value={s.uptime} color={s.status === 'operational' ? '#34D399' : '#F59E0B'} /></div>
                <span className={`text-xs font-semibold ${statusColor[s.status]}`}>{s.status.toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ======= LOGS VIEWER =======
export const LogsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('ALL')
  const levels = ['ALL', 'INFO', 'WARN', 'ERROR']
  const levelColors: Record<string, string> = {
    INFO: '#00D4FF', WARN: '#F59E0B', ERROR: '#FB7185',
  }

  const filtered = filter === 'ALL' ? mockLogs : mockLogs.filter(l => l.level === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">Logs Viewer</h1>
          <p className="text-sm text-dim mt-1">Aggregated service logs from all microservices (Winston + ELK)</p>
        </div>
        <div className="flex gap-2">
          {levels.map(l => (
            <button key={l} onClick={() => setFilter(l)}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${filter === l ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-dim border border-transparent hover:border-ghost hover:text-bright'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="space-y-1 font-mono text-xs">
          {filtered.map((log, i) => (
            <motion.div key={log.id} className="flex items-start gap-3 p-2.5 rounded hover:bg-surface transition-colors"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <span className="text-ghost text-[10px] whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="font-bold" style={{ color: levelColors[log.level] || '#6B7A9F' }}>[{log.level}]</span>
              <span className="text-violet-bright">[{log.service}]</span>
              <span className="text-neutral flex-1">{log.message}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ======= ERROR MONITORING =======
export const ErrorMonitorPage: React.FC = () => {
  const errors = [
    { id: '1', message: 'MongoServerError: cursor maxTimeMS exceeded', service: 'mongodb', count: 12, first: '2024-01-24 09:14', last: '2024-01-24 14:22', resolved: false },
    { id: '2', message: 'KafkaJSError: Consumer group rebalancing timeout', service: 'kafka', count: 5, first: '2024-01-24 11:30', last: '2024-01-24 13:45', resolved: false },
    { id: '3', message: 'TypeError: Cannot read properties of undefined (model output)', service: 'ml-service', count: 2, first: '2024-01-23 18:00', last: '2024-01-23 18:12', resolved: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-signal">Error Monitoring</h1>
        <p className="text-sm text-dim mt-1">Production error tracking and grouping across all services</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Errors" value="2" changeType="neutral" icon={<Bug size={14} />} color="rose" />
        <StatCard label="Resolved Today" value="8" changeType="up" icon={<CheckCircle size={14} />} color="emerald" />
        <StatCard label="Error Rate" value="0.12%" changeType="neutral" icon={<Activity size={14} />} color="amber" />
      </div>

      <div className="space-y-3">
        {errors.map((err, i) => (
          <motion.div key={err.id} className="card-hover"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${err.resolved ? 'bg-emerald' : 'bg-rose animate-pulse'}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={err.resolved ? 'badge-emerald' : 'badge-rose'}>{err.resolved ? 'RESOLVED' : 'ACTIVE'}</span>
                  <span className="badge-violet text-[10px]">{err.service}</span>
                  <span className="text-xs text-dim">×{err.count}</span>
                </div>
                <code className="text-sm text-rose-bright font-mono">{err.message}</code>
                <div className="text-xs text-dim mt-1">First: {err.first} · Last: {err.last}</div>
              </div>
              {!err.resolved && <button className="btn-primary text-xs">Resolve</button>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
