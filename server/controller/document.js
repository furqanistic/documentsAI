import crypto from 'crypto'
import OpenAI from 'openai'
import { createError } from '../error.js'
import Document from '../models/Document.js'
import User from '../models/User.js'

// Initialize Groq client for DeepSeek
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

// Document type prompts for better AI generation
const documentTypePrompts = {
  professional: {
    systemPrompt:
      'You are an expert business document writer. Create professional, well-structured business documents with proper formatting, clear sections, and actionable content. Use markdown formatting for headers, lists, and emphasis.',
    context:
      'business proposal, contract, memo, policy document, or other professional business document',
  },
  exam: {
    systemPrompt:
      'You are an expert educational assessment designer. Create comprehensive exams and quizzes with varied question types, clear instructions, and appropriate difficulty levels. Format questions clearly with proper numbering and answer choices.',
    context: 'examination, quiz, assessment, or educational test',
  },
  interview: {
    systemPrompt:
      'You are an expert HR professional and interviewer. Create structured interview guides with behavioral, technical, and situational questions appropriate for the role. Organize questions by category and include timing suggestions.',
    context:
      'interview questions, assessment guide, or candidate evaluation framework',
  },
  report: {
    systemPrompt:
      'You are an expert analyst and report writer. Create detailed, data-driven reports with clear analysis, insights, and recommendations. Use professional formatting with sections, bullet points, and data presentations.',
    context:
      'business report, analysis, research summary, or performance evaluation',
  },
}

// Generate document with DeepSeek via Groq
export const generateDocument = async (req, res, next) => {
  try {
    const {
      prompt,
      documentType,
      metadata = {},
      isInteractive = false,
      interactiveSettings = {},
    } = req.body
    const userId = req.user.id

    // Validation
    if (!prompt || !documentType) {
      return next(createError(400, 'Please provide prompt and document type'))
    }

    if (
      !['professional', 'exam', 'interview', 'report'].includes(documentType)
    ) {
      return next(createError(400, 'Invalid document type'))
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return next(
        createError(
          500,
          'AI service not configured. Please check GROQ_API_KEY environment variable.'
        )
      )
    }

    // Get document type configuration
    const typeConfig = documentTypePrompts[documentType]

    // Prepare the AI prompt
    let fullPrompt = `Create a ${typeConfig.context} based on the following request:\n\n${prompt}\n\n`

    // Add metadata context if provided
    if (metadata.orgName) {
      fullPrompt += `Organization: ${metadata.orgName}\n`
    }
    if (metadata.date) {
      fullPrompt += `Date: ${metadata.date}\n`
    }
    if (metadata.additionalInfo) {
      fullPrompt += `Additional Context: ${metadata.additionalInfo}\n`
    }

    fullPrompt +=
      '\nPlease format the document with clear headings, proper structure, and professional presentation. Use markdown formatting where appropriate.'

    // Generate content with DeepSeek via Groq

    const completion = await groq.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b', // DeepSeek model
      messages: [
        {
          role: 'system',
          content: typeConfig.systemPrompt,
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      temperature: 0.6, // DeepSeek works well with lower temperature
      max_tokens: 8000, // DeepSeek can handle more tokens
      top_p: 0.8,
      frequency_penalty: 0.1,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      return next(createError(500, 'Failed to generate document content'))
    }

    // Add branding header if metadata provided
    let finalContent = generatedContent
    if (metadata.orgName || metadata.date || metadata.time) {
      let header = ''
      if (metadata.orgName) {
        header += `# ${metadata.orgName}\n\n`
      }
      if (metadata.additionalInfo) {
        header += `${metadata.additionalInfo}\n\n`
      }
      if (metadata.date || metadata.time) {
        header += `**Date:** ${metadata.date || ''} ${
          metadata.time || ''
        }\n\n---\n\n`
      }
      finalContent = header + generatedContent
    }

    // Generate a title from the prompt (first 50 characters)
    const title = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt

    // Save document to database
    const newDocument = await Document.create({
      title,
      content: finalContent,
      documentType,
      prompt,
      userId,
      metadata,
      isInteractive,
      interactiveSettings: isInteractive ? interactiveSettings : undefined,
    })

    // Return the generated document
    res.status(201).json({
      success: true,
      message: 'Document generated successfully',
      document: {
        id: newDocument._id,
        title: newDocument.title,
        content: newDocument.content,
        documentType: newDocument.documentType,
        metadata: newDocument.metadata,
        isInteractive: newDocument.isInteractive,
        interactiveSettings: newDocument.interactiveSettings,
        createdAt: newDocument.createdAt,
      },
    })
  } catch (error) {
    console.error('Error generating document:', error)

    // Handle specific Groq/API errors
    if (error.status === 429) {
      return next(
        createError(
          429,
          'Rate limit exceeded. Please try again in a few minutes.'
        )
      )
    }
    if (error.status === 401) {
      return next(
        createError(
          401,
          'Invalid API key. Please check your Groq API configuration.'
        )
      )
    }
    if (error.status === 400) {
      return next(
        createError(
          400,
          'Invalid request. Please check your prompt and try again.'
        )
      )
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return next(
        createError(
          503,
          'AI service temporarily unavailable. Please try again later.'
        )
      )
    }

    next(createError(500, 'An error occurred while generating the document'))
  }
}

// Get user's documents
export const getUserDocuments = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10, documentType } = req.query

    const query = { userId, isDeleted: false }
    if (documentType && documentType !== 'all') {
      query.documentType = documentType
    }

    const documents = await Document.find(query)
      .select('title documentType createdAt updatedAt isInteractive')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Document.countDocuments(query)

    res.status(200).json({
      success: true,
      documents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDocuments: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    next(createError(500, 'An error occurred while fetching documents'))
  }
}

