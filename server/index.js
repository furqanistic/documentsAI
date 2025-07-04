import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
// Import passport configuration (must be imported before routes)
import './config/passport.js'
import authRoute from './routes/auth.js'
import documentRoute from './routes/document.js'

const app = express()

// Load environment variables first
dotenv.config()

// Function to check if origin is allowed
const isOriginAllowed = (origin) => {
  // Allow requests with no origin (mobile apps, etc.)
  if (!origin) return true

  // List of specific allowed origins
  const allowedOrigins = [
    'http://localhost:5173', // Dev
    'https://documnt.ai',
    'https://www.documnt.ai',
  ]

  // Check if origin is in the specific allowed list
  if (allowedOrigins.includes(origin)) {
    return true
  }

  // Check if origin is a subdomain of documnt.ai
  const subdomainPattern = /^https:\/\/[\w-]+\.documnt\.ai$/
  if (subdomainPattern.test(origin)) {
    return true
  }

  return false
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

// Initialize Passport middleware
app.use(passport.initialize())

mongoose.set('strictQuery', true)

// Routes
app.use('/api/auth', authRoute)
app.use('/api/documents', documentRoute)

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err) => console.log(err))
}

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

app.listen(8800, () => {
  connect()
  console.log('Server running at 8800')
})
