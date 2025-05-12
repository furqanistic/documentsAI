import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  FileText,
  Maximize,
  Minimize,
  Printer,
  RefreshCw,
  Save,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const DocumentPreview = ({ content, onContentChange }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [fullscreen, setFullscreen] = useState(false)
  const [contentPages, setContentPages] = useState([])
  const [copied, setCopied] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const searchInputRef = useRef(null)
  const contentRef = useRef(null)
  const editRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if viewport is mobile-sized
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Parse content into pages for better display
  useEffect(() => {
    if (!content) return
    setIsLoading(true)

    // Set the edit content to match the full content
    setEditContent(content)

    // More sophisticated page splitting - by headers or meaningful chunks
    // This improved algorithm looks for markdown headers or chunks of appropriate size
    const splitByHeaders = (text) => {
      const headerRegex = /^#{1,6}\s+.+$/gm
      const matches = [...text.matchAll(headerRegex)]

      if (matches.length <= 1) {
        // If no headers or just one, use size-based splitting
        return splitBySize(text)
      }

      const pages = []
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index
        const end = i < matches.length - 1 ? matches[i + 1].index : text.length
        pages.push(text.substring(start, end))
      }

      return pages
    }

    const splitBySize = (text) => {
      const paragraphs = text.split('\n\n').filter((p) => p.trim())
      const pages = []
      let currentPage = ''

      paragraphs.forEach((paragraph) => {
        // Consider a reasonable page size, adjusted for reading on screen
        if (currentPage.length + paragraph.length > 1500) {
          pages.push(currentPage)
          currentPage = paragraph
        } else {
          currentPage += (currentPage ? '\n\n' : '') + paragraph
        }
      })

      if (currentPage) {
        pages.push(currentPage)
      }

      return pages
    }

    // Try header-based splitting first, fall back to size-based
    let pages = splitByHeaders(content)

    // Ensure we have at least one page
    if (pages.length === 0) {
      pages = [content]
    }

    setTimeout(() => {
      setContentPages(pages)
      setIsLoading(false)
    }, 300) // Small delay to allow for animation
  }, [content])

  // Perform search when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim() || !content) {
      setSearchResults([])
      return
    }

    const searchRegex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi'
    )
    let match
    const results = []
    let contentCopy = content

    while ((match = searchRegex.exec(contentCopy)) !== null) {
      // Find which page this result is on
      let totalLength = 0
      let pageIndex = 0

      for (let i = 0; i < contentPages.length; i++) {
        if (match.index < totalLength + contentPages[i].length) {
          pageIndex = i
          break
        }
        totalLength += contentPages[i].length
      }

      results.push({
        index: match.index,
        pageIndex: pageIndex + 1,
        context: contentCopy.substr(
          Math.max(0, match.index - 30),
          Math.min(60 + searchTerm.length, contentCopy.length - match.index)
        ),
      })
    }

    setSearchResults(results)
    setCurrentSearchIndex(0)

    // If we found results, navigate to the first one
    if (results.length > 0) {
      setCurrentPage(results[0].pageIndex)
    }
  }, [searchTerm, contentPages, content])

  const totalPages = contentPages.length

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSearchToggle = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchTerm('')
    }
  }

  const handleSearchPrev = () => {
    if (currentSearchIndex > 0) {
      setCurrentSearchIndex(currentSearchIndex - 1)
      const result = searchResults[currentSearchIndex - 1]
      setCurrentPage(result.pageIndex)
      highlightSearchResult(result)
    }
  }

  const handleSearchNext = () => {
    if (currentSearchIndex < searchResults.length - 1) {
      setCurrentSearchIndex(currentSearchIndex + 1)
      const result = searchResults[currentSearchIndex + 1]
      setCurrentPage(result.pageIndex)
      highlightSearchResult(result)
    }
  }

  const highlightSearchResult = (result) => {
    if (!contentRef.current) return

    // This would normally involve more complex DOM manipulation
    // For a real implementation, you might use a library or create a more sophisticated
    // mechanism to scroll to and highlight the specific text
    console.log('Highlighting result:', result)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      handleSaveEdit()
    } else {
      // Enter edit mode
      setIsEditing(true)

      // Focus the editor after a short delay
      setTimeout(() => {
        if (editRef.current) {
          editRef.current.focus()
        }
      }, 100)
    }
  }

  const handleSaveEdit = () => {
    // Apply the edited content
    if (onContentChange && editContent !== content) {
      onContentChange(editContent)
    }

    // Exit edit mode
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    // Discard changes
    setEditContent(content)
    setIsEditing(false)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      const combinedContent = contentPages.join('\n\n')

      printWindow.document.write(`
        <html>
          <head>
            <title>Document Print</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 2cm; }
              h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
              p { margin-bottom: 1em; line-height: 1.5; }
              pre { background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; }
              code { font-family: monospace; background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
              ul, ol { margin-bottom: 1em; padding-left: 2em; }
              li { margin-bottom: 0.5em; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f0f0f0; }
              @media print {
                @page { margin: 2cm; }
                h1, h2, h3 { break-after: avoid; }
                img, table { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="markdown-content">
              ${combinedContent
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(
                  /```(\w+)?\n([\s\S]*?)```/g,
                  (_, lang, code) =>
                    `<pre><code>${code
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;')}</code></pre>`
                )
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `)

      printWindow.document.close()
    }
  }

  // Animation for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  // Determine icon size based on screen size
  const iconSize = isMobile ? 20 : 16 // Bigger icons on mobile
  const smallIconSize = isMobile ? 16 : 14

  // Calculate appropriate height for content area in fullscreen
  // Adjusted to ensure footer is visible on small screens
  const getContentHeight = () => {
    if (!fullscreen) return 'max-h-96 md:max-h-[28rem]'

    // On mobile, especially small screens like iPhone SE, we need to reserve more space
    if (isMobile) {
      return 'h-[calc(100vh-200px)]' // Increased from 160px to 200px for mobile
    }

    return 'h-[calc(100vh-160px)]'
  }

  return (
    <motion.div
      className={`border rounded-lg border-gray-200 overflow-hidden shadow-sm ${
        fullscreen ? 'fixed inset-0 z-50 bg-white' : ''
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Preview toolbar with improved layout */}
      <div className='bg-gray-50 p-2 md:p-3 border-b border-gray-200'>
        <div className='flex flex-wrap items-center justify-between gap-y-2'>
          <div className='flex items-center space-x-3 md:space-x-4'>
            <div className='flex items-center'>
              <FileText
                className={`h-${isMobile ? 5 : 4} w-${
                  isMobile ? 5 : 4
                } text-gray-500 mr-2`}
              />
              <span
                className={`${
                  isMobile ? 'text-sm' : 'text-xs md:text-sm'
                } font-medium`}
              >
                Document Preview
              </span>
            </div>

            {/* Page indicator - On desktop, it stays in original position */}
            {!isMobile && (
              <div className='text-xs md:text-sm text-gray-500 flex items-center'>
                <span className='bg-white px-2 py-1 rounded-md border border-gray-200'>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </div>

          {/* Page indicator - On mobile, it's moved to top right */}
          {isMobile && (
            <div className='text-xs text-gray-500 flex items-center'>
              <span className='bg-white px-2 py-1 rounded-md border border-gray-200'>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          <div className='flex items-center gap-1 md:gap-3 ml-auto flex-1 justify-end'>
            {/* Search bar (toggled by the search button) */}
            {showSearch && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className='flex flex-1 items-center bg-white border border-gray-200 rounded-md overflow-hidden md:ml-2' // Added md:ml-2
              >
                <input
                  ref={searchInputRef}
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Search...'
                  className='text-xs p-1.5 w-full focus:outline-none flex-1'
                />
                {searchTerm && (
                  <div className='flex items-center px-1 text-gray-500 text-xs'>
                    <span>
                      {searchResults.length > 0
                        ? `${currentSearchIndex + 1}/${searchResults.length}`
                        : '0/0'}
                    </span>
                    <button
                      onClick={handleSearchPrev}
                      disabled={
                        !searchResults.length || currentSearchIndex === 0
                      }
                      className='p-1 hover:bg-gray-100 rounded disabled:opacity-50'
                    >
                      <ChevronLeft
                        className={`h-${smallIconSize / 4} w-${
                          smallIconSize / 4
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleSearchNext}
                      disabled={
                        !searchResults.length ||
                        currentSearchIndex === searchResults.length - 1
                      }
                      className='p-1 hover:bg-gray-100 rounded disabled:opacity-50'
                    >
                      <ChevronRight
                        className={`h-${smallIconSize / 4} w-${
                          smallIconSize / 4
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setSearchTerm('')}
                      className='p-1 hover:bg-gray-100 rounded'
                    >
                      <X
                        className={`h-${smallIconSize / 4} w-${
                          smallIconSize / 4
                        }`}
                      />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Primary action buttons - right aligned */}
            <div className='flex items-center gap-1 md:gap-2 sm:border-l sm:border-gray-200 sm:pl-2 justify-end'>
              <button
                onClick={handleSearchToggle}
                className={`p-${
                  isMobile ? 2 : 1.5
                } rounded-md hover:bg-gray-200 transition-colors`}
                title={showSearch ? 'Close search' : 'Search document'}
              >
                <Search
                  className={`h-${iconSize / 4} w-${
                    iconSize / 4
                  } text-gray-500`}
                />
              </button>

              <button
                onClick={handleEditToggle}
                className={`p-${isMobile ? 2 : 1.5} rounded-md ${
                  isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
                } transition-colors`}
                title={isEditing ? 'Save changes' : 'Edit document'}
              >
                {isEditing ? (
                  <Save
                    className={`h-${iconSize / 4} w-${
                      iconSize / 4
                    } text-blue-600`}
                  />
                ) : (
                  <Edit
                    className={`h-${iconSize / 4} w-${
                      iconSize / 4
                    } text-gray-500`}
                  />
                )}
              </button>

              <button
                onClick={handleCopy}
                className={`p-${
                  isMobile ? 2 : 1.5
                } rounded-md hover:bg-gray-200 transition-colors relative`}
                title='Copy to clipboard'
              >
                <Copy
                  className={`h-${iconSize / 4} w-${
                    iconSize / 4
                  } text-gray-500`}
                />
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap'
                  >
                    Copied!
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => setFullscreen(!fullscreen)}
                className={`p-${
                  isMobile ? 2 : 1.5
                } rounded-md hover:bg-gray-200 transition-colors`}
                title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? (
                  <Minimize
                    className={`h-${iconSize / 4} w-${
                      iconSize / 4
                    } text-gray-500`}
                  />
                ) : (
                  <Maximize
                    className={`h-${iconSize / 4} w-${
                      iconSize / 4
                    } text-gray-500`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Second toolbar row with pagination and zoom */}
        <div className='flex items-center justify-between mt-2 border-t border-gray-200 pt-2'>
          {/* Pagination controls */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-${
                isMobile ? 2 : 1.5
              } rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent`}
              title='Previous page'
            >
              <ChevronLeft
                className={`h-${iconSize / 4} w-${iconSize / 4} text-gray-600`}
              />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-${
                isMobile ? 2 : 1.5
              } rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent`}
              title='Next page'
            >
              <ChevronRight
                className={`h-${iconSize / 4} w-${iconSize / 4} text-gray-600`}
              />
            </button>
          </div>

          {/* Zoom controls - now visible on mobile too */}
          <div className='flex items-center space-x-1'>
            <button
              onClick={handleZoomOut}
              className='p-1.5 rounded-md hover:bg-gray-200 transition-colors'
              title='Zoom out'
              disabled={zoom <= 50}
            >
              <ZoomOut className='h-4 w-4 text-gray-600' />
            </button>

            <div className='w-14 text-center'>
              <span className='text-xs font-medium'>{zoom}%</span>
            </div>

            <button
              onClick={handleZoomIn}
              className='p-1.5 rounded-md hover:bg-gray-200 transition-colors'
              title='Zoom in'
              disabled={zoom >= 200}
            >
              <ZoomIn className='h-4 w-4 text-gray-600' />
            </button>

            <button
              onClick={() => setZoom(100)}
              className='ml-1 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-xs'
              title='Reset zoom'
            >
              <RefreshCw className='h-3.5 w-3.5 text-gray-600' />
            </button>
          </div>
        </div>
      </div>

      {/* Document content with improved rendering */}
      <div className={`bg-white overflow-auto relative ${getContentHeight()}`}>
        {isLoading ? (
          <div className='flex items-center justify-center h-full p-8'>
            <div className='text-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full mb-2'
              />
              <p className='text-sm text-gray-500'>Loading document...</p>
            </div>
          </div>
        ) : isEditing ? (
          <div className='h-full'>
            <textarea
              ref={editRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className='w-full h-full min-h-[24rem] p-5 md:p-8 font-mono text-sm resize-none focus:outline-none border-0'
              style={{
                fontSize: `${zoom}%`,
                maxWidth: '1000px',
                margin: '0 auto',
              }}
            />
          </div>
        ) : (
          <div
            className='document-content p-5 md:p-8'
            style={{
              fontSize: `${zoom}%`,
              maxWidth: '1000px',
              margin: '0 auto',
            }}
            ref={contentRef}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentPage}
                variants={pageVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                transition={{ duration: 0.2 }}
                className='prose prose-sm sm:prose max-w-none'
              >
                {/* Use ReactMarkdown for better rendering */}
                {/* For a real implementation, you would include ReactMarkdown */}
                <div className='markdown-content whitespace-pre-wrap'>
                  {/* This creates a basic markdown-like rendering */}
                  {contentPages[currentPage - 1]?.split('\n').map((line, i) => {
                    // Very basic markdown-like rendering
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={i} className='text-2xl font-bold mt-6 mb-4'>
                          {line.substring(2)}
                        </h1>
                      )
                    } else if (line.startsWith('## ')) {
                      return (
                        <h2 key={i} className='text-xl font-bold mt-5 mb-3'>
                          {line.substring(3)}
                        </h2>
                      )
                    } else if (line.startsWith('### ')) {
                      return (
                        <h3 key={i} className='text-lg font-bold mt-4 mb-2'>
                          {line.substring(4)}
                        </h3>
                      )
                    } else if (line.startsWith('- ')) {
                      return (
                        <li key={i} className='ml-4 mb-1'>
                          {line.substring(2)}
                        </li>
                      )
                    } else if (line.match(/^\d+\. /)) {
                      const textContent = line.replace(/^\d+\. /, '')
                      return (
                        <li key={i} className='ml-4 mb-1 list-decimal'>
                          {textContent}
                        </li>
                      )
                    } else if (line.trim() === '') {
                      return <div key={i} className='h-4'></div>
                    } else {
                      return (
                        <p key={i} className='mb-2'>
                          {line}
                        </p>
                      )
                    }
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Edit mode controls */}
        {isEditing && (
          <div className='absolute bottom-4 right-4 bg-white shadow-lg rounded-lg p-2 flex items-center space-x-2 border border-gray-200'>
            <button
              onClick={handleCancelEdit}
              className='bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200'
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className='bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700'
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Footer with improved actions - now with proper padding for mobile */}
      <div className='bg-gray-50 p-2 md:p-3 border-t border-gray-200 pb-3 relative'>
        {/* Mobile print button - positioned in the right and vertically centered */}
        <div className='sm:hidden absolute top-1/2 right-2 -translate-y-1/2'>
          <button
            className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-1.5 px-4 rounded-md text-xs font-medium hover:opacity-90 shadow-sm transition-colors flex items-center'
            onClick={handlePrint}
          >
            <Printer className='h-4 w-4 inline mr-1.5' />
            Print
          </button>
        </div>

        {/* Desktop footer layout */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-y-2 sm:items-center mt-10 sm:mt-0'>
          <span className='text-xs text-gray-500 text-center sm:text-left'>
            {searchResults.length > 0 && (
              <span className='mr-2 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md text-xs'>
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'match' : 'matches'} found
              </span>
            )}
            <span className='hidden sm:inline'>
              Preview Mode • Document will render differently when exported
            </span>
          </span>

          {/* Desktop print button */}
          <div className='hidden sm:block'>
            <button
              className='bg-gradient-to-br from-blue-600 to-blue-800 text-white py-1.5 px-4 rounded-md text-xs font-medium hover:opacity-90 shadow-sm transition-colors flex items-center'
              onClick={handlePrint}
            >
              <Printer className='h-4 w-4 inline mr-1.5' />
              Print
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DocumentPreview
