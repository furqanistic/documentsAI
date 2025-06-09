import { motion } from 'framer-motion'
import { ArrowLeft, FileX, Home, Search } from 'lucide-react'
import React from 'react'
import Layout from '../Layout/Layout'

const ErrorPage = () => {
  const handleHomeClick = () => {
    // Navigate to home - you can replace this with your routing logic
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <Layout>
      <div className='min-h-screen bg-white px-4 pt-8'>
        <div className='max-w-4xl w-full mx-auto text-center'>
          {/* Animated GIF */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='mb-8 md:mb-20'
          >
            <img
              src='/404.gif'
              alt='404 Error Animation'
              className='w-full max-w-2xl mx-auto h-auto object-contain'
            />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className='mb-10'
          >
            <h2 className='text-3xl md:text-4xl font-semibold text-black mb-6'>
              Page Not Found
            </h2>
            <p className='text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto'>
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <motion.button
              onClick={handleHomeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto'
            >
              <Home className='w-5 h-5' />
              Go to Home
            </motion.button>

            <motion.button
              onClick={handleGoBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center gap-3 bg-gray-100 text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors duration-200 w-full sm:w-auto'
            >
              <ArrowLeft className='w-5 h-5' />
              Go Back
            </motion.button>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default ErrorPage
