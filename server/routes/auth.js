import express from 'express'
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getUserProfile,
  signin,
  signup,
  updateUser,
} from '../controller/auth.js'
import { createError } from '../error.js'
import {
  checkPermission,
  restrictTo,
  verifyToken,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/signup', signup)
router.post('/signin', signin)

// Protected routes
router.use(verifyToken)

// Basic user profile routes (available to all authenticated users)
router.get('/profile/:id', getUserProfile)
router.put('/change-password', changePassword)

// Routes that need permission checking
router.use(checkPermission)

// Additional helper function to check if user is accessing their own profile
const checkSelfOrMarketing = (req, res, next) => {
  if (
    req.user.role === 'Marketing' ||
    req.user._id.toString() === req.params.id
  ) {
    next()
  } else {
    next(createError(403, 'You can only access your own profile'))
  }
}

// User management routes with role-specific access
router.put('/users/:id', checkSelfOrMarketing, updateUser)

// Marketing (Admin) only routes
router.use(restrictTo('Marketing'))
router.get('/all-users', getAllUsers)
router.post('/signup-user', signup) // For Marketing to create new users
router.put('/update/:id', updateUser)
router.patch('/users/:id/brands', updateUser)
router.delete('/delete/:id', deleteUser)

export default router
