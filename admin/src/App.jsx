import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthModal from './pages/Auth/AuthModal'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MyDocumentsPage from './pages/Documents/MyDocumentsPage'
import ProfileSettingsPage from './pages/Settings/ProfileSettingsPage'
import MyTemplatesPage from './pages/Template/MyTemplatesPage'
import ExamReport from './pages/TestManagement/ExamReport'
import TestManagementPage from './pages/TestManagement/TestManagementPage'
import TestReportPage from './pages/TestManagement/TestReportPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser ? children : <Navigate to='/auth' replace />
}

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser ? <Navigate to='/dashboard' replace /> : children
}

const App = () => {
  const { currentUser } = useSelector((state) => state.user)
  console.log(currentUser)

  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        {/* Root route - redirect based on auth status */}
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

        {/* Public routes - redirect to dashboard if logged in */}
        <Route
          path='/auth'
          element={
            <PublicRoute>
              <AuthModal />
            </PublicRoute>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mytemplates'
          element={
            <ProtectedRoute>
              <MyTemplatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mydocuments'
          element={
            <ProtectedRoute>
              <MyDocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/management'
          element={
            <ProtectedRoute>
              <TestManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/management/report'
          element={
            <ProtectedRoute>
              <TestReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/management/report/result'
          element={
            <ProtectedRoute>
              <ExamReport />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to auth or dashboard */}
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
