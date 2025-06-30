import AiPromptSuggestions from '@/components/CreateDocuments/AiPromptSuggestions'
import CreateDocumentsHeader from '@/components/CreateDocuments/CreateDocumentsHeader'
import DocumentBranding from '@/components/CreateDocuments/DocumentBranding'
import DocumentPreview from '@/components/CreateDocuments/DocumentPreview'
import SidebarCreateDocument from '@/components/CreateDocuments/SidebarCreateDocument'
import InteractiveTestOptions from '@/components/InteractiveTests/InteractiveTestOptions'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  Download,
  FilePlus,
  FileQuestion,
  FileText,
  FileType,
  Globe,
  HelpCircle,
  LayoutGrid,
  RefreshCw,
  Share,
  Sparkles,
  Upload,
  Users,
  Wand2,
  Zap,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../../../config' // Import your existing axios instance
import Layout from '../Layout/Layout'
// Redux imports
import {
  loginSuccess,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/userSlice'
import { toast } from 'react-hot-toast' // For notifications
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from '../Auth/AuthModal'

const CreateDocumentsPage = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [selectedDocType, setSelectedDocType] = useState(0)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('pdf')
  const [generationComplete, setGenerationComplete] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [documentContent, setDocumentContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showInteractiveOptions, setShowInteractiveOptions] = useState(false)
  const [convertToInteractive, setConvertToInteractive] = useState(false)
  const [interactiveSettings, setInteractiveSettings] = useState({
    timeLimit: null,
    showResults: true,
    allowRetry: true,
    isPublic: false,
    generateLink: false,
  })
  const [interactiveLink, setInteractiveLink] = useState('')
  const [currentDocumentId, setCurrentDocumentId] = useState(null)
  const [userDocuments, setUserDocuments] = useState([])

  // Document branding/metadata state
  const [documentMetadata, setDocumentMetadata] = useState({
    logo: null,
    orgName: '',
    date: '',
    time: '',
    additionalInfo: '',
  })
  const [brandingEnabled, setBrandingEnabled] = useState(false)
  const fileInputRef = useRef(null)

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Simulate realistic progress for AI generation
  const simulateProgress = () => {
    setProgress(0)
    setProgressMessage('Initializing AI request...')

    const progressSteps = [
      { progress: 15, message: 'Initialization...', delay: 500 },
      { progress: 30, message: 'Processing your prompt...', delay: 800 },
      { progress: 50, message: 'AI is generating content...', delay: 1200 },
      {
        progress: 70,
        message: 'Optimizing document structure...',
        delay: 1000,
      },
      { progress: 85, message: 'Finalizing formatting...', delay: 800 },
      { progress: 95, message: 'Almost ready...', delay: 500 },
    ]

    let currentStep = 0

    const updateProgress = () => {
      if (currentStep < progressSteps.length) {
        const step = progressSteps[currentStep]
        setTimeout(() => {
          setProgress(step.progress)
          setProgressMessage(step.message)
          currentStep++
          updateProgress()
        }, step.delay)
      }
    }

    updateProgress()
  }

  // Reset progress
  const resetProgress = () => {
    setProgress(0)
    setProgressMessage('')
  }
  useEffect(() => {
    if (isAuthenticated) {
      loadUserDocuments()
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Reset convert to interactive option when document type changes
    if (selectedDocType !== 1) {
      setConvertToInteractive(false)
      setShowInteractiveOptions(false)
    }

    // Show interactive options only if user chose to convert
    if (convertToInteractive && generationComplete) {
      setShowInteractiveOptions(true)
    } else {
      setShowInteractiveOptions(false)
      setInteractiveSettings({
        ...interactiveSettings,
        generateLink: false,
      })
    }
  }, [selectedDocType, generationComplete, convertToInteractive])

  // AI prompt suggestions based on selected document type
  const promptSuggestions = {
    0: [
      'Create a formal business proposal for a software development project including scope, timeline, budget, and team structure',
      'Generate a legal contract template for consulting services with payment terms and deliverables',
      'Draft a professional memo to stakeholders about new company policies and procedures',
    ],
    1: [
      'Create a final exam for Introduction to Psychology course with 25 multiple choice questions and 3 essay questions covering cognitive psychology and research methods',
      'Generate a technical assessment for senior JavaScript developer position with coding challenges and system design questions',
      'Make a comprehensive quiz about world history focusing on 20th century events with varied question types',
    ],
    2: [
      'Create structured interview questions for a marketing manager position including behavioral, situational, and skills-based assessments',
      'Generate a comprehensive interview guide for senior software engineer role with technical and cultural fit questions',
      'Design a behavioral interview framework for customer service roles with scenario-based questions',
    ],
    3: [
      'Create a quarterly business performance report for a tech startup showing KPIs, growth metrics, and strategic recommendations',
      'Generate a detailed market research report on renewable energy trends in Europe with data analysis and forecasts',
      'Develop a financial analysis report for Q4 2024 including revenue breakdown, cost analysis, and growth projections',
    ],
  }

  // Document types with enhanced descriptions
  const documentTypes = [
    {
      icon: <FileText className='h-5 w-5' />,
      name: 'Professional Documents',
      description: 'Formal business and official documents',
      type: 'professional',
    },
    {
      icon: <FileQuestion className='h-5 w-5' />,
      name: 'Exams & Quizzes',
      description: 'Create assessments',
      type: 'exam',
    },
    {
      icon: <Users className='h-5 w-5' />,
      name: 'Interviews',
      description: 'Any type of Interview questions',
      type: 'interview',
    },
    {
      icon: <FilePlus className='h-5 w-5' />,
      name: 'Reports',
      description: 'Comprehensive data analysis reports',
      type: 'report',
    },
  ]

  // File export formats
  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      icon: <FileText />,
      description: 'Best for sharing and printing',
    },
    {
      id: 'docx',
      name: 'Word Document',
      icon: <FileText />,
      description: 'Editable document for Microsoft Word',
    },
    {
      id: 'html',
      name: 'Web Page',
      icon: <Globe />,
      description: 'Online interactive version',
    },
    {
      id: 'text',
      name: 'Plain Text',
      icon: <FileType />,
      description: 'Simple text format',
    },
  ]

  // Load user documents
  const loadUserDocuments = async (page = 1, limit = 5) => {
    try {
      const response = await axiosInstance.get('/documents/my-documents', {
        params: { page, limit },
      })

      if (response.data.success) {
        setUserDocuments(response.data.documents)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
      // Don't show error toast for this, as it's background loading
    }
  }

  // Handle authentication success
  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData))
    localStorage.setItem('token', userData.token)
    loadUserDocuments() // Load documents after successful login
  }

  // Real AI document generation
  const handleGenerate = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (!promptText.trim() && !selectedFile) {
      toast.error('Please enter a prompt or upload a file for your document')
      return
    }

    setIsLoading(true)
    setShowExportOptions(false)
    setGenerationComplete(false)
    setInteractiveLink('')
    setCurrentDocumentId(null)

    // Start progress simulation
    simulateProgress()

    try {
      // Prepare the request data
      let finalPrompt = promptText.trim()

      // If file is uploaded, add file context to prompt
      if (selectedFile) {
        if (finalPrompt) {
          finalPrompt += `\n\nAdditional context: Based on the uploaded file "${selectedFile.name}"`
        } else {
          finalPrompt = `Process and analyze the uploaded file "${
            selectedFile.name
          }" to create a ${documentTypes[
            selectedDocType
          ].description.toLowerCase()}.`
        }
      }

      const requestData = {
        prompt: finalPrompt,
        documentType: documentTypes[selectedDocType].type,
        metadata: brandingEnabled ? documentMetadata : {},
        isInteractive: convertToInteractive,
        interactiveSettings: convertToInteractive ? interactiveSettings : {},
      }

      console.log('Sending generation request:', requestData)

      // Call the AI generation API
      const response = await axiosInstance.post(
        '/documents/generate',
        requestData
      )

      if (response.data.success) {
        // Complete the progress
        setProgress(100)
        setProgressMessage('Document generated successfully!')

        // Small delay to show completion
        setTimeout(() => {
          setDocumentContent(response.data.document.content)
          setCurrentDocumentId(response.data.document.id)
          setGenerationComplete(true)
          setShowExportOptions(true)

          // Reload documents list to show the new document
          loadUserDocuments()

          toast.success('Document generated successfully with Documnt AI!')

          // Reset progress after a brief moment
          setTimeout(resetProgress, 1000)
        }, 500)
      } else {
        throw new Error(response.data.message || 'Failed to generate document')
      }
    } catch (error) {
      console.error('Error generating document:', error)

      // Reset progress on error
      resetProgress()

      // Handle specific error types based on status codes
      const errorMessage = error.response?.data?.message || error.message

      if (error.response?.status === 429) {
        toast.error(
          'Rate limit exceeded. Please wait a few minutes before trying again.'
        )
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.')
        setShowAuthModal(true)
      } else if (error.response?.status === 400) {
        toast.error(
          errorMessage ||
            'Invalid request. Please check your input and try again.'
        )
      } else if (error.response?.status === 503) {
        toast.error(
          'AI service temporarily unavailable. Please try again later.'
        )
      } else if (errorMessage.includes('API key')) {
        toast.error('AI service configuration error. Please contact support.')
      } else {
        toast.error(
          errorMessage || 'Failed to generate document. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // File upload handler with better file processing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }

      // Check file type
      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (
        !allowedTypes.includes(file.type) &&
        !file.name.match(/\.(txt|pdf|doc|docx|rtf)$/i)
      ) {
        toast.error(
          'Please upload a valid document file (PDF, DOC, DOCX, TXT, RTF)'
        )
        return
      }

      setSelectedFile(file)

      // For text files, try to read content for preview
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        try {
          const reader = new FileReader()
          reader.onload = (e) => {
            const fileContent = e.target.result
            const preview = fileContent.substring(0, 300)
            const filePrompt = `Analyze and improve this document content:\n\n"${preview}${
              fileContent.length > 300 ? '...' : ''
            }"\n\nCreate a professional ${documentTypes[
              selectedDocType
            ].description.toLowerCase()} based on this content.`
            setPromptText(filePrompt)
            toast.success('File uploaded and analyzed successfully!')
          }
          reader.onerror = () => {
            toast.error('Error reading file content')
          }
          reader.readAsText(file)
        } catch (error) {
          toast.error('Error processing file')
        }
      } else {
        // For other file types, just set a generic prompt
        const filePrompt = `Process the uploaded ${
          file.type.split('/')[1]
        } file "${file.name}" and create a ${documentTypes[
          selectedDocType
        ].description.toLowerCase()} based on its content.`
        setPromptText(filePrompt)
        toast.success('File uploaded successfully!')
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fakeEvent = { target: { files: [e.dataTransfer.files[0]] } }
      handleFileUpload(fakeEvent)
    }
  }

  // Handle export action (this would still be simulated for now)
  const handleExport = (format) => {
    if (!documentContent) {
      toast.error('No document content to export')
      return
    }

    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)

      try {
        // Create a download
        const element = document.createElement('a')
        const file = new Blob([documentContent], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `document-${Date.now()}.${format}`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)

        toast.success(`Document exported as ${format.toUpperCase()}`)
      } catch (error) {
        toast.error('Error exporting document')
      }
    }, 1000)
  }

  // Generate interactive test link (Real API call)
  const handleGenerateInteractiveLink = async () => {
    if (!currentDocumentId) {
      toast.error('No document available to create interactive link')
      return
    }

    if (!interactiveSettings.generateLink) {
      setInteractiveSettings({ ...interactiveSettings, generateLink: true })
      setIsLoading(true)

      try {
        const response = await axiosInstance.post(
          `/documents/${currentDocumentId}/interactive-link`
        )

        if (response.data.success) {
          setInteractiveLink(response.data.shareLink)
          toast.success('Interactive link generated successfully!')
        } else {
          throw new Error(response.data.message || 'Failed to generate link')
        }
      } catch (error) {
        console.error('Error generating interactive link:', error)
        const errorMessage = error.response?.data?.message || error.message
        toast.error(errorMessage || 'Failed to generate interactive link')
        setInteractiveSettings({ ...interactiveSettings, generateLink: false })
      } finally {
        setIsLoading(false)
      }
    } else {
      setInteractiveSettings({ ...interactiveSettings, generateLink: false })
      setInteractiveLink('')
    }
  }

  // Apply AI suggestion to prompt
  const applyPromptSuggestion = (suggestion) => {
    setPromptText(suggestion)
  }

  // Save document updates
  const handleDocumentUpdate = async (newContent) => {
    if (!currentDocumentId) {
      // If no document ID, just update local state
      setDocumentContent(newContent)
      return
    }

    try {
      const response = await axiosInstance.put(
        `/documents/${currentDocumentId}`,
        {
          content: newContent,
          metadata: brandingEnabled ? documentMetadata : {},
        }
      )

      if (response.data.success) {
        setDocumentContent(newContent)
        toast.success('Document updated successfully!')
        // Reload documents list
        loadUserDocuments()
      }
    } catch (error) {
      console.error('Error updating document:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to update document')
    }
  }

  // Load a specific document
  const loadDocument = async (documentId) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/documents/${documentId}`)

      if (response.data.success) {
        const doc = response.data.document
        setDocumentContent(doc.content)
        setCurrentDocumentId(doc._id)
        setPromptText(doc.prompt)
        setDocumentMetadata(doc.metadata || {})
        setBrandingEnabled(!!doc.metadata?.orgName)
        setGenerationComplete(true)
        setShowExportOptions(true)

        // Set document type
        const typeIndex = documentTypes.findIndex(
          (type) => type.type === doc.documentType
        )
        if (typeIndex !== -1) {
          setSelectedDocType(typeIndex)
        }

        // Set interactive settings
        if (doc.isInteractive) {
          setConvertToInteractive(true)
          setInteractiveSettings(doc.interactiveSettings || interactiveSettings)
          if (doc.shareLink) {
            setInteractiveLink(
              `${
                import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'
              }/interactive-test/${doc.shareLink}`
            )
          }
        }

        toast.success('Document loaded successfully!')
      }
    } catch (error) {
      console.error('Error loading document:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to load document')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a document
  const deleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const response = await axiosInstance.delete(`/documents/${documentId}`)

      if (response.data.success) {
        toast.success('Document deleted successfully!')
        loadUserDocuments() // Reload the list

        // If the current document was deleted, clear the form
        if (documentId === currentDocumentId) {
          setDocumentContent('')
          setCurrentDocumentId(null)
          setGenerationComplete(false)
          setShowExportOptions(false)
        }
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to delete document')
    }
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 text-gray-900'>
        {/* Header component */}
        <CreateDocumentsHeader />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLoginSuccess}
        />

        {/* REDUCED AND CONSISTENT TOP PADDING */}
        <main className='container mx-auto px-4 py-4 md:py-6 max-w-7xl'>
          {/* Main Content Area with enhanced grid layout */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8'>
            {/* Left Column - Input with enhanced styling */}
            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              className='lg:col-span-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'
            >
              {/* Content area - original horizontal padding */}
              <div className='p-4 pt-5.5 md:p-8 md:pt-6'>
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={staggerContainer}
                >
                  {/* Recent Documents Section */}
                  {isAuthenticated && userDocuments.length > 0 && (
                    <motion.div variants={itemVariant} className='mb-6'>
                      <h3 className='text-lg font-bold text-black mb-3'>
                        Recent Documents
                      </h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        {userDocuments.slice(0, 4).map((doc) => (
                          <div
                            key={doc._id}
                            className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer'
                            onClick={() => loadDocument(doc._id)}
                          >
                            <div className='flex items-center space-x-3'>
                              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                {documentTypes.find(
                                  (type) => type.type === doc.documentType
                                )?.icon || <FileText className='h-4 w-4' />}
                              </div>
                              <div>
                                <p className='text-sm font-medium text-gray-900 truncate max-w-32'>
                                  {doc.title}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteDocument(doc._id)
                              }}
                              className='text-gray-400 hover:text-red-500 p-1'
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Document Type*/}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <h3 className='text-lg font-bold text-black mb-3'>
                      Document Type
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                      {documentTypes.map((type, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className='cursor-pointer rounded-lg p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 relative border border-transparent hover:bg-gray-50'
                          style={{
                            boxShadow:
                              selectedDocType === index
                                ? '0 0 0 2px rgb(31 41 55)'
                                : '0 0 0 1px rgb(229 231 235)',
                          }}
                          onClick={() => setSelectedDocType(index)}
                        >
                          <div
                            className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md flex-shrink-0 ${
                              selectedDocType === index
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {type.icon}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                              <span className='font-medium text-gray-800 text-sm md:text-base truncate'>
                                {type.name}
                              </span>

                              {selectedDocType === index && (
                                <div className='flex-shrink-0 ml-1'>
                                  <div className='h-5 w-5 sm:h-5 sm:w-5 bg-gray-900 rounded-full flex items-center justify-center'>
                                    <Check className='h-3 w-3 sm:h-3 sm:w-3 text-white' />
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className='text-xs sm:text-sm text-gray-500 block truncate'>
                              {type.description}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Introduction Help Text */}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <div className='p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center'>
                      <HelpCircle className='h-5 w-5 text-blue-500 mr-2 md:mr-3 flex-shrink-0' />
                      <p className='text-xs md:text-sm text-gray-700'>
                        You can create documents in two ways: upload a file or
                        describe what you need in the text prompt below.
                        Documents are generated using Documnt AI.
                      </p>
                    </div>
                  </motion.div>

                  {/* FILE UPLOAD SECTION - CONSISTENT SPACING */}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-lg font-bold text-black'>
                        Upload a File (Optional)
                      </label>
                    </div>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors'
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className='hidden'
                        accept='.pdf,.docx,.doc,.txt,.rtf'
                      />
                      <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                        <div className='bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center text-gray-700'>
                          <Upload className='h-5 w-5' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-sm md:text-base font-medium mb-1'>
                            {selectedFile
                              ? selectedFile.name
                              : 'Drag & drop or click to browse'}
                          </h3>
                          <p className='text-xs sm:text-sm text-gray-500'>
                            {selectedFile
                              ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                              : 'Supports PDF, DOC, DOCX, TXT files (Max 10MB)'}
                          </p>
                        </div>
                        {selectedFile && (
                          <button
                            className='text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1'
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(null)
                              setPromptText('')
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariant} className='mb-5'>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-lg font-bold text-black'>
                        Describe What You Need
                      </label>
                      <div className='flex items-center space-x-1'>
                        <button
                          className='p-1 rounded-md hover:bg-gray-100 text-gray-500'
                          title='Help'
                        >
                          <HelpCircle className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                    <div className='relative h-35 md:h-40'>
                      <textarea
                        className='w-full h-full p-3 md:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none text-xs md:text-sm shadow-sm placeholder:text-xs md:placeholder:text-sm'
                        placeholder='E.g., Create a comprehensive business proposal for developing a mobile app for a restaurant chain. Include executive summary, market analysis, technical requirements, project timeline, budget breakdown, team structure, and risk assessment.'
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                      ></textarea>
                      <div className='absolute bottom-3 right-3 flex space-x-2'>
                        <button
                          className='p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                          title='Copy to clipboard'
                          onClick={() => {
                            navigator.clipboard.writeText(promptText)
                            toast.success('Copied to clipboard!')
                          }}
                        >
                          <Copy className='h-4 w-4 text-gray-600' />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Prompt Suggestions Component */}
                  <div className='mb-3'>
                    <AiPromptSuggestions
                      suggestions={promptSuggestions[selectedDocType] || []}
                      onSuggestionClick={applyPromptSuggestion}
                    />
                  </div>

                  {/* Generate Document Button */}
                  <motion.div
                    variants={itemVariant}
                    className='mt-6 flex justify-end'
                  >
                    <div className='flex items-center space-x-3 md:space-x-4 w-full'>
                      <button
                        className='text-gray-700 py-2 px-3 md:px-4 rounded-md text-sm font-medium flex items-center hover:bg-gray-100 transition-all border border-gray-300'
                        onClick={() => {
                          setPromptText('')
                          setDocumentContent('')
                          setSelectedFile(null)
                          setGenerationComplete(false)
                          setShowExportOptions(false)
                          setCurrentDocumentId(null)
                          setInteractiveLink('')
                          setConvertToInteractive(false)
                          setBrandingEnabled(false)
                          setDocumentMetadata({
                            logo: null,
                            orgName: '',
                            date: '',
                            time: '',
                            additionalInfo: '',
                          })
                          resetProgress()
                          toast.success('Form cleared!')
                        }}
                      >
                        <div className='flex items-center space-x-1 md:space-x-2'>
                          <RefreshCw className='h-4 w-4' />
                          <span>Clear All</span>
                        </div>
                      </button>

                      <button
                        className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-2 px-4 md:px-6 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-gray-800 transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={handleGenerate}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className='flex items-center space-x-2 md:space-x-3'>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className='h-4 w-4 border-2 border-white border-t-transparent rounded-full'
                            />
                            <span>Generating...</span>
                          </div>
                        ) : (
                          <div className='flex items-center space-x-1 md:space-x-2'>
                            <Sparkles className='h-4 w-4' />
                            <span>
                              {generationComplete ? 'Regenerate' : 'Generate'}
                            </span>
                          </div>
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* AI Generation Progress Bar */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className='mt-4'
                    >
                      <div className='bg-white border border-blue-200 rounded-lg p-4 shadow-sm'>
                        <div className='flex items-center space-x-3 mb-3'>
                          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              <Sparkles className='h-5 w-5 text-blue-600' />
                            </motion.div>
                          </div>
                          <div className='flex-1'>
                            <h4 className='text-sm font-medium text-gray-900'>
                              Documnt AI is generating your document
                            </h4>
                            <p className='text-xs text-gray-600 mt-1'>
                              {progressMessage ||
                                'Please wait while we create your document...'}
                            </p>
                          </div>
                          <div className='text-right'>
                            <span className='text-sm font-medium text-blue-600'>
                              {progress}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                          <motion.div
                            className='h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full'
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={{
                              duration: 0.5,
                              ease: 'easeOut',
                            }}
                          />
                        </div>

                        {/* Progress Details */}
                        <div className='flex justify-between items-center mt-2 text-xs text-gray-500'>
                          <span>Processing with AI...</span>
                          <span className='flex items-center space-x-1'>
                            <div className='w-1 h-1 bg-blue-500 rounded-full animate-pulse'></div>
                            <div
                              className='w-1 h-1 bg-blue-500 rounded-full animate-pulse'
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className='w-1 h-1 bg-blue-500 rounded-full animate-pulse'
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Document Branding Options - Add after generation button but before preview */}
                  {generationComplete && (
                    <DocumentBranding
                      metadata={documentMetadata}
                      onMetadataChange={setDocumentMetadata}
                      enabled={brandingEnabled}
                      onToggleEnabled={(value) => {
                        setBrandingEnabled(value)
                        // Update document with new branding when toggled
                        if (currentDocumentId && documentContent) {
                          handleDocumentUpdate(documentContent)
                        }
                      }}
                    />
                  )}

                  {/* Document Preview Section */}
                  {generationComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className='mt-6'
                    >
                      <DocumentPreview
                        content={documentContent}
                        onContentChange={handleDocumentUpdate}
                      />

                      {/* Interactive Test Conversion Option - Only for Exam/Quiz types */}
                      {selectedDocType === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className='mt-5 p-3 md:p-5 border border-blue-300 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-md text-white'
                        >
                          {/* Mobile layout - fixed text wrapping */}
                          <div className='md:hidden'>
                            <div className='text-center mb-3'>
                              <div className='w-10 h-10 mx-auto rounded-full bg-white flex items-center justify-center shadow-md mb-2'>
                                <Zap className='h-5 w-5 text-blue-600' />
                              </div>

                              <h3 className='text-base font-medium text-white mb-1 leading-tight px-2'>
                                Make this an interactive online test
                              </h3>

                              <p className='text-xs text-white/90 max-w-xs mx-auto px-2'>
                                Time limits • Auto-grading • Share links
                              </p>
                            </div>

                            <div className='mt-3'>
                              <div className='bg-white/10 p-0.5 rounded-lg flex shadow-md backdrop-blur-sm'>
                                <button
                                  onClick={() => setConvertToInteractive(false)}
                                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    !convertToInteractive
                                      ? 'bg-white text-blue-800 shadow-md'
                                      : 'text-white'
                                  }`}
                                >
                                  No
                                </button>
                                <button
                                  onClick={() => setConvertToInteractive(true)}
                                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    convertToInteractive
                                      ? 'bg-white text-blue-800 shadow-md'
                                      : 'text-white'
                                  }`}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop layout - unchanged */}
                          <div className='hidden md:flex flex-row items-center justify-between'>
                            <div className='flex items-center'>
                              <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 flex-shrink-0 shadow-md'>
                                <Zap className='h-6 w-6 text-blue-600' />
                              </div>
                              <div>
                                <h3 className='text-lg font-medium text-white'>
                                  Make this an interactive online test
                                </h3>
                                <p className='text-sm text-white text-opacity-80 mt-1'>
                                  Time limits • Auto-grading • Share links
                                </p>
                              </div>
                            </div>
                            <div className='flex items-center ml-2'>
                              <div className='bg-white/10 p-1 rounded-lg flex shadow-md backdrop-blur-sm'>
                                <button
                                  onClick={() => setConvertToInteractive(false)}
                                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    !convertToInteractive
                                      ? 'bg-white text-blue-800 shadow-md'
                                      : 'text-white'
                                  }`}
                                >
                                  No
                                </button>
                                <button
                                  onClick={() => setConvertToInteractive(true)}
                                  className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    convertToInteractive
                                      ? 'bg-white text-blue-800 shadow-md'
                                      : 'text-white'
                                  }`}
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Interactive Test Options - Only show if user chose to convert */}
                  {showInteractiveOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className='mt-6'
                    >
                      <InteractiveTestOptions
                        settings={interactiveSettings}
                        onSettingsChange={setInteractiveSettings}
                        onGenerateLink={handleGenerateInteractiveLink}
                        interactiveLink={interactiveLink}
                        isLoading={isLoading}
                      />

                      {/* Display Interactive Link */}
                      {interactiveLink && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className='mt-6'
                        >
                          <div className='bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5'>
                            <p className='text-sm font-medium text-gray-700 mb-3'>
                              Your generated link:
                            </p>
                            <div className='flex flex-col sm:flex-row items-center gap-4'>
                              <div className='relative flex-1 w-full'>
                                <input
                                  type='text'
                                  value={interactiveLink}
                                  readOnly
                                  className='w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-800 pr-10 font-mono hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                  onClick={(e) => e.target.select()}
                                />
                                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                                  <svg
                                    className='w-4 h-4 text-gray-400'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className='flex gap-2 w-full sm:w-auto'>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      interactiveLink
                                    )
                                    toast.success('Link copied to clipboard!')
                                  }}
                                  className='flex-1 sm:flex-initial flex items-center justify-center py-2 px-4 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-all text-sm font-medium'
                                >
                                  <Copy className='h-4 w-4 mr-2' />
                                  Copy
                                </button>
                                <button
                                  onClick={() =>
                                    window.open(interactiveLink, '_blank')
                                  }
                                  className='flex-1 sm:flex-initial flex items-center justify-center py-2 px-4 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md'
                                >
                                  <ArrowRight className='h-4 w-4 mr-2' />
                                  Open
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Export Options Section */}
                  {showExportOptions && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className='mt-5 pt-4 border-t border-gray-100'
                    >
                      <h3 className='text-lg font-medium text-black mb-3'>
                        Export Options
                      </h3>

                      <div className='mb-4'>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                          {exportFormats.map((format) => (
                            <button
                              key={format.id}
                              className={`relative py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                selectedExportFormat === format.id
                                  ? 'bg-blue-50 border-2 border-blue-600 text-blue-700'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedExportFormat(format.id)}
                            >
                              <div className='flex flex-col items-center'>
                                <div className='text-lg mb-1'>
                                  {format.icon}
                                </div>
                                <span className='text-xs font-medium'>
                                  {format.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4'>
                        <button
                          className='bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-all col-span-1 sm:col-start-1'
                          onClick={() => {
                            if (interactiveLink) {
                              navigator.clipboard.writeText(interactiveLink)
                              toast.success('Share link copied!')
                            } else if (documentContent) {
                              const shareText = `Check out this document I created with RadiantAI:\n\n${documentContent.substring(
                                0,
                                200
                              )}...`
                              navigator.clipboard.writeText(shareText)
                              toast.success(
                                'Document preview copied for sharing!'
                              )
                            } else {
                              toast.info('Generate a document first to share')
                            }
                          }}
                        >
                          <Share className='h-4 w-4 mr-2' />
                          <span>Share</span>
                        </button>

                        <button
                          className='bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-green-700 transition-all col-span-1 sm:col-start-4 disabled:opacity-50'
                          onClick={() => handleExport(selectedExportFormat)}
                          disabled={isLoading || !documentContent}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className='h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'
                            />
                          ) : (
                            <Download className='h-4 w-4 mr-2' />
                          )}
                          <span>Download</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Sidebar Component */}
            <div className='lg:col-span-4'>
              <SidebarCreateDocument
                userDocuments={userDocuments}
                onLoadDocument={loadDocument}
                onDeleteDocument={deleteDocument}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default CreateDocumentsPage
