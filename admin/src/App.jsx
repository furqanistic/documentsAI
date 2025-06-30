import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// Import all pages
import AuthModal from './pages/Auth/AuthModal'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MyDocumentsPage from './pages/Documents/MyDocumentsPage'
import ProfileSettingsPage from './pages/Settings/ProfileSettingsPage'
import MyTemplatesPage from './pages/Template/MyTemplatesPage'
import ExamReport from './pages/TestManagement/ExamReport'
import TestManagementPage from './pages/TestManagement/TestManagementPage'
import TestReportPage from './pages/TestManagement/TestReportPage'

// Simple component to protect routes - only logged in users can access
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser ? children : <Navigate to='/auth' replace />
}

// Simple component for public routes - redirect logged in users to dashboard
const PublicRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser ? <Navigate to='/dashboard' replace /> : children
}

const App = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <BrowserRouter>
      <Toaster position='top-center' />

      <Routes>
        {/* Home page - redirect based on login status */}
        <Route
          path='/'
          element={
            currentUser ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <Navigate to='/auth' replace />
            )
          }
        />

        {/* Login page - only for guests */}
        <Route
          path='/auth'
          element={
            <PublicRoute>
              <AuthModal />
            </PublicRoute>
          }
        />

        {/* Dashboard - only for logged in users */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* My Templates page */}
        <Route
          path='/mytemplates'
          element={
            <ProtectedRoute>
              <MyTemplatesPage />
            </ProtectedRoute>
          }
        />

        {/* My Documents page */}
        <Route
          path='/mydocuments'
          element={
            <ProtectedRoute>
              <MyDocumentsPage />
            </ProtectedRoute>
          }
        />

        {/* Settings page */}
        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Test Management page */}
        <Route
          path='/management'
          element={
            <ProtectedRoute>
              <TestManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Test Report page */}
        <Route
          path='/management/report'
          element={
            <ProtectedRoute>
              <TestReportPage />
            </ProtectedRoute>
          }
        />

        {/* Exam Report page */}
        <Route
          path='/management/report/result'
          element={
            <ProtectedRoute>
              <ExamReport />
            </ProtectedRoute>
          }
        />

        {/* Any other page - redirect based on login status */}
        <Route
          path='*'
          element={
            currentUser ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <Navigate to='/auth' replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
