import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateDocumentsPage from './pages/CreateDocuments/CreateDocumentsPage'
import ExamplesPage from './pages/Examples/ExamplesPage'
import HomePage from './pages/Home/HomePage'
import PricingPage from './pages/Pricing/PricingPage'
import SmartTemplatesPage from './pages/SmartTemplates/SmartTemplatesPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/templates' element={<SmartTemplatesPage />} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/examples' element={<ExamplesPage />} />
        <Route path='/create' element={<CreateDocumentsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
