import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/redux/userSlice'
import {
  ChevronDown,
  CreditCard,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorCog,
  Settings,
  User as UserIcon,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sidebarRef = useRef(null)

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', url: '/' },
    {
      id: 'documents',
      icon: FolderOpen,
      label: 'My Documents',
      url: '/mydocuments',
    },
    {
      id: 'tests',
      icon: MonitorCog,
      label: 'Test Management',
      url: '/management',
    },
    {
      id: 'templates',
      icon: FileText,
      label: 'My Templates',
      url: '/mytemplates',
    },
    {
      id: 'profile',
      icon: Settings,
      label: 'Profile Settings',
      url: '/settings',
    },
  ]

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      window.location.href = '/'
    }
  }, [isAuthenticated, currentUser])

  // Determine active item based on current URL (no lag)
  const getActiveItem = () => {
    if (typeof window === 'undefined') return 'dashboard'

    const currentPath = window.location.pathname

    // Find the matching sidebar item based on current URL
    const currentItem = sidebarItems.find((item) => {
      if (item.url === '/') {
        // For dashboard, only match exact root path
        return currentPath === '/'
      }
      // For other items, check if current path starts with the item's URL
      return currentPath === item.url || currentPath.startsWith(item.url + '/')
    })

    return currentItem ? currentItem.id : 'dashboard'
  }

  const [activeItem, setActiveItem] = useState(getActiveItem)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setIsMobileMenuOpen(!isMobileMenuOpen)

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 300) // Match the duration of the CSS transition
    }
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleNavigation = (itemId, url) => {
    setActiveItem(itemId)
    window.location.href = url // Navigate to the URL
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsUserMenuOpen(false)
    // Redirect will happen automatically due to useEffect above
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleMobileMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !currentUser) {
    return null
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-20 md:hidden'
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-64 bg-white z-30 shadow-2xl border-r border-gray-200 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-8'>
            <img
              src='/logo-new.png'
              alt='Logo'
              className='h-13 object-contain'
            />
            <button
              onClick={toggleMobileMenu}
              className='p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors duration-200'
            >
              <X size={20} />
            </button>
          </div>

          <div className='space-y-1'>
            {sidebarItems.map((item, index) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(item.id, item.url)
                  }}
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 transform ${
                    activeItem === item.id
                      ? 'bg-gray-900 text-white scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                  style={{
                    animationDelay: isMobileMenuOpen
                      ? `${index * 50}ms`
                      : '0ms',
                  }}
                >
                  <Icon size={20} className='mr-3' />
                  <span className='font-medium'>{item.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Always Expanded */}
      <div className='hidden md:block w-56 h-full border-r border-gray-200 bg-white'>
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='flex justify-center items-center w-full px-4 py-2'>
            <img
              src='/logo-new.png'
              alt='Logo'
              className='h-14 object-contain'
            />
          </div>

          {/* Navigation Items */}
          <div className='flex-1 px-2 py-4 space-y-1 overflow-y-auto'>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(item.id, item.url)
                  }}
                  className={`flex items-center justify-start w-full p-2.5 rounded-lg transition-all duration-200 transform ${
                    activeItem === item.id
                      ? 'bg-gray-900 text-white scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  <Icon size={20} />
                  <span className='ml-3 font-medium'>{item.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <header className='bg-white border-b border-gray-200 relative'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex items-center justify-between h-16 pl-4 md:pl-6 pr-4'>
              {/* Mobile hamburger menu */}
              <div className='md:hidden flex items-center'>
                <button
                  onClick={toggleMobileMenu}
                  className={`p-2 rounded-lg bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none transition-all duration-200 transform hover:scale-105 ${
                    isMobileMenuOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                  disabled={isAnimating}
                >
                  {isMobileMenuOpen ? (
                    <X
                      size={20}
                      className='transition-transform duration-200'
                    />
                  ) : (
                    <Menu
                      size={20}
                      className='transition-transform duration-200'
                    />
                  )}
                </button>
              </div>

              {/* Page title or breadcrumbs could go here */}
              <div className='flex-1'></div>

              {/* User Info */}
              <div className='relative user-menu-container'>
                <button
                  onClick={toggleUserMenu}
                  className='flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900 focus:outline-none transition-all duration-200 transform hover:scale-105'
                >
                  <div className='flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full'>
                    <UserIcon size={16} className='text-gray-300' />
                  </div>
                  <div className='text-left'>
                    <div className='font-medium'>{currentUser.name}</div>
                    <div className='text-xs text-gray-500 capitalize'>
                      {currentUser.role || 'User'}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 transform transition-all duration-200 scale-95 animate-in fade-in zoom-in'>
                    <div className='py-1'>
                      <a
                        href='/profile'
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon size={16} className='mr-2' />
                        Profile
                      </a>
                      <a
                        href='/settings'
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className='mr-2' />
                        Settings
                      </a>
                      <a
                        href='/subscriptions'
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <CreditCard size={16} className='mr-2' />
                        Subscriptions
                      </a>
                      <hr className='my-1' />
                      <button
                        onClick={handleLogout}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150'
                      >
                        <LogOut size={16} className='mr-2' />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
