import { motion } from 'framer-motion'
import { BrainCircuit, Check, Clock, Globe, Languages, Zap } from 'lucide-react'
import React from 'react'

const SidebarCreateDocument = () => {
  // Animation variants
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

  const features = [
    {
      icon: <BrainCircuit className='h-5 w-5 text-pink-500' />,
      text: 'AI-powered document creation',
      description: 'Cutting-edge AI to generate professional content',
    },
    {
      icon: <Languages className='h-5 w-5 text-teal-500' />,
      text: 'Supports 100+ languages',
      description: 'Create content in any language you need',
    },
    {
      icon: <Zap className='h-5 w-5 text-orange-500' />,
      text: 'Professional formatting',
      description: 'Perfect layout and styling automatically applied',
    },
    {
      icon: <Clock className='h-5 w-5 text-violet-500' />,
      text: 'Create in minutes, not hours',
      description: 'Save time with instant document generation',
    },
  ]

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={staggerContainer}
      className='lg:col-span-4 space-y-5'
    >
      {/* Enhanced Features List */}
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

      {/* Interactive Testing Card */}
      <motion.div
        variants={itemVariant}
        className='bg-white rounded-xl shadow-md border border-gray-200 p-5 overflow-hidden'
      >
        <h3 className='text-lg font-bold mb-3 flex items-center text-gray-800'>
          Interactive Testing
        </h3>
        <div className='space-y-4'>
          <p className='text-sm text-black leading-tight'>
            Turn exams into interactive tests with one click:
          </p>
          <ul className='space-y-1.5'>
            <li className='flex items-center space-x-2'>
              <div className='bg-green-100 p-1 rounded-full'>
                <Check className='h-4 w-4 text-green-600' />
              </div>
              <span className='text-xs text-gray-700'>
                Secure shareable links
              </span>
            </li>
            <li className='flex items-center space-x-2'>
              <div className='bg-green-100 p-1 rounded-full'>
                <Check className='h-4 w-4 text-green-600' />
              </div>
              <span className='text-xs text-gray-700'>Automatic grading</span>
            </li>
            <li className='flex items-center space-x-2'>
              <div className='bg-green-100 p-1 rounded-full'>
                <Check className='h-4 w-4 text-green-600' />
              </div>
              <span className='text-xs text-gray-700'>Detailed analytics</span>
            </li>
            <li className='flex items-center space-x-2'>
              <div className='bg-green-100 p-1 rounded-full'>
                <Check className='h-4 w-4 text-green-600' />
              </div>
              <span className='text-xs text-gray-700'>
                Anti-cheating measures
              </span>
            </li>
          </ul>
          <button className='w-full mt-2 text-xs bg-gray-900 text-white py-2.5 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-all shadow-sm'>
            <div className='flex items-center space-x-2'>
              <Zap className='h-4 w-4 text-white' />
              <span>Learn More</span>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SidebarCreateDocument
