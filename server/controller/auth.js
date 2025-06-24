import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import User from '../models/User.js'

const signToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })
}

const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id)
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 1) *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    res.cookie('jwt', token, cookieOptions)

    // Remove password from output
    user.password = undefined

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    console.error('Error in createSendToken:', error)
    throw error
  }
}

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return next(createError(400, 'Please provide name, email and password'))
    }

    // Set default role to user if not provided
    const userRole = role || 'user'

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(createError(400, 'User with this email already exists'))
    }

    // Create new user (password will be hashed by the pre-save middleware)
    const newUser = await User.create({
      name,
      email,
      password,
      role: userRole,
    })

    // Send token to the new user
    createSendToken(newUser, 201, res)
  } catch (err) {
    console.error('Error in signup:', err)
    next(createError(500, 'An unexpected error occurred during signup'))
  }
}

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return next(createError(400, 'Please provide email and password'))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return next(createError(401, 'Incorrect email or password'))
    }

    // Check if user is a Google user trying to sign in with password
    if (user.authProvider === 'google' && !user.password) {
      return next(
        createError(
          400,
          'This account uses Google Sign-In. Please use "Continue with Google" button.'
        )
      )
    }

    if (!(await user.correctPassword(password, user.password))) {
      return next(createError(401, 'Incorrect email or password'))
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })
    createSendToken(user, 200, res)
  } catch (err) {
    console.error('Error in signin:', err)
    next(createError(500, 'An unexpected error occurred'))
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is populated by verifyToken middleware
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(createError(404, 'User not found'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const { name, email, role } = req.body

    // Find the user first
    const existingUser = await User.findById(userId)

    // If no user found with that ID
    if (!existingUser) {
      return next(createError(404, 'No user found with that ID'))
    }

    // Check if user is trying to update their own profile or has admin rights
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return next(createError(403, 'You can only update your own profile'))
    }

    // If updating email, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) {
        return next(createError(400, 'Email is already in use'))
      }
    }

    // If updating role, validate it's a correct role and user has permission
    if (role) {
      if (!['admin', 'user', 'team', 'enterprise'].includes(role)) {
        return next(createError(400, 'Invalid role provided'))
      }
      // Only admins can change roles
      if (req.user.role !== 'admin') {
        return next(createError(403, 'Only admins can change user roles'))
      }
    }

    // Prepare update data (only allow certain fields)
    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role && req.user.role === 'admin') updateData.role = role

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return next(createError(400, 'Please provide current and new password'))
    }

    if (newPassword.length < 8) {
      return next(
        createError(400, 'New password must be at least 8 characters long')
      )
    }

    const user = await User.findById(req.user.id).select('+password')

    if (!user) {
      return next(createError(404, 'User not found'))
    }

    // Check if user has a password (might be Google user)
    if (!user.password) {
      return next(
        createError(
          400,
          'Cannot change password for Google authenticated users'
        )
      )
    }

    if (!(await user.correctPassword(currentPassword, user.password))) {
      return next(createError(401, 'Your current password is wrong'))
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = newPassword
    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Only admins can delete users, or users can delete their own account
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return next(createError(403, 'You can only delete your own account'))
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    )

    if (!user) {
      return next(createError(404, 'No user found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    // Only admins can get all users
    if (req.user.role !== 'admin') {
      return next(createError(403, 'Access denied. Admin rights required.'))
    }

    const users = await User.find({ isDeleted: false })

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id

    // Users can only view their own profile unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return next(createError(403, 'You can only view your own profile'))
    }

    const user = await User.findById(userId)

    if (!user || user.isDeleted) {
      return next(createError(404, 'No user found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Google OAuth Controllers
export const googleAuth = (req, res, next) => {
  // This will redirect to Google OAuth
  // The actual logic is handled by passport middleware
}

export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      console.error('No user in Google callback')
      return res.redirect(
        `${getValidRedirectUrl(req)}?error=authentication_failed`
      )
    }

    // Generate JWT token
    const token = signToken(user._id)

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          (parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 1) *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    }

    // Set the JWT cookie
    res.cookie('jwt', token, cookieOptions)

    // Get and validate the redirect URL
    const redirectUrl = getValidRedirectUrl(req)

    // Include token and success in URL parameters for frontend detection
    const separator = redirectUrl.includes('?') ? '&' : '?'
    const finalRedirectUrl = `${redirectUrl}${separator}success=true&token=${token}`

    // Redirect to frontend with success and token
    res.redirect(finalRedirectUrl)
  } catch (error) {
    console.error('Error in Google callback:', error)
    const redirectUrl = getValidRedirectUrl(req)
    const separator = redirectUrl.includes('?') ? '&' : '?'
    res.redirect(`${redirectUrl}${separator}error=server_error`)
  }
}

// Helper function to validate and get redirect URL
const getValidRedirectUrl = (req) => {
  const requestedRedirect = req.query.redirect || req.query.state

  // If no redirect requested, use default CLIENT_URL
  if (!requestedRedirect) {
    return process.env.CLIENT_URL
  }

  // Validate that the redirect URL is safe
  if (isValidRedirectUrl(requestedRedirect)) {
    return requestedRedirect
  }

  // If invalid, fall back to CLIENT_URL
  console.warn(`Invalid redirect URL attempted: ${requestedRedirect}`)
  return process.env.CLIENT_URL
}

// Helper function to validate redirect URLs
const isValidRedirectUrl = (url) => {
  try {
    const urlObj = new URL(url)

    // Allow localhost for development
    if (urlObj.hostname === 'localhost' && urlObj.protocol === 'http:') {
      return true
    }

    // Must be HTTPS for production domains
    if (urlObj.protocol !== 'https:') {
      return false
    }

    // Check if it's documnt.ai or a subdomain
    const hostname = urlObj.hostname

    // Allow exact matches
    if (hostname === 'documnt.ai' || hostname === 'www.documnt.ai') {
      return true
    }

    // Allow subdomains of documnt.ai
    if (hostname.endsWith('.documnt.ai')) {
      // Additional check to ensure it's a proper subdomain
      const subdomain = hostname.replace('.documnt.ai', '')
      // Subdomain should only contain letters, numbers, and hyphens
      const subdomainPattern = /^[a-zA-Z0-9-]+$/
      return subdomainPattern.test(subdomain) && subdomain.length > 0
    }

    return false
  } catch (error) {
    // Invalid URL format
    return false
  }
}

// Link Google account to existing user
export const linkGoogleAccount = async (req, res, next) => {
  try {
    const { googleId, googleEmail, googleName, googleAvatar } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!googleId || !googleEmail) {
      return next(createError(400, 'Google account information is required'))
    }

    // Check if Google ID is already linked to another account
    const existingGoogleUser = await User.findOne({ googleId })
    if (existingGoogleUser && existingGoogleUser._id.toString() !== userId) {
      return next(
        createError(
          400,
          'This Google account is already linked to another user'
        )
      )
    }

    // Update current user with Google ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        googleId,
        avatar: googleAvatar || updatedUser.avatar,
        // Don't change authProvider if user already has local auth
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      status: 'success',
      message: 'Google account linked successfully',
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Unlink Google account
export const unlinkGoogleAccount = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select('+password')

    if (!user) {
      return next(createError(404, 'User not found'))
    }

    // Check if user has a password (can't unlink if Google is the only auth method)
    if (!user.password && user.authProvider === 'google') {
      return next(
        createError(
          400,
          'Cannot unlink Google account. Please set a password first.'
        )
      )
    }

    // Remove Google ID and avatar if it was from Google
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          googleId: 1,
          avatar: 1, // Only unset if you want to remove Google avatar
        },
      },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      status: 'success',
      message: 'Google account unlinked successfully',
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    next(error)
  }
}
