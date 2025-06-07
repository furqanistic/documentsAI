import NewTemplateForm from '@/components/Template/NewTemplateForm'
import { motion } from 'framer-motion'
import {
  Clock,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  SortDesc,
  Star,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'

// Storage utility functions
// NOTE: These would use localStorage in a real environment
// For Claude.ai artifacts, we'll use in-memory storage that persists during the session
const STORAGE_KEY = 'templatePagePreferences'
let memoryStorage = {
  isGridView: true,
  sortBy: 'recent',
}

const getStoredPreferences = () => {
  // In a real environment, uncomment this:
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { isGridView: true, sortBy: 'recent' }
  } catch (error) {
    console.error('Error reading preferences:', error)
    return { isGridView: true, sortBy: 'recent' }
  }
}

const savePreferences = (preferences) => {
  // In a real environment, uncomment this:
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.error('Error saving preferences:', error)
  }

  memoryStorage = { ...memoryStorage, ...preferences }
}

// Reusable components
const TemplateCard = ({
  template,
  isGridView,
  onToggleFavorite,
  onViewTemplate,
}) => {
  const handleView = (e, id) => {
    e.stopPropagation()
    console.log(`Viewing template ${id}`)
    onViewTemplate(template)
  }

  const handleEdit = (e, id) => {
    e.stopPropagation()
    console.log(`Editing template ${id}`)
    // Implement edit functionality here
  }

  const handleUse = (e, id) => {
    e.stopPropagation()
    console.log(`Using template ${id}`)
    // Implement use functionality here
  }

  const handleFavoriteToggle = (e, id) => {
    e.stopPropagation()
    onToggleFavorite(id)
  }

  // Determine card accent color based on template type
  const getTypeColor = (type) => {
    switch (type) {
      case 'Education':
        return 'bg-indigo-100 text-indigo-700'
      case 'Business':
        return 'bg-emerald-100 text-emerald-700'
      case 'Academic':
        return 'bg-purple-100 text-purple-700'
      case 'Career':
        return 'bg-amber-100 text-amber-700'
      case 'Recruitment':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <motion.div
      className={`bg-white rounded-lg  border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:border-gray-300 ${
        isGridView ? 'h-72' : 'h-auto'
      }`}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
      transition={{ duration: 0.2 }}
    >
      {isGridView ? (
        // Grid view with fixed proportions
        <div className='h-full flex flex-col relative group'>
          {/* Fixed height header section - exactly 1/3 of card */}
          <div
            className='h-24 bg-gray-100 flex items-center justify-center relative flex-shrink-0'
            style={{
              backgroundImage: `url(${template.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!template.thumbnail && (
              <div className='text-gray-400 text-4xl font-light'>
                {template.title[0]}
              </div>
            )}
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                template.type
              )}`}
            >
              {template.type}
            </div>
          </div>

          {/* Fixed height content section - exactly 2/3 of card */}
          <div className='h-48 p-4 flex flex-col'>
            {/* Header with title and favorite - fixed height */}
            <div className='flex justify-between items-start h-8'>
              <h3 className='font-bold text-gray-900 text-base leading-tight line-clamp-2 pr-2 flex-1'>
                {template.title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleFavoriteToggle(e, template.id)}
                className='text-gray-400 hover:text-amber-400 transition-colors flex-shrink-0'
              >
                <Star
                  size={16}
                  className={
                    template.isFavorite ? 'text-amber-400' : 'text-gray-400'
                  }
                  fill={template.isFavorite ? '#FBBF24' : 'none'}
                />
              </motion.button>
            </div>

            {/* Description - fixed height with overflow hidden */}
            <div className='h-10 mb-4'>
              <p className='text-gray-500 text-sm line-clamp-2 leading-5'>
                {template.description}
              </p>
            </div>

            {/* Bottom section - takes remaining space */}
            <div className='flex-1 flex flex-col justify-end'>
              {/* Date - positioned above buttons */}
              <div className='text-xs text-gray-400 mb-3 text-right'>
                {template.date}
              </div>

              {/* Action buttons - fixed at bottom */}
              <div className='flex space-x-2'>
                <motion.button
                  className='flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded flex items-center justify-center transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleView(e, template.id)}
                >
                  View
                </motion.button>
                <motion.button
                  className='flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center justify-center transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleUse(e, template.id)}
                >
                  Use
                </motion.button>
                <motion.button
                  className='flex-1 px-3 py-1.5 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-medium rounded flex items-center justify-center transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleEdit(e, template.id)}
                >
                  Edit
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // List view - Completely redesigned for mobile
        <div className='p-3 sm:p-4'>
          {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
          <div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center'>
            {/* Header Row - Title and Favorite */}
            <div className='flex items-start justify-between sm:hidden'>
              <div className='flex-1 pr-2'>
                <h3 className='font-bold text-gray-900 text-lg leading-tight'>
                  {template.title}
                </h3>
                <p className='text-gray-500 text-sm mt-1 line-clamp-2'>
                  {template.description}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleFavoriteToggle(e, template.id)}
                className='text-gray-400 hover:text-amber-400 transition-colors ml-2 mt-1 flex-shrink-0'
              >
                <Star
                  size={18}
                  className={
                    template.isFavorite ? 'text-amber-400' : 'text-gray-400'
                  }
                  fill={template.isFavorite ? '#FBBF24' : 'none'}
                />
              </motion.button>
            </div>

            {/* Desktop layout - Image and content side by side */}
            <div className='hidden sm:flex sm:items-center sm:flex-1 sm:space-x-4'>
              <div
                className='h-14 w-14 bg-gray-100 rounded flex items-center justify-center flex-shrink-0'
                style={{
                  backgroundImage: `url(${template.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!template.thumbnail && (
                  <div className='text-gray-400 text-xl font-light'>
                    {template.title[0]}
                  </div>
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='font-bold text-gray-900 truncate pr-2 text-base'>
                    {template.title}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleFavoriteToggle(e, template.id)}
                    className='text-gray-400 hover:text-amber-400 transition-colors flex-shrink-0'
                  >
                    <Star
                      size={16}
                      className={
                        template.isFavorite ? 'text-amber-400' : 'text-gray-400'
                      }
                      fill={template.isFavorite ? '#FBBF24' : 'none'}
                    />
                  </motion.button>
                </div>
                <p className='text-gray-500 text-sm line-clamp-1 mb-1'>
                  {template.description}
                </p>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-400'>{template.date}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      template.type
                    )}`}
                  >
                    {template.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta info for mobile */}
            <div className='flex items-center justify-between sm:hidden'>
              <div className='flex items-center space-x-2'>
                <span className='text-xs text-gray-400'>{template.date}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    template.type
                  )}`}
                >
                  {template.type}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex space-x-2 sm:flex-shrink-0 sm:w-auto'>
              <motion.button
                className='flex-1 sm:flex-none sm:w-16 px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleView(e, template.id)}
              >
                View
              </motion.button>
              <motion.button
                className='flex-1 sm:flex-none sm:w-16 px-2 sm:px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleUse(e, template.id)}
              >
                Use
              </motion.button>
              <motion.button
                className='flex-1 sm:flex-none sm:w-16 px-2 sm:px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-medium rounded-md transition-colors'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleEdit(e, template.id)}
              >
                Edit
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

const EmptyState = ({ onCreateTemplate }) => (
  <motion.div
    className='flex flex-col items-center justify-center p-8 sm:p-10 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center h-64'
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <div className='bg-blue-100 p-4 rounded-full mb-4 '>
      <Plus size={24} className='text-blue-600' />
    </div>
    <h3 className='text-lg font-medium text-gray-700 mb-2'>No templates yet</h3>
    <p className='text-gray-500 max-w-md mb-4 text-sm sm:text-base'>
      Get started by creating your first template or explore our template
      library
    </p>
    <button
      onClick={onCreateTemplate}
      className='px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg font-medium transition-colors'
    >
      Create Template
    </button>
  </motion.div>
)

// Mock data for templates
const mockTemplates = [
  {
    id: 1,
    title: 'Final Exam Template',
    description: 'Physics exam with multiple choice and open-ended questions',
    type: 'Education',
    date: '2 days ago',
    isFavorite: true,
    thumbnail: null,
  },
  {
    id: 2,
    title: 'Weekly Quiz',
    description: 'Short quiz format with automated grading',
    type: 'Education',
    date: '1 week ago',
    isFavorite: false,
    thumbnail: null,
  },
  {
    id: 3,
    title: 'Project Proposal',
    description: 'Professional template for project proposals and planning',
    type: 'Business',
    date: '3 weeks ago',
    isFavorite: true,
    thumbnail: null,
  },
  {
    id: 4,
    title: 'Research Paper',
    description: 'Academic research paper with citations and references',
    type: 'Academic',
    date: '1 month ago',
    isFavorite: false,
    thumbnail: null,
  },
  {
    id: 5,
    title: 'Cover Letter',
    description: 'Professional cover letter for job applications',
    type: 'Career',
    date: '1 month ago',
    isFavorite: false,
    thumbnail: null,
  },
  {
    id: 6,
    title: 'Interview Questions',
    description: 'Technical interview questions for software developers',
    type: 'Recruitment',
    date: '2 months ago',
    isFavorite: true,
    thumbnail: null,
  },
]

// Main component
const MyTemplatesPage = () => {
  const [templates, setTemplates] = useState(mockTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false)
  const filterRef = useRef(null)
  const mobileFilterRef = useRef(null)

  // Initialize state from stored preferences
  const storedPrefs = getStoredPreferences()
  const [isGridView, setIsGridView] = useState(storedPrefs.isGridView)
  const [sortBy, setSortBy] = useState(storedPrefs.sortBy)

  // Handle click outside to close filter dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Check both mobile and desktop filter refs
      const clickedOutsideDesktop =
        filterRef.current && !filterRef.current.contains(event.target)
      const clickedOutsideMobile =
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(event.target)

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setFilterOpen(false)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle view change with persistence
  const handleViewChange = (gridView) => {
    setIsGridView(gridView)
    savePreferences({ isGridView: gridView })
  }

  // Handle sort change with persistence
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    savePreferences({ sortBy: newSortBy })
    setFilterOpen(false)
  }

  // Toggle favorite status
  const handleToggleFavorite = (id) => {
    setTemplates(
      templates.map((template) =>
        template.id === id
          ? { ...template, isFavorite: !template.isFavorite }
          : template
      )
    )
  }

  // Handle template view
  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPDFModal(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowPDFModal(false)
    setSelectedTemplate(null)
  }

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort templates based on selected option
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'recent') {
      // Simplified sorting - in real app would use proper date comparison
      return a.date > b.date ? -1 : 1
    } else if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title)
    } else if (sortBy === 'favorites') {
      return b.isFavorite - a.isFavorite
    }
    return 0
  })

  return (
    <DashboardLayout>
      <motion.div
        className='max-w-7xl mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-3'>
          <div className='w-full sm:w-auto text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>
              My Templates
            </h1>
            <p className='text-gray-500 text-sm sm:text-base'>
              Manage and organize your document templates.
            </p>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <motion.button
              className='flex-1 sm:flex-none px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg font-medium flex items-center transition-colors justify-center'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowNewTemplateForm(true)}
            >
              <Plus size={18} className='mr-2' />
              New Template
            </motion.button>
            <div className='sm:hidden relative' ref={mobileFilterRef}>
              <button
                className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className='text-gray-600' />
                <span className='text-sm'>Filter</span>
              </button>

              {filterOpen && (
                <motion.div
                  className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='p-2'>
                    <div className='p-2 text-sm font-medium text-gray-700'>
                      Sort by
                    </div>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'recent'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('recent')}
                    >
                      <div className='flex items-center'>
                        <Clock size={14} className='mr-2' />
                        Most Recent
                      </div>
                    </button>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'alphabetical'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('alphabetical')}
                    >
                      <div className='flex items-center'>
                        <SortDesc size={14} className='mr-2' />
                        Alphabetical
                      </div>
                    </button>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'favorites'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('favorites')}
                    >
                      <div className='flex items-center'>
                        <Star size={14} className='mr-2' />
                        Favorites
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-2 sm:mb-6 gap-4'>
          <div className='relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search templates...'
              className='pl-10 py-2 pr-4 w-full border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black h-10'
            />
          </div>

          <div className='flex items-center gap-2 w-full md:w-auto justify-between md:justify-start'>
            <div className='hidden sm:flex items-center bg-gray-100 rounded-lg p-1'>
              <button
                className={`p-1.5 rounded ${isGridView ? 'bg-white ' : ''}`}
                onClick={() => handleViewChange(true)}
              >
                <Grid size={18} className='text-gray-600' />
              </button>
              <button
                className={`p-1.5 rounded ${!isGridView ? 'bg-white ' : ''}`}
                onClick={() => handleViewChange(false)}
              >
                <List size={18} className='text-gray-600' />
              </button>
            </div>

            <div className='hidden sm:block relative' ref={filterRef}>
              <button
                className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} className='text-gray-600' />
                <span className='text-sm'>Filter</span>
              </button>

              {filterOpen && (
                <motion.div
                  className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='p-2'>
                    <div className='p-2 text-sm font-medium text-gray-700'>
                      Sort by
                    </div>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'recent'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('recent')}
                    >
                      <div className='flex items-center'>
                        <Clock size={14} className='mr-2' />
                        Most Recent
                      </div>
                    </button>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'alphabetical'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('alphabetical')}
                    >
                      <div className='flex items-center'>
                        <SortDesc size={14} className='mr-2' />
                        Alphabetical
                      </div>
                    </button>
                    <button
                      className={`w-full text-left p-2 text-sm rounded hover:bg-gray-100 ${
                        sortBy === 'favorites'
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-600'
                      }`}
                      onClick={() => handleSortChange('favorites')}
                    >
                      <div className='flex items-center'>
                        <Star size={14} className='mr-2' />
                        Favorites
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        {sortedTemplates.length > 0 ? (
          <motion.div
            className={`grid gap-3 sm:gap-4 ${
              isGridView && window.innerWidth >= 640
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {sortedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isGridView={isGridView && window.innerWidth >= 640}
                onToggleFavorite={handleToggleFavorite}
                onViewTemplate={handleViewTemplate}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState onCreateTemplate={() => setShowNewTemplateForm(true)} />
        )}

        {/* PDF Modal with backdrop and close button - FIXED VERSION */}
        {showPDFModal && selectedTemplate && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={handleCloseModal}
          >
            {/* Modal content */}
            <motion.div
              className='bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl h-full max-h-screen sm:max-h-[95vh] lg:max-h-[90vh] flex flex-col border border-gray-200 relative mx-1 sm:mx-0 overflow-hidden'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with close button */}
              <div className='flex items-start sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg sm:rounded-t-xl shrink-0'>
                <div className='flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0'>
                  <div className='min-w-0 flex-1'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-900 truncate'>
                      {selectedTemplate.title}
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-500 line-clamp-1 sm:line-clamp-2 mt-0.5'>
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <motion.button
                  onClick={handleCloseModal}
                  className='p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} className='sm:w-5 sm:h-5' />
                </motion.button>
              </div>

              {/* PDF Viewer - Fixed Container with proper overflow control */}
              <div className='flex-1 p-2 sm:p-4 min-h-0 overflow-hidden'>
                <div className='w-full h-full border border-gray-200 rounded sm:rounded-lg shadow-inner overflow-hidden bg-gray-100'>
                  <iframe
                    src='/pdf/test.pdf'
                    className='w-full h-full border-0'
                    title={`${selectedTemplate.title} PDF Preview`}
                    style={{
                      overflow: 'hidden',
                      display: 'block',
                    }}
                    scrolling='no'
                    frameBorder='0'
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg sm:rounded-b-xl gap-3 sm:gap-2 shrink-0'>
                <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 order-2 sm:order-1'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTemplate.type === 'Education'
                        ? 'bg-indigo-100 text-indigo-700'
                        : selectedTemplate.type === 'Business'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedTemplate.type === 'Academic'
                        ? 'bg-purple-100 text-purple-700'
                        : selectedTemplate.type === 'Career'
                        ? 'bg-amber-100 text-amber-700'
                        : selectedTemplate.type === 'Recruitment'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {selectedTemplate.type}
                  </span>
                  <span className='hidden sm:inline'>
                    {selectedTemplate.date}
                  </span>
                </div>

                <div className='flex items-center gap-2 order-1 sm:order-2'>
                  <motion.button
                    className='flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md sm:rounded-lg transition-colors'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Use
                  </motion.button>
                  <motion.button
                    className='flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-medium rounded-md sm:rounded-lg transition-colors'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* New Template Form */}
        <NewTemplateForm
          isOpen={showNewTemplateForm}
          onClose={() => setShowNewTemplateForm(false)}
        />
      </motion.div>
    </DashboardLayout>
  )
}

export default MyTemplatesPage
