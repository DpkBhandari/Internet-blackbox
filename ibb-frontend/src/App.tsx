import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/auth/AuthPages'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ContentAnalysisPage } from './pages/content/ContentAnalysisPage'
import { SentimentPage } from './pages/analytics/SentimentPage'
import {
  ViralTrendsPage,
  MisinfoPage,
  LiveActivityPage,
  ContentFeedPage,
  SearchPage,
  NotificationsPage,
  SettingsPage,
  ProfilePage,
  AdminPage,
  ReportPage,
  UploadPage,
  CollaborationPage,
  ApiStatusPage,
  LogsPage,
  ErrorMonitorPage,
} from './pages/AllPages'
import { useAuthStore } from './store'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#181C2A',
            border: '1px solid #1F2435',
            color: '#C8D3F0',
            fontSize: '13px',
            fontFamily: 'DM Sans, sans-serif',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected App */}
        <Route
          path="/"
          element={<ProtectedRoute><AppLayout /></ProtectedRoute>}
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="content-analysis" element={<ContentAnalysisPage />} />
          <Route path="sentiment" element={<SentimentPage />} />
          <Route path="viral-trends" element={<ViralTrendsPage />} />
          <Route path="misinformation" element={<MisinfoPage />} />
          <Route path="activity" element={<LiveActivityPage />} />
          <Route path="feed" element={<ContentFeedPage />} />
          <Route path="explore" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="api-status" element={<ApiStatusPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="errors" element={<ErrorMonitorPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
