import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const AuthModal = ({ isOpen, onClose, initialView = 'signup' }) => {
  const [view, setView] = useState(initialView)
  const [showPassword, setShowPassword] = useState(false)

  // Prevent animation flicker when changing views
  const [isChangingView, setIsChangingView] = useState(false)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  // Mobile UI improvements
  const isMobile = windowWidth < 768

  // Set fixed height for mobile modal to maintain consistency between views
  const getMobileModalHeight = () => {
    if (windowWidth <= 320) {
      // iPhone SE 1st gen and similar
      return '530px'
    } else if (windowWidth <= 375) {
      // iPhone SE 2nd/3rd gen, iPhone 8, etc.
      return '550px'
    } else {
      return '570px'
    }
  }

  // Fixed height for mobile forms to maintain consistency between views
  const mobileFormHeight = '180px'

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close on escape key and prevent background scrolling
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden' // Also prevent html element scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('')
        setPassword('')
        setName('')
        setIsSubmitting(false)
      }, 300)
    }
  }, [isOpen])

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', { view, email, password, name })
      setIsSubmitting(false)
      // Usually you would handle the auth logic here
    }, 1500)
  }

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={handleBackdropClick}
        >
          {/* MOBILE DESIGN (< 768px) */}
          {isMobile ? (
            <motion.div
              className='bg-white rounded-2xl overflow-hidden w-full shadow-2xl flex flex-col'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: getMobileModalHeight(),
                maxWidth: '100%',
              }}
            >
              {/* Mobile header - with white background */}
              <motion.div className='relative p-4 border-b border-gray-200'>
                <div className='flex justify-between items-center'>
                  <motion.h3
                    className='text-lg font-bold text-gray-900'
                    key={view}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {view === 'signup' ? 'Create Account' : 'Log In'}
                  </motion.h3>
                  <motion.button
                    onClick={onClose}
                    className='p-1.5 rounded-full hover:bg-gray-100 transition-colors'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label='Close modal'
                  >
                    <X size={18} className='text-gray-500' />
                  </motion.button>
                </div>
              </motion.div>

              {/* Form area with better mobile spacing - reduced padding & fixed height */}
              <div className='px-4 py-3 flex-grow overflow-y-auto'>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.form
                    key={view}
                    onSubmit={handleSubmit}
                    className='space-y-3 flex flex-col w-full'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ minHeight: mobileFormHeight }}
                  >
                    {view === 'signup' ? (
                      <div
                        className='space-y-3'
                        style={{
                          height: mobileFormHeight,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <div>
                          <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700 mb-1.5'
                          >
                            Full Name
                          </label>
                          <div className='relative flex items-center'>
                            <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                              <User size={18} />
                            </div>
                            <input
                              id='name'
                              type='text'
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1.5'
                          >
                            Email Address
                          </label>
                          <div className='relative flex items-center'>
                            <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                              <Mail size={18} />
                            </div>
                            <input
                              id='email'
                              type='email'
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-1.5'
                          >
                            Password
                          </label>
                          <div className='relative flex items-center'>
                            <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                              <Lock size={18} />
                            </div>
                            <input
                              id='password'
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className='w-full pl-7 pr-8 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                              required
                            />
                            <motion.button
                              type='button'
                              className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
                              onClick={() => setShowPassword(!showPassword)}
                              whileTap={{ scale: 0.9 }}
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <EyeOff
                                  size={18}
                                  className='text-gray-400 hover:text-gray-600'
                                />
                              ) : (
                                <Eye
                                  size={18}
                                  className='text-gray-400 hover:text-gray-600'
                                />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className='space-y-3'
                        style={{
                          height: mobileFormHeight,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                        }}
                      >
                        <div>
                          <label
                            htmlFor='login-email'
                            className='block text-sm font-medium text-gray-700 mb-1.5'
                          >
                            Email Address
                          </label>
                          <div className='relative flex items-center'>
                            <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                              <Mail size={18} />
                            </div>
                            <input
                              id='login-email'
                              type='email'
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor='login-password'
                            className='block text-sm font-medium text-gray-700 mb-1.5'
                          >
                            Password
                          </label>
                          <div className='relative flex items-center'>
                            <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                              <Lock size={18} />
                            </div>
                            <input
                              id='login-password'
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className='w-full pl-7 pr-8 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                              required
                            />
                            <motion.button
                              type='button'
                              className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
                              onClick={() => setShowPassword(!showPassword)}
                              whileTap={{ scale: 0.9 }}
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                            >
                              {showPassword ? (
                                <EyeOff
                                  size={18}
                                  className='text-gray-400 hover:text-gray-600'
                                />
                              ) : (
                                <Eye
                                  size={18}
                                  className='text-gray-400 hover:text-gray-600'
                                />
                              )}
                            </motion.button>
                          </div>
                        </div>

                        {/* Forgot Password button */}
                        <div className='flex justify-end'>
                          <motion.button
                            type='button'
                            className='text-sm text-black hover:text-zinc-600 font-medium transition-colors'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Forgot Password?
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.form>
                </AnimatePresence>
              </div>

              {/* Bottom section with actions */}
              <div className='px-4 py-2'>
                <motion.button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 flex items-center justify-center text-white font-medium shadow-md rounded-md transition-all ${
                    isSubmitting
                      ? 'bg-black/80 cursor-not-allowed'
                      : 'bg-black hover:bg-zinc-800 active:bg-zinc-900'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <motion.div
                      className='h-5 w-5 rounded-full border-2 border-white border-t-transparent'
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    ></motion.div>
                  ) : (
                    <>
                      <span>
                        {view === 'signup' ? 'Create Account' : 'Log In'}
                      </span>
                      <ArrowRight size={18} className='ml-2' />
                    </>
                  )}
                </motion.button>

                <div className='relative my-3'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200'></div>
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='bg-white px-2 text-xs text-gray-500'>
                      or continue with
                    </span>
                  </div>
                </div>

                <div className='w-full'>
                  <motion.button
                    type='button'
                    className='w-full py-1.5 px-3 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center justify-center transition-colors rounded-md'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Google icon */}
                    <svg
                      className='mr-2'
                      width='20'
                      height='20'
                      viewBox='0 0 48 48'
                    >
                      <path
                        fill='#FFC107'
                        d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                      />
                      <path
                        fill='#FF3D00'
                        d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                      />
                      <path
                        fill='#4CAF50'
                        d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                      />
                      <path
                        fill='#1976D2'
                        d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                      />
                    </svg>
                    Continue with Google
                  </motion.button>
                </div>

                {/* Toggle view option */}
                <div className='mt-4 md:mt-2 text-center'>
                  <p className='text-sm text-gray-600'>
                    {view === 'signup'
                      ? 'Already have an account?'
                      : "Don't have an account?"}
                    <motion.button
                      type='button'
                      className='ml-1  text-black hover:text-zinc-600 font-medium transition-colors'
                      onClick={() => {
                        setIsChangingView(true)
                        setTimeout(() => {
                          setView(view === 'signup' ? 'login' : 'signup')
                          setIsChangingView(false)
                        }, 50)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {view === 'signup' ? 'Log In' : 'Sign Up'}
                    </motion.button>
                  </p>
                </div>

                {/* Terms links */}
                <div className='mt-3 pt-2 text-xs text-gray-500 text-center'>
                  By continuing, you agree to Calani's{' '}
                  <motion.a
                    href='/terms'
                    className='text-black hover:text-zinc-600 transition-colors'
                    whileHover={{ scale: 1.05 }}
                  >
                    Terms of Service
                  </motion.a>{' '}
                  and{' '}
                  <motion.a
                    href='/privacy'
                    className='text-black hover:text-zinc-600 transition-colors'
                    whileHover={{ scale: 1.05 }}
                  >
                    Privacy Policy
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* DESKTOP DESIGN (≥ 768px) */
            <motion.div
              className='bg-white rounded-2xl overflow-hidden w-full max-w-5xl shadow-2xl flex flex-col md:flex-row'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                height: windowWidth < 768 ? '700px' : '650px',
              }}
            >
              {/* Left side - Creative Design - hidden on mobile */}
              <div className='hidden md:flex w-full md:w-1/2 bg-black p-6 md:p-10 flex-col justify-between relative overflow-hidden'>
                {/* Static gradient background with grid */}
                <div className='absolute inset-0 bg-gradient-to-br from-black to-purple-900/80 opacity-80'>
                  {/* Grid overlay */}
                  <div className='absolute inset-0 bg-[linear-gradient(0deg,transparent_calc(100%-1px),rgba(255,255,255,0.1)_100%),linear-gradient(90deg,transparent_calc(100%-1px),rgba(255,255,255,0.1)_100%)] bg-[size:50px_50px]'></div>

                  {/* Glowing orb */}
                  <motion.div
                    className='absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-purple-500/40 blur-3xl'
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                    style={{ top: '30%', left: '60%' }}
                  ></motion.div>
                </div>

                {/* Content overlay */}
                <div className='relative z-10 flex flex-col h-full'>
                  <div>
                    <motion.h2
                      className='text-white text-2xl md:text-4xl font-bold mb-4 md:mb-6'
                      key={view}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {view === 'signup' ? 'Join Calani Today' : 'Welcome Back'}
                    </motion.h2>
                    <motion.p
                      className='text-zinc-300 text-base md:text-lg mb-6 md:mb-8'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      Create documents, interactive tests, and more with
                      AI-powered tools designed for educators, students, and
                      professionals.
                    </motion.p>
                  </div>

                  {/* Animated illustration - hidden on very small screens */}
                  <div className='relative h-24 md:h-48 my-4 md:my-6 hidden sm:block'>
                    <div className='w-full h-full flex items-center justify-center'>
                      {/* Animated line with gradient */}
                      <motion.div
                        className='w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 relative'
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                        style={{ transformOrigin: 'left' }}
                      >
                        {/* Circles on the line */}
                        <motion.div
                          className='absolute -top-2 left-0 w-5 h-5 rounded-full bg-purple-600'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        ></motion.div>
                        <motion.div
                          className='absolute -top-3 left-1/2 w-6 h-6 rounded-full bg-pink-500 -translate-x-1/2'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        ></motion.div>
                        <motion.div
                          className='absolute -top-2 right-0 w-5 h-5 rounded-full bg-purple-600'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        ></motion.div>
                      </motion.div>
                    </div>

                    {/* Rotating cube */}
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 perspective-[600px]'>
                      <motion.div
                        className='w-full h-full relative'
                        style={{ transformStyle: 'preserve-3d' }}
                        animate={{
                          rotateY: 360,
                          rotateX: 180,
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{ transform: 'translateZ(20px)' }}
                        ></div>
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{
                            transform: 'rotateY(180deg) translateZ(20px)',
                          }}
                        ></div>
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{
                            transform: 'rotateY(90deg) translateZ(20px)',
                          }}
                        ></div>
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{
                            transform: 'rotateY(-90deg) translateZ(20px)',
                          }}
                        ></div>
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{
                            transform: 'rotateX(90deg) translateZ(20px)',
                          }}
                        ></div>
                        <div
                          className='absolute inset-0 bg-purple-600/20 border border-white/20'
                          style={{
                            transform: 'rotateX(-90deg) translateZ(20px)',
                          }}
                        ></div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className='mt-auto'>
                    <p className='text-zinc-400 text-xs md:text-sm mb-2 md:mb-3'>
                      Trusted by educators worldwide
                    </p>
                    <div className='flex space-x-3 md:space-x-4'>
                      {['Stanford', 'MIT', 'Harvard'].map((name, index) => (
                        <motion.div
                          key={name}
                          className='h-10 w-10 md:h-12 md:w-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center shadow-lg'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <span className='text-white text-xs md:text-sm font-medium'>
                            {name[0]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Auth Form */}
              <div
                className='w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full'
                style={{
                  width: windowWidth < 768 ? '100%' : '50%',
                  maxHeight: windowWidth < 768 ? '700px' : '650px',
                  padding: windowWidth < 768 ? '16px' : '',
                }}
              >
                <div className='flex justify-between items-center mb-6'>
                  <motion.h3
                    className='text-xl md:text-3xl font-bold text-gray-900'
                    key={view}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {view === 'signup' ? 'Create Account' : 'Log In'}
                  </motion.h3>
                  <motion.button
                    onClick={onClose}
                    className='p-2 rounded-full hover:bg-gray-100 transition-colors'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label='Close modal'
                  >
                    <X size={20} className='text-gray-500' />
                  </motion.button>
                </div>

                {/* Fixed-height content area */}
                <div className='flex-grow flex flex-col overflow-x-hidden'>
                  {/* Form with fixed layout */}
                  <AnimatePresence mode='wait' initial={false}>
                    <motion.form
                      key={view}
                      onSubmit={handleSubmit}
                      className='space-y-4 flex flex-col w-full flex-grow'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className='form-fields-container'>
                        {view === 'signup' ? (
                          <>
                            {/* Signup view */}
                            <div className='h-full flex flex-col'>
                              <div>
                                <div className='mb-4 pt-2'>
                                  <label
                                    htmlFor='name'
                                    className='block text-sm font-medium text-gray-700 mb-1'
                                  >
                                    Full Name
                                  </label>
                                  <div className='relative flex items-center'>
                                    <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                                      <User size={18} />
                                    </div>
                                    <input
                                      id='name'
                                      type='text'
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                                      required
                                    />
                                  </div>
                                </div>

                                <div className='mb-4'>
                                  <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-gray-700 mb-1'
                                  >
                                    Email Address
                                  </label>
                                  <div className='relative flex items-center'>
                                    <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                                      <Mail size={18} />
                                    </div>
                                    <input
                                      id='email'
                                      type='email'
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                                      required
                                    />
                                  </div>
                                </div>

                                <div className='mb-4'>
                                  <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-gray-700 mb-1'
                                  >
                                    Password
                                  </label>
                                  <div className='relative flex items-center'>
                                    <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                                      <Lock size={18} />
                                    </div>
                                    <input
                                      id='password'
                                      type={showPassword ? 'text' : 'password'}
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      className='w-full pl-7 pr-8 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                                      required
                                    />
                                    <motion.button
                                      type='button'
                                      className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      whileTap={{ scale: 0.9 }}
                                      aria-label={
                                        showPassword
                                          ? 'Hide password'
                                          : 'Show password'
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff
                                          size={18}
                                          className='text-gray-400 hover:text-gray-600'
                                        />
                                      ) : (
                                        <Eye
                                          size={18}
                                          className='text-gray-400 hover:text-gray-600'
                                        />
                                      )}
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                              <div className='flex-grow'></div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Login view with exact same starting position as signup */}
                            <div className='h-full flex flex-col'>
                              <div>
                                <div className='mb-4 pt-2'>
                                  <label
                                    htmlFor='login-email'
                                    className='block text-sm font-medium text-gray-700 mb-1'
                                  >
                                    Email Address
                                  </label>
                                  <div className='relative flex items-center'>
                                    <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                                      <Mail size={18} />
                                    </div>
                                    <input
                                      id='login-email'
                                      type='email'
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className='w-full pl-7 pr-2 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                                      required
                                    />
                                  </div>
                                </div>

                                <div className='mb-4'>
                                  <label
                                    htmlFor='login-password'
                                    className='block text-sm font-medium text-gray-700 mb-1'
                                  >
                                    Password
                                  </label>
                                  <div className='relative flex items-center'>
                                    <div className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'>
                                      <Lock size={18} />
                                    </div>
                                    <input
                                      id='login-password'
                                      type={showPassword ? 'text' : 'password'}
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      className='w-full pl-7 pr-8 py-2 border-b border-gray-300 text-gray-800 focus:border-black focus:outline-none transition-colors bg-transparent'
                                      required
                                    />
                                    <motion.button
                                      type='button'
                                      className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                      whileTap={{ scale: 0.9 }}
                                      aria-label={
                                        showPassword
                                          ? 'Hide password'
                                          : 'Show password'
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff
                                          size={18}
                                          className='text-gray-400 hover:text-gray-600'
                                        />
                                      ) : (
                                        <Eye
                                          size={18}
                                          className='text-gray-400 hover:text-gray-600'
                                        />
                                      )}
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Forgot Password link */}
                                <div className='mb-4 flex justify-end'>
                                  <motion.button
                                    type='button'
                                    className='text-sm text-black hover:text-zinc-600 font-medium transition-colors'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Forgot Password?
                                  </motion.button>
                                </div>
                              </div>
                              <div className='flex-grow'></div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.form>
                  </AnimatePresence>
                </div>

                {/* Fixed bottom section that won't move */}
                <div className='mt-4'>
                  <motion.button
                    type='submit'
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 flex rounded-sm items-center justify-center text-white font-medium shadow-md transition-all ${
                      isSubmitting
                        ? 'bg-black/80 cursor-not-allowed'
                        : 'bg-black hover:bg-zinc-800 active:bg-zinc-900'
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className='h-5 w-5 rounded-full border-2 border-white border-t-transparent'
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      ></motion.div>
                    ) : (
                      <>
                        <span>
                          {view === 'signup' ? 'Create Account' : 'Log In'}
                        </span>
                        <ArrowRight size={18} className='ml-2' />
                      </>
                    )}
                  </motion.button>

                  <div className='relative my-3'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-gray-200'></div>
                    </div>
                    <div className='relative flex justify-center'>
                      <span className='bg-white px-4 text-sm text-gray-500'>
                        or continue with
                      </span>
                    </div>
                  </div>

                  <div className='w-full'>
                    <motion.button
                      type='button'
                      className='w-full py-2.5 px-4 border border-gray-300 rounded-sm shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center transition-colors'
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Using SVG for Google icon */}
                      <svg
                        className='mr-2'
                        width='20'
                        height='20'
                        viewBox='0 0 48 48'
                      >
                        <path
                          fill='#FFC107'
                          d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                        />
                        <path
                          fill='#FF3D00'
                          d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                        />
                        <path
                          fill='#4CAF50'
                          d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                        />
                        <path
                          fill='#1976D2'
                          d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                        />
                      </svg>
                      Continue with Google
                    </motion.button>
                  </div>
                </div>

                {/* Footer section */}
                <div className='w-full pt-4 mt-4'>
                  <div className='text-center'>
                    <p className='text-sm text-gray-600'>
                      {view === 'signup'
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                      <motion.button
                        type='button'
                        className='ml-1 text-black  hover:text-zinc-600 font-medium transition-colors'
                        onClick={() => {
                          setIsChangingView(true)
                          setTimeout(() => {
                            setView(view === 'signup' ? 'login' : 'signup')
                            setIsChangingView(false)
                          }, 50)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {view === 'signup' ? 'Log In' : 'Sign Up'}
                      </motion.button>
                    </p>
                  </div>

                  <div className='mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center'>
                    By continuing, you agree to Calani's{' '}
                    <motion.a
                      href='/terms'
                      className='text-black hover:text-zinc-600 transition-colors'
                      whileHover={{ scale: 1.05 }}
                    >
                      Terms of Service
                    </motion.a>{' '}
                    and{' '}
                    <motion.a
                      href='/privacy'
                      className='text-black hover:text-zinc-600 transition-colors'
                      whileHover={{ scale: 1.05 }}
                    >
                      Privacy Policy
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
