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
      // Basic Test Settings
      timeLimit: { type: Number, default: 30 },
      showResults: { type: Boolean, default: true },
      allowRetry: { type: Boolean, default: true },
      isPublic: { type: Boolean, default: false },
      allowSaving: { type: Boolean, default: true },
      randomizeQuestions: { type: Boolean, default: false },
      questionTimeLimit: { type: Boolean, default: false },

      // Grading & Scoring
      passingScore: { type: Number, default: 70 },
      gradingScheme: {
        type: String,
        enum: ['standard', 'percentage', 'passfail', 'points'],
        default: 'standard',
      },
      enablePartialCredit: { type: Boolean, default: false },
      certificate: { type: Boolean, default: false },

      // Appearance & Branding
      customTheme: {
        type: String,
        enum: ['default', 'orion', 'kids', 'minimal'],
        default: 'default',
      },
      showProgressBar: { type: Boolean, default: true },
      questionLayout: {
        type: String,
        enum: ['standard', 'all', 'sections'],
        default: 'standard',
      },
      showBranding: { type: Boolean, default: false },

      // Security & Privacy
      requireLogin: { type: Boolean, default: true },
      preventTabSwitching: { type: Boolean, default: false },
      disableCopyPaste: { type: Boolean, default: false },
      ipRestriction: { type: Boolean, default: false },

      // Results & Feedback
      showCorrectAnswers: { type: Boolean, default: true },
      showFeedback: { type: Boolean, default: true },
      feedbackType: {
        type: String,
        enum: ['detailed', 'basic', 'endOnly'],
        default: 'detailed',
      },

      // Email Notifications
      sendResultsEmail: { type: Boolean, default: false },
      emailTemplate: {
        type: String,
        enum: ['default', 'friendly', 'detailed', 'certificate'],
        default: 'default',
      },
      notifyInstructor: { type: Boolean, default: false },
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

DocumentSchema.index({ userId: 1, createdAt: -1 })
DocumentSchema.index({ documentType: 1 })

export default mongoose.model('Document', DocumentSchema)
