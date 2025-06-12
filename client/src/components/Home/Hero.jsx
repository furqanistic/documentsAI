import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Book,
  Bot,
  BrainCircuit,
  CheckCircle,
  Clock,
  FileCheck,
  FileSymlink,
  FileText,
  GraduationCap,
  LineChart,
  LucideWand2,
  Shield,
  Smartphone,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Hero = () => {
  const [currentFeature, setCurrentFeature] = useState(0)
  const features = [
    { icon: <Bot size={18} />, text: 'AI formatting' },
    { icon: <Users size={18} />, text: 'Collaborating teams' },
    { icon: <BarChart3 size={18} />, text: 'Real-time analytics' },
    { icon: <GraduationCap size={18} />, text: 'Auto-grading' },
    { icon: <FileText size={18} />, text: 'Client proposals' },
    { icon: <Smartphone size={18} />, text: 'Interactive online tests' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='relative w-full overflow-hidden bg-white'>
      {/* Modern gradient background */}
      <div className='absolute inset-0 bg-gradient-to-br ' />

      {/* Subtle wave pattern */}
      <div className='absolute inset-0' style={wavePatternStyle} />

      {/* Floating particles */}

      <div className='container relative z-10 px-4 py-6 lg:py-10  mx-auto max-w-7xl'>
        <div className='flex flex-col items-center gap-4 lg:gap-8 lg:flex-row lg:justify-between lg:items-center'>
          {/* Left column - Text content */}
          <motion.div
            className='w-full max-w-xl mb-4 text-center lg:text-left lg:mb-0 lg:flex lg:flex-col lg:justify-between lg:h-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div
                className='inline-flex items-center px-2 py-1 mb-3 space-x-0.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-full shadow-sm sm:px-4 sm:py-2 sm:space-x-2 sm:text-sm'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={16} className='text-gray-600' />
                </motion.div>
                <span className='whitespace-nowrap'>
                  AI-Powered Document Creation & Interactive Testing
                </span>
              </motion.div>

              <motion.h1
                className='mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Create professional{' '}
                <span className='relative inline-block'>
                  <span className='relative z-10'>documents</span>
                  <motion.span
                    className='absolute bottom-1 left-0 w-full h-3 bg-gray-200 rounded-sm -z-10'
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                </span>{' '}
                in minutes,{' '}
                <span className='block sm:inline'>
                  <span className='uppercase text-red-600'>NOT</span> hours
                </span>
              </motion.h1>

              <motion.p
                className='mb-3 text-base text-gray-600 sm:text-lg'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Documnt AI helps educators, students, and professionals generate{' '}
                <span className='whitespace-nowrap'>high-quality</span>{' '}
                materials instantly with powerful AI. Effortlessly produce
                everything from exams and Q&As to{' '}
                <span className='whitespace-nowrap'>
                  commercial trade reports
                </span>
                –supported in 100+ languages.
              </motion.p>

              {/* Rotating features */}
              <motion.div
                className='flex flex-wrap justify-center gap-2 mb-4 lg:gap-3 lg:justify-start'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    className={`flex items-center px-2 py-1 text-xs sm:text-sm font-medium rounded-md ${
                      currentFeature === index
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700'
                    } whitespace-nowrap`}
                    animate={{
                      scale: currentFeature === index ? 1.05 : 1,
                      backgroundColor:
                        currentFeature === index ? '#000000' : '#f3f4f6',
                      color: currentFeature === index ? '#ffffff' : '#374151',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className='mr-2'>{feature.icon}</span>
                    {feature.text}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Buttons moved down with margin-top to align with bottom of right card */}
            <motion.div
              className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4 lg:mt-28'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button
                className='flex items-center justify-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg md:py-2 md:text-sm hover:bg-gray-800'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Try for free
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                >
                  <ArrowRight size={16} className='ml-2' />
                </motion.div>
              </motion.button>
              <motion.button
                className='flex items-center justify-center px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg md:py-2 md:text-sm hover:bg-gray-50'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                See examples
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right column - Enhanced document and test interface - Now visible on all screen sizes */}
          {/* Right column - Enhanced document and test interface */}
          <motion.div
            className='relative w-full max-w-full md:max-w-md lg:max-w-md xl:max-w-lg'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <EnhancedDocumentInterface />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Completely redesigned document interface with app-like experience
const EnhancedDocumentInterface = () => {
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showCheck, setShowCheck] = useState(false)
  const [activeTab, setActiveTab] = useState('document')

  // Handle document generation animation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsGenerating(false)
            setTimeout(() => setShowCheck(true), 300)
            return 100
          }
          return prev + 4
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  return (
    <div className='relative'>
      {/* Background glow effect */}
      <div className='absolute inset-0 bg-blue-50 rounded-full filter blur-3xl opacity-40' />

      {/* Modern UI container */}
      <motion.div
        className='relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-xl mx-4 md:mx-0'
        initial={{ y: 20 }}
        animate={{
          y: [0, -8, 0],
          boxShadow: [
            '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            '0 15px 35px -5px rgba(0, 0, 0, 0.15)',
            '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          ],
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          boxShadow: {
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
      >
        {/* App header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-100'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center justify-center w-8 h-8 bg-black rounded-md'>
              <FileCheck size={16} className='text-white' />
            </div>
            <span className='font-semibold text-gray-800'>Documnt AI</span>
          </div>
          <div className='flex items-center space-x-3'>
            <motion.div
              className='flex items-center px-2 py-1 text-xs font-medium text-white bg-black  rounded-full'
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>AI-Active</span>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-gray-100'>
          <motion.button
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'document'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('document')}
            whileHover={{ backgroundColor: '#f9f9f9' }}
          >
            <div className='flex items-center justify-center'>
              <FileText size={14} className='mr-1' />
              Document
            </div>
          </motion.button>
          <motion.button
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'interactive'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('interactive')}
            whileHover={{ backgroundColor: '#f9f9f9' }}
          >
            <div className='flex items-center justify-center'>
              <GraduationCap size={14} className='mr-1' />
              Interactive Test
            </div>
          </motion.button>
        </div>

        {/* Document preview area - Increased height for mobile */}
        <div className='relative h-128 lg:h-142 overflow-y-auto'>
          <AnimatePresence mode='wait'>
            {activeTab === 'document' ? (
              <motion.div
                key='document'
                className='absolute inset-0 p-3 sm:p-5'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Input area */}
                <div className='mb-4'>
                  <div className='p-2 sm:p-3 mb-2 text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 rounded-lg'>
                    Generate a comprehensive science exam for 10th grade,
                    covering the latest topics in physics and chemistry
                  </div>
                  <div className='flex justify-end'>
                    <motion.button
                      className='flex items-center px-2 sm:px-3 py-2 text-xs font-medium text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-md'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LucideWand2 size={10} className='mr-1' />
                      Regenerate
                    </motion.button>
                  </div>
                </div>

                {/* Document creation interface */}
                <div className='p-2 sm:p-4 border border-gray-200 rounded-lg bg-gray-50'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center'>
                      <FileText className='w-4 h-4 mr-2 text-gray-700' />
                      <div className='text-xs sm:text-sm font-medium text-gray-800'>
                        Science Exam - Grade 10
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Clock size={12} sm:size={14} className='text-gray-400' />
                      <span className='text-xs text-gray-500'>Just now</span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {isGenerating ? (
                    <div className='mb-3'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='text-xs font-medium text-gray-500'>
                          Generating document...
                        </span>
                        <span className='text-xs text-gray-500'>
                          {progress}%
                        </span>
                      </div>
                      <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                        <motion.div
                          className='h-full bg-black'
                          style={{ width: `${progress}%` }}
                          animate={{
                            backgroundColor: ['#000000', '#333333', '#000000'],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      className='flex items-center justify-center py-1 mb-3 text-xs font-medium text-white bg-green-500 rounded-md'
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle size={12} className='mr-1' />
                      Document generated successfully
                    </motion.div>
                  )}

                  {/* Document preview */}
                  <div className='p-2 sm:p-3 bg-white border border-gray-100 rounded-md'>
                    <div className='mb-3 text-xs sm:text-sm font-bold text-center text-gray-800'>
                      Physics and Chemistry Exam
                    </div>

                    {/* Document content with animation */}
                    <div className='space-y-2 sm:space-y-3'>
                      {/* Section header */}
                      <div className='pb-1 mb-1 border-b border-gray-100'>
                        <motion.div
                          className='w-24 h-2 sm:h-3 bg-gray-800 rounded'
                          animate={{
                            width: isGenerating ? ['20%', '100%'] : '100%',
                          }}
                          transition={{ duration: isGenerating ? 1 : 0 }}
                        />
                      </div>

                      {/* Content lines with staggered reveal */}
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className='flex items-start'
                          initial={{ opacity: isGenerating ? 0 : 1 }}
                          animate={{ opacity: progress > i * 20 ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className='w-4 h-4 mt-1 mr-2 text-xs font-bold text-center text-gray-700 bg-gray-100 rounded-full'>
                            {i + 1}
                          </div>
                          <div className='flex-1 space-y-1'>
                            <motion.div
                              className='w-full h-2 bg-gray-300 rounded'
                              animate={{
                                width:
                                  isGenerating && progress < (i + 1) * 20
                                    ? ['0%', '100%']
                                    : '100%',
                              }}
                              transition={{ duration: isGenerating ? 1 : 0 }}
                            />
                            <motion.div
                              className='w-3/4 h-2 bg-gray-200 rounded'
                              animate={{
                                width:
                                  isGenerating && progress < (i + 1) * 20
                                    ? ['0%', '75%']
                                    : '75%',
                              }}
                              transition={{ duration: isGenerating ? 0.8 : 0 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Convert to Interactive Test button */}
                  <motion.button
                    className='flex items-center justify-center w-full px-3 py-2 mt-3 text-xs font-medium text-white bg-gradient-to-br from-blue-600 to-blue-800 rounded-md'
                    whileHover={{ scale: 1.02, backgroundColor: '#1c55f2' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('interactive')}
                  >
                    Convert to Interactive Test
                  </motion.button>
                </div>

                {/* Action buttons */}
                <div className='flex justify-between mt-4 '>
                  <button className='px-2 sm:px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-md'>
                    Preview
                  </button>
                  <div className='flex space-x-2'>
                    <button className='px-2 sm:px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-md'>
                      Edit
                    </button>
                    <motion.button
                      className='px-2 sm:px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-md'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={
                        showCheck
                          ? { backgroundColor: '#16a34a', scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={
                        showCheck
                          ? { duration: 0.5, repeat: 3, repeatType: 'mirror' }
                          : {}
                      }
                    >
                      Download PDF
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='interactive'
                className='p-3 sm:p-5'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Interactive test interface */}
                <div className='p-2 sm:p-4 border border-gray-200 rounded-lg bg-gray-50'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center'>
                      <GraduationCap className='w-4 h-4 mr-2 text-blue-600' />
                      <div className='text-xs sm:text-sm font-medium text-gray-800'>
                        Interactive Science Exam - Grade 10
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                        <CheckCircle size={10} className='mr-1' />
                        Ready
                      </span>
                    </div>
                  </div>

                  {/* Interactive test preview */}
                  <div className='p-2 sm:p-3 bg-white border border-gray-100 rounded-md'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='text-xs sm:text-sm font-bold text-gray-800'>
                        Physics and Chemistry Interactive Test
                      </div>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Timer size={12} />
                        <span>45 min</span>
                      </div>
                    </div>

                    {/* Test settings */}
                    <div className='grid grid-cols-2 gap-2 p-2 mb-3 text-xs bg-gray-50 rounded-md'>
                      <div className='flex items-center text-gray-600'>
                        <LineChart size={12} className='mr-1 text-blue-500' />
                        Analytics
                      </div>
                      <div className='flex items-center text-gray-600'>
                        <Shield size={12} className='mr-1 text-blue-500' />
                        Anti-cheating
                      </div>
                      <div className='flex items-center text-gray-600'>
                        <CheckCircle size={12} className='mr-1 text-blue-500' />
                        Auto-grading
                      </div>
                      <div className='flex items-center text-gray-600'>
                        <Smartphone size={12} className='mr-1 text-blue-500' />
                        Mobile
                      </div>
                    </div>

                    {/* Sample question preview */}
                    <div className='p-2 mb-2 border border-gray-100 rounded-md'>
                      <div className='mb-2 text-xs font-medium text-gray-700'>
                        Question 1
                      </div>
                      <div className='mb-2 text-xs text-gray-600'>
                        Which of the following correctly describes Newton's
                        Second Law of Motion?
                      </div>
                      <div className='space-y-1'>
                        {[
                          'Force equals mass times acceleration',
                          'Objects at rest stay at rest',
                          'For every action there is an equal and opposite reaction',
                          'Energy cannot be created or destroyed',
                        ].map((option, i) => (
                          <div key={i} className='flex items-center'>
                            <div
                              className={`flex-shrink-0 w-3 h-3 mr-2 border rounded-full ${
                                i === 0
                                  ? 'bg-blue-50 border-blue-400'
                                  : 'border-gray-300'
                              }`}
                            ></div>
                            <div className='text-xs text-gray-600'>
                              {option}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='flex justify-center'>
                      <div className='inline-flex items-center px-2 py-1 text-xs text-gray-500'>
                        <span className='font-medium text-blue-600'>5</span>
                        <span className='mx-1'>/</span>
                        <span>20 questions</span>
                      </div>
                    </div>
                  </div>

                  {/* Test distribution */}
                  <div className='mt-3 space-y-3'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                      <div className='text-xs font-medium text-gray-700 mb-1 sm:mb-0'>
                        Test Link
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='px-2 py-1 text-xs bg-gray-100 rounded truncate'>
                          exam.documnt.ai/sci10-28fj3
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                      <div className='text-xs font-medium text-gray-700 mb-1 sm:mb-0'>
                        Analytics
                      </div>
                      <motion.button
                        className='flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded'
                        whileHover={{ backgroundColor: '#dbeafe' }}
                      >
                        <LineChart size={10} className='mr-1' />
                        View dashboard
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className='flex justify-between mt-4'>
                  <button className='px-2 sm:px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-md'>
                    Preview Test
                  </button>
                  <div className='flex space-x-2'>
                    <button className='px-2 sm:px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-md'>
                      Edit
                    </button>
                    <motion.button
                      className='flex items-center px-2 sm:px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md'
                      whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users size={12} className='mr-1' />
                      Share
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Additional features - Scrollable on mobile */}
        <div className='p-2 sm:p-3 bg-gray-50 border-t border-gray-100'>
          <div className='flex overflow-x-auto pb-1 space-x-2 no-scrollbar'>
            {[
              'Related Templates',
              'Share',
              'Analytics Dashboard',
              'AI Feedback',
              'Student Portal',
            ].map((option, i) => (
              <div
                key={i}
                className='flex-shrink-0 px-2 sm:px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md whitespace-nowrap'
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Floating particles background - improved version with more subtle effect

// Subtle wave background pattern
const wavePatternStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.24.19 1.64.39 1.84.39.194 0 .43-.76.606-.142l.448-.086c.352-.13.72-.26.89-.143a.76.76 0 0 1 .484-.056 6.99 6.99 0 0 1 .546-.192 2.03 2.03 0 0 1 .921-.084c.564.057 1.23.214 1.773.143.534-.069 1.033-.286 1.5-.428.459-.143.882-.333 1.344-.142.462.19 1.014.542 1.542.542.53 0 1.084-.35 1.546-.538.462-.188.885 0 1.344.14.459.14.959.36 1.496.43.536.068 1.208-.09 1.77-.145.563-.057 1.03.061.926.083-.106.022-.343.12-.906.19-.563.074-1.231.03-1.77.078-.537.046-1.033.19-1.496.283-.463.092-.886.14-1.342.086-.456-.053-1.012-.248-1.545-.285-.533-.037-1.08.214-1.544.377-.464.164-.882.217-1.344.112-.463-.107-.959-.35-1.498-.437-.538-.087-1.205-.04-1.767.103-.56.142-1.026.378-.926.316.098-.063.34-.199.903-.33.564-.133 1.233-.242 1.77-.3.537-.057 1.04-.082 1.497-.076.458.006.886.075 1.345.19.46.117 1.01.276 1.542.317.533.04 1.084-.07 1.546-.214.462-.143.883-.332 1.344-.332.46 0 .885.188 1.344.33.459.144.959.312 1.496.368.536.056 1.208-.018 1.768-.104.561-.087 1.023-.236.924-.298-.1-.06-.336-.165-.901-.254-.564-.09-1.236-.128-1.77-.154-.536-.025-1.038-.015-1.498.03-.46.047-.885.098-1.347.086-.46-.01-1.01-.12-1.54-.155-.531-.034-1.08.034-1.54.133-.46.098-.875.215-1.342.226-.467.01-.954-.14-1.497-.195-.543-.057-1.239.009-1.77.109-.53.1-.97.253-.873.207.098-.046.323-.135.875-.23.553-.096 1.209-.154 1.765-.195.556-.041 1.058-.05 1.54-.026.483.024.894.083 1.356.162.462.08 1.01.173 1.525.205.515.031 1.12-.043 1.588-.14.468-.098.87-.226 1.343-.226.473 0 .874.128 1.342.226.468.098 1.075.17 1.59.14.515-.032 1.063-.125 1.525-.204.463-.079.874-.138 1.358-.162.483-.024.987-.015 1.544.026.556.04 1.21.098 1.762.195.552.095.775.184.874.23.1.046-.343-.107-.874-.207-.532-.1-1.232-.165-1.774-.108-.543.056-1.032.204-1.5.194-.467-.01-.882-.127-1.34-.226-.46-.1-1.014-.167-1.546-.133-.531.034-1.082.145-1.545.155-.462.01-.887-.039-1.347-.086-.46-.046-.96-.055-1.498-.03-.537.026-1.212.064-1.772.153-.56.088-.8.194-.9.256-.101.06.363.21.927.297.564.086 1.237.16 1.77.104.532-.056 1.034-.225 1.496-.37.462-.142.882-.33 1.342-.33.46 0 .887.19 1.342.333.456.143 1.01.254 1.544.213.535-.04 1.08-.2 1.54-.316.463-.117.886-.185 1.345-.19.46-.006.962.02 1.5.076.536.057 1.21.166 1.77.3.56.13.8.266.897.328.098.063-.366-.173-.925-.316-.56-.142-1.232-.19-1.77-.103-.538.087-1.035.33-1.5.438-.462.104-.883.051-1.34-.112-.46-.162-1.012-.414-1.546-.377-.534.037-1.08.232-1.544.285-.465.05-.882.006-1.344-.086-.462-.092-.96-.237-1.498-.283-.538-.047-1.204-.004-1.77-.078-.56-.07-.798-.168-.902-.19z' fill='%23f7f7f7' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat-x',
  backgroundSize: '100px auto',
}

export default Hero
