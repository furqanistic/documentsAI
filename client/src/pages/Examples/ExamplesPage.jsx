import ExamplesHeader from '@/components/Examples/ExamplesHeader'
import { motion } from 'framer-motion'
import {
  Book,
  BookOpen,
  Briefcase,
  Calculator,
  DollarSign,
  FilePlus,
  FileText,
  Grid,
  Search,
  Users,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '../Layout/Layout'

// Define category order and configurations
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid },
  { id: 'education', label: 'Education', icon: Book },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'academic', label: 'Academic', icon: BookOpen },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'accounting', label: 'Accounting', icon: Calculator },
  { id: 'interview', label: 'Interview', icon: Users },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'custom', label: 'Custom', icon: FilePlus },
]

const ExamplesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [activeCardId, setActiveCardId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const dropdownRef = useRef(null)

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMobileFilter(false)
      }
    }

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [dropdownRef])

  // Function to toggle card activation on mobile
  const toggleCard = (id) => {
    setActiveCardId(activeCardId === id ? null : id)
  }

  // Examples data
  const examples = [
    {
      id: 1,
      title: 'AP Calculus Exam',
      category: 'education',
      description:
        'Multi-section calculus assessment with problems ranging from limits to integration.',
      image: '/api/placeholder/800/600',
      accent: '#4F46E5',
    },
    {
      id: 2,
      title: 'Quarterly Financial Analysis',
      category: 'professional',
      description:
        'Comprehensive financial report with visuals and performance insights.',
      image: '/api/placeholder/800/600',
      accent: '#0EA5E9',
    },
    {
      id: 3,
      title: 'Literature Research Paper',
      category: 'academic',
      description:
        'In-depth analysis of thematic elements across multiple literary works.',
      image: '/api/placeholder/800/600',
      accent: '#EC4899',
    },
    {
      id: 4,
      title: 'Biology Mid-Term',
      category: 'education',
      description:
        'Detailed assessment covering cellular structures to ecosystem dynamics.',
      image: '/api/placeholder/800/600',
      accent: '#10B981',
    },
    {
      id: 5,
      title: 'Market Expansion Strategy',
      category: 'professional',
      description:
        'Strategic roadmap for targeting new market segments with implementation phases.',
      image: '/api/placeholder/800/600',
      accent: '#F59E0B',
    },
    {
      id: 6,
      title: 'Psychology Case Study',
      category: 'academic',
      description:
        'Analytical case review with theoretical frameworks and clinical observations.',
      image: '/api/placeholder/800/600',
      accent: '#8B5CF6',
    },
    {
      id: 7,
      title: 'Physics Laboratory Report',
      category: 'education',
      description:
        'Experimental documentation with methodology, data analysis, and scientific conclusions.',
      image: '/api/placeholder/800/600',
      accent: '#2563EB',
    },
    {
      id: 8,
      title: 'Marketing Campaign Analysis',
      category: 'professional',
      description:
        'Performance evaluation of multi-channel marketing efforts with ROI metrics.',
      image: '/api/placeholder/800/600',
      accent: '#DC2626',
    },
    {
      id: 9,
      title: 'Anthropology Field Study',
      category: 'academic',
      description:
        'Ethnographic research with cultural observations and theoretical implications.',
      image: '/api/placeholder/800/600',
      accent: '#7C3AED',
    },
    {
      id: 10,
      title: 'Computer Science Quiz',
      category: 'education',
      description:
        'Programming concepts assessment covering algorithms, data structures, and system design.',
      image: '/api/placeholder/800/600',
      accent: '#0891B2',
    },
    {
      id: 11,
      title: 'Project Management Plan',
      category: 'professional',
      description:
        'Comprehensive timeline with resource allocation, milestones, and risk management strategies.',
      image: '/api/placeholder/800/600',
      accent: '#DB2777',
    },
    {
      id: 12,
      title: 'Economics Research Paper',
      category: 'academic',
      description:
        'Market analysis with statistical modeling and policy recommendations.',
      image: '/api/placeholder/800/600',
      accent: '#16A34A',
    },
    {
      id: 13,
      title: 'Language Arts Assessment',
      category: 'education',
      description:
        'Comprehensive evaluation of writing skills, literary analysis, and grammatical proficiency.',
      image: '/api/placeholder/800/600',
      accent: '#9333EA',
    },
    {
      id: 14,
      title: 'Product Launch Strategy',
      category: 'professional',
      description:
        'Go-to-market plan with competitive analysis, positioning, and distribution channels.',
      image: '/api/placeholder/800/600',
      accent: '#CA8A04',
    },
    {
      id: 15,
      title: 'Sociology Survey Study',
      category: 'academic',
      description:
        'Quantitative research with demographic analysis and social trend identification.',
      image: '/api/placeholder/800/600',
      accent: '#4338CA',
    },
  ]

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
    } else {
      const query = searchQuery.toLowerCase()
      const results = examples.filter(
        (example) =>
          example.title.toLowerCase().includes(query) ||
          example.description.toLowerCase().includes(query) ||
          example.category.toLowerCase().includes(query)
      )
      setSearchResults(results)
    }
  }, [searchQuery])

  // Determine which examples to display
  const displayedExamples =
    searchQuery.trim() !== ''
      ? searchResults
      : examples.filter(
          (example) =>
            activeFilter === 'all' || example.category === activeFilter
        )

  // Get category-specific counts for display
  const getCategoryCount = () => {
    if (searchQuery.trim() !== '') {
      return searchResults.length
    } else {
      if (activeFilter === 'all') {
        return examples.length
      } else {
        return examples.filter((example) => example.category === activeFilter)
          .length
      }
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    // Close mobile filter when searching
    setShowMobileFilter(false)
    // Reset category filter when searching
    if (e.target.value.trim() !== '') {
      setActiveFilter('all')
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <Layout>
      <div className='min-h-screen bg-white'>
        {/* Header Section */}
        <ExamplesHeader />
        <section className='pt-10 pb-8'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Filter Buttons */}
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-5'>
                <h2 className='text-xl font-bold text-gray-900'>
                  Explore Examples
                </h2>

                {/* Mobile Dropdown with ref for click-outside detection */}
                <div className='relative sm:hidden' ref={dropdownRef}>
                  <button
                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                    className='flex items-center justify-between w-32 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none'
                  >
                    <span className='flex items-center'>
                      <span className='mr-1.5'>
                        {React.createElement(
                          CATEGORIES.find((c) => c.id === activeFilter).icon,
                          { className: 'w-4 h-4' }
                        )}
                      </span>
                      <span className='truncate'>
                        {CATEGORIES.find((c) => c.id === activeFilter).label}
                      </span>
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
                      {CATEGORIES.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => {
                            setActiveFilter(category.id)
                            setShowMobileFilter(false)
                          }}
                          className={`flex items-center px-3 py-1.5 text-xs cursor-pointer ${
                            activeFilter === category.id
                              ? 'bg-gray-100 text-gray-900 rounded-md mx-1'
                              : 'text-gray-700 hover:bg-gray-50 hover:rounded-md hover:mx-1'
                          }`}
                        >
                          <category.icon className='w-4 h-4 mr-1.5' />
                          <span>{category.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Desktop Category Chips */}
              <div className='hidden sm:flex sm:flex-wrap sm:gap-2 justify-center'>
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveFilter(category.id)}
                    className={`px-4 py-1.5 rounded-full flex items-center text-sm font-medium ${
                      activeFilter === category.id
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className='w-4 h-4 mr-2' />
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className='flex justify-center'>
              <div className='relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                <div className='relative'>
                  <input
                    type='text'
                    className='w-full py-2 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-800 placeholder-gray-500 shadow-sm'
                    placeholder='Search examples...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowMobileFilter(false)}
                  />

                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className='absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className='absolute mt-1 text-xs text-gray-500'>
                    Found {searchResults.length} result
                    {searchResults.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </section>

        {/* Examples Grid */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-2'>
          {/* Added heading with count similar to Templates page */}
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              {searchQuery.trim() !== ''
                ? `Search Results for "${searchQuery}"`
                : activeFilter === 'all'
                ? 'All Examples'
                : `${
                    CATEGORIES.find((c) => c.id === activeFilter).label
                  } Examples`}
              <span className='text-sm text-gray-500 ml-2'>
                ({getCategoryCount()})
              </span>
            </h2>
            {searchQuery && (
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

          {displayedExamples.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {displayedExamples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className='group relative'
                >
                  <div
                    className='relative h-80 w-full overflow-hidden rounded-xl bg-white transition-all duration-300 group-hover:shadow-xl border border-gray-100 group-hover:border-gray-200'
                    onClick={() => toggleCard(example.id)}
                    style={{
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <img
                      src='https://cdn.dribbble.com/userupload/15065870/file/original-e0872fbc56dd81e60564dc9365c41704.png?resize=2048x1536&vertical=center'
                      alt={example.title}
                      className='h-full w-full object-cover'
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 transition-opacity duration-300 ${
                        activeCardId === example.id
                          ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    ></div>
                    <div
                      className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-300 ${
                        activeCardId === example.id
                          ? 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className='bg-white/95 p-4 rounded-lg shadow-md backdrop-blur-sm'>
                        <p className='text-gray-800 text-sm mb-3'>
                          {example.description}
                        </p>
                        <div className='flex justify-between items-center'>
                          <span className='text-xs text-gray-500 capitalize py-1 px-2.5 bg-gray-100 rounded-full'>
                            {example.category}
                          </span>
                          <button className='px-3 py-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs rounded-md hover:bg-black transition-colors'>
                            View document
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile indicator that card is tappable */}
                    <div className='absolute top-2 right-2 md:hidden bg-white/70 rounded-full p-1 shadow-sm'>
                      <span className='sr-only'>Tap for details</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 text-gray-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Title without the dot */}
                  <h3 className='mt-4 text-lg font-medium text-gray-900'>
                    {example.title}
                  </h3>

                  {/* Category label */}
                  <div className='mt-1'>
                    <span className='text-sm text-gray-500 capitalize'>
                      {example.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-20'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <X className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-xl font-medium text-gray-900 mb-1'>
                No examples found
              </h3>
              <p className='text-gray-500'>
                {searchQuery
                  ? 'Try a different search term or clear the search.'
                  : 'Try selecting a different category.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}

export default ExamplesPage
