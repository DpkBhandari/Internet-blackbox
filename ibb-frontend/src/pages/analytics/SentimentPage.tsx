import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { mockSentimentData } from '../../utils/mockData'
import { StatCard } from '../../components/ui'
import { Activity, TrendingDown, Minus } from 'lucide-react'

// Heatmap cell component
const HeatCell: React.FC<{ value: number; day: number; hour: number }> = ({ value, day, hour }) => {
  const alpha = value / 100
  const bg = value > 70 ? `rgba(244,63,94,${alpha})` : value > 40 ? `rgba(245,158,11,${alpha * 0.8})` : `rgba(0,212,255,${alpha * 0.6})`
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <div
      className="w-full aspect-square rounded-sm cursor-pointer hover:ring-1 hover:ring-white/20 transition-all relative group"
      style={{ background: bg || '#12151F' }}
      title={`${days[day]} ${hour}:00 — Activity: ${value}`}
    />
  )
}

// Generate heatmap data
const heatData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day, hour, value: Math.floor(
      Math.random() * 100 *
      (hour >= 9 && hour <= 22 ? 1 : 0.2) *
      (day < 5 ? 1 : 0.6)
    )
  }))
)

const sentimentBySource = [
  { source: 'Twitter', positive: 38, negative: 42, neutral: 20 },
  { source: 'Reddit', positive: 31, negative: 35, neutral: 34 },
  { source: 'YouTube', positive: 44, negative: 28, neutral: 28 },
  { source: 'News', positive: 29, negative: 51, neutral: 20 },
  { source: 'Facebook', positive: 35, negative: 38, neutral: 27 },
]

const scatterData = Array.from({ length: 60 }, () => ({
  virality: Math.floor(Math.random() * 100),
  sentiment: (Math.random() * 2 - 1).toFixed(2),
  size: Math.floor(Math.random() * 200 + 50),
}))

export const SentimentPage: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-signal">Sentiment Visualization</h1>
          <p className="text-sm text-dim mt-1">Deep emotional polarity analysis across all tracked content</p>
        </div>
        <div className="flex gap-1 p-1 bg-surface border border-border rounded-lg">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${range === r ? 'bg-panel text-cyan border border-border' : 'text-dim hover:text-bright'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Sentiment" value="-0.23" change="Negative trend" changeType="down" icon={<TrendingDown size={14} />} color="rose" />
        <StatCard label="Positive Content" value="34.2%" change="+2.1% vs last week" changeType="up" icon={<Activity size={14} />} color="emerald" />
        <StatCard label="Negative Content" value="48.6%" change="+5.4% spike" changeType="down" icon={<TrendingDown size={14} />} color="rose" />
        <StatCard label="Neutral Content" value="17.2%" change="Stable" changeType="neutral" icon={<Minus size={14} />} color="amber" />
      </div>

      {/* Trend chart */}
      <div className="card">
        <h3 className="font-display font-semibold text-signal mb-5">Sentiment Over Time — Multi-Emotion</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={mockSentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" />
            <XAxis dataKey="date" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#181C2A', border: '1px solid #1F2435', borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#6B7A9F' }} />
            <ReferenceLine y={50} stroke="#3D4560" strokeDasharray="4 4" label={{ value: 'Baseline', fill: '#3D4560', fontSize: 10 }} />
            <Line type="monotone" dataKey="positive" stroke="#34D399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" stroke="#FB7185" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="neutral" stroke="#FCD34D" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-signal">Activity Heatmap</h3>
            <p className="text-xs text-dim mt-0.5">Sentiment intensity by day × hour (last 7 days)</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-dim">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-cyan/40" /> Low
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber/60" /> Mid
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-rose/80" /> High
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex gap-1 mb-1 ml-10">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[9px] text-ghost font-mono">
                  {i % 3 === 0 ? `${i}h` : ''}
                </div>
              ))}
            </div>
            {/* Day rows */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <div className="w-8 text-right text-[10px] text-dim font-mono pr-1">{day}</div>
                {heatData[di].map((cell, hi) => (
                  <HeatCell key={hi} value={cell.value} day={di} hour={hi} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source comparison & scatter */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-display font-semibold text-signal mb-5">Sentiment by Platform</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sentimentBySource}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" />
              <XAxis dataKey="source" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#181C2A', border: '1px solid #1F2435', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#34D399" fill="#34D399" fillOpacity={0.4} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#FCD34D" fill="#FCD34D" fillOpacity={0.4} />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#FB7185" fill="#FB7185" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-display font-semibold text-signal mb-2">Sentiment vs Virality</h3>
          <p className="text-xs text-dim mb-4">Each point = one analyzed content piece</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2435" />
              <XAxis dataKey="virality" name="Virality" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} label={{ value: 'Virality Score', fill: '#3D4560', fontSize: 10, position: 'insideBottom', offset: -2 }} />
              <YAxis dataKey="sentiment" name="Sentiment" tick={{ fill: '#6B7A9F', fontSize: 10 }} axisLine={false} />
              <ReferenceLine y={0} stroke="#3D4560" strokeDasharray="4 4" />
              <Tooltip contentStyle={{ background: '#181C2A', border: '1px solid #1F2435', borderRadius: 8, fontSize: 12 }} />
              <Scatter data={scatterData} fill="#7C3AED" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
