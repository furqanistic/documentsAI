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

const corsOptions = {
  origin: 'https://doucmnt.ai', // Your Vite frontend URL
  credentials: true, // This allows cookies and credentials to be sent
  optionsSuccessStatus: 200,
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
