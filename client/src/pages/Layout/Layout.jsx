import Footer from '@/components/Home/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AuthModal from '../Auth/AuthModal'

// Define the height of the navbar for spacing calculations
const NAVBAR_HEIGHT = '64px'

// AI-focused navigation categories with hrefs
const navLinks = [
  {
    name: 'Create Documents',
    description: 'Generate professional documents instantly',
    href: '/create',
  },
  {
    name: 'Interactive Tests',
    description: 'Auto-graded online assessments',
    href: '/tests',
  },
  {
    name: 'Smart Templates',
    description: 'Pre-designed AI templates',
    href: '/templates',
  },
  {
    name: 'Examples',
    description: 'View sample AI-generated content',
    href: '/examples',
  },
  {
    name: 'Pricing',
    description: 'Affordable plans for all your needs',
    href: '/pricing',
  },
]

// Topbar Component
const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState('signup')

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileMenuOpen])

  // Open auth modal with the correct view
  const openAuthModal = (view) => {
    setAuthModalView(view)
    setIsAuthModalOpen(true)
    // Close mobile menu if it's open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className='w-full bg-black text-white fixed top-0 left-0 z-50 h-16'>
        <div className='container mx-auto h-full px-2 md:px-4 flex items-center justify-between'>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='flex items-center'
          >
            <a href='/' className='block'>
              <img
                src='./logo.png'
                alt='Logo'
                className='h-12 object-contain lg:h-14'
              />
            </a>
          </motion.div>

          {/* Desktop Navigation */}
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
              onClick={() => openAuthModal('login')}
            >
              Log In
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              className='hidden md:flex items-center space-x-2 bg-white text-black rounded-md px-4 py-1.5 transition-all duration-200 cursor-pointer hover:bg-gray-100 whitespace-nowrap'
              onClick={() => openAuthModal('signup')}
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

        {/* Mobile Navigation Menu - Optimized for all screen sizes and browser UI placements */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='fixed inset-x-0 top-16 bottom-0 z-50 bg-black'
            >
              {/* Content area with guaranteed space for nav items and auth buttons */}
              <div className='flex flex-col h-full'>
                {/* Scrollable area if needed, but typically won't scroll on most devices */}
                <div className='flex-1 overflow-y-auto'>
                  <div className='px-4 pt-4 pb-20'>
                    {' '}
                    {/* Extra bottom padding to ensure space for fixed buttons */}
                    {navLinks.map((link, i) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className='block p-3 rounded-lg hover:bg-gray-900 transition-colors mb-3'
                      >
                        <div className='text-base font-medium text-white'>
                          {link.name}
                        </div>
                        <p className='text-sm text-gray-300'>
                          {link.description}
                        </p>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Auth buttons - fixed to bottom, always visible */}
                <div className='fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 w-full'>
                  <div className='grid grid-cols-2 gap-3 pb-safe'>
                    <button
                      onClick={() => openAuthModal('login')}
                      className='py-3 text-sm font-medium text-white border border-white rounded-lg hover:bg-gray-900 transition-colors'
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className='py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
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

        /* Add safe area inset for mobile devices */
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
