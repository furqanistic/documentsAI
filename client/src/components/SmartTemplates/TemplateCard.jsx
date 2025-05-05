import { motion } from 'framer-motion'
import { ArrowRight, Eye, Users } from 'lucide-react'
import React from 'react'

const TemplateCard = ({ template }) => {
  // Enhanced tag styling with more primary colors
  const getTagStyle = () => {
    if (template.tag === 'Popular') {
      return 'bg-amber-500 text-white' // Amber/orange for Popular
    } else if (template.tag === 'Custom') {
      return 'bg-blue-500 text-white' // Primary blue for Custom
    } else if (template.tag === 'Education') {
      return 'bg-sky-500 text-white' // Sky blue for Education
    } else if (template.tag === 'Business') {
      return 'bg-blue-700 text-white' // Darker blue for Business
    } else if (template.tag === 'Academic') {
      return 'bg-blue-400 text-white' // Medium blue for Academic
    } else if (template.tag === 'Finance') {
      return 'bg-green-600 text-white' // Green (primary) for Finance
    } else if (template.tag === 'Accounting') {
      return 'bg-green-500 text-white' // Lighter green for Accounting
    } else if (template.tag === 'Interview') {
      return 'bg-red-600 text-white' // Red (primary) for Interview
    } else if (template.tag === 'Content') {
      return 'bg-blue-300 text-white' // Light blue for Content
    } else {
      return template.tagColor || 'bg-gray-100 text-gray-600'
    }
  }

  // Primary light sky blue color for buttons
  const skyBlueColor = 'bg-sky-400'

  return (
    <motion.div
      variants={{
        hidden: { y: 10, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.1)',
      }}
      className={`bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden h-auto sm:h-[190px] lg:h-[220px] ${
        template.category === 'Custom' ? 'border-t-2 border-t-blue-500' : ''
      }`}
    >
      <div className='p-3 sm:p-4 lg:p-5 flex flex-col h-full relative pb-14 lg:pb-16'>
        <div className='flex items-start justify-between mb-2 sm:mb-3'>
          <div
            className={`p-2 lg:p-3 ${
              template.category === 'Custom' ? 'bg-blue-50' : 'bg-gray-50'
            } rounded-lg`}
          >
            <div className='text-sky-600'>{template.icon}</div>
          </div>
          <span className={`text-xs px-2 py-0.5 ${getTagStyle()} rounded-full`}>
            {template.tag}
          </span>
        </div>
        <h3 className='text-sm sm:text-sm lg:text-base font-semibold text-gray-900 truncate'>
          {template.title}
        </h3>
        <p className='text-xs lg:text-sm text-gray-500 mt-1 lg:mt-2 line-clamp-2'>
          {template.description}
        </p>
        <div className='flex items-center justify-between absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-5 lg:right-5'>
          <span className='text-xs lg:text-sm text-gray-500 flex items-center'>
            <Users className='w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-gray-500 hidden sm:inline' />
            {template.users}
          </span>
          <div className='flex space-x-1 lg:space-x-2'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-2.5 py-1.5 lg:px-3 lg:py-1.5 bg-white border bborder-gray-200 text-gray-700 rounded-md text-xs lg:text-sm font-medium flex items-center justify-center w-18 sm:w-20'
            >
              <Eye className='w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5' />
              <span>View</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-2.5 py-1.5 lg:px-3 lg:py-1.5 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-md text-xs lg:text-sm font-medium flex items-center justify-center w-18 sm:w-20'
            >
              <span>Use</span>
              <ArrowRight className='w-3.5 h-3.5 lg:w-4 lg:h-4 ml-1.5' />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TemplateCard
