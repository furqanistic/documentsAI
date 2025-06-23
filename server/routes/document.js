import express from 'express'

import {
  deleteDocument,
  generateDocument,
  generateInteractiveLink,
  getDocumentById,
  getSharedDocument,
  getUserDocuments,
  updateDocument,
} from '../controller/document.js'
import { verifyToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Generate a new document with AI
router.post('/generate', verifyToken, generateDocument)

// Get user's documents
router.get('/my-documents', verifyToken, getUserDocuments)

// Get specific document
router.get('/:id', verifyToken, getDocumentById)

// Update document
router.put('/:id', verifyToken, updateDocument)

// Delete document
router.delete('/:id', verifyToken, deleteDocument)

// Generate interactive link for sharing
router.post('/:id/interactive-link', verifyToken, generateInteractiveLink)

// Get shared document (public access)
router.get('/shared/:shareLink', getSharedDocument)

export default router
