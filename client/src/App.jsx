import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import SmartTemplatesPage from './pages/SmartTemplates/SmartTemplatesPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/templates' element={<SmartTemplatesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
