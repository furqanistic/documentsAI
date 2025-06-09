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
      state.currentUser = action.payload.data.user
      state.token = action.payload.token
      state.error = false
    },
    loginFailure: (state) => {
      state.loading = false
      state.error = true
    },
    logout: (state) => {
      localStorage.removeItem('token')
      return initialState
    },
  },
})

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlice.actions

// Selectors for easy access to state
export const selectCurrentUser = (state) => state.user.currentUser
export const selectIsAdmin = (state) => state.user.currentUser?.role === 'admin'
export const selectIsAuthenticated = (state) => !!state.user.currentUser
export const selectToken = (state) => state.user.token
export const selectIsLoading = (state) => state.user.loading

export default userSlice.reducer
