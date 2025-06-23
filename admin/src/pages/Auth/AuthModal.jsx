import {
  loginFailure,
  loginStart,
  loginSuccess,
  selectCurrentUser,
  selectIsLoading,
  selectToken,
} from '@/redux/userSlice'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../../../config'

const FormField = ({
  id,
  type,
  value,
  onChange,
  label,
  icon: Icon,
  error,
  disabled,
  placeholder,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  onSubmit,
}) => (
  <motion.div
    className='mb-4'
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={id}
      className='block text-sm font-medium text-gray-700 mb-1'
    >
      {label}
    </label>
    <div className='relative flex items-center'>
      <Icon
        size={18}
        className='absolute left-0 top-1/2 -translate-y-1/2 text-gray-400'
      />
      <input
        id={id}
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyPress={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
        className={`w-full pl-7 ${
          showPasswordToggle ? 'pr-8' : 'pr-2'
        } py-2 border-b transition-colors bg-transparent ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-gray-300 focus:border-black'
        } text-gray-800 focus:outline-none`}
        disabled={disabled}
      />
      {showPasswordToggle && (
        <motion.button
          type='button'
          className='absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer'
          onClick={onTogglePassword}
          whileTap={{ scale: 0.9 }}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff size={18} className='text-gray-400 hover:text-gray-600' />
          ) : (
            <Eye size={18} className='text-gray-400 hover:text-gray-600' />
          )}
        </motion.button>
      )}
    </div>
    {error && <p className='text-red-600 text-xs mt-1'>{error}</p>}
  </motion.div>
)

const GoogleButton = ({ onClick, disabled }) => (
  <motion.button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className='w-full py-2 md:py-2.5 px-3 md:px-4 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none flex items-center justify-center transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
  >
    <svg className='mr-2' width='20' height='20' viewBox='0 0 48 48'>
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
)

