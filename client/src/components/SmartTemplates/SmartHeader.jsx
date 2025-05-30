import { motion } from 'framer-motion'
import { FileSearch } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SmartHeader = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect - simpler, just for subtle styling changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`w-full bg-black py-4 sm:py-5 px-4 sm:px-6 lg:px-8 relative border-b ${
        scrolled ? 'border-[#3e9ef5]/20 shadow-md' : 'border-gray-800'
      } transition-all duration-300`}
    >
      {/* Simple grid background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(62, 158, 245, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(62, 158, 245, 0.03) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Simple glow effect - static, no animation */}
        <div className='absolute top-0 left-1/4 w-1/2 h-24 bg-[#3e9ef5] rounded-full filter blur-[100px] opacity-5' />
      </div>
      <div className='max-w-6xl mx-auto relative'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0'>
          {/* Left side - Logo and text with clean layout */}
          <div className='flex flex-col sm:flex-row items-center text-center sm:items-center sm:text-left gap-4 w-full sm:w-auto'>
            {/* Clean logo with subtle hover effect - INCREASED SIZE */}
            <div className='relative flex flex-col items-center sm:-mt-2'>
              <motion.div
                className='bg-gradient-to-br from-[#3e9ef5] to-[#2171b5] h-16 w-16 rounded-lg flex items-center justify-center shadow-md flex-shrink-0'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FileSearch className='w-8 h-8 text-white' />
              </motion.div>
              {/* AI POWERED positioned to stick to bottom of icon */}
              <div className='absolute -bottom-3 px-2 py-0.5 bg-[#3e9ef5] rounded text-xs font-semibold text-white whitespace-nowrap'>
                AI-POWERED
              </div>
            </div>
            <div className='flex flex-col justify-center mt-4 sm:mt-0 sm:ml-4'>
              <h2 className='text-4xl md:text-5xl font-bold text-white tracking-tight mb-1'>
                Smart Templates
              </h2>
              {/* Mobile version - hidden on sm screens and above */}
              <p className='text-gray-400 text-lg max-w-md sm:hidden'>
                Create docs in seconds with templates.
              </p>
              {/* Desktop version - hidden on mobile, visible on sm screens and above */}
              <p className='text-gray-400 text-lg max-w-md hidden sm:block'>
                Create documents in seconds with templates.
              </p>
            </div>
          </div>
          {/* Right side - Floating example template hidden on mobile, visible on SM and up */}
          <div className='hidden sm:flex justify-center'>
            <motion.div
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className='relative h-16 w-52 group cursor-pointer'
            >
              {/* Example template container with enhanced mac-style window */}
              <div className='absolute inset-0 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden group-hover:border-blue-500 transition-colors duration-300 shadow-lg'>
                {/* Mac-style header bar */}
                <div className='absolute top-0 left-0 right-0 h-5 bg-gray-800 flex items-center justify-between px-2'>
                  <div className='flex space-x-1.5'>
                    <div className='w-1.5 h-1.5 bg-red-400 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-yellow-400 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-green-400 rounded-full'></div>
                  </div>
                  <div className='text-xs text-gray-400'>Template</div>
                </div>
                {/* Example template content with template design */}
                <div className='absolute top-6 left-2 right-2'>
                  {/* Template type */}
                  <div className='flex justify-between items-center'>
                    <div className='text-xs text-[#3e9ef5] px-1 rounded'>
                      AI Template
                    </div>
                    <div className='text-xs text-[#3e9ef5]'>Use</div>
                  </div>

                  {/* Template content */}
                  <div className='my-1'>
                    <div className='h-1 bg-[#3e9ef5] rounded-full w-4/5'></div>
                    <div className='h-1 bg-[#3e9ef5]/60 rounded-full w-3/5 mt-0.5'></div>
                  </div>

                  {/* Template body with form fields styling */}
                  <div className='mt-2'>
                    {/* Paragraph 1 */}
                    <div className='mb-1'>
                      <div className='h-0.5 bg-gray-700 rounded-full w-full'></div>
                      <div className='h-0.5 bg-gray-700 rounded-full w-11/12 mt-0.5'></div>
                      <div className='h-0.5 bg-gray-700 rounded-full w-4/5 mt-0.5'></div>
                    </div>

                    {/* Form field - Highlighted */}
                    <div className='mb-1'>
                      <div className='h-0.5 bg-[#3e9ef5]/30 rounded-full w-full'></div>
                      <div className='h-0.5 bg-[#3e9ef5]/30 rounded-full w-11/12 mt-0.5'></div>
                      <div className='h-0.5 bg-[#3e9ef5]/30 rounded-full w-3/4 mt-0.5'></div>
                    </div>

                    {/* Signature line */}
                    <div className='mt-1.5'>
                      <div className='h-0.5 bg-gray-700 rounded-full w-1/3'></div>
                      <div className='h-0.5 bg-[#3e9ef5] rounded-full w-1/4 mt-1'></div>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className='mt-1 flex justify-between items-center'>
                    <div className='text-xs text-[#3e9ef5] flex items-center'>
                      <span className='inline-block w-1.5 h-1.5 bg-[#3e9ef5] rounded-full mr-1'></span>
                      Customizable
                    </div>
                    <div className='text-xs text-[#3e9ef5]'>✓</div>
                  </div>
                </div>
              </div>
              {/* Subtle shadow effect */}
              <motion.div
                className='absolute -inset-1 bg-[#3e9ef5]/20 rounded-lg blur-md -z-10'
                animate={{
                  opacity: isHovered ? 0.15 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartHeader
