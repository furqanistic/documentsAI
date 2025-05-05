import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Book,
  Bookmark,
  BookOpen,
  Brain,
  Briefcase,
  Clock,
  Eye,
  FileText,
  Grid,
  School,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Template data
const templates = [
  {
    id: 1,
    title: 'Exam Generator',
    category: 'Education',
    description:
      'Create comprehensive exams with automatic grading capabilities.',
    tags: ['Education', 'Exams', 'Multiple Choice'],
    icon: School,
  },
  {
    id: 2,
    title: 'Interview Question Pack',
    category: 'Professional',
    description:
      'Generate tailored interview questions for any role or position.',
    tags: ['Professional', 'Interview', 'HR'],
    icon: Users,
  },
  {
    id: 3,
    title: 'Study Guide Generator',
    category: 'Education',
    description:
      'Create comprehensive study guides from your course materials.',
    tags: ['Education', 'Study', 'Notes'],
    icon: Brain,
  },
  {
    id: 4,
    title: 'Business Proposal',
    category: 'Professional',
    description:
      'Professional business proposal templates with customizable sections.',
    tags: ['Professional', 'Business', 'Proposal'],
    icon: Briefcase,
  },
  {
    id: 5,
    title: 'Essay Examination',
    category: 'Education',
    description:
      'Create open-ended essay exams with detailed rubrics for assessment.',
    tags: ['Education', 'Essays', 'Assessment'],
    icon: FileText,
  },
  {
    id: 6,
    title: 'Research Report',
    category: 'Academic',
    description: 'Structured research report templates with proper formatting.',
    tags: ['Academic', 'Research', 'Report'],
    icon: Award,
  },
  {
    id: 7,
    title: 'Weekly Quiz',
    category: 'Education',
    description:
      'Quick quiz templates for regular knowledge checks and classroom engagement.',
    tags: ['Education', 'Quiz', 'Weekly'],
    icon: Clock,
  },
  {
    id: 8,
    title: 'Project Brief',
    category: 'Professional',
    description:
      'Clear and concise project brief templates for team alignment.',
    tags: ['Professional', 'Project', 'Brief'],
    icon: Bookmark,
  },
]

// Category chips - updated to match SmartTemplatesPage
const categories = [
  { name: 'All', icon: Grid, active: true },
  { name: 'Academic', icon: BookOpen, active: false },
  { name: 'Education', icon: Book, active: false },
  { name: 'Professional', icon: Briefcase, active: false },
]

const TemplateGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [filteredTemplates, setFilteredTemplates] = useState(templates)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const dropdownRef = React.useRef(null)

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMobileFilter(false)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [dropdownRef])

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Filter templates based on active category
  useEffect(() => {
    const results = templates.filter((template) => {
      const matchesCategory =
        activeCategory === 'All' || template.category === activeCategory

      return matchesCategory
    })

    setFilteredTemplates(results)
  }, [activeCategory])

  return (
    <div className='py-8 lg:py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <motion.div
            className='inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-5 space-x-1.5 md:space-x-2 text-xs md:text-sm font-medium text-gray-700 bg-white rounded-full shadow-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FileText size={16} className='text-gray-500' />
            <span>Ready-to-Use</span>
          </motion.div>

          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900'>
            Templates Gallery
          </h2>
          <p className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'>
            Choose from our collection of templates or easily design your own,
            creating quality work in only minutes.
          </p>
        </motion.div>

        {/* Category filter - Updated to match SmartTemplatesPage with mobile dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='mb-6 md:mb-10'
        >
          {/* Mobile filter dropdown */}
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-bold text-gray-900 sm:hidden'>
              Templates
            </h2>

            {/* Mobile Dropdown */}
            <div className='relative sm:hidden' ref={dropdownRef}>
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className='flex items-center justify-between w-32 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none'
              >
                <span className='flex items-center'>
                  <span className='mr-1.5'>
                    {(() => {
                      const ActiveIcon = categories.find(
                        (c) => c.name === activeCategory
                      )?.icon
                      return ActiveIcon ? (
                        <ActiveIcon className='w-4 h-4' />
                      ) : null
                    })()}
                  </span>
                  <span className='truncate'>{activeCategory}</span>
                </span>
                <svg
                  className='w-4 h-4 ml-1'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='absolute z-10 w-32 mt-1 bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none'
                >
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      onClick={() => {
                        setActiveCategory(category.name)
                        setShowMobileFilter(false)
                      }}
                      className={`flex items-center px-3 py-1.5 text-xs cursor-pointer ${
                        activeCategory === category.name
                          ? 'bg-gray-100 text-gray-900 rounded-md mx-1'
                          : 'text-gray-700 hover:bg-gray-50 hover:rounded-md hover:mx-1'
                      }`}
                    >
                      <span className='mr-1.5'>
                        <category.icon className='w-4 h-4 ' />
                      </span>
                      <span className='truncate'>{category.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop Category Chips */}
          <div
            className='hidden sm:flex sm:flex-wrap sm:gap-2 justify-center'
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-1.5 rounded-full flex items-center text-sm font-medium ${
                  activeCategory === category.name
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <category.icon className='w-4 h-4 mr-2' />
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className='mt-8'>
          {filteredTemplates.length === 0 ? (
            <div className='text-center py-16 bg-white rounded-xl border border-gray-200'>
              <p className='text-xl text-gray-600'>
                No templates found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
              {filteredTemplates
                .slice(0, isMobile ? 4 : filteredTemplates.length)
                .map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * (index % 4) }}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
                    }}
                    className='bg-white rounded-xl overflow-hidden border border-gray-200 transition-all group'
                  >
                    <div className='relative'>
                      <div className='h-20 md:h-28 bg-gray-100 flex items-center justify-center overflow-hidden'>
                        <motion.div
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05, rotate: 3 }}
                          transition={{ duration: 0.3 }}
                          className='p-2.5 md:p-4 rounded-full bg-black shadow-md border border-gray-100'
                        >
                          <template.icon
                            size={24}
                            className='md:size-7 text-white'
                          />
                        </motion.div>
                      </div>
                    </div>
                    <div className='p-4 md:p-5 flex flex-col h-52 md:h-52'>
                      <div className='flex-1 flex flex-col'>
                        <h3 className='text-sm md:text-lg font-semibold mb-2 text-gray-800 group-hover:text-gray-700 line-clamp-1'>
                          {template.title}
                        </h3>
                        <div className='mb-2 overflow-y-auto max-h-20 md:max-h-none'>
                          <p className='text-gray-500 text-xs md:text-sm md:line-clamp-2'>
                            {template.description}
                          </p>
                        </div>
                      </div>

                      <div className='mt-auto'>
                        <div className='flex flex-wrap gap-1.5 md:gap-2 mb-3'>
                          {template.tags
                            .slice(0, isMobile ? 1 : 2)
                            .map((tag) => (
                              <span
                                key={tag}
                                className='text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full'
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className='flex items-center justify-center text-xs md:text-sm font-medium text-gray-700 bg-white px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-all hover:bg-gray-100 border border-gray-200 w-full'
                          >
                            <Eye className='w-4 h-4 md:w-4 md:h-4 mr-1.5 sm:block hidden' />
                            <span>View</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            className='flex items-center justify-center text-xs md:text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-blue-800 px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg transition-all hover:bg-gray-900 w-full'
                          >
                            <span>Use</span>
                            <ArrowRight className='w-4 h-4 md:w-4 md:h-4 ml-1.5 sm:block hidden' />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateGallery
