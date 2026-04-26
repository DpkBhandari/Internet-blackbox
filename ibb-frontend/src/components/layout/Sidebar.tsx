import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Search, FileText, Activity, TrendingUp,
  AlertTriangle, Radio, Users, Settings, ChevronLeft,
  BarChart3, Upload, Bell, Shield, Terminal, Bug,
  Wifi, UserCircle, FlaskConical, ChevronRight, Database
} from 'lucide-react'
import { useAuthStore, useUIStore } from '../../store'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/activity', icon: Radio, label: 'Live Activity', badge: 'LIVE' },
      { to: '/feed', icon: FileText, label: 'Content Feed' },
    ],
  },
  {
    label: 'Analysis',
    items: [
      { to: '/content-analysis', icon: BarChart3, label: 'Content Analysis' },
      { to: '/sentiment', icon: Activity, label: 'Sentiment Viz' },
      { to: '/viral-trends', icon: TrendingUp, label: 'Viral Trends' },
      { to: '/misinformation', icon: AlertTriangle, label: 'Misinfo Tracker' },
      { to: '/explore', icon: Search, label: 'Explore & Search' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/upload', icon: Upload, label: 'Data Upload' },
      { to: '/reports', icon: FlaskConical, label: 'Report Generator' },
      { to: '/collaboration', icon: Users, label: 'Collaboration', roles: ['admin', 'researcher'] },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/api-status', icon: Wifi, label: 'API Status' },
      { to: '/logs', icon: Terminal, label: 'Logs Viewer', roles: ['admin', 'researcher'] },
      { to: '/errors', icon: Bug, label: 'Error Monitor', roles: ['admin'] },
      { to: '/admin', icon: Shield, label: 'Admin Panel', roles: ['admin'] },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', icon: UserCircle, label: 'Profile' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  badge?: string
  roles?: string[]
}

const SidebarLink: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  const { user } = useAuthStore()
  if (item.roles && user && !item.roles.includes(user.role)) return null
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
        isActive
          ? 'text-cyan bg-cyan/10 border border-cyan/20'
          : 'text-dim hover:text-bright hover:bg-surface border border-transparent',
        collapsed && 'justify-center'
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon size={16} />
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && item.badge && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose/20 text-rose-bright border border-rose/30">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()

  return (
    <motion.aside
      className="flex flex-col h-screen bg-ink border-r border-border fixed left-0 top-0 z-20 overflow-hidden"
      animate={{ width: sidebarOpen ? 240 : 60 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[60px]">
        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="full"
              className="flex items-center gap-2 overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center flex-shrink-0">
                <Database size={14} className="text-void" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-mono text-cyan font-semibold whitespace-nowrap">IBB PLATFORM</div>
                <div className="text-[10px] text-dim whitespace-nowrap">Black Box v2.0</div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                <Database size={14} className="text-void" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1 text-dim hover:text-bright transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {sidebarOpen && (
              <div className="px-3 mb-1 text-[10px] uppercase tracking-widest text-ghost font-semibold">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} collapsed={!sidebarOpen} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className={clsx(
          'p-3 border-t border-border',
          sidebarOpen ? 'flex items-center gap-3' : 'flex justify-center'
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-void text-xs font-bold flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-neutral truncate">{user.name}</div>
              <div className="text-[10px] text-dim capitalize">{user.role}</div>
            </div>
          )}
        </div>
      )}
    </motion.aside>
  )
}
