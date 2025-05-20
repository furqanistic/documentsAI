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
import Layout from '../Layout/Layout'

const CreateDocumentsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState(null) // Default to first option
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

  useEffect(() => {
    // Reset convert to interactive option when document type changes
    if (selectedDocType !== 1) {
      // Changed from 0 to 1
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
      'Create a final exam for an Introduction to Psychology course with 30 multiple choice questions and 5 essay questions',
      'Generate a technical interview question set for a senior JavaScript developer position',
      'Make a quiz about world history focusing on the 20th century events',
    ],
    1: [
      'Create a formal business proposal for a software development project',
      'Generate a legal contract for a consulting agreement',
      'Draft a professional memo to all department heads about the upcoming fiscal year',
    ],
    2: [
      'Create interview questions for a marketing manager position',
      'Generate a structured interview guide for technical candidates',
      'Design a behavioral interview assessment for customer service roles',
    ],
    3: [
      'Create a quarterly business performance report for a tech startup',
      'Generate a market research report on renewable energy trends in Europe',
      "Create a financial analysis report for company XYZ's 2024 fiscal year",
    ],
  }

  // Document types with enhanced descriptions
  const documentTypes = [
    {
      icon: <FileText className='h-5 w-5' />,
      name: 'Professional Documents',
      description: 'Formal business and official documents',
    },
    {
      icon: <FileQuestion className='h-5 w-5' />,
      name: 'Exams & Quizzes',
      description: 'Create assessments',
    },
    {
      icon: <Users className='h-5 w-5' />,
      name: 'Interviews',
      description: 'Any type of Interview questions',
    },
    {
      icon: <FilePlus className='h-5 w-5' />,
      name: 'Reports',
      description: 'Comprehensive data analysis reports',
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

  // Simulated AI document generation
  const handleGenerate = async () => {
    if (!promptText && !selectedFile) {
      alert('Please enter a prompt or upload a file for your document')
      return
    }

    setIsLoading(true)
    setShowExportOptions(false)
    setGenerationComplete(false)
    setInteractiveLink('')

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Generate document content based on prompt or file
      const generatedContent = generateSampleContent()
      setDocumentContent(generatedContent)

      setIsLoading(false)
      setGenerationComplete(true)
      setShowExportOptions(true)
    } catch (error) {
      console.error('Error generating document:', error)
      setIsLoading(false)
      alert('Failed to generate document. Please try again.')
    }
  }

  // Simulate document content generation based on type
  const generateSampleContent = () => {
    const docTypes = ['exam', 'professional', 'interview', 'report']
    const selectedType = docTypes[selectedDocType]

    // Create header content if branding is enabled
    let headerContent = ''
    if (brandingEnabled) {
      const dateDisplay = documentMetadata.date
        ? `Date: ${documentMetadata.date}`
        : ''
      const timeDisplay = documentMetadata.time
        ? `Time: ${documentMetadata.time}`
        : ''

      headerContent = `
# ${documentMetadata.orgName || 'Organization Name'}
${documentMetadata.additionalInfo ? documentMetadata.additionalInfo + '\n' : ''}
${dateDisplay} ${timeDisplay}

---

`
    }

    let mainContent = ''
    if (selectedType === 'exam') {
      mainContent = `
## Introduction to Psychology - Final Examination

**Instructions:** This exam consists of 30 multiple choice questions and 3 essay questions. You have 2 hours to complete this exam.

### Multiple Choice (2 points each)

1. Which of the following is NOT one of the main perspectives in psychology?
   a) Cognitive
   b) Behavioral
   c) Mathematical
   d) Psychodynamic

2. The tendency to attribute other people's behavior to their personality and to attribute our own behavior to the situation is known as:
   a) Fundamental attribution error
   b) Self-serving bias
   c) Hindsight bias
   d) Confirmation bias

[... remaining questions would appear here ...]

### Essay Questions (10 points each)

1. Compare and contrast classical and operant conditioning. Provide examples of how each might be applied in educational settings.

2. Explain the major theories of cognitive development, highlighting the key contributions and limitations of each approach.

3. Discuss the biological and environmental factors that contribute to the development of psychological disorders.
      `
    } else if (selectedType === 'professional') {
      mainContent = `
# Professional Business Proposal
## Project: Enterprise CRM Implementation

### Executive Summary
This proposal outlines our approach to implementing a customized Customer Relationship Management (CRM) system for XYZ Corporation. Our solution will address the specific requirements identified during our preliminary analysis and is designed to increase sales efficiency by 25% and improve customer retention by 15%.

### Scope of Work
- Requirements gathering and analysis (2 weeks)
- System design and architecture (3 weeks)
- Development and customization (8 weeks)
- Testing and quality assurance (3 weeks)
- Deployment and training (2 weeks)
- Post-implementation support (ongoing)

### Budget and Timeline
- Total project cost: $175,000
- Timeline: 18 weeks from contract signing
- Payment schedule: 30% upfront, 40% at midpoint, 30% upon completion

### Team and Resources
Our implementation team consists of:
- 1 Project Manager
- 2 Business Analysts
- 3 Senior Developers
- 1 UX/UI Specialist
- 2 QA Engineers

[... remaining content would appear here ...]
    `
    } else if (selectedType === 'interview') {
      mainContent = `
# Senior Software Engineer Interview Guide
## Technical Assessment and Behavioral Questions

### Introduction (5 minutes)
- Brief introduction of the interview panel
- Overview of the interview process
- Candidate introduction and background

### Technical Questions (30 minutes)

#### Programming Fundamentals
1. Explain the difference between object-oriented and functional programming paradigms.
2. How would you optimize a SQL query that's performing poorly?
3. Describe a complex technical problem you've solved recently. What approach did you take?

#### System Design
1. How would you design a distributed caching system?
2. Draw the architecture for a high-traffic web application with multiple microservices.
3. Explain how you would implement authentication across a microservices architecture.

#### Coding Assessment
Please implement a function that finds the longest palindromic substring in a given string.

### Behavioral Questions (15 minutes)

1. Describe a situation where you disagreed with a team member. How did you resolve it?
2. Tell me about a time when you had to meet a tight deadline. How did you manage your time?
3. How do you stay updated with the latest technologies and industry trends?

[... remaining content would appear here ...]
    `
    } else {
      mainContent = `
# Quarterly Business Performance Report
## Q1 2025 - XYZ Technology Inc.

### Executive Summary
This report presents an analysis of XYZ Technology's performance in Q1 2025. Overall revenue increased by 15.3% compared to Q4 2024, exceeding projections by 7.2%. The cloud services division showed the strongest growth at 22.1%, while hardware sales slightly underperformed projections by 3.5%.

### Financial Highlights
- Total Revenue: $124.7M (+15.3% QoQ)
- Operating Expenses: $87.2M (+8.1% QoQ)
- Net Profit: $27.3M (+23.4% QoQ)
- Cash Reserves: $215.6M (+5.2% QoQ)

### Department Performance
#### Cloud Services
Cloud services continued its strong performance with revenue of $68.3M, representing a 22.1% increase over the previous quarter. The introduction of the new enterprise security features contributed significantly to this growth, adding approximately $7.2M in new contracts.

[... remaining content would appear here ...]
      `
    }

    return headerContent + mainContent
  }

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)

      // Read file content for preview (simplified for demo)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPromptText(
          `Process this ${
            file.type.split('/')[1]
          } file and create a similar document with improved content.`
        )
      }
      reader.readAsText(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  // Handle export action
  const handleExport = (format) => {
    setIsLoading(true)

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)

      // In a real implementation, this would trigger the actual file download
      console.log(`Exporting document as ${format}...`)

      // Create a simulated download for demonstration purposes
      const element = document.createElement('a')
      const file = new Blob([documentContent], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `document.${format}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 1500)
  }

  // Generate interactive test link
  const handleGenerateInteractiveLink = () => {
    if (!interactiveSettings.generateLink) {
      setInteractiveSettings({ ...interactiveSettings, generateLink: true })

      // Simulate link generation
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        // Generate a fake unique URL
        const uniqueId = Math.random().toString(36).substring(2, 10)
        setInteractiveLink(
          `https://yourdomain.com/interactive-test/${uniqueId}`
        )
      }, 1500)
    } else {
      setInteractiveSettings({ ...interactiveSettings, generateLink: false })
      setInteractiveLink('')
    }
  }

  // Apply AI suggestion to prompt
  const applyPromptSuggestion = (suggestion) => {
    setPromptText(suggestion)
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 text-gray-900'>
        {/* Header component */}
        <CreateDocumentsHeader />

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
                  {/* Document Type - CONSISTENT SPACING */}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <h3 className='text-base md:text-lg font-bold text-black mb-3'>
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
                      </p>
                    </div>
                  </motion.div>

                  {/* FILE UPLOAD SECTION - CONSISTENT SPACING */}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-base md:text-lg font-bold text-black'>
                        Upload a File (Optional)
                      </label>
                    </div>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors'
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
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
                              : 'Supports PDF, DOCX, TXT, and more'}
                          </p>
                        </div>
                        {selectedFile && (
                          <button
                            className='text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1'
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(null)
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
                      <label className='block text-base md:text-lg font-bold text-black'>
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
                    <div className='relative h-32 md:h-40'>
                      <textarea
                        className='w-full h-full p-3 md:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none text-xs md:text-sm shadow-sm placeholder:text-xs md:placeholder:text-sm'
                        placeholder='E.g., Create a mid-term exam for a college-level Intro to Psychology course. Include 30 multiple choice questions and 3 essay questions covering topics like cognitive development, research methods, and behavioral psychology.'
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                      ></textarea>
                      <div className='absolute bottom-3 right-3 flex space-x-2'>
                        <button
                          className='p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'
                          title='Copy to clipboard'
                          onClick={() =>
                            navigator.clipboard.writeText(promptText)
                          }
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
                      <button className='text-gray-700 py-2 px-3 md:px-4 rounded-md text-sm font-medium flex items-center hover:bg-gray-100 transition-all border border-gray-300'>
                        <div className='flex items-center space-x-1 md:space-x-2'>
                          <Clock className='h-4 w-4' />
                          <span>Save Draft</span>
                        </div>
                      </button>

                      <button
                        className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-2 px-4 md:px-6 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-gray-800 transition-all ml-auto'
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

                  {/* Document Branding Options - Add after generation button but before preview */}
                  {generationComplete && (
                    <DocumentBranding
                      metadata={documentMetadata}
                      onMetadataChange={setDocumentMetadata}
                      enabled={brandingEnabled}
                      onToggleEnabled={(value) => {
                        setBrandingEnabled(value)
                        // Regenerate document content with or without branding when toggled
                        if (value !== brandingEnabled) {
                          setDocumentContent(generateSampleContent())
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
                        onContentChange={(newContent) => {
                          setDocumentContent(newContent)
                        }}
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
                                    // You could add a toast notification here
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
                      <h3 className='text-base md:text-lg font-medium text-black mb-3'>
                        Export Options
                      </h3>

                      <div className='mb-4'>
                        {/* Removed "Select Format" text */}
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

                      {/* Updated button layout */}
                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4'>
                        {/* Share button positioned under PDF */}
                        <button
                          className='bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-all col-span-1 sm:col-start-1'
                          onClick={() => {}}
                        >
                          <Share className='h-4 w-4 mr-2' />
                          <span>Share</span>
                        </button>

                        {/* Download button positioned under Plain Text */}
                        <button
                          className='bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-green-700 transition-all col-span-1 sm:col-start-4'
                          onClick={() => handleExport(selectedExportFormat)}
                          disabled={isLoading}
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
              <SidebarCreateDocument />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default CreateDocumentsPage
