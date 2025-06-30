import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  FileQuestion,
  FileText,
  HelpCircle,
  RefreshCw,
  Share,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

import AuthModal from '@/pages/Auth/AuthModal'
import {
  loginSuccess,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/userSlice'
import { axiosInstance } from '../../../config'
import AiPromptSuggestions from '../CreateDocuments/AiPromptSuggestions'
import InteractiveTestOptions from './InteractiveTestOptions'
import SidebarCreateTest from './SidebarCreateTest'
import TestPreview from './TestPreview'

const InteractiveTestsMain = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [selectedTestType, setSelectedTestType] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [testContent, setTestContent] = useState('')
  const [currentTestId, setCurrentTestId] = useState(null)
  const [userTests, setUserTests] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [interactiveSettings, setInteractiveSettings] = useState({
    timeLimit: 30,
    showResults: true,
    allowRetry: false,
    randomizeQuestions: true,
    isPublic: false,
  })
  const [interactiveLink, setInteractiveLink] = useState('')

  const [testMetadata, setTestMetadata] = useState({
    title: '',
    description: '',
    passingScore: 70,
    totalQuestions: 0,
  })

  const testTypes = [
    {
      icon: <FileQuestion className='h-5 w-5' />,
      name: 'Multiple Choice',
      description: 'Auto-graded quiz with MCQ',
      documentType: 'exam',
    },
    {
      icon: <FileText className='h-5 w-5' />,
      name: 'Essay Questions',
      description: 'Long form answers',
      documentType: 'exam',
    },
    {
      icon: <Users className='h-5 w-5' />,
      name: 'Interview Assessment',
      description: 'Assessment for candidates',
      documentType: 'interview',
    },
    {
      icon: <Zap className='h-5 w-5' />,
      name: 'Mixed Format',
      description: 'Combination of question types',
      documentType: 'exam',
    },
  ]

  const promptSuggestions = {
    0: [
      'Create a multiple choice quiz about world history with 20 questions focusing on the 20th century. Each question should have 4 options with one correct answer clearly marked.',
      'Generate a biology quiz with 15 multiple choice questions about the human body systems. Include clear answer choices and mark correct answers.',
      'Make a computer science quiz with 25 questions covering algorithms and data structures. Format as multiple choice with explanations.',
    ],
    1: [
      "Create 5 essay questions for a literature course on Shakespeare's tragedies. Provide clear instructions and grading criteria for each question.",
      'Generate 3 long-form questions about environmental sustainability challenges. Include suggested answer length and key points to cover.',
      'Create an essay exam with 4 questions on macroeconomic theory. Provide detailed prompts and evaluation rubrics.',
    ],
    2: [
      'Create a technical interview assessment for a senior JavaScript developer position. Include coding challenges, system design questions, and behavioral questions.',
      'Generate a design thinking challenge for UX designer candidates. Include portfolio review questions and practical exercises.',
      'Create a problem-solving assessment for project manager candidates. Include scenario-based questions and case studies.',
    ],
    3: [
      'Create a mixed format exam with multiple choice, short answer, and essay questions about American history. Include clear instructions for each section.',
      'Generate a comprehensive assessment with various question types for a marketing course. Mix MCQs, case studies, and analytical questions.',
      'Create a mixed format quiz covering data analysis with both theoretical multiple choice and practical problem-solving questions.',
    ],
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadUserTests()
    }
  }, [isAuthenticated])

  const simulateProgress = () => {
    setProgress(0)
    setProgressMessage('Initializing AI request...')

    const progressSteps = [
      { progress: 15, message: 'Analyzing your requirements...', delay: 500 },
      { progress: 30, message: 'Processing test prompt...', delay: 800 },
      {
        progress: 50,
        message: 'DeepSeek AI is generating questions...',
        delay: 1200,
      },
      { progress: 70, message: 'Creating answer choices...', delay: 1000 },
      {
        progress: 85,
        message: 'Setting up interactive features...',
        delay: 800,
      },
      { progress: 95, message: 'Finalizing test structure...', delay: 500 },
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

  const resetProgress = () => {
    setProgress(0)
    setProgressMessage('')
  }

  const loadUserTests = async () => {
    try {
      const response = await axiosInstance.get('/documents/my-documents', {
        params: {
          documentType: 'exam',
          limit: 10,
        },
      })

      if (response.data.success) {
        setUserTests(response.data.documents)
      }
    } catch (error) {
      console.error('Error loading tests:', error)
    }
  }

  const createStructuredTestPrompt = (userPrompt, testType) => {
    const basePrompt = userPrompt.trim()

    let structuredPrompt = basePrompt

    if (testType === 0) {
      // Multiple Choice
      structuredPrompt += `\n\nFORMATTING REQUIREMENTS:
- Generate ONLY the test content, no explanations or meta-commentary
- Number each question clearly (1., 2., 3., etc.)
- For each question, provide exactly 4 answer choices labeled A, B, C, D
- Mark the correct answer with [CORRECT] after the option
- Use this exact format:

1. [Question text here]
   A. [Option A]
   B. [Option B] [CORRECT]
   C. [Option C]
   D. [Option D]

Generate the test content directly without any introductory text or explanations.`
    } else if (testType === 1) {
      // Essay Questions
      structuredPrompt += `\n\nFORMATTING REQUIREMENTS:
- Generate ONLY the test content, no explanations or meta-commentary
- Number each question clearly (1., 2., 3., etc.)
- Provide clear instructions for each question
- Include suggested word count or time allocation
- Add grading criteria or key points to cover
- Generate the test content directly without any introductory text`
    } else if (testType === 3) {
      // Mixed Format
      structuredPrompt += `\n\nFORMATTING REQUIREMENTS:
- Generate ONLY the test content, no explanations or meta-commentary
- Clearly separate different question types into sections
- Number all questions sequentially
- For multiple choice: use A, B, C, D format with [CORRECT] after correct answers
- For short answer: specify expected answer length
- For essay: include grading criteria
- Generate the test content directly without any introductory text`
    }

    return structuredPrompt
  }

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (!promptText.trim()) {
      toast.error('Please describe what test you want to create')
      return
    }

    setIsLoading(true)
    setGenerationComplete(false)
    setInteractiveLink('')
    setCurrentTestId(null)

    simulateProgress()

    try {
      const structuredPrompt = createStructuredTestPrompt(
        promptText,
        selectedTestType
      )

      const requestData = {
        prompt: structuredPrompt,
        documentType: testTypes[selectedTestType].documentType,
        metadata: {
          orgName: testMetadata.title || 'Documnt AI Test',
          date: new Date().toISOString().split('T')[0],
          additionalInfo: `Interactive ${testTypes[selectedTestType].name} - Generated for online testing`,
        },
        isInteractive: true,
        interactiveSettings: {
          timeLimit: interactiveSettings.timeLimit,
          showResults: interactiveSettings.showResults,
          allowRetry: interactiveSettings.allowRetry,
          randomizeQuestions: interactiveSettings.randomizeQuestions,
          isPublic: interactiveSettings.isPublic,
        },
      }

      const response = await axiosInstance.post(
        '/documents/generate',
        requestData
      )

      if (response.data.success) {
        setProgress(100)
        setProgressMessage('Test generated successfully!')

        setTimeout(() => {
          setTestContent(response.data.document.content)
          setCurrentTestId(response.data.document.id)

          setTestMetadata({
            title: response.data.document.title,
            description: `Generated ${testTypes[selectedTestType].name} based on your requirements`,
            passingScore: 70,
            totalQuestions: getTotalQuestions(response.data.document.content),
          })

          setGenerationComplete(true)
          loadUserTests()
          toast.success('Test generated successfully with Documnt AI!')
          setTimeout(resetProgress, 1000)
        }, 500)
      } else {
        throw new Error(response.data.message || 'Failed to generate test')
      }
    } catch (error) {
      console.error('Error generating test:', error)
      resetProgress()

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
          errorMessage || 'Failed to generate test. Please try again.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalQuestions = (content) => {
    const questionMatches = content.match(/^\d+\./gm)
    return questionMatches ? questionMatches.length : 10
  }

  const handleGenerateInteractiveLink = async () => {
    if (!currentTestId) {
      toast.error('Please generate a test first')
      return
    }

    setIsLoading(true)
    try {
      const response = await axiosInstance.post(
        `/documents/${currentTestId}/interactive-link`
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
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewTest = () => {
    if (!testContent || !currentTestId) {
      toast.error('No test content to preview')
      return
    }

    // Open test viewer page in new tab
    const testUrl = `/test-viewer/${currentTestId}`
    window.open(testUrl, '_blank')
  }

  const applyPromptSuggestion = (suggestion) => {
    setPromptText(suggestion)
  }

  const handleClearForm = () => {
    setPromptText('')
    setTestContent('')
    setGenerationComplete(false)
    setCurrentTestId(null)
    setInteractiveLink('')
    setTestMetadata({
      title: '',
      description: '',
      passingScore: 70,
      totalQuestions: 0,
    })
    resetProgress()
    toast.success('Form cleared!')
  }

  const handleTestUpdate = async (newContent) => {
    if (!currentTestId) {
      setTestContent(newContent)
      return
    }

    try {
      const response = await axiosInstance.put(`/documents/${currentTestId}`, {
        content: newContent,
        metadata: testMetadata,
      })

      if (response.data.success) {
        setTestContent(newContent)
        toast.success('Test updated successfully!')
        loadUserTests()
      }
    } catch (error) {
      console.error('Error updating test:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to update test')
    }
  }

  const loadTest = async (testId) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/documents/${testId}`)

      if (response.data.success) {
        const test = response.data.document
        setTestContent(test.content)
        setCurrentTestId(test._id)
        setPromptText(test.prompt)
        setTestMetadata({
          title: test.title,
          description: test.metadata?.additionalInfo || '',
          passingScore: 70,
          totalQuestions: getTotalQuestions(test.content),
        })
        setGenerationComplete(true)

        if (test.isInteractive && test.interactiveSettings) {
          setInteractiveSettings(test.interactiveSettings)
        }

        const typeIndex = testTypes.findIndex(
          (type) => type.documentType === test.documentType
        )
        if (typeIndex !== -1) {
          setSelectedTestType(typeIndex)
        }

        toast.success('Test loaded successfully!')
      }
    } catch (error) {
      console.error('Error loading test:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to load test')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return
    }

    try {
      const response = await axiosInstance.delete(`/documents/${testId}`)

      if (response.data.success) {
        toast.success('Test deleted successfully!')
        loadUserTests()

        if (testId === currentTestId) {
          handleClearForm()
        }
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      const errorMessage = error.response?.data?.message || error.message
      toast.error(errorMessage || 'Failed to delete test')
    }
  }

  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData))
    localStorage.setItem('token', userData.token)
    loadUserTests()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLoginSuccess}
      />

      <main className='container mx-auto px-4 py-6 max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200'
          >
            <div className='p-8'>
              {/* Recent Tests */}
              {/* Recent Tests */}
              {isAuthenticated && userTests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mb-6'
                >
                  <h3 className='text-lg font-bold text-black mb-3'>
                    Recent Tests
                  </h3>
                  <div className='space-y-2'>
                    {userTests.slice(0, 4).map((test) => (
                      <div
                        key={test._id}
                        className='flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all group'
                        onClick={() => loadTest(test._id)}
                      >
                        <div className='flex items-center space-x-3 flex-1 min-w-0'>
                          <div className='w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                            <FileQuestion className='h-5 w-5 text-white' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-gray-900 truncate'>
                              {test.title}
                            </p>
                            <div className='flex items-center space-x-2 mt-0.5'>
                              <p className='text-xs text-gray-500'>
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                              <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                              <p className='text-xs text-gray-500'>
                                {test.content
                                  ? test.content.match(/^\d+\./gm)?.length || 0
                                  : 0}{' '}
                                questions
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTest(test._id)
                          }}
                          className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-all'
                        >
                          <svg
                            className='w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Test Type Selection */}
              <motion.div className='mb-6'>
                <h3 className='text-lg font-bold text-black mb-3'>Test Type</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                  {testTypes.map((type, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className='cursor-pointer rounded-lg p-2 sm:p-3 flex items-center space-x-2 sm:space-x-3 transition-all duration-300 relative border border-transparent hover:bg-gray-50'
                      style={{
                        boxShadow:
                          selectedTestType === index
                            ? '0 0 0 2px rgb(31 41 55)'
                            : '0 0 0 1px rgb(229 231 235)',
                      }}
                      onClick={() => setSelectedTestType(index)}
                    >
                      <div
                        className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md flex-shrink-0 ${
                          selectedTestType === index
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
                          {selectedTestType === index && (
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

              {/* Help Text */}
              <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <div className='flex items-center'>
                  <HelpCircle className='h-5 w-5 text-blue-500 mr-3 flex-shrink-0' />
                  <p className='text-sm text-gray-700'>
                    Describe the test you want to create. Our AI will generate
                    interactive test content with proper formatting for online
                    testing.
                  </p>
                </div>
              </div>

              {/* Prompt Input */}
              <div className='mb-6'>
                <label className='block text-lg font-bold text-gray-900 mb-3'>
                  Describe Your Test
                </label>
                <div className='relative'>
                  <textarea
                    className='w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm'
                    placeholder='E.g., Create a multiple choice quiz about world history with 20 questions focusing on the 20th century. Include questions about both World Wars, the Cold War, and major political movements. Each question should have 4 options with clear correct answers.'
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                  />
                  <button
                    className='absolute bottom-3 right-3 p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                    onClick={() => {
                      navigator.clipboard.writeText(promptText)
                      toast.success('Copied to clipboard!')
                    }}
                  >
                    <Copy className='h-4 w-4 text-gray-600' />
                  </button>
                </div>
              </div>

              {/* AI Suggestions */}
              <AiPromptSuggestions
                suggestions={promptSuggestions[selectedTestType] || []}
                onSuggestionClick={applyPromptSuggestion}
              />

              {/* Generate Button */}
              <div className='mt-6 flex justify-between items-center'>
                <button
                  onClick={handleClearForm}
                  className='flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                >
                  <RefreshCw className='h-4 w-4 mr-2' />
                  Clear All
                </button>

                <button
                  className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-md font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center'
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className='h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className='h-4 w-4 mr-2' />
                      {generationComplete ? 'Regenerate' : 'Generate Test'}
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'
                >
                  <div className='flex items-center mb-3'>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3'
                    >
                      <Sparkles className='h-5 w-5 text-white' />
                    </motion.div>
                    <div className='flex-1'>
                      <h4 className='text-sm font-medium text-gray-900'>
                        Documnt AI is creating your test
                      </h4>
                      <p className='text-xs text-gray-600'>{progressMessage}</p>
                    </div>
                    <span className='text-sm font-medium text-blue-600'>
                      {progress}%
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <motion.div
                      className='h-full bg-blue-600 rounded-full'
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Test Preview & Actions */}
              {generationComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='mt-6'
                >
                  <TestPreview
                    content={testContent}
                    metadata={testMetadata}
                    onContentChange={handleTestUpdate}
                    onMetadataChange={setTestMetadata}
                  />

                  <InteractiveTestOptions
                    settings={interactiveSettings}
                    onSettingsChange={setInteractiveSettings}
                    onGenerateLink={handleGenerateInteractiveLink}
                    interactiveLink={interactiveLink}
                    isLoading={isLoading}
                  />

                  {/* Action Buttons */}
                  <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                    <h3 className='text-lg font-bold text-gray-900 mb-4'>
                      Test Actions
                    </h3>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      <button
                        onClick={handleViewTest}
                        className='bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center'
                      >
                        <ExternalLink className='h-4 w-4 mr-2' />
                        View Test
                      </button>

                      <button
                        onClick={() => {
                          if (interactiveLink) {
                            navigator.clipboard.writeText(interactiveLink)
                            toast.success('Test link copied to clipboard!')
                          } else {
                            toast.error('Generate a test link first')
                          }
                        }}
                        className='bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center'
                      >
                        <Share className='h-4 w-4 mr-2' />
                        Share Test
                      </button>

                      <button
                        onClick={() => {
                          const element = document.createElement('a')
                          const file = new Blob([testContent], {
                            type: 'text/plain',
                          })
                          element.href = URL.createObjectURL(file)
                          element.download = `${
                            testMetadata.title || 'test'
                          }.txt`
                          document.body.appendChild(element)
                          element.click()
                          document.body.removeChild(element)
                          toast.success('Test downloaded!')
                        }}
                        className='bg-gray-600 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors flex items-center justify-center'
                      >
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Interactive Link Display */}
                  {interactiveLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-4 p-4 bg-white border border-gray-200 rounded-lg'
                    >
                      <p className='text-sm font-medium text-gray-700 mb-3'>
                        Share this link with your test takers:
                      </p>
                      <div className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={interactiveLink}
                          readOnly
                          className='flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm font-mono'
                          onClick={(e) => e.target.select()}
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(interactiveLink)
                            toast.success('Link copied!')
                          }}
                          className='px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                        >
                          <Copy className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => window.open(interactiveLink, '_blank')}
                          className='px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
                        >
                          <ArrowRight className='h-4 w-4' />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className='lg:col-span-4'>
            <SidebarCreateTest
              userTests={userTests}
              onLoadTest={loadTest}
              onDeleteTest={deleteTest}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default InteractiveTestsMain
