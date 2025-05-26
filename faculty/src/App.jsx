import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MyDocumentsPage from './pages/Documents/MyDocumentsPage'
import ProfileSettingsPage from './pages/Settings/ProfileSettingsPage'
import MyTemplatesPage from './pages/Template/MyTemplatesPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/mytemplates' element={<MyTemplatesPage />} />
        <Route path='/mydocuments' element={<MyDocumentsPage />} />
        <Route path='/settings' element={<ProfileSettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
