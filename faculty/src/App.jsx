import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/Dashboard/DashboardPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
