import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // This already creates an index
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is required only if authProvider is 'local'
        return this.authProvider === 'local'
      },
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'team', 'enterprise'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true, // This already creates an index
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String, // Google profile picture URL
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// REMOVED: These duplicate index declarations
// UserSchema.index({ email: 1 }) // Already indexed by unique: true
// UserSchema.index({ googleId: 1 }) // Already indexed by unique: true

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new) and it exists
  if (!this.isModified('password') || !this.password) return next()

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to check if password is correct
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // If no password is set (Google users), return false
  if (!userPassword) return false
  return await bcrypt.compare(candidatePassword, userPassword)
}

// Method to check if user can authenticate with password
UserSchema.methods.canAuthenticateWithPassword = function () {
  return this.authProvider === 'local' && this.password
}

export default mongoose.model('User', UserSchema)
