import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, LogOut, Moon, Sun, Command } from 'lucide-react'
import { useAuthStore, useUIStore, useNotificationStore } from '../../store'
import { clsx } from 'clsx'

export const Topbar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  const { unreadCount, notifications, markRead, markAllRead } = useNotificationStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const typeColors: Record<string, string> = {
    info: 'bg-cyan/10 border-cyan/20',
    warning: 'bg-amber/10 border-amber/20',
    error: 'bg-rose/10 border-rose/20',
    success: 'bg-emerald/10 border-emerald/20',
  }

  return (
    <header className="h-[60px] border-b border-border bg-ink/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10">
      {/* Left: breadcrumb / search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm text-dim hover:text-bright hover:border-ghost transition-all"
        >
          <Search size={14} />
          <span className="hidden md:block">Search anything...</span>
          <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] bg-panel rounded border border-border font-mono">
            <Command size={9} />K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Theme */}
        <button
          onClick={toggleTheme}
          className="p-2 text-dim hover:text-bright transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-dim hover:text-bright transition-colors relative"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-bright rounded-full text-void text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowNotifs(false)} />
                <motion.div
                  className="absolute right-0 top-10 w-80 bg-panel border border-border rounded-xl shadow-panel-lg z-30"
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="text-sm font-semibold text-signal">Notifications</span>
                    <button className="text-xs text-cyan hover:underline" onClick={markAllRead}>Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-dim text-sm">All caught up!</div>
                    ) : notifications.map((n) => (
                      <div
                        key={n.id}
                        className={clsx('p-4 border-b border-border/50 cursor-pointer hover:bg-surface/50 transition-colors',
                          !n.read && 'bg-cyan/5'
                        )}
                        onClick={() => markRead(n.id)}
                      >
                        <div className={clsx('text-xs font-semibold mb-1', typeColors[n.type], 'px-2 py-0.5 rounded-md border inline-block')}>
                          {n.type.toUpperCase()}
                        </div>
                        <div className="text-sm text-signal font-medium">{n.title}</div>
                        <div className="text-xs text-dim mt-0.5">{n.message}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border">
                    <button
                      className="w-full text-xs text-cyan hover:underline"
                      onClick={() => { navigate('/notifications'); setShowNotifs(false) }}
                    >
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-void text-xs font-bold">
            {user?.name.charAt(0) ?? 'U'}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-medium text-neutral leading-tight">{user?.name}</div>
            <div className="text-[10px] text-dim capitalize">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="p-2 text-dim hover:text-rose-bright transition-colors ml-1">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Search modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-panel border border-border rounded-xl shadow-panel-lg overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search size={16} className="text-dim" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-signal placeholder-dim outline-none"
                    placeholder="Search topics, content, users, reports..."
                  />
                  <kbd className="px-2 py-0.5 text-[10px] text-dim bg-surface border border-border rounded font-mono">ESC</kbd>
                </div>
                <div className="p-3 text-xs text-dim font-mono">
                  Try: "sentiment analysis health", "viral topics 2024", "misinfo tracker"
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
