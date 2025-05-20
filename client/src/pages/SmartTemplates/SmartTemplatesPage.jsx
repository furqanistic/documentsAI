import SmartHeader from '@/components/SmartTemplates/SmartHeader'
import TemplateCard from '@/components/SmartTemplates/TemplateCard'
import { motion } from 'framer-motion'
import {
  Book,
  BookOpen,
  Briefcase,
  Calculator,
  DollarSign,
  Eye,
  FilePlus,
  FileText,
  Grid,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Layout/Layout'

const SmartTemplatesPage = () => {
  // State to track selected category
  const [selectedCategory, setSelectedCategory] = useState('All')
  // State for mobile dropdown
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  // Ref for dropdown
  const dropdownRef = useRef(null)

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

  // Updated icon sizes to match ExamplesPage
  const templateCategories = [
    {
      id: 0,
      title: 'All',
      icon: <Grid className='w-4 h-4' />,
      popular: 'View all templates',
    },
    {
      id: 1,
      title: 'Education',
      icon: <Book className='w-4 h-4' />,
      popular: 'Exams, Study Guides',
    },
    {
      id: 2,
      title: 'Professional',
      icon: <Briefcase className='w-4 h-4' />,
      popular: 'Reports, Presentations',
    },
    {
      id: 3,
      title: 'Academic',
      icon: <BookOpen className='w-4 h-4' />,
      popular: 'Research Papers, Citations',
    },
    {
      id: 4,
      title: 'Finance',
      icon: <DollarSign className='w-4 h-4' />,
      popular: 'Budgets, Forecasts',
    },
    {
      id: 5,
      title: 'Accounting',
      icon: <Calculator className='w-4 h-4' />,
      popular: 'Statements, Reports',
    },
    {
      id: 6,
      title: 'Interview',
      icon: <Users className='w-4 h-4' />,
      popular: 'Questions, Evaluation Forms',
    },
    {
      id: 7,
      title: 'Content',
      icon: <FileText className='w-4 h-4' />,
      popular: 'Blog Posts, Articles',
    },
    {
      id: 8,
      title: 'Custom',
      icon: <FilePlus className='w-4 h-4' />,
      popular: 'Start from scratch',
    },
  ]

  // Templates organized by category
  const templatesByCategory = {
    All: [
      {
        icon: <Book className='w-6 h-6 text-gray-700' />,
        title: 'Exam Creator',
        description: 'Generate professional exams with auto-grading capability',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Education',
        users: '1.2k',
      },
      {
        icon: <Briefcase className='w-6 h-6 text-gray-700' />,
        title: 'Business Proposal',
        description: 'Professional templates that win clients',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Professional',
        users: '982',
      },
      {
        icon: <BookOpen className='w-6 h-6 text-gray-700' />,
        title: 'Research Paper',
        description: 'Academic format with proper citations and structure',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Academic',
        users: '856',
      },
      {
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
        title: 'Financial Report',
        description: 'Comprehensive financial statements with analysis',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Finance',
        users: '890',
      },
      {
        icon: <Calculator className='w-6 h-6 text-gray-700' />,
        title: 'Expense Report',
        description: 'Organized expense tracking with categorization',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Accounting',
        users: '845',
      },
      {
        icon: <Users className='w-6 h-6 text-gray-700' />,
        title: 'Interview Questions',
        description: 'Role-specific questions for better hiring decisions',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Interview',
        users: '724',
      },
      {
        icon: <FileText className='w-6 h-6 text-gray-700' />,
        title: 'Blog Post',
        description: 'Engaging content with optimized structure',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Content',
        users: '893',
      },
      {
        icon: <FilePlus className='w-6 h-6 text-gray-700' />,
        title: 'Blank Template',
        description: 'Start from scratch with AI assistance',
        tag: 'Custom',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Custom',
        users: '942',
      },
    ],
    Education: [
      {
        icon: <Book className='w-6 h-6 text-gray-700' />,
        title: 'Exam Creator',
        description: 'Generate professional exams with auto-grading capability',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Education',
        users: '1.2k',
      },
      {
        icon: <Book className='w-6 h-6 text-gray-700' />,
        title: 'Study Guide',
        description: 'Create comprehensive study guides with key concepts',
        tag: 'Education',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Education',
        users: '950',
      },
      {
        icon: <Book className='w-6 h-6 text-gray-700' />,
        title: 'Lesson Plan',
        description: 'Structured lesson plans with objectives and activities',
        tag: 'Education',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Education',
        users: '845',
      },
    ],
    Professional: [
      {
        icon: <Briefcase className='w-6 h-6 text-gray-700' />,
        title: 'Business Proposal',
        description: 'Professional templates that win clients',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Professional',
        users: '982',
      },
      {
        icon: <Briefcase className='w-6 h-6 text-gray-700' />,
        title: 'Executive Summary',
        description: 'Concise business summaries for stakeholders',
        tag: 'Business',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Professional',
        users: '756',
      },
      {
        icon: <Briefcase className='w-6 h-6 text-gray-700' />,
        title: 'Project Plan',
        description: 'Detailed project plans with timelines and resources',
        tag: 'Business',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Professional',
        users: '639',
      },
    ],
    Academic: [
      {
        icon: <BookOpen className='w-6 h-6 text-gray-700' />,
        title: 'Research Paper',
        description: 'Academic format with proper citations and structure',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Academic',
        users: '856',
      },
      {
        icon: <BookOpen className='w-6 h-6 text-gray-700' />,
        title: 'Literature Review',
        description: 'Structured analysis of published research',
        tag: 'Academic',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Academic',
        users: '743',
      },
      {
        icon: <BookOpen className='w-6 h-6 text-gray-700' />,
        title: 'Thesis Template',
        description: 'Complete thesis structure with formatting',
        tag: 'Academic',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Academic',
        users: '612',
      },
    ],
    Finance: [
      {
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
        title: 'Financial Report',
        description: 'Comprehensive financial statements with analysis',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Finance',
        users: '890',
      },
      {
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
        title: 'Budget Planner',
        description: 'Detailed budget planning with forecasting tools',
        tag: 'Finance',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Finance',
        users: '768',
      },
      {
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
        title: 'Investment Analysis',
        description: 'ROI calculations and investment opportunity assessment',
        tag: 'Finance',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Finance',
        users: '654',
      },
    ],
    Accounting: [
      {
        icon: <Calculator className='w-6 h-6 text-gray-700' />,
        title: 'Expense Report',
        description: 'Organized expense tracking with categorization',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Accounting',
        users: '845',
      },
      {
        icon: <Calculator className='w-6 h-6 text-gray-700' />,
        title: 'Balance Sheet',
        description: 'Professional balance sheet with automated calculations',
        tag: 'Accounting',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Accounting',
        users: '732',
      },
      {
        icon: <Calculator className='w-6 h-6 text-gray-700' />,
        title: 'Tax Documentation',
        description: 'Tax preparation forms with compliance features',
        tag: 'Accounting',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Accounting',
        users: '625',
      },
    ],
    Interview: [
      {
        icon: <Users className='w-6 h-6 text-gray-700' />,
        title: 'Interview Questions',
        description: 'Role-specific questions for better hiring decisions',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Interview',
        users: '724',
      },
      {
        icon: <Users className='w-6 h-6 text-gray-700' />,
        title: 'Candidate Evaluation',
        description: 'Standardized forms for consistent assessments',
        tag: 'Interview',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Interview',
        users: '621',
      },
      {
        icon: <Users className='w-6 h-6 text-gray-700' />,
        title: 'Feedback Template',
        description: 'Structured feedback for interview candidates',
        tag: 'Interview',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Interview',
        users: '508',
      },
    ],
    Content: [
      {
        icon: <FileText className='w-6 h-6 text-gray-700' />,
        title: 'Blog Post',
        description: 'Engaging content with optimized structure',
        tag: 'Popular',
        tagColor: 'bg-black text-white',
        category: 'Content',
        users: '893',
      },
      {
        icon: <FileText className='w-6 h-6 text-gray-700' />,
        title: 'Newsletter',
        description: 'Professional email newsletters with sections',
        tag: 'Content',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Content',
        users: '712',
      },
      {
        icon: <FileText className='w-6 h-6 text-gray-700' />,
        title: 'Social Media Pack',
        description: 'Coordinated content for multiple platforms',
        tag: 'Content',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Content',
        users: '645',
      },
    ],
    Custom: [
      {
        icon: <FilePlus className='w-6 h-6 text-gray-700' />,
        title: 'Blank Template',
        description: 'Start from scratch with AI assistance',
        tag: 'Custom',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Custom',
        users: '942',
      },
      {
        icon: <FilePlus className='w-6 h-6 text-gray-700' />,
        title: 'Import Design',
        description: 'Upload your design and enhance with AI',
        tag: 'Custom',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Custom',
        users: '586',
      },
      {
        icon: <FilePlus className='w-6 h-6 text-gray-700' />,
        title: 'Advanced Editor',
        description: 'Full control with AI-powered suggestions',
        tag: 'Custom',
        tagColor: 'bg-gray-100 text-gray-600',
        category: 'Custom',
        users: '491',
      },
    ],
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // Handle search in real-time as user types
  // Update the handleSearchInput function to also close the mobile filter
  const handleSearchInput = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Close the mobile filter dropdown when searching
    setShowMobileFilter(false)

    // If search term is empty, reset search state
    if (value.trim() === '') {
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Search across all categories
    const results = []
    Object.keys(templatesByCategory).forEach((category) => {
      const categoryResults = templatesByCategory[category].filter(
        (template) =>
          template.title.toLowerCase().includes(value.toLowerCase()) ||
          template.description.toLowerCase().includes(value.toLowerCase())
      )
      results.push(...categoryResults)
    })

    // Remove duplicates (templates might appear in multiple categories)
    const uniqueResults = Array.from(
      new Set(results.map((item) => item.title))
    ).map((title) => results.find((item) => item.title === title))

    setSearchResults(uniqueResults)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setIsSearching(false)
  }

  return (
    <Layout>
      <div className='w-full min-h-screen bg-white text-gray-900'>
        {/* Header */}
        <SmartHeader />
        <style jsx>{`
          .bg-grid-pattern {
            background-image: linear-gradient(
                to right,
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              );
            background-size: 20px 20px;
          }
        `}</style>
        {/* Category Navigation - Updated to match Examples page */}
        <div className='w-full pt-10 pb-8'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-5'>
                <h2 className='text-xl font-bold text-gray-900'>
                  Explore Templates
                </h2>

                {/* Mobile Dropdown with ref for click-outside detection */}
                <div className='relative sm:hidden' ref={dropdownRef}>
                  <button
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                    className='flex items-center justify-between w-32 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none'
                  >
                    <span className='flex items-center'>
                      <span className='mr-1.5'>
                        {
                          templateCategories.find(
                            (c) => c.title === selectedCategory
                          )?.icon
                        }
                      </span>
                      <span className='truncate'>{selectedCategory}</span>
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
                      className='absolute z-10 w-32 right-0 mt-1 bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none'
                    >
                      {templateCategories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => {
                            handleCategoryChange(category.title)
                            setShowMobileFilter(false)
                          }}
                          className={`flex items-center px-3 py-1.5 text-xs cursor-pointer ${
                            selectedCategory === category.title
                              ? 'bg-gray-100 text-gray-900 rounded-md mx-1'
                              : 'text-gray-700 hover:bg-gray-50 hover:rounded-md hover:mx-1'
                          }`}
                        >
                          <span className='mr-1.5'>{category.icon}</span>
                          <span className='truncate'>{category.title}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Desktop Category Chips - Adjusted to match Examples page */}
              <div
                className='hidden sm:flex sm:flex-wrap sm:gap-2 justify-center'
                style={{ width: '100%' }}
              >
                {templateCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategoryChange(category.title)}
                    className={`px-4 py-1.5 rounded-full flex items-center text-sm font-medium ${
                      selectedCategory === category.title
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className='mr-2'>{category.icon}</span>
                    {category.title}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Bar - Matching Examples page structure exactly */}
            <div className='flex justify-center'>
              <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                <div className='relative'>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchInput}
                    onFocus={() => setShowMobileFilter(false)}
                    className='w-full py-2 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-800 placeholder-gray-500 shadow-sm'
                    placeholder='Search templates...'
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className='absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className='absolute mt-1 text-xs text-gray-500'>
                    Found {searchResults.length} result
                    {searchResults.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Templates Grid - Adding mb-10 to search bar container to match Examples page */}
        <div className='w-full py-2'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10'>
            {' '}
            {/* Added mb-10 here to create consistent gap */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                {isSearching
                  ? `Search Results for "${searchTerm}"`
                  : selectedCategory === 'All'
                  ? 'All Templates'
                  : `${selectedCategory} Templates`}
                <span className='text-sm text-gray-500 ml-2'>
                  (
                  {isSearching
                    ? searchResults.length
                    : templatesByCategory[selectedCategory].length}
                  )
                </span>
              </h2>
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className='text-xs text-gray-600 hover:text-black flex items-center'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-3 w-3 mr-1'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                  Clear
                </button>
              )}
            </div>
            <div style={{ minHeight: '600px' }}>
              <motion.div
                key='templates-grid'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 relative'
              >
                {isSearching ? (
                  searchResults.length > 0 ? (
                    searchResults.map((template, index) => (
                      <TemplateCard key={index} template={template} />
                    ))
                  ) : (
                    <div className='col-span-full py-10 text-center'>
                      <div className='mb-2'>
                        <Search className='w-6 h-6 text-gray-400 mx-auto' />
                      </div>
                      <h3 className='text-gray-700 font-medium mb-1'>
                        No templates found
                      </h3>
                      <p className='text-gray-500 text-sm'>
                        We couldn't find any templates matching "{searchTerm}"
                      </p>
                      <button
                        onClick={clearSearch}
                        className='mt-3 text-sm text-gray-600 hover:text-black underline'
                      >
                        Clear search
                      </button>
                    </div>
                  )
                ) : (
                  templatesByCategory[selectedCategory].map(
                    (template, index) => (
                      <TemplateCard key={index} template={template} />
                    )
                  )
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SmartTemplatesPage
