import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileSearch,
  FileText,
  LineChart,
  Link as LinkIcon,
  LockKeyhole,
  MousePointerClick,
  PenTool,
  Share2,
  Shuffle,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'

// Add standard tailwind only
const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('educator')

  const tabs = [
    { id: 'educator', label: 'For Educators' },
    { id: 'student', label: 'For Students' },
    { id: 'professional', label: 'For Professionals' },
  ]

  return (
    <div className='w-full bg-gray-50 py-2 sm:py-4 px-2 sm:px-4'>
      <div className='container mx-auto max-w-7xl'>
        {/* Section header with animated underline */}
        <div className='mb-12 text-center'>
          <motion.div
            className='inline-flex items-center px-3 py-1 mb-3 md:mb-4 space-x-1 text-xs font-medium text-gray-800 bg-white rounded-full shadow-sm sm:px-4 sm:py-2 sm:space-x-2 sm:text-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <BrainCircuit size={16} className='text-gray-600' />
            <span>Quick & Easy Conversion</span>
          </motion.div>

          <motion.h2
            className='text-2xl md:text-3xl lg:text-4xl font-bold mb-3'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className='relative'>One-Click Digital Assessment</span>
          </motion.h2>

          <motion.p
            className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transform anything from business topics to diverse subject matter
            into extensive educational content, thorough market analysis
            reports, and many other types of documents with just one click.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className='flex justify-center mb-6 md:mb-10 px-1'>
          <div className='inline-flex p-1 bg-white rounded-lg shadow-sm w-full max-w-md'>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`relative flex-1 px-1 sm:px-2 md:px-6 py-1 sm:py-2 text-xs xs:text-xs md:text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: activeTab !== tab.id ? 1.03 : 1 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className='absolute inset-0 bg-black rounded-md'
                    layoutId='activetab'
                    initial={false}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <span className='relative z-10 truncate'>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className='relative'>
          {/* Educator View */}
          <motion.div
            className={`${activeTab === 'educator' ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeTab === 'educator' ? 1 : 0,
              y: activeTab === 'educator' ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 items-center'>
              {/* Left side: Features */}
              <div className='space-y-4 sm:space-y-6'>
                <motion.h3
                  className='text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Create once, use everywhere
                </motion.h3>

                <motion.div
                  className='space-y-3 sm:space-y-6'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {[
                    {
                      icon: (
                        <AlertTriangle size={18} className='sm:w-5 sm:h-5' />
                      ),
                      title: 'Anti-Cheating Measures',
                      description:
                        'Time limits, randomized questions, and browser monitoring',
                    },
                    {
                      icon: (
                        <MousePointerClick
                          size={18}
                          className='sm:w-5 sm:h-5'
                        />
                      ),
                      title: 'Convenient Drag & Drop',
                      description:
                        'Easily organize and arrange content with intuitive controls',
                    },
                    {
                      icon: <BarChart3 size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Instant Analytics',
                      description:
                        'Get real-time performance insights and detailed reports',
                    },
                    {
                      icon: <LinkIcon size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Secure Sharing',
                      description:
                        'Share access via secure links or integration with your LMS',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className='flex items-center p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100'
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div className='flex-shrink-0 mt-0.5 sm:mt-0.5 md:mt-0'>
                        <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4 bg-gray-100 rounded-lg'>
                          <div className='text-gray-700 flex items-center justify-center'>
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className='text-2xs xs:text-sm sm:text-base font-bold text-gray-800'>
                          {feature.title}
                        </h4>
                        <p className='text-xs sm:text-sm md:text-base text-gray-600'>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className='mt-6 sm:mt-10'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    className='inline-flex items-center justify-center px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm font-medium text-white transition-colors bg-black rounded-lg hover:bg-gray-800'
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try it now
                  </motion.button>
                </motion.div>
              </div>

              {/* Right side: Interactive demo */}
              <motion.div
                className='relative bg-white p-1 rounded-2xl border border-gray-200 shadow-lg'
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Document preview with test conversion UI */}
                <div className='rounded-xl overflow-hidden'>
                  {/* Header */}
                  <div className='bg-gray-900 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between text-white'>
                    <div className='flex items-center min-w-0'>
                      <FileText
                        size={12}
                        className='mr-1 sm:mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                      />
                      <span className='font-medium text-xs sm:text-sm truncate'>
                        Physics Exam - Grade 10
                      </span>
                    </div>
                    <div className='flex items-center space-x-1 sm:space-x-2 flex-shrink-0'>
                      <div className='flex items-center text-xs'>
                        <Users
                          size={10}
                          className='mr-1 flex-shrink-0 sm:w-3 sm:h-3'
                        />
                        <span className='text-xs whitespace-nowrap'>
                          28 students
                        </span>
                      </div>
                      <motion.div
                        className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0'
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-3 sm:p-5 space-y-3 sm:space-y-5'>
                    {/* Conversion panel */}
                    <motion.div
                      className='border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 bg-gray-50'
                      whileHover={{ y: -2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <div className='flex justify-between items-center mb-2 sm:mb-3 md:mb-4'>
                        <div className='flex items-center min-w-0 mr-2'>
                          <BrainCircuit
                            size={12}
                            className='text-gray-700 mr-1 sm:mr-2 flex-shrink-0 sm:w-3.5 sm:h-3.5'
                          />
                          <span className='font-medium text-gray-800 text-2xs xs:text-xs sm:text-sm truncate'>
                            Convert to Interactive Test
                          </span>
                        </div>
                        <motion.button
                          className='flex items-center px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md whitespace-nowrap flex-shrink-0'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Convert
                        </motion.button>
                      </div>

                      <div className='grid grid-cols-2 gap-2 sm:gap-3 md:gap-4'>
                        <div className='flex items-center bg-gray-50 p-2 rounded-md border border-gray-100'>
                          <Clock
                            size={14}
                            className='text-gray-500 mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                          />
                          <span className='text-xs sm:text-sm text-gray-600 truncate'>
                            45 min time limit
                          </span>
                        </div>
                        <div className='flex items-center bg-gray-50 p-2 rounded-md border border-gray-100'>
                          <Shuffle
                            size={14}
                            className='text-gray-500 mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                          />
                          <span className='text-xs sm:text-sm text-gray-600 truncate'>
                            Randomize questions
                          </span>
                        </div>
                        <div className='flex items-center bg-gray-50 p-2 rounded-md border border-gray-100'>
                          <CheckCircle2
                            size={14}
                            className='text-gray-500 mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                          />
                          <span className='text-xs sm:text-sm text-gray-600 truncate'>
                            Auto grading
                          </span>
                        </div>
                        <div className='flex items-center bg-gray-50 p-2 rounded-md border border-gray-100'>
                          <LockKeyhole
                            size={14}
                            className='text-gray-500 mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                          />
                          <span className='text-xs sm:text-sm text-gray-600 truncate'>
                            Prevent tab switching
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Document content preview */}
                    <div className='space-y-3 sm:space-y-4'>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className='font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2'>
                          Multiple Choice Questions
                        </div>
                        <div className='bg-white p-2 sm:p-3 border border-gray-200 rounded-md'>
                          <div className='text-xs sm:text-sm md:text-base text-gray-700 mb-1.5 sm:mb-2'>
                            1. A 5kg object accelerates at 2m/s² when a force is
                            applied. What is the magnitude of the force?
                          </div>
                          <div className='space-y-1 sm:space-y-1.5 pl-2 sm:pl-3 md:pl-4'>
                            {['A. 2.5 N', 'B. 5 N', 'C. 10 N', 'D. 25 N'].map(
                              (option, idx) => (
                                <div key={idx} className='flex items-center'>
                                  <div className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 rounded-full border border-gray-300'></div>
                                  <span className='text-xs sm:text-sm text-gray-600'>
                                    {option}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className='font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2'>
                          Short Answer Questions
                        </div>
                        <div className='bg-white p-2 sm:p-3 border border-gray-200 rounded-md'>
                          <div className='text-xs sm:text-sm md:text-base text-gray-700 mb-1.5 sm:mb-2'>
                            2. Define Newton's Third Law and provide a
                            real-world example.
                          </div>
                          <div className='h-8 sm:h-10 md:h-14 bg-gray-50 rounded-md border border-gray-200'></div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Sharing options */}
                    <div className='pt-2 sm:pt-3 border-t border-gray-100'>
                      <div className='flex justify-between items-center'>
                        <div className='text-xs sm:text-sm font-medium text-gray-700'>
                          Share with students
                        </div>
                        <ChevronDown
                          size={14}
                          className='text-gray-500 sm:w-4 sm:h-4'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Student View - UPDATED to fix mobile/desktop layout */}
          <motion.div
            className={`${activeTab === 'student' ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeTab === 'student' ? 1 : 0,
              y: activeTab === 'student' ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 items-center'>
              {/* Left side: Features for students - Order modified for mobile */}
              <div className='space-y-4 sm:space-y-6 order-1 lg:order-2'>
                <motion.h3
                  className='text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  A better testing experience
                </motion.h3>

                <motion.div
                  className='space-y-3 sm:space-y-6'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {[
                    {
                      icon: <Smartphone size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Device Flexibility',
                      description:
                        'Take tests from any device - desktop, tablet, or mobile',
                    },
                    {
                      icon: (
                        <CheckCircle2 size={18} className='sm:w-5 sm:h-5' />
                      ),
                      title: 'Instant Feedback',
                      description:
                        'See results and explanations immediately after submission',
                    },
                    {
                      icon: <LineChart size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Progress Tracking',
                      description:
                        'Monitor performance and identify areas for improvement',
                    },
                    {
                      icon: <Clock size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Time Management',
                      description:
                        'Clear timing information helps pace through questions',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className='flex items-center p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100'
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4 bg-gray-100 rounded-lg flex-shrink-0 mt-0.5 xs:mt-0'>
                        <div className='text-gray-700'>{feature.icon}</div>
                      </div>
                      <div>
                        <h4 className='text-2xs xs:text-sm sm:text-base font-bold text-gray-800'>
                          {feature.title}
                        </h4>
                        <p className='text-xs sm:text-sm md:text-base text-gray-600'>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Added "Try it now" button for students */}
                <motion.div
                  className='mt-6 sm:mt-10'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    className='inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition-colors bg-black rounded-lg hover:bg-gray-800'
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try it now
                  </motion.button>
                </motion.div>
              </div>

              {/* Right side: Interactive test interface - Order modified for mobile */}
              <motion.div
                className='relative bg-white p-1 rounded-2xl border border-gray-200 shadow-lg order-2 lg:order-1'
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Test interface for students */}
                <div className='rounded-xl overflow-hidden'>
                  {/* Header */}
                  <div className='bg-gray-900 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between text-white'>
                    <div className='flex items-center min-w-0'>
                      <FileText
                        size={12}
                        className='mr-1 sm:mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                      />
                      <span className='font-medium text-xs sm:text-sm truncate'>
                        Physics Exam - Grade 10
                      </span>
                    </div>
                    <div className='flex items-center space-x-1 sm:space-x-3 flex-shrink-0'>
                      <div className='flex items-center text-xs'>
                        <Clock
                          size={10}
                          className='mr-1 flex-shrink-0 sm:w-3 sm:h-3'
                        />
                        <span className='text-xs whitespace-nowrap'>
                          32:15 remaining
                        </span>
                      </div>
                      <motion.div
                        className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0'
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-3 sm:p-5 space-y-3 sm:space-y-5'>
                    {/* Progress indicator */}
                    <div className='mb-3 sm:mb-4'>
                      <div className='flex items-center justify-between mb-1.5 sm:mb-2'>
                        <div className='text-xs sm:text-sm font-medium text-gray-700'>
                          Progress
                        </div>
                        <div className='text-2xs xs:text-xs sm:text-sm text-gray-500'>
                          5/15 questions
                        </div>
                      </div>
                      <div className='w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden'>
                        <motion.div
                          className='h-full bg-black'
                          style={{ width: '33%' }}
                        />
                      </div>
                    </div>

                    {/* Current question */}
                    <div className='bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200'>
                      <div className='text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-800 mb-2 sm:mb-4'>
                        Question 5
                      </div>
                      <div className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-3 sm:mb-5'>
                        A 5kg object accelerates at 2m/s² when a force is
                        applied. What is the magnitude of the force?
                      </div>

                      <div className='space-y-2 sm:space-y-3 mb-4 sm:mb-6'>
                        {['A. 2.5 N', 'B. 5 N', 'C. 10 N', 'D. 25 N'].map(
                          (option, idx) => (
                            <motion.div
                              key={idx}
                              className={`flex items-center p-2 sm:p-3 rounded-md border ${
                                idx === 2
                                  ? 'border-black bg-gray-100'
                                  : 'border-gray-200 bg-white'
                              } cursor-pointer`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div
                                className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 rounded-full border-2 flex items-center justify-center ${
                                  idx === 2 ? 'border-black' : 'border-gray-300'
                                }`}
                              >
                                {idx === 2 && (
                                  <motion.div
                                    className='w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full'
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      type: 'spring',
                                      stiffness: 500,
                                      damping: 30,
                                    }}
                                  />
                                )}
                              </div>
                              <span className='text-xs sm:text-sm text-gray-700'>
                                {option}
                              </span>
                            </motion.div>
                          )
                        )}
                      </div>

                      <div className='flex justify-between'>
                        <motion.button
                          className='px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-md'
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Previous
                        </motion.button>
                        <motion.button
                          className='px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md'
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Next Question
                        </motion.button>
                      </div>
                    </div>

                    {/* Question navigation */}
                    <div className='flex flex-wrap gap-1 sm:gap-2'>
                      {[...Array(15)].map((_, idx) => (
                        <motion.div
                          key={idx}
                          className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-medium ${
                            idx < 5
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {idx + 1}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Professional View - UPDATED with consistent text sizes */}
          <motion.div
            className={`${activeTab === 'professional' ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeTab === 'professional' ? 1 : 0,
              y: activeTab === 'professional' ? 0 : 20,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 items-center'>
              {/* Left side: Features for professionals */}
              <div className='space-y-4 sm:space-y-6'>
                <motion.h3
                  className='text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Elevate business documents
                </motion.h3>

                <motion.div
                  className='space-y-3 sm:space-y-6'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {[
                    {
                      icon: <FileSearch size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Customizable Templates',
                      description:
                        'Personalize industry-specific templates always your way',
                    },
                    {
                      icon: <Briefcase size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Professional Polish',
                      description:
                        'Ensure consistent branding and formatting across all materials',
                    },
                    {
                      icon: <Share2 size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Seamless Collaboration',
                      description:
                        'Share and co-edit documents with team members in real-time',
                    },
                    {
                      icon: <Star size={18} className='sm:w-5 sm:h-5' />,
                      title: 'Tailored Solutions',
                      description:
                        'Specialized tools and features designed for your industry needs',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className='flex items-center p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100'
                      whileHover={{
                        y: -4,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <div className='flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 md:mr-4 bg-gray-100 rounded-lg flex-shrink-0 mt-0.5 xs:mt-0'>
                        <div className='text-gray-700'>{feature.icon}</div>
                      </div>
                      <div>
                        <h4 className='text-2xs xs:text-sm sm:text-base font-bold text-gray-800'>
                          {feature.title}
                        </h4>
                        <p className='text-xs sm:text-sm md:text-base text-gray-600'>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Added "Try it now" button for professionals */}
                <motion.div
                  className='mt-6 sm:mt-10'
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.button
                    className='inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white transition-colors bg-black rounded-lg hover:bg-gray-800'
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try it now
                  </motion.button>
                </motion.div>
              </div>

              {/* Right side: Professional document interface */}
              <motion.div
                className='relative bg-white p-1 rounded-2xl border border-gray-200 shadow-lg'
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {/* Document creation interface for professionals */}
                <div className='rounded-xl overflow-hidden'>
                  {/* Header */}
                  <div className='bg-gray-900 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between text-white'>
                    <div className='flex items-center min-w-0'>
                      <FileText
                        size={12}
                        className='mr-1 sm:mr-2 flex-shrink-0 sm:w-4 sm:h-4'
                      />
                      <span className='font-medium text-xs sm:text-sm truncate'>
                        Market Analysis Report
                      </span>
                    </div>
                    <div className='flex items-center space-x-1 sm:space-x-3 flex-shrink-0'>
                      <div className='flex items-center text-xs'>
                        <Users
                          size={10}
                          className='mr-1 flex-shrink-0 sm:w-3 sm:h-3'
                        />
                        <span className='text-xs whitespace-nowrap'>
                          3 collaborators
                        </span>
                      </div>
                      <motion.div
                        className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 flex-shrink-0'
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='p-3 sm:p-5 space-y-3 sm:space-y-5'>
                    {/* AI Creation panel */}
                    <motion.div
                      className='border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50'
                      whileHover={{ y: -2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <div className='flex justify-between items-center mb-2 sm:mb-3 md:mb-4'>
                        <div className='flex items-center min-w-0 mr-2'>
                          <BrainCircuit
                            size={12}
                            className='text-gray-700 mr-1 sm:mr-2 flex-shrink-0 sm:w-3.5 sm:h-3.5'
                          />
                          <span className='font-medium text-gray-800 text-2xs xs:text-xs sm:text-sm truncate'>
                            AI Document Generation
                          </span>
                        </div>
                        <motion.button
                          className='flex items-center px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md whitespace-nowrap flex-shrink-0'
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Generate
                        </motion.button>
                      </div>

                      <div className='text-xs sm:text-sm md:text-base text-gray-600 mb-1.5 sm:mb-2'>
                        "Create a detailed market analysis report for the tech
                        industry in Q2 2025..."
                      </div>

                      <div className='flex flex-wrap gap-1 sm:gap-2'>
                        {[
                          'Professional',
                          'Concise',
                          'Data-driven',
                          'Visual',
                        ].map((tag, idx) => (
                          <div
                            key={idx}
                            className='px-1 sm:px-2 py-0.5 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-md'
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Document preview */}
                    <div className='space-y-3 sm:space-y-4'>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className='font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2'>
                          Document Preview
                        </div>
                        <div className='bg-white p-2 sm:p-3 border border-gray-200 rounded-md'>
                          {/* Document title */}
                          <div className='text-sm font-bold text-gray-800 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-gray-100'>
                            Tech Industry Market Analysis: Q2 2025
                          </div>

                          {/* Document sections */}
                          <div className='space-y-2 sm:space-y-3'>
                            <div className='font-medium text-xs sm:text-sm text-gray-700'>
                              Executive Summary
                            </div>
                            <div className='h-5 sm:h-6 md:h-10 bg-gray-50 rounded-md border border-gray-200'></div>

                            <div className='font-medium text-xs sm:text-sm text-gray-700'>
                              AI Market Trends
                            </div>
                            <div className='h-5 sm:h-6 md:h-10 bg-gray-50 rounded-md border border-gray-200'></div>

                            <div className='h-12 sm:h-16 md:h-24 bg-gray-50 rounded-md border border-gray-200 mt-2 sm:mt-3'></div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className='font-medium text-xs sm:text-sm text-gray-800 mb-1.5 sm:mb-2'>
                          Export Options
                        </div>
                        <div className='flex flex-wrap gap-1 sm:gap-2'>
                          {['PDF', 'DOCX', 'HTML', 'Presentation'].map(
                            (format, idx) => (
                              <motion.div
                                key={idx}
                                className='flex items-center p-1.5 sm:p-2 bg-white rounded-md border border-gray-200 text-[9px] xxs:text-[10px] xs:text-2xs sm:text-xs cursor-pointer'
                                whileHover={{
                                  scale: 1.05,
                                  backgroundColor: '#f9fafb',
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className='w-3 h-3 sm:w-4 sm:h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 bg-gray-100 rounded-md flex items-center justify-center'>
                                  <FileText
                                    size={8}
                                    className='text-gray-600 sm:w-2.5 sm:h-2.5'
                                  />
                                </div>
                                {format}
                              </motion.div>
                            )
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Collaboration section */}
                    <div className='pt-2 sm:pt-3 border-t border-gray-100'>
                      <div className='flex justify-between items-center'>
                        <div className='text-xs sm:text-sm font-medium text-gray-700'>
                          Share with team
                        </div>
                        <div className='flex -space-x-1 sm:-space-x-1.5 md:-space-x-2'>
                          {[...Array(3)].map((_, idx) => (
                            <div
                              key={idx}
                              className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gray-300 border-2 border-white'
                            ></div>
                          ))}
                          <div className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs sm:text-sm text-gray-500'>
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats section - Improved design without icons */}
        <motion.div
          className='mt-8 sm:mt-12 md:mt-20 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[
            { value: '97%', label: 'Completion rate' },
            { value: '85%', label: 'Time saved' },
            { value: '10x', label: 'Faster feedback' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className='relative bg-white overflow-hidden p-2.5 sm:p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center h-full'
              whileHover={{
                y: -5,
                boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fafafa',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Decorative background element */}
              <motion.div
                className='absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-50 -m-6'
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: idx * 1.5,
                }}
              />

              {/* Value with improved animation */}
              <motion.div
                className='text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1 md:mb-2'
                animate={{
                  scale: [1, 1.05, 1],
                  color: ['#1f2937', '#000000', '#1f2937'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: idx * 0.5,
                }}
              >
                {stat.value}
              </motion.div>

              {/* Label with improved text size */}
              <div className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 relative z-10'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default HowItWorks
