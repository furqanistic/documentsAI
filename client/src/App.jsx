import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateDocumentsPage from './pages/CreateDocuments/CreateDocumentsPage'
import ExamplesPage from './pages/Examples/ExamplesPage'
import HomePage from './pages/Home/HomePage'
import InteractiveTestsPage from './pages/InteractiveTests/InteractiveTestsPage'
import PrivacyPolicy from './pages/Others/PrivacyPolicy'
import TermsPage from './pages/Others/TermsPage'
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
        <Route path='/tests' element={<InteractiveTestsPage />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
