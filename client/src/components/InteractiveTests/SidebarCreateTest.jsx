import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Brain,
  CalendarClock,
  Check,
  Clock,
  FileQuestion,
  Info,
  LayoutGrid,
  MessageSquare,
  PieChart,
  Play,
  Sigma,
  Sparkles,
  Tag,
  Upload,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import React from 'react'

const SidebarCreateTest = () => {
  // Animation variants - updated to match SidebarCreateDocument
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Features list - keeping original data
  const features = [
    {
      icon: <Sparkles className='h-5 w-5 text-purple-500' />,
      text: 'AI-Powered Test Creation',
      description: 'Create tests from prompts or existing materials',
    },
    {
      icon: <FileQuestion className='h-5 w-5 text-blue-500' />,
      text: 'Multiple Question Types',
      description: 'Multiple choice, essay, matching, and more',
    },
    {
      icon: <Clock className='h-5 w-5 text-orange-500' />,
      text: 'Timed Assessments',
      description: 'Set time limits for the entire test or per question',
    },
    {
      icon: <PieChart className='h-5 w-5 text-green-500' />,
      text: 'Instant Grading & Analysis',
      description: 'Automatic scoring with performance insights',
    },
    {
      icon: <Users className='h-5 w-5 text-indigo-500' />,
      text: 'Easy Sharing',
      description: 'Share with participants via unique link or embed',
    },
    {
      icon: <Brain className='h-5 w-5 text-rose-500' />,
      text: 'Randomization',
      description: 'Randomly order questions or answer choices',
    },
  ]

  // Pro tips - keeping original data
  const proTips = [
    'Use specific prompts for better test generation results',
    'Include the target audience level in your description',
    'Specify the number and types of questions you want',
    'Upload existing materials to generate similar tests',
  ]

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={staggerContainer}
      className='lg:col-span-4 space-y-5'
    >
      {/* Features Card - updated styling to match SidebarCreateDocument */}
      <motion.div
        variants={itemVariant}
        className='bg-white rounded-xl shadow-md border border-gray-200 p-5 overflow-hidden'
      >
        <h3 className='text-lg font-bold mb-3 flex items-center text-gray-800'>
          Features
        </h3>
        <ul className='space-y-2.5'>
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className='flex items-center space-x-3'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className='p-1.5 flex-shrink-0'>{feature.icon}</div>
              <div className='flex flex-col space-y-0.5'>
                <span className='text-2xs font-medium text-gray-800'>
                  {feature.text}
                </span>
                <span className='text-xs text-gray-500 leading-tight'>
                  {feature.description}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Pro Tips Card - exact match to Interactive Testing styling */}
      <motion.div
        variants={itemVariant}
        className='bg-white rounded-xl shadow-md border border-gray-200 p-5 overflow-hidden'
      >
        <h3 className='text-lg font-bold mb-3 flex items-center text-gray-800'>
          Pro Tips
        </h3>
        <div className='space-y-4'>
          <p className='text-xs text-gray-700 leading-tight'>
            Follow these guidelines for the best test creation results:
          </p>
          <ul className='space-y-1.5'>
            {proTips.map((tip, index) => (
              <li key={index} className='flex items-center space-x-2'>
                <div className='bg-green-100 p-1 rounded-full'>
                  <Check className='h-4 w-4 text-green-600' />
                </div>
                <span className='text-xs text-gray-700'>{tip}</span>
              </li>
            ))}
          </ul>
          <button className='w-full mt-2 text-xs bg-gray-900 text-white py-2.5 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-all shadow-sm'>
            <div className='flex items-center space-x-2'>
              <Zap className='h-4 w-4 text-white' />
              <span>View Example Tests</span>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SidebarCreateTest
