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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
    // This field will be used to reference appointments in the future
    // appointments: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Appointment'
    // }],
  },
  { timestamps: true }
)

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()

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
  return await bcrypt.compare(candidatePassword, userPassword)
}

export default mongoose.model('User', UserSchema)
