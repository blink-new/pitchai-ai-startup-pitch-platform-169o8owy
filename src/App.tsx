import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { InvestorDashboard } from './pages/InvestorDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { EnhancedUploadPage } from './pages/EnhancedUploadPage'
import { SharedReportPage } from './pages/SharedReportPage'
import { PitchDetailPage } from './pages/PitchDetailPage'
import { InvestorAnalyticsPage } from './pages/InvestorAnalyticsPage'
import { Toaster } from './components/ui/toaster'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// Dashboard Route Component - renders different dashboards based on user role
const DashboardRoute: React.FC = () => {
  const { user } = useAuth()
  
  if (!user) return null

  switch (user.role) {
    case 'investor':
      return <InvestorDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'founder':
    default:
      return <Dashboard />
  }
}

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <EnhancedUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pitches"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">My Pitches</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Video Analysis</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/qa-simulation"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Q&A Simulation</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Reports</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Browse Pitches</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pitch-reports"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Pitch Reports</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <InvestorAnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="/pitch/:id" element={<ProtectedRoute><PitchDetailPage /></ProtectedRoute>} />
      <Route path="/shared/:shareToken" element={<SharedReportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <AppRoutes />
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App