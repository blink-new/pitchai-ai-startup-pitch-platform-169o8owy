import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { EnhancedUploadPage } from './pages/EnhancedUploadPage'
import { TestUploadPage } from './pages/TestUploadPage'
import { PitchesPage } from './pages/PitchesPage'
import { VideoAnalysisPage } from './pages/VideoAnalysisPage'
import { QASimulationPage } from './pages/QASimulationPage'
import { ReportsPage } from './pages/ReportsPage'
import { SharedReportPage } from './pages/SharedReportPage'
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
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <TestUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-enhanced"
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
            <PitchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <VideoAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qa-simulation"
        element={
          <ProtectedRoute>
            <QASimulationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
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