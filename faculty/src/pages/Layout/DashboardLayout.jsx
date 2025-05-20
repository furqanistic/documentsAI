import { AnimatePresence, motion } from 'framer-motion'
import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorCog,
  Settings,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'templates', icon: FileText, label: 'Templates' },
    { id: 'documents', icon: FolderOpen, label: 'My Documents' },
    { id: 'tests', icon: MonitorCog, label: 'Test Management' },
    { id: 'profile', icon: Settings, label: 'Profile' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleNavigation = (itemId) => {
    setActiveItem(itemId)
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  const mobileMenuVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Mobile Menu Button */}
      <div className='md:hidden fixed top-4 left-4 z-30'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 rounded-full bg-white shadow-md text-gray-800 focus:outline-none'
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className='fixed inset-0 bg-black bg-opacity-50 z-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />

            <motion.div
              className='fixed left-0 top-0 h-full w-56 bg-white z-30 shadow-xl p-4'
              variants={mobileMenuVariants}
              initial='closed'
              animate='open'
              exit='closed'
            >
              <div className='flex items-center justify-between mb-8'>
                <img
                  src='./logo.png'
                  alt='Logo'
                  className='h-16 object-contain'
                />
                <button
                  onClick={toggleMobileMenu}
                  className='text-gray-500 focus:outline-none'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='space-y-1'>
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center w-full p-3 rounded-lg ${
                        activeItem === item.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      } transition-colors duration-200`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} className='mr-3' />
                      <span className='font-medium'>{item.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              <div className='absolute bottom-8 left-0 w-full px-4'>
                <motion.button
                  className='flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-gray-200 transition-colors duration-200'
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={20} className='mr-3' />
                  <span className='font-medium'>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always Expanded */}
      <div className='hidden md:block w-56 h-full border-r border-gray-200 bg-white shadow-sm'>
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex justify-center items-center w-full px-4 py-6'>
            <img src='./logo.png' alt='Logo' className='h-16 object-contain' />
          </div>

          {/* Navigation Items */}
          <div className='flex-1 px-2 py-4 space-y-1 overflow-y-auto'>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center justify-start w-full p-2.5 rounded-lg ${
                    activeItem === item.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div>
                    <motion.div
                      whileHover={{ rotate: activeItem === item.id ? 0 : 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={20} />
                    </motion.div>
                  </div>
                  <span className='ml-3 font-medium'>{item.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Logout Button */}
          <div className='px-2 py-4 border-t border-gray-200'>
            <motion.button
              className='flex items-center justify-start w-full p-2.5 rounded-lg text-red-600 hover:bg-gray-100 transition-colors duration-200'
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
            >
              <LogOut size={20} />
              <span className='ml-3 font-medium'>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
