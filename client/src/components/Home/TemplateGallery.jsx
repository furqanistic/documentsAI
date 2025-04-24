import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Bookmark,
  Brain,
  Briefcase,
  Clock,
  Eye,
  FileText,
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
    popularity: 'Popular',
    icon: School,
  },
  {
    id: 2,
    title: 'Interview Question Pack',
    category: 'Professional',
    description:
      'Generate tailored interview questions for any role or position.',
    tags: ['Professional', 'Interview', 'HR'],
    popularity: 'Trending',
    icon: Users,
  },
  {
    id: 3,
    title: 'Study Guide Generator',
    category: 'Education',
    description:
      'Create comprehensive study guides from your course materials.',
    tags: ['Education', 'Study', 'Notes'],
    popularity: 'New',
    icon: Brain,
  },
  {
    id: 4,
    title: 'Business Proposal',
    category: 'Professional',
    description:
      'Professional business proposal templates with customizable sections.',
    tags: ['Professional', 'Business', 'Proposal'],
    popularity: 'Popular',
    icon: Briefcase,
  },
  {
    id: 5,
    title: 'Essay Examination',
    category: 'Education',
    description:
      'Create open-ended essay exams with detailed rubrics for assessment.',
    tags: ['Education', 'Essays', 'Assessment'],
    popularity: 'New',
    icon: FileText,
  },
  {
    id: 6,
    title: 'Research Report',
    category: 'Academic',
    description: 'Structured research report templates with proper formatting.',
    tags: ['Academic', 'Research', 'Report'],
    popularity: 'Trending',
    icon: Award,
  },
  {
    id: 7,
    title: 'Weekly Quiz',
    category: 'Education',
    description:
      'Quick quiz templates for regular knowledge checks and classroom engagement.',
    tags: ['Education', 'Quiz', 'Weekly'],
    popularity: 'Popular',
    icon: Clock,
  },
  {
    id: 8,
    title: 'Project Brief',
    category: 'Professional',
    description:
      'Clear and concise project brief templates for team alignment.',
    tags: ['Professional', 'Project', 'Brief'],
    popularity: 'New',
    icon: Bookmark,
  },
]

// Category chips with icons - modified order to All → Academic → Education → Professional
const categories = [
  { name: 'All', icon: null, active: true },
  { name: 'Academic', icon: Award, active: false },
  { name: 'Education', icon: School, active: false },
  { name: 'Professional', icon: Briefcase, active: false },
]

const TemplateGallery = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [filteredTemplates, setFilteredTemplates] = useState(templates)
  const [isMobile, setIsMobile] = useState(false)

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

  // Filter templates based on search term and active category
  useEffect(() => {
    const results = templates.filter((template) => {
      const matchesSearch =
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )

      const matchesCategory =
        activeCategory === 'All' || template.category === activeCategory

      return matchesSearch && matchesCategory
    })

    setFilteredTemplates(results)
  }, [searchTerm, activeCategory])

  return (
    <div className='py-10 pt-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-12'
        >
          <motion.div
            className='inline-flex items-center px-2 md:px-4 py-1 md:py-2 mb-3 md:mb-4 space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-gray-800 bg-white rounded-full shadow-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FileText size={16} className='text-gray-600' />
            <span>Ready-to-Use</span>
          </motion.div>

          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-3'>
            Templates Gallery
          </h2>
          <p className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'>
            Choose from our collection of templates or easily design your own,
            creating quality work in only minutes.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className='mb-6 md:mb-10'
        >
          <div className='flex flex-wrap gap-2 md:gap-3 justify-center'>
            {categories.map((category) => (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center px-2 py-1 md:px-4 md:py-2 rounded-full border text-xs md:text-sm transition-all ${
                  activeCategory === category.name
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {category.icon && (
                  <category.icon size={12} className='mr-1 md:mr-2 md:size-4' />
                )}
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className='mt-6'>
          {filteredTemplates.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-xl text-gray-600'>
                No templates found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6'>
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
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                    className='bg-white rounded-xl overflow-hidden border border-black hover:border-gray-800 transition-all group'
                  >
                    <div className='relative'>
                      <div className='absolute top-0 right-0 m-2 md:m-3 z-10'>
                        <div
                          className={`text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded-full backdrop-blur-sm ${
                            template.popularity === 'Popular'
                              ? 'bg-blue-100/80 text-blue-800'
                              : template.popularity === 'Trending'
                              ? 'bg-orange-100/80 text-orange-800'
                              : 'bg-green-100/80 text-green-800'
                          }`}
                        >
                          {template.popularity}
                        </div>
                      </div>
                      <div className='h-20 md:h-36 bg-black flex items-center justify-center overflow-hidden'>
                        <motion.div
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05, rotate: 3 }}
                          transition={{ duration: 0.3 }}
                          className='p-2 md:p-4 bg-white rounded-full shadow-md'
                        >
                          <template.icon
                            size={20}
                            className='md:size-7 text-gray-800'
                          />
                        </motion.div>
                      </div>
                    </div>
                    <div className='p-3 md:p-6 flex flex-col h-48 md:h-64'>
                      <h3 className='text-sm md:text-lg font-semibold mb-1 md:mb-2 group-hover:text-gray-700 line-clamp-1'>
                        {template.title}
                      </h3>
                      <p className='text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2'>
                        {template.description}
                      </p>
                      <div className='flex flex-wrap gap-1 md:gap-2 mb-auto'>
                        {template.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className='text-xs bg-gray-100 text-gray-700 px-2 py-0.5 md:py-1 rounded-full'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className='grid grid-cols-2 gap-2 mt-2 md:mt-4'>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className='flex items-center justify-center text-xs md:text-sm font-medium text-gray-800 bg-gray-100 border border-gray-200 px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition-all hover:bg-gray-200'
                        >
                          <Eye size={12} className='md:size-4 mr-1 md:mr-1.5' />
                          <span>View</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className='flex items-center justify-center text-xs md:text-sm font-medium text-white bg-gray-900 px-2 py-1 md:px-3 md:py-1.5 rounded-lg transition-all hover:bg-black'
                        >
                          <span>Use</span>
                          <ArrowRight
                            size={12}
                            className='md:size-4 ml-1 md:ml-1.5'
                          />
                        </motion.button>
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