// Get specific document
export const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const document = await Document.findOne({
      _id: id,
      userId,
      isDeleted: false,
    })

    if (!document) {
      return next(createError(404, 'Document not found'))
    }

    res.status(200).json({
      success: true,
      document,
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    next(createError(500, 'An error occurred while fetching the document'))
  }
}

// Update document
export const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { title, content, metadata, isInteractive, interactiveSettings } =
      req.body

    const document = await Document.findOne({
      _id: id,
      userId,
      isDeleted: false,
    })

    if (!document) {
      return next(createError(404, 'Document not found'))
    }

    // Update document
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(metadata && { metadata: { ...document.metadata, ...metadata } }),
        ...(isInteractive !== undefined && { isInteractive }),
        ...(interactiveSettings && { interactiveSettings }),
      },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument,
    })
  } catch (error) {
    console.error('Error updating document:', error)
    next(createError(500, 'An error occurred while updating the document'))
  }
}

// Delete document
export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const document = await Document.findOne({
      _id: id,
      userId,
      isDeleted: false,
    })

    if (!document) {
      return next(createError(404, 'Document not found'))
    }

    // Soft delete
    await Document.findByIdAndUpdate(id, { isDeleted: true })

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    next(createError(500, 'An error occurred while deleting the document'))
  }
}

// Generate interactive link
export const generateInteractiveLink = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const document = await Document.findOne({
      _id: id,
      userId,
      isDeleted: false,
    })

    if (!document) {
      return next(createError(404, 'Document not found'))
    }

    if (!document.isInteractive) {
      return next(createError(400, 'Document is not set as interactive'))
    }

    // Generate unique share link
    const shareLink = crypto.randomBytes(16).toString('hex')

    // Update document with share link
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { shareLink },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'Interactive link generated successfully',
      shareLink: `${
        process.env.FRONTEND_URL || 'http://localhost:3000'
      }/interactive-test/${shareLink}`,
      document: updatedDocument,
    })
  } catch (error) {
    console.error('Error generating interactive link:', error)
    next(createError(500, 'An error occurred while generating the link'))
  }
}

// Get shared document (public access)
export const getSharedDocument = async (req, res, next) => {
  try {
    const { shareLink } = req.params

    const document = await Document.findOne({
      shareLink,
      isDeleted: false,
      isInteractive: true,
    }).select('title content documentType interactiveSettings createdAt')

    if (!document) {
      return next(
        createError(404, 'Shared document not found or no longer available')
      )
    }

    res.status(200).json({
      success: true,
      document,
    })
  } catch (error) {
    console.error('Error fetching shared document:', error)
    next(
      createError(500, 'An error occurred while fetching the shared document')
    )
  }
}
