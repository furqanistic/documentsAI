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

  // Enhanced markdown parsing function
  const parseMarkdown = (text) => {
    if (!text) return ''

    // First, handle code blocks to prevent interference with other formatting
    const codeBlocks = []
    let codeBlockIndex = 0
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`
      codeBlocks[codeBlockIndex] = match
      codeBlockIndex++
      return placeholder
    })

    // Handle inline code
    const inlineCode = []
    let inlineCodeIndex = 0
    text = text.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__INLINE_CODE_${inlineCodeIndex}__`
      inlineCode[inlineCodeIndex] = code
      inlineCodeIndex++
      return placeholder
    })

    // Convert markdown to HTML-like structure
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')

      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )

      // Lists - handle both unordered and ordered
      .replace(/^(\s*)- (.+)$/gim, '$1<li class="unordered">$2</li>')
      .replace(/^(\s*)\d+\. (.+)$/gim, '$1<li class="ordered">$2</li>')

      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

    // Restore code blocks
    codeBlocks.forEach((codeBlock, index) => {
      const placeholder = `__CODE_BLOCK_${index}__`
      const match = codeBlock.match(/```(\w+)?\n?([\s\S]*?)```/)
      const language = match?.[1] || ''
      const code = match?.[2] || codeBlock.replace(/```/g, '')
      html = html.replace(
        placeholder,
        `<pre><code class="language-${language}">${code.trim()}</code></pre>`
      )
    })

    // Restore inline code
    inlineCode.forEach((code, index) => {
      const placeholder = `__INLINE_CODE_${index}__`
      html = html.replace(placeholder, `<code class="inline">${code}</code>`)
    })

    // Wrap in paragraphs if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>'
    }

    return html
  }

  // Enhanced rendering component
  const renderContent = (htmlContent) => {
    if (!htmlContent) return null

    // Split by major HTML tags for processing
    const parts = htmlContent.split(
      /(<\/?(?:h[1-6]|p|pre|ul|ol|li|div|blockquote)(?:\s[^>]*)?>)/gi
    )

    return parts
      .map((part, index) => {
        // Handle different HTML elements
        if (part.match(/^<h1>/i)) {
          const content = parts[index + 1] || ''
          return (
            <h1
              key={index}
              className='text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2'
            >
              {renderInlineContent(content)}
            </h1>
          )
        } else if (part.match(/^<h2>/i)) {
          const content = parts[index + 1] || ''
          return (
            <h2
              key={index}
              className='text-2xl font-semibold mt-6 mb-3 text-gray-800'
            >
              {renderInlineContent(content)}
            </h2>
          )
        } else if (part.match(/^<h3>/i)) {
          const content = parts[index + 1] || ''
          return (
            <h3
              key={index}
              className='text-xl font-semibold mt-5 mb-2 text-gray-800'
            >
              {renderInlineContent(content)}
            </h3>
          )
        } else if (part.match(/^<pre>/i)) {
          const content = parts[index + 1] || ''
          const codeMatch = content.match(
            /<code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code>/
          )
          const language = codeMatch?.[1] || ''
          const code = codeMatch?.[2] || content.replace(/<\/?code[^>]*>/g, '')

          return (
            <div key={index} className='my-4'>
              {language && (
                <div className='bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 rounded-t-md border-b'>
                  {language}
                </div>
              )}
              <pre
                className={`bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono border ${
                  language ? 'rounded-t-none' : ''
                }`}
              >
                <code>{code.trim()}</code>
              </pre>
            </div>
          )
        } else if (part.match(/^<p>/i)) {
          const content = parts[index + 1] || ''
          if (!content.trim() || content.match(/^<\//)) return null

          return (
            <p key={index} className='mb-4 text-gray-700 leading-relaxed'>
              {renderInlineContent(content)}
            </p>
          )
        } else if (part.match(/^<li class="unordered">/i)) {
          const content = parts[index + 1] || ''
          return (
            <li key={index} className='ml-6 mb-2 text-gray-700 list-disc'>
              {renderInlineContent(content)}
            </li>
          )
        } else if (part.match(/^<li class="ordered">/i)) {
          const content = parts[index + 1] || ''
          return (
            <li key={index} className='ml-6 mb-2 text-gray-700 list-decimal'>
              {renderInlineContent(content)}
            </li>
          )
        }

        return null
      })
      .filter(Boolean)
  }

  // Helper function to render inline content (bold, italic, links, etc.)
  const renderInlineContent = (content) => {
    if (!content) return ''

    // Split by inline HTML tags
    const parts = content.split(/(<\/?(?:strong|em|a|code|br)(?:\s[^>]*)?>)/gi)

    return parts
      .map((part, index) => {
        if (part.match(/^<strong>/i)) {
          const text = parts[index + 1] || ''
          return (
            <strong key={index} className='font-semibold'>
              {text}
            </strong>
          )
        } else if (part.match(/^<em>/i)) {
          const text = parts[index + 1] || ''
          return (
            <em key={index} className='italic'>
              {text}
            </em>
          )
        } else if (part.match(/^<a\s/i)) {
          const hrefMatch = part.match(/href="([^"]+)"/)
          const href = hrefMatch?.[1] || '#'
          const text = parts[index + 1] || ''
          return (
            <a
              key={index}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800 underline'
            >
              {text}
            </a>
          )
        } else if (part.match(/^<code class="inline">/i)) {
          const text = parts[index + 1] || ''
          return (
            <code
              key={index}
              className='bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800'
            >
              {text}
            </code>
          )
        } else if (part.match(/^<br>/i)) {
          return <br key={index} />
        } else if (!part.match(/^<\/?/)) {
          // Regular text
          return part
        }

        return null
      })
      .filter((item) => item !== null && item !== '')
  }

  // Parse content into pages for better display
  useEffect(() => {
    if (!content) return
    setIsLoading(true)

    // Set the edit content to match the full content
    setEditContent(content)

    // More sophisticated page splitting - by headers or meaningful chunks
    const splitByHeaders = (text) => {
      // Look for main headers (# and ##) as natural break points
      const headerRegex = /^#{1,2}\s+.+$/gm
      const matches = [...text.matchAll(headerRegex)]

      if (matches.length <= 1) {
        // If no headers or just one, use size-based splitting
        return splitBySize(text)
      }

      const pages = []
      for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index
        const end = i < matches.length - 1 ? matches[i + 1].index : text.length
        const pageContent = text.substring(start, end).trim()
        if (pageContent) {
          pages.push(pageContent)
        }
      }

      return pages.length > 0 ? pages : [text]
    }

    const splitBySize = (text) => {
      const sections = text.split(/\n\s*\n/).filter((section) => section.trim())
      const pages = []
      let currentPage = ''

      sections.forEach((section) => {
        // Consider a reasonable page size for reading
        if (currentPage.length + section.length > 2000) {
          if (currentPage.trim()) {
            pages.push(currentPage.trim())
          }
          currentPage = section
        } else {
          currentPage += (currentPage ? '\n\n' : '') + section
        }
      })

      if (currentPage.trim()) {
        pages.push(currentPage.trim())
      }

      return pages.length > 0 ? pages : [text]
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
    }, 300)
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
      const parsedContent = parseMarkdown(combinedContent)

      printWindow.document.write(`
        <html>
          <head>
            <title>Document Print</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 2cm; 
                line-height: 1.6;
                color: #333;
              }
              h1 { 
                font-size: 28px; 
                font-weight: bold; 
                margin: 2em 0 1em 0; 
                border-bottom: 2px solid #eee; 
                padding-bottom: 0.5em;
                color: #1a1a1a;
              }
              h2 { 
                font-size: 22px; 
                font-weight: 600; 
                margin: 1.5em 0 0.75em 0; 
                color: #2a2a2a;
              }
              h3 { 
                font-size: 18px; 
                font-weight: 600; 
                margin: 1.25em 0 0.5em 0; 
                color: #2a2a2a;
              }
              p { 
                margin-bottom: 1em; 
                line-height: 1.6; 
              }
              pre { 
                background: #f8f9fa; 
                padding: 1em; 
                border-radius: 4px; 
                overflow-x: auto; 
                border: 1px solid #e9ecef;
                margin: 1em 0;
              }
              code { 
                font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; 
                background: #f1f3f4; 
                padding: 0.2em 0.4em; 
                border-radius: 3px; 
                font-size: 0.9em;
              }
              pre code {
                background: transparent;
                padding: 0;
              }
              ul, ol { 
                margin-bottom: 1em; 
                padding-left: 2em; 
              }
              li { 
                margin-bottom: 0.5em; 
              }
              strong { 
                font-weight: 600; 
              }
              em { 
                font-style: italic; 
              }
              a { 
                color: #0066cc; 
                text-decoration: underline; 
              }
              table { 
                border-collapse: collapse; 
                width: 100%; 
                margin-bottom: 1em; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f8f9fa; 
                font-weight: 600;
              }
              @media print {
                @page { margin: 2cm; }
                h1, h2, h3 { break-after: avoid; }
                img, table, pre { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="markdown-content">
              ${parsedContent}
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

  // Calculate appropriate height for content area
  const getContentHeight = () => {
    if (!fullscreen) {
      return 'h-96 md:h-[28rem] overflow-auto'
    }
    return 'flex-grow overflow-auto'
  }

  return (
    <div
      className={`flex flex-col ${
        fullscreen ? 'fixed inset-0 z-50 bg-white' : ''
      }`}
      style={{
        borderRadius: fullscreen ? '0' : '0.5rem',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Preview toolbar with improved layout */}
      <div className='bg-gray-50 p-2 md:p-3 border-b border-gray-200 flex-shrink-0'>
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

          <div className='flex items-center gap-1 md:gap-2 ml-auto flex-1 justify-end'>
            {/* Search bar (toggled by the search button) */}
            {showSearch && (
              <div className='flex flex-1 items-center bg-white border border-gray-200 rounded-md overflow-hidden md:ml-2'>
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
                      <ChevronLeft className={`h-3 w-3`} />
                    </button>
                    <button
                      onClick={handleSearchNext}
                      disabled={
                        !searchResults.length ||
                        currentSearchIndex === searchResults.length - 1
                      }
                      className='p-1 hover:bg-gray-100 rounded disabled:opacity-50'
                    >
                      <ChevronRight className={`h-3 w-3`} />
                    </button>
                    <button
                      onClick={() => setSearchTerm('')}
                      className='p-1 hover:bg-gray-100 rounded'
                    >
                      <X className={`h-3 w-3`} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Primary action buttons */}
            <div className='flex items-center space-x-2.5 md:space-x-3 sm:border-l sm:border-gray-200 sm:pl-2 justify-end'>
              <button
                onClick={handleSearchToggle}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors`}
                title={showSearch ? 'Close search' : 'Search document'}
              >
                <Search className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`} />
              </button>

              <button
                onClick={handleEditToggle}
                className={`p-1.5 rounded-md ${
                  isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
                } transition-colors`}
                title={isEditing ? 'Save changes' : 'Edit document'}
              >
                {isEditing ? (
                  <Save className={`h-5 w-5 md:h-4.5 md:w-4.5 text-blue-600`} />
                ) : (
                  <Edit className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`} />
                )}
              </button>

              <button
                onClick={handleCopy}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors relative`}
                title='Copy to clipboard'
              >
                <Copy className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`} />
                {copied && (
                  <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap'>
                    Copied!
                  </div>
                )}
              </button>

              <button
                onClick={handlePrint}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors`}
                title='Print document'
              >
                <Printer
                  className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`}
                />
              </button>

              <button
                onClick={() => setFullscreen(!fullscreen)}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors`}
                title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {fullscreen ? (
                  <Minimize
                    className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`}
                  />
                ) : (
                  <Maximize
                    className={`h-5 w-5 md:h-4.5 md:w-4.5 text-gray-500`}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Second toolbar row with pagination and zoom */}
        <div className='flex items-center justify-between mt-2 border-t border-gray-200 pt-2'>
          {/* Pagination controls */}
          <div className='flex items-center space-x-1'>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent`}
              title='Previous page'
            >
              <ChevronLeft className={`h-4 w-4 text-gray-600`} />
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent`}
              title='Next page'
            >
              <ChevronRight className={`h-4 w-4 text-gray-600`} />
            </button>
          </div>

          {/* Zoom controls - aligned properly */}
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

      {/* Document content with enhanced markdown rendering */}
      <div className={`bg-white relative ${getContentHeight()}`}>
        {isLoading ? (
          <div className='flex items-center justify-center h-full p-8'>
            <div className='text-center'>
              <div
                className='inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full mb-2'
                style={{ animation: 'spin 1s linear infinite' }}
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
            className='document-content p-5 md:p-8 h-full overflow-auto'
            style={{
              fontSize: `${zoom}%`,
              maxWidth: '1000px',
              margin: '0 auto',
            }}
            ref={contentRef}
          >
            <div className='prose prose-sm sm:prose max-w-none'>
              {/* Enhanced markdown rendering */}
              <div className='markdown-content leading-relaxed'>
                {renderContent(
                  parseMarkdown(contentPages[currentPage - 1] || '')
                )}
              </div>
            </div>
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

      {/* Footer with status message */}
      <div
        className={`bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 border-t border-gray-200 flex-shrink-0 z-10 ${
          fullscreen ? 'mt-auto' : ''
        }`}
      >
        <div className='flex justify-center items-center'>
          <span className='text-xs text-gray-500 text-center'>
            {searchResults.length > 0 && (
              <span className='mr-2 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md text-xs'>
                {searchResults.length}{' '}
                {searchResults.length === 1 ? 'match' : 'matches'} found
              </span>
            )}
            {!isMobile && <span>Enhanced Preview • </span>}Powered by Documnt AI
          </span>
        </div>
      </div>
    </div>
  )
}

export default DocumentPreview
