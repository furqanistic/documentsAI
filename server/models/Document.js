import mongoose from 'mongoose'

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      enum: ['professional', 'exam', 'interview', 'report'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    metadata: {
      orgName: String,
      date: String,
      time: String,
      additionalInfo: String,
      logo: String,
    },
    isInteractive: {
      type: Boolean,
      default: false,
    },
    interactiveSettings: {
      timeLimit: Number,
      showResults: Boolean,
      allowRetry: Boolean,
      isPublic: Boolean,
    },
    shareLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Index for faster queries
DocumentSchema.index({ userId: 1, createdAt: -1 })
DocumentSchema.index({ shareLink: 1 })
DocumentSchema.index({ documentType: 1 })

export default mongoose.model('Document', DocumentSchema)
