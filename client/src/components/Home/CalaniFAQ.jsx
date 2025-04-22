import { motion } from 'framer-motion'
import {
  CheckCircle,
  Code,
  FileText,
  HelpCircle,
  Minus,
  Plus,
  School,
  Shield,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'
const CalaniFAQ = () => {
  // Track only one open item at a time
  const [openItemIndex, setOpenItemIndex] = useState(null)
  const toggleQuestion = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index)
  }
  // FAQ items
  const faqItems = [
    {
      question: 'What is Calani AI?',
      answer:
        'Calani AI is an AI-powered document development platform that helps educators, students, and professionals instantly produce high-quality materials. We combine specialized templates with powerful AI models to generate superior documents in minutes rather than hours.',
      icon: <Zap size={18} className='text-purple-500' />,
    },
    {
      question: 'How does Calani work?',
      answer:
        'Simply describe what you need, and Calani handles the entire process—from content creation to professional formatting. Our AI analyzes your requirements and generates tailored content that can be exported as ready-to-use files.',
      icon: <Code size={18} className='text-blue-500' />,
    },
    {
      question: 'What types of documents can I create?',
      answer:
        'Calani AI can help you create exams, smart study guides, lesson plans, and interview questions. As well as corporate training manuals, strategic business plans, technical reports and many other educational and professional materials.',
      icon: <FileText size={18} className='text-gray-500' />,
    },
    {
      question: 'Can I convert my exams to online tests?',
      answer:
        'Yes! Educators can convert AI-generated exams into interactive online tests with a single click. Share a secure link with students, who can take the test digitally from any device.',
      icon: <School size={18} className='text-green-500' />,
    },
    {
      question: 'Does Calani AI grade student responses?',
      answer:
        'Absolutely. Our platform auto-grades responses, provides instant analytics, and supports anti-cheating measures like we set time limits, mix up questions for each student, block copying text, and can tell if students leave the test page or open new tabs. These tools help teachers get honest results they can trust.',
      icon: <CheckCircle size={18} className='text-teal-500' />,
    },
    {
      question: 'How secure is the platform?',
      answer:
        'Calani AI takes security seriously. We implement robust encryption, secure authentication, and privacy controls to ensure your documents and student data remain confidential and protected.',
      icon: <Shield size={18} className='text-red-500' />,
    },
  ]
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  }
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }
  return (
    <div className='w-full bg-gray-50 px-4 py-10 md:px-6 lg:px-8 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute top-0 left-0 w-64 h-64 bg-gray-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2'></div>
      <div className='absolute bottom-0 right-0 w-56 h-56 bg-gray-300 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2'></div>
      {/* Header */}
      <motion.div
        className='max-w-4xl mx-auto text-center mb-8 relative z-10'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='inline-flex items-center px-2 md:px-4 py-1 md:py-2 mb-3 md:mb-4 space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-gray-800 bg-white rounded-full shadow-sm'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <HelpCircle size={16} className='text-gray-600' />
          <span>Questions, Answered</span>
        </motion.div>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-3'>
          Frequently Asked Questions
        </h2>
        <p className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'>
          Get quick answers to common questions about Calani's AI-powered
          document creation platform.
        </p>
      </motion.div>
      {/* FAQ Items */}
      <motion.div
        className='max-w-4xl mx-auto relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='flex flex-col gap-3 md:max-w-none'>
          {/* Important: Mobile layout is vertical with added gap between items */}
          <div className='md:hidden space-y-3'>
            {faqItems.map((item, index) => (
              <FAQ_Item
                key={index}
                item={item}
                index={index}
                isOpen={openItemIndex === index}
                toggleQuestion={toggleQuestion}
                variants={itemVariants}
              />
            ))}
          </div>
          {/* Desktop layout manually split into two columns */}
          <div className='hidden md:flex md:gap-3'>
            {/* Left column - even indexed items */}
            <div className='flex-1 flex flex-col gap-3'>
              {faqItems
                .filter((_, i) => i % 2 === 0)
                .map((item, i) => {
                  const originalIndex = i * 2 // Calculate original index
                  return (
                    <FAQ_Item
                      key={originalIndex}
                      item={item}
                      index={originalIndex}
                      isOpen={openItemIndex === originalIndex}
                      toggleQuestion={toggleQuestion}
                      variants={itemVariants}
                    />
                  )
                })}
            </div>
            {/* Right column - odd indexed items */}
            <div className='flex-1 flex flex-col gap-3'>
              {faqItems
                .filter((_, i) => i % 2 === 1)
                .map((item, i) => {
                  const originalIndex = i * 2 + 1 // Calculate original index
                  return (
                    <FAQ_Item
                      key={originalIndex}
                      item={item}
                      index={originalIndex}
                      isOpen={openItemIndex === originalIndex}
                      toggleQuestion={toggleQuestion}
                      variants={itemVariants}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Bottom Section */}
      <motion.div
        className='mt-6 text-center relative z-10'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='inline-flex items-center space-x-3'>
          <div className='h-px w-12 bg-gray-300'></div>
          <p className='text-xs text-gray-500'>Need more help?</p>
          <div className='h-px w-12 bg-gray-300'></div>
        </div>
        <div className='mt-3'>
          <button className='bg-black text-white text-xs px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm'>
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  )
}
// Extract FAQ item as a separate component for cleaner code
const FAQ_Item = ({ item, index, isOpen, toggleQuestion, variants }) => {
  return (
    <motion.div
      variants={variants}
      className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full'
    >
      <button
        onClick={() => toggleQuestion(index)}
        className='flex items-center justify-between w-full px-4 py-3 text-left'
      >
        <div className='flex items-center'>
          <span className='mr-3 p-1.5 rounded-md'>{item.icon}</span>
          <h3 className='font-medium text-gray-900 text-sm'>{item.question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 0 }}
          transition={{ duration: 0.2 }}
          className='text-gray-400'
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </motion.div>
      </button>
      {/* Content area */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='px-4 py-3 text-gray-600 text-xs border-t border-gray-100 bg-gray-50'
        >
          {item.answer}
        </motion.div>
      )}
    </motion.div>
  )
}
export default CalaniFAQ
