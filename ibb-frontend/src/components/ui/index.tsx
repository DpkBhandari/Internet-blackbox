import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, CheckCircle, Info, AlertTriangle, X, TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'

// Skeleton loader
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('skeleton', className)} />
)

export const SkeletonCard: React.FC = () => (
  <div className="card space-y-3">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
  </div>
)

// Stat card
interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: 'cyan' | 'violet' | 'amber' | 'rose' | 'emerald'
  loading?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  label, value, change, changeType = 'neutral', icon, color = 'cyan', loading = false,
}) => {
  if (loading) return <SkeletonCard />

  const colorMap = {
    cyan: 'text-cyan bg-cyan/10 border-cyan/20',
    violet: 'text-violet-bright bg-violet/10 border-violet/20',
    amber: 'text-amber-bright bg-amber/10 border-amber/20',
    rose: 'text-rose-bright bg-rose/10 border-rose/20',
    emerald: 'text-emerald-bright bg-emerald/10 border-emerald/20',
  }

  return (
    <motion.div
      className="stat-card hover:border-ghost transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-dim font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={clsx('p-2 rounded-lg border', colorMap[color])}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-1">
        <div className="text-2xl font-display font-bold text-signal">{value}</div>
        {change && (
          <div className={clsx('flex items-center gap-1 mt-1 text-xs font-medium',
            changeType === 'up' ? 'text-emerald-bright' : changeType === 'down' ? 'text-rose-bright' : 'text-dim'
          )}>
            {changeType === 'up' ? <TrendingUp size={12} /> : changeType === 'down' ? <TrendingDown size={12} /> : null}
            {change}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Toast alerts
interface AlertBannerProps {
  type: 'info' | 'warning' | 'error' | 'success'
  message: string
  onClose?: () => void
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ type, message, onClose }) => {
  const config = {
    info: { icon: Info, cls: 'bg-cyan/10 border-cyan/30 text-cyan' },
    warning: { icon: AlertTriangle, cls: 'bg-amber/10 border-amber/30 text-amber-bright' },
    error: { icon: AlertCircle, cls: 'bg-rose/10 border-rose/30 text-rose-bright' },
    success: { icon: CheckCircle, cls: 'bg-emerald/10 border-emerald/30 text-emerald-bright' },
  }
  const { icon: Icon, cls } = config[type]
  return (
    <motion.div
      className={clsx('flex items-center gap-3 p-3 rounded-lg border text-sm', cls)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose}><X size={14} /></button>}
    </motion.div>
  )
}

// Loading spinner
export const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <Loader2 size={size} className={clsx('animate-spin text-cyan', className)} />
)

// Live indicator
export const LiveIndicator: React.FC<{ label?: string }> = ({ label = 'LIVE' }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full bg-rose-bright animate-pulse" />
    <span className="text-xs font-mono text-rose-bright">{label}</span>
  </div>
)

// Sentiment meter
export const SentimentMeter: React.FC<{ value: number; size?: 'sm' | 'md' }> = ({ value, size = 'md' }) => {
  const pct = ((value + 1) / 2) * 100
  const color = value > 0.2 ? '#34D399' : value < -0.2 ? '#FB7185' : '#FCD34D'
  const label = value > 0.2 ? 'Positive' : value < -0.2 ? 'Negative' : 'Neutral'

  return (
    <div className={clsx('space-y-1', size === 'sm' ? 'text-xs' : 'text-sm')}>
      <div className="flex justify-between text-dim">
        <span>–1.0</span>
        <span className="font-mono" style={{ color }}>{value.toFixed(2)} · {label}</span>
        <span>+1.0</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, width: `${pct}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Virality badge
export const ViralityBadge: React.FC<{ score: number }> = ({ score }) => {
  const level = score >= 90 ? 'VIRAL' : score >= 70 ? 'TRENDING' : score >= 50 ? 'RISING' : 'STABLE'
  const cls = score >= 90 ? 'badge-rose' : score >= 70 ? 'badge-amber' : score >= 50 ? 'badge-violet' : 'badge-cyan'
  return <span className={clsx('badge', cls)}>{level} {score}</span>
}

// Modal
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const sizeMap = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={clsx('fixed inset-0 z-50 flex items-center justify-center p-4')}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className={clsx('card w-full', sizeMap[size])}>
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
                <h3 className="font-display font-semibold text-signal">{title}</h3>
                <button onClick={onClose} className="p-1 text-dim hover:text-bright transition-colors">
                  <X size={18} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Table wrapper
export const DataTable: React.FC<{ headers: string[]; children: React.ReactNode; loading?: boolean }> = ({
  headers, children, loading,
}) => (
  <div className="overflow-x-auto">
    <table className="data-table">
      <thead>
        <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {headers.map((h) => <td key={h}><Skeleton className="h-3 w-full" /></td>)}
            </tr>
          ))
          : children
        }
      </tbody>
    </table>
  </div>
)

// Empty state
export const EmptyState: React.FC<{ title: string; description?: string; icon?: React.ReactNode }> = ({
  title, description, icon,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-dim mb-4">{icon}</div>}
    <h3 className="font-display font-semibold text-neutral mb-1">{title}</h3>
    {description && <p className="text-sm text-dim max-w-xs">{description}</p>}
  </div>
)

// Tag
export const Tag: React.FC<{ label: string; onRemove?: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface border border-border rounded text-xs text-neutral">
    {label}
    {onRemove && <button onClick={onRemove}><X size={10} /></button>}
  </span>
)

// Progress bar
export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; label?: string }> = ({
  value, max = 100, color = '#00D4FF', label,
}) => (
  <div className="space-y-1">
    {label && <div className="flex justify-between text-xs text-dim"><span>{label}</span><span>{value}%</span></div>}
    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
)