const CreativeDesign = ({ view }) => (
  <div className='hidden md:flex w-1/2 bg-black p-10 flex-col justify-between relative overflow-hidden'>
    <div className='absolute inset-0 bg-gradient-to-br from-black to-purple-900/80 opacity-80'>
      <div className='absolute inset-0 bg-[linear-gradient(0deg,transparent_calc(100%-1px),rgba(255,255,255,0.1)_100%),linear-gradient(90deg,transparent_calc(100%-1px),rgba(255,255,255,0.1)_100%)] bg-[size:50px_50px]'></div>
      <motion.div
        className='absolute w-40 h-40 rounded-full bg-purple-500/40 blur-3xl'
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        style={{ top: '30%', left: '60%' }}
      />
    </div>

    <div className='relative z-10 flex flex-col h-full'>
      <div>
        <motion.h2
          className='text-white text-4xl font-bold mb-6'
          key={view}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'signup' ? 'Join Calani Today' : 'Welcome Back'}
        </motion.h2>
        <motion.p
          className='text-zinc-300 text-lg mb-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Create documents, interactive tests, and more with AI-powered tools
          designed for educators, students, and professionals.
        </motion.p>
      </div>

      <div className='relative h-48 my-6'>
        <div className='w-full h-full flex items-center justify-center'>
          <motion.div
            className='w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 relative'
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
          >
            {[0, 0.5, 1.5].map((delay, i) => (
              <motion.div
                key={i}
                className={`absolute ${
                  i === 1
                    ? 'left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 top-1/2'
                    : i === 0
                    ? 'left-0 w-5 h-5 -translate-y-1/2 top-1/2 -translate-x-1/2'
                    : 'right-0 w-5 h-5 -translate-y-1/2 top-1/2 translate-x-1/2'
                } rounded-full ${
                  i === 1 ? 'bg-pink-500' : 'bg-purple-600'
                } shadow-lg`}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: [0, 1.2, 1],
                }}
                transition={{
                  delay: delay,
                  duration: 0.8,
                  ease: [0.68, -0.55, 0.265, 1.55],
                  scale: {
                    times: [0, 0.6, 1],
                    duration: 0.8,
                  },
                }}
                whileHover={{
                  scale: 1.3,
                  transition: { duration: 0.2 },
                }}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))',
                }}
              >
                <motion.div
                  className='absolute inset-0 rounded-full'
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: delay + 2,
                    ease: 'easeInOut',
                  }}
                  style={{
                    background:
                      i === 1
                        ? 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className='mt-auto'>
        <p className='text-zinc-400 text-sm mb-3'>
          Trusted by educators worldwide
        </p>
        <div className='flex space-x-4'>
          {['Stanford', 'MIT', 'Harvard'].map((name, index) => (
            <motion.div
              key={name}
              className='h-12 w-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center shadow-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <span className='text-white text-sm font-medium'>{name[0]}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const AuthModal = ({ isOpen = true, initialView = 'login', onAuthSuccess }) => {
  const dispatch = useDispatch()
  const isLoading = useSelector(selectIsLoading)
  const currentUser = useSelector(selectCurrentUser)
  const token = useSelector(selectToken)

  const [view, setView] = useState(initialView)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Clear errors when switching views
  useEffect(() => {
    setError('')
    setSuccess('')
    setFieldErrors({})
  }, [view])

  // Handle successful authentication
  useEffect(() => {
    if (currentUser && token && success) {
      onAuthSuccess?.({
        user: currentUser,
        token,
        isNewUser: view === 'signup',
      })
      setTimeout(() => {
        // Redirect to dashboard after successful login
        // If using React Router, replace with: navigate('/dashboard')
        window.location.href = '/dashboard'
      }, 1500)
    }
  }, [currentUser, token, success, onAuthSuccess, view])

  // Handle OAuth callback
  useEffect(() => {
    const checkOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      const success = urlParams.get('success')
      const token = urlParams.get('token')
      const googleAuthInitiated = sessionStorage.getItem(
        'google_auth_initiated'
      )

      if (error) {
        const errorMessages = {
          authentication_failed:
            'Google authentication failed. Please try again.',
          server_error: 'Server error occurred. Please try again later.',
          access_denied:
            'Access denied. Please try again and accept the required permissions.',
        }
        setError(
          errorMessages[error] || 'Authentication failed. Please try again.'
        )
        dispatch(loginFailure())
        sessionStorage.removeItem('google_auth_initiated')
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      } else if (success === 'true' || token) {
        try {
          dispatch(loginStart())

          if (token) {
            axiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${token}`
          }

          const response = await axiosInstance.get('/auth/me')
          const userData =
            response.data.data?.user || response.data.user || response.data

          dispatch(
            loginSuccess({
              token: token || 'cookie-based',
              data: { user: userData },
            })
          )

          setSuccess('Login successful!')
          sessionStorage.removeItem('google_auth_initiated')
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
        } catch (err) {
          console.error('Error getting user data after OAuth:', err)
          setError('Failed to complete authentication. Please try again.')
          dispatch(loginFailure())
          sessionStorage.removeItem('google_auth_initiated')
        }
      } else if (googleAuthInitiated) {
        dispatch(loginFailure())
        sessionStorage.removeItem('google_auth_initiated')
      }
    }

    if (isOpen) {
      checkOAuthCallback()
    }
  }, [dispatch, isOpen])

  const validateForm = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (view === 'signup' && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (view === 'signup') {
      if (!formData.name) {
        errors.name = 'Full name is required'
      } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getErrorMessage = (err, view) => {
    if (!err.response) {
      return 'Unable to connect. Please check your internet connection and try again.'
    }

    const { status, data } = err.response
    const backendMessage = data?.message || data?.error || ''

    const statusMessages = {
      400:
        view === 'signup'
          ? backendMessage.toLowerCase().includes('email') &&
            backendMessage.toLowerCase().includes('exist')
            ? 'An account with this email already exists. Try logging in instead.'
            : 'Please check your information and try again.'
          : 'Please check your information and try again.',
      401: 'Invalid email or password.',
      404:
        view === 'login'
          ? 'Invalid email or password.'
          : 'Service not found. Please try again later.',
      422: 'Please check your information and ensure all fields are valid.',
      429: 'Too many attempts. Please wait a moment before trying again.',
      500: 'Server error. Please try again later.',
    }

    return (
      statusMessages[status] ||
      (view === 'login'
        ? 'Invalid email or password.'
        : 'Unable to create account. Please try again.')
    )
  }

  const handleAuth = async () => {
    try {
      setError('')
      setSuccess('')
      dispatch(loginStart())

      const endpoint = view === 'signup' ? '/auth/signup' : '/auth/signin'
      const payload =
        view === 'signup'
          ? {
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            }
          : {
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            }

      const response = await axiosInstance.post(endpoint, payload)
      dispatch(loginSuccess(response.data))
      setSuccess(
        view === 'signup'
          ? 'Account created successfully!'
          : 'Login successful!'
      )
    } catch (err) {
      console.error('Auth error:', err)
      dispatch(loginFailure())
      setError(getErrorMessage(err, view))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    await handleAuth()
  }

  const handleGoogleAuth = async () => {
    try {
      setError('')
      dispatch(loginStart())

      const currentUrl = window.location.origin + window.location.pathname
      const apiUrl = import.meta.env.VITE_API_URL
      const url = new URL(apiUrl)
      const baseUrl = `${url.protocol}//${url.host}`
      const googleAuthUrl = `${baseUrl}/api/auth/google?redirect=${encodeURIComponent(
        currentUrl
      )}`

      sessionStorage.setItem('google_auth_initiated', 'true')
      window.location.href = googleAuthUrl
    } catch (err) {
      console.error('Google auth error:', err)
      setError('Google authentication failed. Please try again.')
      dispatch(loginFailure())
    }
  }

  const fields =
    view === 'signup'
      ? [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            icon: User,
            key: 'name',
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            icon: Mail,
            key: 'email',
          },
          {
            id: 'password',
            type: 'password',
            label: 'Password',
            icon: Lock,
            key: 'password',
            showPasswordToggle: true,
          },
        ]
      : [
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            icon: Mail,
            key: 'email',
          },
          {
            id: 'password',
            type: 'password',
            label: 'Password',
            icon: Lock,
            key: 'password',
            showPasswordToggle: true,
          },
        ]

  if (!isOpen) return null

  const modalHeight = isMobile
    ? windowWidth <= 320
      ? '530px'
      : windowWidth <= 375
      ? '550px'
      : '570px'
    : '650px'

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 bg-gray-100 z-50 flex items-center justify-center p-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`bg-white rounded-2xl overflow-hidden w-full shadow-2xl flex ${
            isMobile ? 'flex-col' : 'flex-row max-w-5xl'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ height: modalHeight }}
        >
          {!isMobile && <CreativeDesign view={view} />}

          <div
            className={`${
              isMobile ? 'w-full' : 'w-1/2'
            } p-4 md:p-10 flex flex-col h-full`}
          >
            <div className='flex justify-start items-center mb-4 md:mb-6'>
              <motion.h3
                className='text-lg md:text-3xl font-bold text-gray-900'
                key={view}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'signup' ? 'Create Account' : 'Log In'}
              </motion.h3>
            </div>

            {(error || success) && (
              <motion.div
                className={`mb-3 md:mb-4 p-3 rounded-lg flex items-start space-x-2 ${
                  error
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error ? (
                  <AlertCircle
                    size={16}
                    className='text-red-600 mt-0.5 flex-shrink-0'
                  />
                ) : (
                  <CheckCircle
                    size={16}
                    className='text-green-600 mt-0.5 flex-shrink-0'
                  />
                )}
                <span
                  className={`text-sm ${
                    error ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {error || success}
                </span>
              </motion.div>
            )}

            <div className='flex-grow overflow-y-auto'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={view}
                  className='space-y-3 md:space-y-4 flex flex-col w-full'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <FormField
                        {...field}
                        value={formData[field.key]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        error={fieldErrors[field.key]}
                        disabled={isLoading}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onSubmit={handleSubmit}
                      />
                    </motion.div>
                  ))}

                  {view === 'login' && (
                    <div className='flex justify-end'>
                      <motion.button
                        type='button'
                        className='text-sm text-black hover:text-zinc-600 font-medium transition-colors'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        Forgot Password?
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className='mt-4'>
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-2 md:py-3 px-4 flex items-center justify-center text-white font-medium shadow-md rounded-md transition-all ${
                  isLoading
                    ? 'bg-black/80 cursor-not-allowed'
                    : 'bg-black hover:bg-zinc-800 active:bg-zinc-900'
                }`}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <motion.div
                    className='h-5 w-5 rounded-full border-2 border-white border-t-transparent'
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
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
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center'>
                  <span className='bg-white px-2 md:px-4 text-xs md:text-sm text-gray-500'>
                    or continue with
                  </span>
                </div>
              </div>

              <GoogleButton onClick={handleGoogleAuth} disabled={isLoading} />

              <div className='mt-4 text-center'>
                <p className='text-sm text-gray-600'>
                  {view === 'signup'
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                  <motion.button
                    type='button'
                    className='ml-1 text-black hover:text-zinc-600 font-medium transition-colors disabled:opacity-50'
                    onClick={() =>
                      setView(view === 'signup' ? 'login' : 'signup')
                    }
                    whileHover={!isLoading ? { scale: 1.05 } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                    disabled={isLoading}
                  >
                    {view === 'signup' ? 'Log In' : 'Sign Up'}
                  </motion.button>
                </p>
              </div>

              <div className='mt-3 md:mt-4 pt-2 md:pt-4 md:border-t md:border-gray-200 text-xs text-gray-500 text-center'>
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
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthModal
