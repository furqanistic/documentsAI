import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  FileText,
  Maximize,
  Minimize,
  MoreVertical,
  Printer,
  Save,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const DocumentPreview = ({ content = '', onContentChange }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [pages, setPages] = useState([])
  const [copied, setCopied] = useState(false)

  const searchInputRef = useRef(null)
  const fullscreenRef = useRef(null)

  // Better content splitting with longer pages
  useEffect(() => {
    if (!content || content.trim() === '') {
      setPages(['No content available'])
      return
    }

    setEditContent(content)

    const splitContent = (text) => {
      // Normalize line breaks
      const normalized = text
        .replace(/\r\n/g, '\n')
        .replace(/\n{4,}/g, '\n\n\n')

      // First try to split by major headers (# and ##)
      const majorSections = normalized
        .split(/(?=^#{1,2}\s)/m)
        .filter((section) => section.trim().length > 0)

      if (majorSections.length > 1) {
        // We have headers, use them as natural break points
        const processedPages = []

        majorSections.forEach((section) => {
          const trimmed = section.trim()

          // Only split if section is very long (more than 4000 chars)
          if (trimmed.length > 4000) {
            // Split by subsections or paragraphs, but keep sections together
            const subSections = trimmed.split(/(?=^#{3}\s)|(?:\n\s*\n\s*\n)/m)
            let currentSubPage = ''

            subSections.forEach((subSection) => {
              if (currentSubPage.length + subSection.length > 3500) {
                if (currentSubPage.trim()) {
                  processedPages.push(currentSubPage.trim())
                }
                currentSubPage = subSection
              } else {
                currentSubPage += (currentSubPage ? '\n\n' : '') + subSection
              }
            })

            if (currentSubPage.trim()) {
              processedPages.push(currentSubPage.trim())
            }
          } else {
            processedPages.push(trimmed)
          }
        })

        return processedPages.length > 0 ? processedPages : [normalized]
      }

      // No major headers, split by content size but keep more content together
      const paragraphs = normalized
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0)
      const chunkedPages = []
      let currentPage = ''
      const maxPageLength = 3500 // Longer pages

      paragraphs.forEach((paragraph) => {
        const trimmedParagraph = paragraph.trim()

        // Only start new page if current page is substantial AND adding would make it too long
        if (
          currentPage.length > 1000 &&
          currentPage.length + trimmedParagraph.length > maxPageLength
        ) {
          chunkedPages.push(currentPage.trim())
          currentPage = trimmedParagraph
        } else {
          currentPage += (currentPage ? '\n\n' : '') + trimmedParagraph
        }
      })

      if (currentPage.trim()) {
        chunkedPages.push(currentPage.trim())
      }

      return chunkedPages.length > 0 ? chunkedPages : [normalized]
    }

    const newPages = splitContent(content)
    setPages(newPages)

    // Reset to first page if current page doesn't exist
    if (currentPage > newPages.length) {
      setCurrentPage(1)
    }
  }, [content])

  // Handle fullscreen properly
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen()
      } else if (fullscreenRef.current?.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen()
      } else if (fullscreenRef.current?.mozRequestFullScreen) {
        fullscreenRef.current.mozRequestFullScreen()
      } else if (fullscreenRef.current?.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Enhanced markdown rendering
  const renderMarkdown = (text) => {
    if (!text) return ''

    let html = text
      // Handle code blocks first
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text'
        return `<pre class="code-block" data-lang="${language}"><code>${code.trim()}</code></pre>`
      })

      // Inline code
      .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')

      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="h3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="h2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="h1">$1</h1>')

      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )

      // Lists
      .replace(/^(\s*)[-*+] (.+)$/gm, '$1<li class="bullet-item">$2</li>')
      .replace(/^(\s*)(\d+)\. (.+)$/gm, '$1<li class="number-item">$2. $3</li>')

      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')

    // Wrap in paragraphs if needed
    if (
      !html.includes('<h1') &&
      !html.includes('<h2') &&
      !html.includes('<h3') &&
      !html.includes('<pre')
    ) {
      html = '<p>' + html + '</p>'
    }

    return html
  }

  const handleNavigation = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    } else if (direction === 'next' && currentPage < pages.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 150) {
      setZoom(zoom + 10)
    } else if (direction === 'out' && zoom > 70) {
      setZoom(zoom - 10)
    } else if (direction === 'reset') {
      setZoom(100)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      if (onContentChange) {
        onContentChange(editContent)
      }
    }
    setIsEditing(!isEditing)
  }

  const handlePrint = () => {
    const printContent = pages.join('\n\n---\n\n')
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
              }
              h1 { font-size: 24px; font-weight: bold; margin: 24px 0 16px 0; }
              h2 { font-size: 20px; font-weight: 600; margin: 20px 0 12px 0; }
              h3 { font-size: 18px; font-weight: 600; margin: 16px 0 8px 0; }
              p { margin-bottom: 12px; }
              pre { background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; }
              code { background: #f0f0f0; padding: 2px 4px; border-radius: 2px; font-family: monospace; }
              @media print { @page { margin: 1in; } }
            </style>
          </head>
          <body>
            ${renderMarkdown(printContent)}
            <script>window.onload = () => { window.print(); window.close(); }</script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const highlightSearchTerms = (text, term) => {
    if (!term) return text
    const regex = new RegExp(`(${term})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  const currentPageContent = pages[currentPage - 1] || 'No content available'
  const processedContent =
    showSearch && searchTerm
      ? highlightSearchTerms(renderMarkdown(currentPageContent), searchTerm)
      : renderMarkdown(currentPageContent)

  return (
    <div
      ref={fullscreenRef}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-white' : ''
      }`}
    >
      {/* Header - Mobile Optimized */}
      <div className='border-b border-gray-200 bg-gray-50'>
        {/* Main header row */}
        <div className='flex items-center justify-between p-3 md:p-4'>
          {/* Left side - Title and page info */}
          <div className='flex items-center space-x-2 md:space-x-3 min-w-0 flex-1'>
            <FileText className='h-4 w-4 md:h-5 md:w-5 text-gray-500 flex-shrink-0' />
            <div className='min-w-0 flex-1'>
              <h2 className='font-semibold text-gray-900 text-sm md:text-base truncate'>
                Document Preview
              </h2>
              <span className='text-xs md:text-sm text-gray-500 block md:hidden'>
                {currentPage}/{pages.length}
              </span>
            </div>
            {/* Desktop page info */}
            <span className='hidden md:block text-sm text-gray-500 whitespace-nowrap'>
              Page {currentPage} of {pages.length}
            </span>
          </div>

          {/* Right side - Actions */}
          <div className='flex items-center space-x-1'>
            {/* Desktop buttons */}
            <div className='hidden md:flex items-center space-x-2'>
              <button
                onClick={() => {
                  setShowSearch(!showSearch)
                  if (!showSearch) {
                    setTimeout(() => searchInputRef.current?.focus(), 100)
                  }
                }}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <Search className='h-4 w-4' />
              </button>

              <button
                onClick={handleEdit}
                className={`p-2 rounded ${
                  isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {isEditing ? (
                  <Save className='h-4 w-4' />
                ) : (
                  <Edit className='h-4 w-4' />
                )}
              </button>

              <button
                onClick={handleCopy}
                className='p-2 hover:bg-gray-100 rounded relative'
              >
                <Copy className='h-4 w-4' />
                {copied && (
                  <div className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10'>
                    Copied!
                  </div>
                )}
              </button>

              <button
                onClick={handlePrint}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <Printer className='h-4 w-4' />
              </button>

              <button
                onClick={toggleFullscreen}
                className='p-2 hover:bg-gray-100 rounded'
              >
                {isFullscreen ? (
                  <Minimize className='h-4 w-4' />
                ) : (
                  <Maximize className='h-4 w-4' />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden relative'>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className='p-2 hover:bg-gray-100 rounded'
              >
                <MoreVertical className='h-4 w-4' />
              </button>

              {/* Mobile dropdown menu */}
              {showMobileMenu && (
                <div className='absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-48'>
                  <button
                    onClick={() => {
                      setShowSearch(!showSearch)
                      setShowMobileMenu(false)
                      if (!showSearch) {
                        setTimeout(() => searchInputRef.current?.focus(), 100)
                      }
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2'
                  >
                    <Search className='h-4 w-4' />
                    <span>Search</span>
                  </button>

                  <button
                    onClick={() => {
                      handleEdit()
                      setShowMobileMenu(false)
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2'
                  >
                    {isEditing ? (
                      <Save className='h-4 w-4' />
                    ) : (
                      <Edit className='h-4 w-4' />
                    )}
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleCopy()
                      setShowMobileMenu(false)
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2'
                  >
                    <Copy className='h-4 w-4' />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={() => {
                      handlePrint()
                      setShowMobileMenu(false)
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2'
                  >
                    <Printer className='h-4 w-4' />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleFullscreen()
                      setShowMobileMenu(false)
                    }}
                    className='w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 border-t border-gray-100'
                  >
                    {isFullscreen ? (
                      <Minimize className='h-4 w-4' />
                    ) : (
                      <Maximize className='h-4 w-4' />
                    )}
                    <span>
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar - Mobile optimized */}
        {showSearch && (
          <div className='px-3 pb-3 md:px-4 md:pb-4'>
            <div className='flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2'>
              <Search className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Search in document...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='text-sm outline-none flex-1 min-w-0'
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='ml-2 p-1 hover:bg-gray-100 rounded flex-shrink-0'
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content - Mobile optimized */}
      <div
        className={`${isFullscreen ? 'flex-1 flex flex-col' : 'h-80 md:h-96'}`}
      >
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className='w-full h-full p-3 md:p-6 font-mono text-xs md:text-sm resize-none outline-none'
            style={{ fontSize: `${zoom}%` }}
          />
        ) : (
          <div
            className='h-full overflow-auto'
            style={{ fontSize: `${zoom}%` }}
          >
            <div className='p-3 md:p-6'>
              <style>
                {`
                  .prose h1.h1 { 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    margin: 1.5rem 0 1rem 0; 
                    color: #111827; 
                    border-bottom: 2px solid #e5e7eb; 
                    padding-bottom: 0.5rem; 
                  }
                  .prose h2.h2 { 
                    font-size: 1.25rem; 
                    font-weight: 600; 
                    margin: 1.25rem 0 0.75rem 0; 
                    color: #374151; 
                  }
                  .prose h3.h3 { 
                    font-size: 1.125rem; 
                    font-weight: 600; 
                    margin: 1rem 0 0.5rem 0; 
                    color: #374151; 
                  }
                  .prose p { 
                    margin-bottom: 1rem; 
                    line-height: 1.6; 
                    color: #374151; 
                  }
                  .prose pre.code-block { 
                    background: #f9fafb; 
                    border: 1px solid #e5e7eb; 
                    border-radius: 0.5rem; 
                    padding: 0.75rem; 
                    margin: 1rem 0; 
                    overflow-x: auto; 
                    font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', monospace;
                    font-size: 0.875rem;
                  }
                  .prose pre.code-block::before { 
                    content: attr(data-lang); 
                    display: block; 
                    font-size: 0.75rem; 
                    color: #6b7280; 
                    margin-bottom: 0.5rem; 
                    font-weight: 500; 
                  }
                  .prose code.inline-code { 
                    background: #f3f4f6; 
                    color: #374151; 
                    padding: 0.125rem 0.25rem; 
                    border-radius: 0.25rem; 
                    font-family: ui-monospace, monospace; 
                    font-size: 0.875em; 
                  }
                  .prose li.bullet-item { 
                    margin-left: 1.5rem; 
                    margin-bottom: 0.5rem; 
                    list-style: disc; 
                  }
                  .prose li.number-item { 
                    margin-left: 1.5rem; 
                    margin-bottom: 0.5rem; 
                    list-style: none; 
                  }
                  .prose strong { 
                    font-weight: 600; 
                    color: #111827; 
                  }
                  .prose em { 
                    font-style: italic; 
                  }
                  .prose a { 
                    color: #2563eb; 
                    text-decoration: underline; 
                  }
                  .prose a:hover { 
                    color: #1d4ed8; 
                  }
                  .prose mark { 
                    background-color: #fef3c7; 
                    padding: 0.125rem; 
                    border-radius: 0.125rem; 
                  }
                  
                  @media (max-width: 768px) {
                    .prose h1.h1 { font-size: 1.25rem; margin: 1rem 0 0.75rem 0; }
                    .prose h2.h2 { font-size: 1.125rem; margin: 1rem 0 0.5rem 0; }
                    .prose h3.h3 { font-size: 1rem; margin: 0.75rem 0 0.5rem 0; }
                    .prose pre.code-block { padding: 0.5rem; font-size: 0.75rem; }
                  }
                `}
              </style>
              <div
                className='prose prose-gray max-w-none'
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer - Mobile optimized */}
      <div className='border-t border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between p-2 md:p-3'>
          {/* Navigation */}
          <div className='flex items-center space-x-1'>
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentPage === 1}
              className='p-1.5 md:p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:hover:bg-gray-50'
            >
              <ChevronLeft className='h-4 w-4' />
            </button>
            <button
              onClick={() => handleNavigation('next')}
              disabled={currentPage === pages.length}
              className='p-1.5 md:p-2 hover:bg-gray-200 rounded disabled:opacity-50 disabled:hover:bg-gray-50'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>

          {/* Center info - Mobile */}
          <div className='flex-1 text-center md:hidden'>
            {searchTerm && (
              <span className='text-xs text-gray-500'>Search active</span>
            )}
          </div>

          {/* Zoom controls */}
          <div className='flex items-center space-x-1'>
            <button
              onClick={() => handleZoom('out')}
              disabled={zoom <= 70}
              className='p-1 md:p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-600'
            >
              <ZoomOut className='h-3 w-3 md:h-4 md:w-4' />
            </button>
            <span className='text-xs font-medium w-8 md:w-12 text-center text-gray-700'>
              {zoom}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoom >= 150}
              className='p-1 md:p-1.5 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-600'
            >
              <ZoomIn className='h-3 w-3 md:h-4 md:w-4' />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className='hidden md:block text-xs px-2 py-1 hover:bg-gray-200 rounded text-gray-600'
            >
              Reset
            </button>
          </div>

          {/* Desktop search status */}
          <div className='hidden md:block'>
            {searchTerm && (
              <span className='text-xs text-gray-500'>
                Search results highlighted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Close mobile menu when clicking outside */}
      {showMobileMenu && (
        <div
          className='fixed inset-0 z-10'
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  )
}

export default DocumentPreview
