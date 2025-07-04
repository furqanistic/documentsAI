import Footer from '@/components/Home/Footer'
import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/userSlice'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from '../Auth/AuthModal'

// Define the height of the navbar for spacing calculations
const NAVBAR_HEIGHT = '64px'

// AI-focused navigation categories with hrefs
const navLinks = [
  {
    name: 'Create Documents',
    description: 'Create professional docs with intelligence.',
    href: '/create',
  },
  {
    name: 'Interactive Tests',
    description: 'Create engaging assessments with ease.',
    href: '/tests',
  },
  {
    name: 'Smart Templates',
    description: 'Create docs in seconds with templates.',
    href: '/templates',
  },
  {
    name: 'Examples',
    description: 'Real documents generated by our AI.',
    href: '/examples',
  },
  {
    name: 'Pricing',
    description: 'Affordable plans for all your needs',
    href: '/pricing',
  },
]

// User Dropdown Component
const UserDropdown = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const dropdownItems = [
    {
      label: 'Dashboard',
      href: 'https://dashboard.documnt.ai/',
      icon: <LayoutDashboard size={16} />,
    },
    {
      label: 'Subscriptions',
      href: '/',
      icon: <CreditCard size={16} />,
    },
    {
      label: 'Settings',
      href: 'https://dashboard.documnt.ai/settings',
      icon: <Settings size={16} />,
    },
  ]

  return (
    <div className='relative' ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center space-x-2 px-2 lg:px-3 py-1.5 rounded-md text-white hover:bg-gray-800 transition-colors duration-200'
        whileHover={{ y: -1 }}
      >
        {/* User Icon */}
        <div className='flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 bg-gray-700 rounded-full'>
          <UserIcon size={14} className='text-gray-300 lg:w-4 lg:h-4' />
        </div>

        <div className='text-left hidden lg:block'>
          <div className='text-sm font-medium'>{user.name}</div>
          <div className='text-xs text-gray-300 capitalize'>
            {user.role || 'User'}
          </div>
        </div>

        {/* Show abbreviated name on tablets */}
        <div className='text-left lg:hidden'>
          <div className='text-sm font-medium'>
            {user.name?.split(' ')[0] || 'User'}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className='text-gray-300 lg:w-4 lg:h-4' />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute right-0 mt-2 w-44 lg:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'
          >
            {dropdownItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className='flex items-center space-x-3 px-3 lg:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.a>
            ))}

            <div className='border-t border-gray-100 my-1'></div>

            <motion.button
              onClick={onSignOut}
              className='flex items-center space-x-3 w-full px-3 lg:px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: dropdownItems.length * 0.05 }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Mobile User Menu Component
const MobileUserMenu = ({ user, onSignOut }) => {
  const menuItems = [
    { label: 'Dashboard', href: 'https://dashboard.documnt.ai/' },
    { label: 'Subscriptions', href: '/subscriptions' },
    { label: 'Settings', href: '/settings' },
  ]

  return (
    <div className='px-4 py-4'>
      {/* User Info */}
      <div className='flex items-center space-x-3 mb-4 p-3 bg-gray-900 rounded-lg'>
        {/* User Icon */}
        <div className='flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full flex-shrink-0'>
          <UserIcon size={20} className='text-gray-300' />
        </div>

        <div>
          <div className='text-base font-medium text-white'>{user.name}</div>
          <div className='text-sm text-gray-300 capitalize'>
            {user.role || 'User'}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className='space-y-2'>
        {menuItems.map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className='block p-3 rounded-lg hover:bg-gray-900 transition-colors'
          >
            <div className='text-base font-medium text-white'>{item.label}</div>
          </motion.a>
        ))}

        <motion.button
          onClick={onSignOut}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: menuItems.length * 0.05 }}
          className='block w-full p-3 rounded-lg hover:bg-red-900 transition-colors text-left'
        >
          <div className='text-base font-medium text-red-400'>Sign Out</div>
        </motion.button>
      </div>
    </div>
  )
}

// Topbar Component
const Topbar = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

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

  // Handle sign out
  const handleSignOut = () => {
    dispatch(logout())
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className='w-full bg-black text-white fixed top-0 left-0 z-50 h-16'>
        <div className='container mx-auto h-full px-2 md:px-4 lg:px-6 xl:px-8 flex items-center justify-between'>
          {/* Logo with Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='flex items-center pl-2 lg:pl-0'
          >
            <a href='/' className='flex items-center space-x-1'>
              <img
                src='./logo-3.png'
                alt='Logo'
                className='h-10 md:h-11 lg:h-12 object-contain'
              />
            </a>
          </motion.div>

          {/* Desktop Navigation - Better tablet spacing */}
          <div className='hidden md:flex items-center justify-center space-x-2 md:space-x-3 lg:space-x-5 xl:space-x-8'>
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <motion.a
                  href={link.href}
                  className='text-xs md:text-sm text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 whitespace-nowrap px-1 md:px-2 lg:px-0'
                  whileHover={{ scale: 1.05 }}
                >
                  {link.name}
                </motion.a>
              </motion.div>
            ))}
          </div>

          {/* Right side - User Info or Auth Buttons */}
          <div className='flex items-center space-x-2 md:space-x-4'>
            {isAuthenticated && currentUser ? (
              // User is logged in - show user dropdown (desktop only)
              <div className='hidden md:block'>
                <UserDropdown user={currentUser} onSignOut={handleSignOut} />
              </div>
            ) : (
              // User is not logged in - show auth buttons
              <>
                <motion.button
                  whileHover={{ y: -1 }}
                  className='hidden md:block text-sm font-medium text-white hover:text-white transition-colors duration-200 whitespace-nowrap px-2 lg:px-0'
                  onClick={() => openAuthModal('login')}
                >
                  Log In
                </motion.button>

                <motion.button
                  whileHover={{ y: -1 }}
                  className='hidden md:flex items-center space-x-2 bg-white text-black rounded-md px-3 lg:px-4 py-1.5 transition-all duration-200 cursor-pointer hover:bg-gray-100 whitespace-nowrap'
                  onClick={() => openAuthModal('signup')}
                >
                  <span className='text-sm font-medium'>Sign Up</span>
                </motion.button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className='inline-flex md:hidden items-center justify-center w-8 h-8 rounded-md text-gray-300 hover:text-black hover:bg-white focus:outline-none focus:ring-0 transition-colors'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label='Menu'
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='fixed inset-x-0 top-16 bottom-0 z-50 bg-black'
            >
              <div className='flex flex-col h-full'>
                <div className='flex-1 overflow-y-auto'>
                  <div className='px-4 pt-4 pb-20'>
                    {/* Navigation Links */}
                    {navLinks.map((link, i) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className='block p-3 rounded-lg hover:bg-gray-900 transition-colors mb-3'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className='text-base font-medium text-white'>
                          {link.name}
                        </div>
                        <p className='text-sm text-gray-300'>
                          {link.description}
                        </p>
                      </motion.a>
                    ))}

                    {/* User menu for mobile (if authenticated) */}
                    {isAuthenticated && currentUser && (
                      <div className='mt-6 pt-6 border-t border-gray-800'>
                        <MobileUserMenu
                          user={currentUser}
                          onSignOut={handleSignOut}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Auth buttons - only show if not authenticated */}
                {!isAuthenticated && (
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal - only show if not authenticated */}
      {!isAuthenticated && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView={authModalView}
        />
      )}
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
