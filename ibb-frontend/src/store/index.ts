import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'researcher' | 'user'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'ibb-auth' }
  )
)

// UI store
interface UIState {
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  toggleTheme: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',
      activeTab: 'dashboard',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    { name: 'ibb-ui' }
  )
)

// Notification store
interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  timestamp: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [
    { id: '1', type: 'warning', title: 'Viral Spike Detected', message: 'Topic #AI-Politics reached 94k shares in 2h', read: false, timestamp: new Date().toISOString() },
    { id: '2', type: 'error', title: 'Misinformation Alert', message: 'High-confidence fake news cluster flagged in Health category', read: false, timestamp: new Date().toISOString() },
    { id: '3', type: 'info', title: 'New Dataset Ingested', message: 'Twitter dataset (2.4M posts) processed successfully', read: true, timestamp: new Date().toISOString() },
  ],
  unreadCount: 2,
  addNotification: (n) =>
    set((s) => ({
      notifications: [{ ...n, id: Date.now().toString(), read: false, timestamp: new Date().toISOString() }, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
