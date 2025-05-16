import { motion } from 'framer-motion'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
  Maximize,
  Minimize,
  Pencil,
  Save,
  Settings,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const TestPreview = ({
  content,
  metadata,
  onContentChange,
  onMetadataChange,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [showSettings, setShowSettings] = useState(false)
  const [localMetadata, setLocalMetadata] = useState(metadata)
  const [fullscreen, setFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent background scrolling in full-screen mode
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    // Cleanup on unmount or when fullscreen changes
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [fullscreen])

  const handleEditToggle = () => {
    if (isEditing) {
      onContentChange(editedContent)
    } else {
      setEditedContent(content)
    }
    setIsEditing(!isEditing)
  }

  const handleContentChange = (e) => {
    setEditedContent(e.target.value)
  }

  const handleMetadataChange = (field, value) => {
    const updated = { ...localMetadata, [field]: value }
    setLocalMetadata(updated)
    onMetadataChange(updated)
  }

  const handleSaveMetadata = () => {
    onMetadataChange(localMetadata)
    setShowSettings(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${
        fullscreen
          ? 'fixed inset-0 z-50 bg-white flex flex-col'
          : 'border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden'
      }`}
    >
      {/* Header */}
      <div className='p-3 md:p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
        <div className='flex items-center'>
          <h3 className='text-sm md:text-base font-medium text-gray-800'>
            {metadata.title || 'Test Preview'}
          </h3>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={handleEditToggle}
            className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
          >
            {isEditing ? (
              <Save className='h-4 w-4' />
            ) : (
              <Edit className='h-4 w-4' />
            )}
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
            title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? (
              <Minimize className='h-4 w-4' />
            ) : (
              <Maximize className='h-4 w-4' />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`${
          fullscreen ? 'flex-1 overflow-auto' : 'max-h-[500px] overflow-auto'
        }`}
      >
        {isEditing ? (
          <div className='p-3 md:p-4'>
            <textarea
              className='w-full h-96 p-3 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={editedContent}
              onChange={handleContentChange}
            />
          </div>
        ) : (
          <div className='p-3 md:p-4 prose prose-sm max-w-none'>
            {(metadata.title || metadata.description || metadata.author) && (
              <div className='mb-4 pb-3 border-b border-gray-200'>
                {metadata.title && (
                  <h1 className='text-xl font-bold'>{metadata.title}</h1>
                )}
                {metadata.description && (
                  <p className='text-gray-600 mt-1'>{metadata.description}</p>
                )}
                {metadata.author && (
                  <p className='text-sm text-gray-500 mt-1'>
                    Created by: {metadata.author}
                    {metadata.date &&
                      ` • ${new Date(metadata.date).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            )}
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                li: ({ node, ...props }) => {
                  if (node.children[0]?.tagName === 'input') {
                    return (
                      <li className='flex items-start mb-2'>
                        <input
                          type='checkbox'
                          className='mt-1 mr-2 h-4 w-4'
                          readOnly
                        />
                        <span>{props.children.slice(1)}</span>
                      </li>
                    )
                  }
                  return <li {...props} />
                },
                h1: ({ node, ...props }) => (
                  <h1 className='text-xl font-bold mt-6 mb-3' {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className='text-lg font-bold mt-5 mb-2' {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className='text-base font-bold mt-4 mb-2' {...props} />
                ),
                p: ({ node, ...props }) => <p className='mb-3' {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Editing Controls */}
      {isEditing && (
        <div
          className={`bg-gray-50 px-3 py-1.5 md:px-3 md:py-2 border-t border-gray-200 flex justify-end ${
            fullscreen ? 'mt-auto' : ''
          }`}
        >
          <button
            onClick={handleEditToggle}
            className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center'
          >
            <Save className='h-4 w-4 mr-2' />
            Save Changes
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default TestPreview
