import { motion } from 'framer-motion'
import { FileText, Plus, Sparkles } from 'lucide-react'
import React from 'react'

const SmartHeader = () => {
  return (
    <div>
      <div className='w-full bg-black relative overflow-hidden py-8 px-4 sm:px-10 lg:px-24 xl:px-32'>
        {/* Background Elements */}
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

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='text-center md:text-left mb-4 md:mb-0 md:pr-8 w-full py-4'
            >
              <div className='flex items-center mb-4 justify-start md:justify-start'>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className='mr-2'
                >
                  <Sparkles className='w-5 h-5 text-gray-100' />
                </motion.div>
                <div className='flex items-center'>
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
                <span className='text-white'>Smart Templates</span>
              </h1>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className='h-1 bg-gradient-to-r bg-[#3e9ef5] rounded-full mb-4 hidden md:block'
                style={{ maxWidth: '355px' }}
              />
              <p className='text-gray-300 text-lg mb-4 max-w-lg leading-relaxed'>
                Create professional documents in seconds with our AI‑powered
                Smart Templates. Support for 100+ languages.
              </p>

              <div className='flex items-center justify-start md:justify-start mt-4'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white font-medium rounded-lg flex items-center space-x-2 text-sm'
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
              {/* Main document preview */}
              <div className='bg-[#3e9ef5] bg-opacity-5 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-5 relative z-20'>
                <div className='flex justify-between items-center mb-4'>
                  <div className='flex space-x-1.5'>
                    <div className='w-3 h-3 bg-red-400 rounded-full'></div>
                    <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
                    <div className='w-3 h-3 bg-green-400 rounded-full'></div>
                  </div>
                  <div className='text-xs font-medium text-white'>
                    AI Template
                  </div>
                </div>

                <div className='h-36 flex flex-col justify-center items-center'>
                  <div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-3'>
                    <FileText className='w-5 h-5 text-gray-300' />
                  </div>
                  <div className='space-y-1.5 w-full'>
                    <div className='h-2 bg-white rounded-full w-3/5 mx-auto'></div>
                    <div className='h-2 bg-white rounded-full w-4/5 mx-auto'></div>
                    <div className='h-2 bg-white rounded-full w-2/3 mx-auto'></div>
                  </div>
                </div>

                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className='h-1 bg-gray-100 rounded-full mt-5'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartHeader
