import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage first, then from Redux store if needed
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')

      // Clear Redux state if available
      if (window.store && window.store.dispatch) {
        // Import logout action if needed
        // window.store.dispatch(logout())
      }

      // Only redirect if not already on login/auth page
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/auth')
      ) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Make axiosInstance globally available for userSlice
if (typeof window !== 'undefined') {
  window.axiosInstance = axiosInstance
}

export { axiosInstance }
