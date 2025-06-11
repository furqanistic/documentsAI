import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  token: null,
  loading: false,
  error: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = false
    },
    loginSuccess: (state, action) => {
      state.loading = false

      // Extract user data from nested structure
      state.currentUser = action.payload.data?.user || action.payload.user
      state.token = action.payload.token
      state.error = false

      // Store token in localStorage for persistence across page refreshes
      if (action.payload.token && action.payload.token !== 'cookie-based') {
        localStorage.setItem('token', action.payload.token)

        // Set token in axios defaults if axiosInstance is available
        if (window.axiosInstance) {
          window.axiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${action.payload.token}`
        }
      }
    },
    loginFailure: (state) => {
      state.loading = false
      state.error = true
    },
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('token')

      // Clear axios authorization header
      if (window.axiosInstance) {
        delete window.axiosInstance.defaults.headers.common['Authorization']
      }

      return initialState
    },
    // Add a new action to restore auth state from localStorage
    restoreAuth: (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.token
      state.loading = false
      state.error = false
    },
  },
})

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout, restoreAuth } =
  userSlice.actions

// Selectors for easy access to state
export const selectCurrentUser = (state) => state.user.currentUser
export const selectIsAdmin = (state) => state.user.currentUser?.role === 'admin'
export const selectIsAuthenticated = (state) => !!state.user.currentUser
export const selectToken = (state) => state.user.token
export const selectIsLoading = (state) => state.user.loading

export default userSlice.reducer
