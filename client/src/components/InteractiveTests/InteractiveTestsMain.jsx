// file 2
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
  Share,
  Sparkles,
  Upload,
  Users,
  Zap,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// You'll need to create or import these components

import AiPromptSuggestions from '../CreateDocuments/AiPromptSuggestions'
import InteractiveTestOptions from './InteractiveTestOptions'
import SidebarCreateTest from './SidebarCreateTest'
import TestPreview from './TestPreview'

const InteractiveTestsMain = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTestType, setSelectedTestType] = useState(null) // Default to first option
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('html') // Default to HTML for interactive tests
  const [generationComplete, setGenerationComplete] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [testContent, setTestContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [interactiveSettings, setInteractiveSettings] = useState({
    timeLimit: 30,
    showResults: true,
    allowRetry: true,
    isPublic: false,
    generateLink: false,
  })
  const [interactiveLink, setInteractiveLink] = useState('')
  // Test metadata state
  const [testMetadata, setTestMetadata] = useState({
    title: '',
    description: '',
    author: '',
    date: '',
    passingScore: 70,
    randomizeQuestions: true,
    showProgress: true,
  })
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

  // Test type options
  const testTypes = [
    {
      icon: <FileQuestion className='h-5 w-5' />,
      name: 'Multiple Choice',
      description: 'Auto-graded quiz with MCQ',
    },
    {
      icon: <FileText className='h-5 w-5' />,
      name: 'Essay Questions',
      description: 'Long form answers',
    },
    {
      icon: <Users className='h-5 w-5' />,
      name: 'Interview Assessment',
      description: 'Assessment for interview candidates',
    },
    {
      icon: <FilePlus className='h-5 w-5' />,
      name: 'Mixed Format',
      description: 'Combination of question types',
    },
  ]

  // Export formats
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

  // AI prompt suggestions based on selected test type
  const promptSuggestions = {
    0: [
      'Create a multiple choice quiz about world history with 20 questions focusing on the 20th century',
      'Generate a biology quiz with 15 multiple choice questions about the human body systems',
      'Make a computer science quiz with 25 questions covering algorithms and data structures',
    ],
    1: [
      'Create 5 essay questions for a literature course on Shakespeares tragedies',
      'Generate 3 long-form questions about environmental sustainability challenges',
      'Create an essay exam with 4 questions on macroeconomic theory',
    ],
    2: [
      'Create a technical interview assessment for a senior JavaScript developer position',
      'Generate a design thinking challenge for UX designer candidates',
      'Create a problem-solving assessment for project manager candidates',
    ],
    3: [
      'Create a mixed format exam with multiple choice, short answer, and essay questions about American history',
      'Generate a comprehensive assessment with various question types for a marketing course',
      'Create a mixed format quiz covering data analysis with both theoretical and practical questions',
    ],
  }

  // Simulated test generation
  const handleGenerate = async () => {
    if (!promptText && !selectedFile) {
      alert('Please enter a prompt or upload a file for your test')
      return
    }

    setIsLoading(true)
    setShowExportOptions(false)
    setGenerationComplete(false)
    setInteractiveLink('')

    try {
      // Simulate API call to AI service
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Generate test content based on prompt or file
      const generatedContent = generateSampleContent()
      setTestContent(generatedContent)

      // Auto-fill test metadata with AI-generated title if empty
      if (!testMetadata.title) {
        const inferredTitle = getInferredTitle()
        setTestMetadata({
          ...testMetadata,
          title: inferredTitle,
          date: new Date().toISOString().split('T')[0],
        })
      }

      setIsLoading(false)
      setGenerationComplete(true)
      setShowExportOptions(true)
    } catch (error) {
      console.error('Error generating test:', error)
      setIsLoading(false)
      alert('Failed to generate test. Please try again.')
    }
  }

  // Get inferred title from the prompt
  const getInferredTitle = () => {
    if (promptText.length < 10) return 'Interactive Test'

    // Extract a title from the prompt text
    const words = promptText.split(' ').slice(0, 5).join(' ')
    return words.charAt(0).toUpperCase() + words.slice(1) + '...'
  }

  // Simulate test content generation based on type
  const generateSampleContent = () => {
    const testTypes = ['multiple-choice', 'essay', 'interview', 'mixed']
    const selectedType = testTypes[selectedTestType]

    let testContent = ''

    if (selectedType === 'multiple-choice') {
      testContent = `
## World History Quiz: 20th Century Events

**Instructions:** Select the best answer for each question. You have 30 minutes to complete this quiz.

1. Which event marked the beginning of World War I?
   - [ ] The invasion of Poland
   - [x] The assassination of Archduke Franz Ferdinand
   - [ ] The sinking of the Lusitania
   - [ ] The Treaty of Versailles

2. Which country was NOT part of the Allied Powers during World War II?
   - [ ] United States
   - [ ] Great Britain
   - [x] Italy
   - [ ] Soviet Union

3. The Cold War was primarily a geopolitical tension between:
   - [x] The United States and the Soviet Union
   - [ ] Great Britain and Germany
   - [ ] China and Japan
   - [ ] France and Russia

4. Which agreement divided Korea into two separate countries?
   - [ ] Treaty of Versailles
   - [ ] NATO Agreement
   - [x] Potsdam Agreement
   - [ ] Camp David Accords

5. The Cuban Missile Crisis occurred during which decade?
   - [ ] 1950s
   - [x] 1960s
   - [ ] 1970s
   - [ ] 1980s

[... remaining questions would appear here ...]
      `
    } else if (selectedType === 'essay') {
      testContent = `
## Literature Examination: Shakespeare's Tragedies

**Instructions:** Answer each question thoroughly with well-developed arguments and specific examples from the texts. Each essay should be approximately 500-750 words.

### Essay Questions (20 points each)

1. **Character Analysis**: Compare and contrast the tragic flaws of Macbeth and Hamlet. How do their respective flaws drive the action of each play and lead to their downfalls? Use specific examples from both texts to support your analysis.

2. **Thematic Exploration**: Examine the theme of ambition in "Macbeth" and "Julius Caesar." How does Shakespeare portray the corrupting influence of ambition, and what commentary does he make about power and leadership? Support your argument with textual evidence.

3. **Literary Devices**: Analyze Shakespeare's use of supernatural elements in his tragedies. Choose at least two plays and discuss how supernatural occurrences (ghosts, witches, prophecies, etc.) function within the narratives. What purpose do they serve beyond mere dramatic effect?

4. **Historical Context**: Discuss how the political climate of Elizabethan England influenced Shakespeare's portrayal of monarchy and governance in his tragedies. Consider plays such as "King Lear," "Macbeth," or "Richard III" in your response.

5. **Critical Perspectives**: Choose ONE of Shakespeare's tragic heroines (Lady Macbeth, Ophelia, Desdemona, etc.) and analyze her character through both a contemporary lens and from the perspective of Shakespeare's time. How might interpretations of this character have changed over time?

[Grading Rubric details would appear here...]
    `
    } else if (selectedType === 'interview') {
      testContent = `
## Senior JavaScript Developer Technical Assessment

**Candidate Instructions:** This assessment evaluates your JavaScript proficiency, problem-solving abilities, and software architecture knowledge. Complete all sections within the 60-minute time limit.

### Section 1: Conceptual Questions (10 points)

1. Explain the difference between 'let', 'const', and 'var' in JavaScript.

2. What is closure in JavaScript and how might you use it in practical applications?

3. Describe the event loop in JavaScript and how it handles asynchronous operations.

### Section 2: Code Implementation (15 points)

Implement a function called 'debounce' that takes a function and a delay time as arguments and returns a debounced version of the function.

\`\`\`javascript
// Your implementation here
function debounce(func, delay) {
  // Complete this function
}
\`\`\`

### Section 3: Problem Solving (15 points)

You are tasked with optimizing a web application that is experiencing performance issues. The application loads data from an API and renders a large list of items (>1000) with complex DOM structures.

1. What potential issues might be causing performance problems?
2. Describe your approach to diagnosing the performance bottlenecks.
3. Outline specific strategies you would implement to improve performance.

### Section 4: System Design (10 points)

Design a frontend architecture for a real-time collaborative document editing system similar to Google Docs. Include considerations for:

1. State management
2. Real-time synchronization
3. Conflict resolution
4. User presence indicators
5. Offline capabilities

[... assessment continues ...]
    `
    } else {
      testContent = `
## Comprehensive Marketing Assessment

**Instructions:** This assessment contains multiple types of questions. Complete all sections within the allotted time.

### Section 1: Multiple Choice (2 points each)

1. Which of the following is NOT one of the 4 Ps of marketing?
   - [ ] Product
   - [ ] Price
   - [ ] Place
   - [x] Purpose
   - [ ] Promotion

2. Which digital marketing channel typically has the highest ROI?
   - [ ] Social media advertising
   - [x] Email marketing
   - [ ] Display advertising
   - [ ] Print media

3. What does SEO stand for?
   - [ ] Search Engine Operations
   - [x] Search Engine Optimization
   - [ ] Search Engine Ownership
   - [ ] Search Engine Outcomes

[... more multiple choice questions ...]

### Section 2: Short Answer Questions (5 points each)

1. Explain the concept of customer segmentation and why it's important in marketing strategy.

2. Describe the difference between inbound and outbound marketing approaches.

3. What is a unique selling proposition (USP) and why is it important for brand positioning?

### Section 3: Case Study Analysis (20 points)

**Scenario:** You are the marketing director for a direct-to-consumer fitness equipment company that has been experiencing declining sales over the past year despite increased spending on digital advertising.

1. What potential factors might be contributing to the declining sales?
2. Outline a comprehensive marketing strategy to reverse this trend.
3. Describe how you would measure the success of your proposed strategy.

[... additional content would appear here ...]
      `
    }

    return testContent
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
          } file and create an interactive test based on its content.`
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
      console.log(`Exporting test as ${format}...`)

      // Create a simulated download for demonstration purposes
      const element = document.createElement('a')
      const file = new Blob([testContent], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `interactive-test.${format}`
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
        setInteractiveLink(`https://yourdomain.com/take-test/${uniqueId}`)
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
    <>
      <div className='min-h-screen bg-gray-50 text-gray-900'>
        {/* Header component */}

        <main className='container mx-auto px-4 py-6 md:py-12 max-w-7xl'>
          {/* Main Content Area with enhanced grid layout */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8'>
            {/* Left Column - Input with enhanced styling */}
            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              className='lg:col-span-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'
            >
              {/* Content area - single merged interface */}
              <div className='p-4 md:p-8'>
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={staggerContainer}
                >
                  {/* Test Type Selection */}
                  <motion.div variants={itemVariant} className='mb-5 pt-4'>
                    <h3 className='text-base md:text-lg font-medium text-black mb-3'>
                      Test Type
                    </h3>
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
                                : 'bg-gray-100 text-black'
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

                  {/* Introduction Help Text */}
                  <motion.div variants={itemVariant} className='mb-5'>
                    <div className='p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center'>
                      <HelpCircle className='h-5 w-5 text-blue-500 mr-2 md:mr-3 flex-shrink-0' />
                      <p className='text-xs md:text-sm text-black'>
                        Create an interactive test by uploading a file or
                        describing what you need. Our AI will generate test
                        content that can be shared with participants to take
                        online.
                      </p>
                    </div>
                  </motion.div>

                  {/* FILE UPLOAD SECTION */}
                  <motion.div variants={itemVariant} className='mb-5 pt-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-base md:text-lg font-medium text-black'>
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
                        <div className='bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center text-black'>
                          <Upload className='h-5 w-5' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-sm font-medium mb-1'>
                            {selectedFile
                              ? selectedFile.name
                              : 'Drag & drop or click to browse'}
                          </h3>
                          <p className='text-xs text-gray-500'>
                            {selectedFile
                              ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                              : 'Upload your syllabus, notes, or existing tests'}
                          </p>
                        </div>
                        {selectedFile && (
                          <button
                            className='text-xs text-gray-500 hover:text-black border border-gray-200 rounded px-2 py-1'
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

                  {/* Prompt input */}
                  <motion.div variants={itemVariant} className='mb-5 pt-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <label className='block text-base md:text-lg font-medium text-black'>
                        Describe Your Test
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
                        className='w-full h-full p-3 md:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none resize-none text-xs md:text-sm shadow-sm placeholder:text-xs md:placeholder:text-sm'
                        placeholder='E.g., Create a multiple choice quiz about world history with 20 questions focusing on the 20th century. Include questions about both World Wars, the Cold War, and major political movements.'
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
                  <div className='pt-1'>
                    <AiPromptSuggestions
                      suggestions={promptSuggestions[selectedTestType] || []}
                      onSuggestionClick={applyPromptSuggestion}
                    />
                  </div>

                  {/* Generate Test Button */}
                  <motion.div
                    variants={itemVariant}
                    className='mt-6 md:mt-8 flex justify-end'
                  >
                    <div className='flex items-center space-x-3 md:space-x-4 w-full'>
                      <button className='text-black py-2 px-3 md:px-4 rounded-md text-sm font-medium flex items-center hover:bg-gray-100 transition-all border border-gray-300'>
                        <div className='flex items-center space-x-1 md:space-x-2'>
                          <Clock className='h-4 w-4' />
                          <span>Save Draft</span>
                        </div>
                      </button>

                      <button
                        className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-2 px-4 md:px-6 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-blue-700 transition-all ml-auto'
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

                  {/* Test Preview Section */}
                  {generationComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className='mt-6'
                    >
                      <TestPreview
                        content={testContent}
                        metadata={testMetadata}
                        onContentChange={(newContent) => {
                          setTestContent(newContent)
                        }}
                        onMetadataChange={setTestMetadata}
                      />

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
                          className='mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col sm:flex-row items-center justify-between'
                        >
                          <div className='flex items-center mb-3 sm:mb-0'>
                            <div className='bg-green-100 p-2 rounded-full mr-3'>
                              <Check className='h-5 w-5 text-green-600' />
                            </div>
                            <input
                              type='text'
                              value={interactiveLink}
                              readOnly
                              className='bg-white border border-green-200 rounded px-3 py-2 text-sm w-full sm:w-auto'
                            />
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(interactiveLink)
                              }
                              className='flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-md text-black hover:bg-gray-50 transition-colors text-sm'
                            >
                              <Copy className='h-4 w-4 mr-1.5' />
                              Copy
                            </button>
                            <button
                              onClick={() =>
                                window.open(interactiveLink, '_blank')
                              }
                              className='flex items-center justify-center px-3 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors text-sm'
                            >
                              <ArrowRight className='h-4 w-4 mr-1.5' />
                              Open
                            </button>
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
                      <h3 className='text-base md:text-lg font-medium text-gray-800 mb-3'>
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

                      {/* Action buttons */}
                      <div className='grid grid-cols-2 gap-2 mt-4'>
                        <button
                          className='bg-white border border-gray-300 text-black py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-all'
                          onClick={() => {}}
                        >
                          <Share className='h-4 w-4 mr-2' />
                          <span>Share</span>
                        </button>

                        <button
                          className='bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center shadow-sm hover:bg-green-700 transition-all'
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
              <SidebarCreateTest />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default InteractiveTestsMain
