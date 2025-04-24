import { motion } from 'framer-motion'
import {
  Book,
  BookOpen,
  Briefcase,
  ExternalLink,
  Eye,
  FilePlus,
  FileText,
  Grid,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import Layout from '../Layout/Layout'

const SmartTemplatesPage = () => {
  // State to track selected category
  const [selectedCategory, setSelectedCategory] = useState('All')

  const templateCategories = [
    {
      id: 0,
      title: 'All',
      icon: <Grid className='w-5 h-5' />,
      popular: 'View all templates',
    },
    {
      id: 1,
      title: 'Education',
      icon: <Book className='w-5 h-5' />,
      popular: 'Exams, Study Guides',
    },
    {
      id: 2,
      title: 'Professional',
      icon: <Briefcase className='w-5 h-5' />,
      popular: 'Reports, Presentations',
    },
    {
      id: 3,
      title: 'Academic',
      icon: <BookOpen className='w-5 h-5' />,
      popular: 'Research Papers, Citations',
    },
    {
      id: 4,
      title: 'Interview',
      icon: <Users className='w-5 h-5' />,
      popular: 'Questions, Evaluation Forms',
    },
    {
      id: 5,
      title: 'Content',
      icon: <FileText className='w-5 h-5' />,
      popular: 'Blog Posts, Articles',
    },
    {
      id: 6,
      title: 'Custom',
      icon: <FilePlus className='w-5 h-5' />,
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

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  // State for mobile dropdown
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // Handle search functionality
  const [searchTerm, setSearchTerm] = useState('')
  const handleSearch = () => {
    // For now, let's assume searching just goes to All category with a message
    setSelectedCategory('All')
    // In a real app, you would filter the templates based on the search term
  }

  return (
    <Layout>
      <div className='w-full min-h-screen bg-white text-gray-900'>
        {/* Modern Header */}
        <div className='w-full bg-black relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8'>
          {/* Abstract Background Elements */}
          <div className='absolute top-0 left-0 w-full h-full opacity-30'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.5 }}
              className='absolute w-64 h-64 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 blur-3xl -top-20 -left-20'
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className='absolute w-96 h-96 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 blur-3xl -bottom-40 -right-20'
            />
          </div>

          {/* Grid Pattern Overlay */}
          <div className='absolute inset-0 opacity-10 bg-grid-pattern'></div>

          <div className='max-w-5xl mx-auto relative z-10'>
            <div className='flex flex-col md:flex-row items-center justify-between'>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='text-center md:text-left mb-8 md:mb-0 md:pr-8'
              >
                <div className='flex items-center mb-3'>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white bg-opacity-10 rounded-full p-1 mr-3'
                  >
                    <Sparkles className='w-5 h-5 text-white' />
                  </motion.div>
                  <div className='flex items-center space-x-2'>
                    {' '}
                    {/* Added wrapper div */}
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className='uppercase text-xs font-semibold tracking-wider text-gray-400 whitespace-nowrap'
                    >
                      AI-Powered
                    </motion.span>
                  </div>
                </div>
                <h1 className='text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight'>
                  Smart Templates
                </h1>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className='h-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full mb-4 hidden md:block'
                />
                <p className='text-gray-300 text-lg mb-4 max-w-lg leading-relaxed'>
                  Create professional documents in seconds with our AI‑powered
                  templates. Support for 100+ languages.
                </p>

                <div className='flex items-center'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='px-4 py-2 bg-white text-black font-medium rounded-lg flex items-center space-x-2 text-sm'
                  >
                    <Plus className='w-3.5 h-3.5' />
                    <span>New Document</span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className='relative w-full md:w-1/2 max-w-sm'
              >
                {/* Floating document elements */}
                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: -5 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 2,
                  }}
                  className='absolute -top-6 -right-6 w-24 h-32 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg z-10 transform rotate-6'
                />

                <motion.div
                  initial={{ y: -5 }}
                  animate={{ y: 10 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 2.5,
                  }}
                  className='absolute -bottom-8 -left-6 w-28 h-36 bg-white bg-opacity-5 backdrop-blur-sm rounded-lg border border-gray-700 shadow-lg transform -rotate-12'
                />

                {/* Main document preview */}
                <div className='bg-white bg-opacity-5 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-5 relative z-20'>
                  <div className='flex justify-between items-center mb-4'>
                    <div className='flex space-x-1.5'>
                      <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                      <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                      <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                    </div>
                    <div className='text-xs font-medium text-gray-400'>
                      AI Template
                    </div>
                  </div>

                  <div className='h-36 flex flex-col justify-center items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-3'>
                      <FileText className='w-5 h-5 text-gray-300' />
                    </div>
                    <div className='space-y-1.5 w-full'>
                      <div className='h-2 bg-gray-700 rounded-full w-3/5 mx-auto'></div>
                      <div className='h-2 bg-gray-700 rounded-full w-4/5 mx-auto'></div>
                      <div className='h-2 bg-gray-700 rounded-full w-2/3 mx-auto'></div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className='h-1 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full mt-5'
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Style tag for grid pattern */}
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

        {/* Improved Responsive Search Bar */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row items-center border border-gray-100'
          >
            <div className='px-2 hidden sm:block'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <div className='relative flex-1 w-full'>
              <div className='absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none sm:hidden'>
                <Search className='h-4 h-4 text-gray-400' />
              </div>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full py-2 pl-8 sm:pl-2 pr-2 text-sm bg-transparent focus:outline-none text-gray-900 placeholder-gray-500'
                placeholder='Search templates...'
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              className='mt-2 sm:mt-0 w-full sm:w-auto ml-0 sm:ml-2 px-3 py-1.5 text-sm bg-black text-white rounded-md'
            >
              Search
            </motion.button>
          </motion.div>
        </div>

        {/* Completely Redesigned Mobile-First Category Navigation */}
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-xl font-bold text-gray-900'>
              Explore Templates
            </h2>

            {/* UPDATED Mobile Dropdown - Fixed width and smaller elements */}
            <div className='relative sm:hidden'>
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

              {/* UPDATED Mobile Dropdown Menu - More compact */}
              {showMobileFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='absolute z-10 w-32 mt-1 bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none'
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
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
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

          {/* Desktop Category Chips */}
          <div className='hidden sm:flex sm:flex-wrap sm:gap-2'>
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
                <span className='mr-1.5'>{category.icon}</span>
                {category.title}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Templates - More Compact Design */}
        {/* <div className='w-full  py-6 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-5xl mx-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                {selectedCategory === 'All'
                  ? 'All Templates'
                  : `${selectedCategory} Templates`}
                <span className='text-sm text-gray-500 ml-2'>
                  ({templatesByCategory[selectedCategory].length})
                </span>
              </h2>
            </div>

            <motion.div
              key={selectedCategory} // This forces re-render on category change
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'
            >
              {templatesByCategory[selectedCategory].map((template, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.05)',
                  }}
                  className={`bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden ${
                    template.category === 'Custom'
                      ? 'border-l-2 border-l-black'
                      : ''
                  }`}
                >
                  <div className='p-3 sm:p-4'>
                    <div className='flex items-start justify-between mb-3'>
                      <div
                        className={`p-2 ${
                          template.category === 'Custom'
                            ? 'bg-black'
                            : 'bg-gray-50'
                        } rounded-lg`}
                      >
                        <div
                          className={
                            template.category === 'Custom'
                              ? 'text-white'
                              : 'text-gray-700'
                          }
                        >
                          {template.icon}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 ${template.tagColor} rounded-full`}
                      >
                        {template.tag}
                      </span>
                    </div>
                    <h3 className='text-sm font-semibold text-gray-900 truncate'>
                      {template.title}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1 mb-3 line-clamp-2'>
                      {template.description}
                    </p>

                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-gray-500'>
                        {template.users} users
                      </span>
                      <div className='flex space-x-1'>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium flex items-center'
                        >
                          <Eye className='w-3 h-3 mr-1' />
                          <span>View</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='px-2 py-1 bg-black text-white rounded-md text-xs font-medium'
                        >
                          Use
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div> */}
      </div>
    </Layout>
  )
}

export default SmartTemplatesPage
