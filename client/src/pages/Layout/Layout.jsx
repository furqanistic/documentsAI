import { AnimatePresence, motion } from 'framer-motion'
import { Menu, User, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Define the height of the navbar for spacing calculations
const NAVBAR_HEIGHT = '64px'

// AI-focused navigation categories with Pricing after Examples and added hrefs
const navLinks = [
  {
    name: 'Create Documents',
    description: 'Generate professional documents instantly',
    href: '/',
  },
  {
    name: 'Interactive Tests',
    description: 'Auto-graded online assessments',
    href: '/',
  },
  {
    name: 'Smart Templates',
    description: 'Pre-designed AI templates',
    href: '/templates',
  },
  {
    name: 'Examples',
    description: 'View sample AI-generated content',
    href: '/',
  },
  {
    name: 'Pricing',
    description: 'Affordable plans for all your needs',
    href: '/',
  },
]

// Topbar Component
const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header className='w-full bg-black text-white fixed top-0 left-0 z-50 h-16'>
      <div className='container mx-auto h-full px-4 flex items-center justify-between'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className='text-xl font-bold sm:text-2xl'>
            <span className='relative'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400'>
                Calani AI
              </span>
              <span className='absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-white to-transparent'></span>
            </span>
          </h1>
        </motion.div>

        {/* Desktop Navigation - with improved responsive spacing and adjustments for Pricing */}
        <div className='hidden md:flex items-center justify-center md:space-x-3 lg:space-x-6 xl:space-x-8'>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.a
                href={link.href}
                className='text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 whitespace-nowrap'
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Right side - Login/Signup */}
        <div className='flex items-center space-x-4'>
          <motion.button
            whileHover={{ y: -1 }}
            className='hidden md:block text-sm font-medium text-white hover:text-white transition-colors duration-200 whitespace-nowrap'
          >
            Log In
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            className='hidden md:flex items-center space-x-2 bg-white text-black rounded-md px-4 py-1.5 transition-all duration-200 cursor-pointer hover:bg-gray-100 whitespace-nowrap'
          >
            <span className='text-sm font-medium'>Sign Up</span>
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='inline-flex md:hidden items-center justify-center w-10 h-10 rounded-md text-gray-300 hover:text-black hover:bg-white focus:outline-none focus:ring-0 transition-colors duration-200'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Menu'
          >
            <Menu size={20} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Professional Design */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
              opacity: { duration: 0.2 },
            }}
            className='absolute top-16 left-0 right-0 bg-black z-50 border-t border-gray-800 shadow-xl overflow-hidden'
          >
            <div className='container mx-auto p-4'>
              <div className='grid gap-2'>
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.05 },
                    }}
                    className='block px-4 py-3 rounded-md hover:bg-gray-900 text-white transition-colors duration-150'
                  >
                    <div className='font-medium text-sm'>{link.name}</div>
                    <div className='text-xs text-gray-400 mt-1'>
                      {link.description}
                    </div>
                  </motion.a>
                ))}

                <div className='grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-800'>
                  <motion.a
                    href='/login'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='py-2.5 text-sm text-center font-medium rounded-md border border-white text-white hover:bg-gray-900'
                  >
                    Log In
                  </motion.a>
                  <motion.a
                    href='/signup'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className='py-2.5 text-sm text-center rounded-md bg-white text-black hover:bg-gray-100 font-medium'
                  >
                    Sign Up
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Layout component that adds the topbar spacing helper
const Layout = ({ children }) => {
  return (
    <>
      <Topbar />
      <style jsx global>{`
        body {
          padding-top: ${NAVBAR_HEIGHT};
        }

        /* This ensures that anchor links get proper scroll positioning */
        html {
          scroll-padding-top: ${NAVBAR_HEIGHT};
        }
      `}</style>
      {children}
    </>
  )
}

export default Layout
