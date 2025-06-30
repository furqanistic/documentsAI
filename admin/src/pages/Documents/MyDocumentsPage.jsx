import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Download,
  FileText,
  Loader2,
  MoreVertical,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../../config'
import DashboardLayout from '../Layout/DashboardLayout'

// Constants
const DOCUMENT_TYPES = ['All', 'Professional', 'Exam', 'Interview', 'Report']

// Custom hooks
const useDocuments = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['documents', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/documents/my-documents', {
        params: { page, limit },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load documents')
      }

      return response.data.documents
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId) => {
      const response = await axiosInstance.delete(`/documents/${documentId}`)
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete document')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      toast.success('Document deleted successfully!')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete document'
      )
    },
  })
}

const useDocumentDetails = () => {
  return useMutation({
    mutationFn: async (documentId) => {
      const response = await axiosInstance.get(`/documents/${documentId}`)
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load document')
      }
      return response.data.document
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to load document details'
      )
    },
    // Ensure each call is fresh and not cached
    cacheTime: 0,
    retry: false,
  })
}

// Utility functions
const getDocumentTypeDisplay = (type) => {
  const typeMap = {
    professional: 'Professional',
    exam: 'Exam',
    interview: 'Interview',
    report: 'Report',
  }
  return typeMap[type] || type
}

const getDocumentStatus = (doc) => {
  return doc.content && doc.content.trim() ? 'completed' : 'draft'
}

const getDocumentDetails = (doc) => {
  if (!doc.content) return 'No content'

  const wordCount = doc.content.trim().split(/\s+/).length
  const estimatedPages = Math.ceil(wordCount / 250)

  if (doc.documentType === 'exam') {
    const questionMatches = doc.content.match(/^\d+\.|Question \d+|Q\d+/gm)
    const questionCount = questionMatches
      ? questionMatches.length
      : Math.ceil(wordCount / 50)
    return `${questionCount} questions`
  }

  return `${estimatedPages} pages`
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return { time, date: dateStr }
}

const downloadDocument = (document) => {
  if (!document?.content) {
    toast.error('No content available to download')
    return
  }

  try {
    const element = document.createElement('a')
    const file = new Blob([document.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${document.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Document downloaded successfully!')
  } catch (error) {
    toast.error('Failed to download document')
  }
}

// Components
const DeleteConfirmationDialog = React.memo(
  ({ isOpen, onClose, onConfirm, document, isDeleting }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Delete Document
            </DialogTitle>
            <DialogDescription className='text-gray-600'>
              Are you sure you want to delete "{document?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex space-x-2'>
            <Button variant='outline' onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={onConfirm}
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

const DocumentViewerDialog = React.memo(({ isOpen, onClose, document }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='text-lg font-semibold'>
            {document?.title}
          </DialogTitle>
          <DialogDescription className='text-gray-600 flex items-center gap-2'>
            <span className='capitalize'>{document?.documentType}</span>
            <span>•</span>
            <span>{new Date(document?.createdAt).toLocaleDateString()}</span>
          </DialogDescription>
        </DialogHeader>
        <div className='px-6 pb-6'>
          <div className='w-full h-[70vh] bg-gray-50 rounded-lg border overflow-hidden'>
            {document?.content ? (
              <div className='h-full overflow-y-auto p-6'>
                <div className='prose prose-sm max-w-none'>
                  <pre className='whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800'>
                    {document.content.substring(0, 2000)}
                    {document.content.length > 2000 && '...'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className='h-full flex items-center justify-center'>
                <div className='text-center'>
                  <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    Document Preview
                  </h3>
                  <p className='text-gray-500 mb-4'>No content available</p>
                </div>
              </div>
            )}
          </div>
          <div className='flex justify-between items-center mt-4'>
            <Button
              onClick={() => downloadDocument(document)}
              disabled={!document?.content}
              className='bg-green-600 hover:bg-green-700 text-white'
            >
              <Download className='w-4 h-4 mr-2' />
              Download
            </Button>
            <Button variant='outline' onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

const DocumentsTable = React.memo(({ documents, onView, onDelete }) => {
  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='text-center py-12'
      >
        <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No documents found
        </h3>
        <p className='text-gray-500 mb-4'>
          Try adjusting your search or filter criteria.
        </p>
      </motion.div>
    )
  }

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Document
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Created
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Type
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Details
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            <AnimatePresence>
              {documents.map((document) => {
                const createdDateTime = formatDateTime(document.createdAt)
                const modifiedDateTime = formatDateTime(document.updatedAt)
                const status = getDocumentStatus(document)

                return (
                  <motion.tr
                    key={document._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                            {document.title}
                          </div>
                          <div className='text-sm text-gray-500 flex items-center gap-2'>
                            <span>
                              Modified: {modifiedDateTime.date} ·{' '}
                              {modifiedDateTime.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Badge
                        variant='secondary'
                        className={
                          status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 font-medium'>
                        {createdDateTime.date}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {createdDateTime.time}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm text-gray-900'>
                        {getDocumentTypeDisplay(document.documentType)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {getDocumentDetails(document)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => onView(document)}
                          className='h-8 px-4 text-xs font-medium bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-600 hover:from-blue-700 hover:to-blue-900 hover:text-white transition-all duration-200'
                        >
                          View
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 ml-2 focus:ring-0 focus:outline-none active:ring-0 focus-visible:ring-0'
                            >
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => downloadDocument(document)}
                            >
                              <Download className='w-4 h-4 mr-2' />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(document)}
                              className='text-red-600 focus:text-red-600'
                            >
                              <Trash2 className='w-4 h-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
})

const EmptyState = React.memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className='text-center py-12'
  >
    <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
    <h3 className='text-lg font-medium text-gray-900 mb-2'>No documents yet</h3>
    <p className='text-gray-500 mb-4'>
      You haven't created any documents yet. Start by generating your first AI
      document!
    </p>
    <Button
      onClick={() => (window.location.href = 'https://documnt.ai/create')}
      className='bg-blue-600 hover:bg-blue-700'
    >
      Create Your First Document
    </Button>
  </motion.div>
))

// Main component
const MyDocuments = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    document: null,
  })
  const [viewerDialog, setViewerDialog] = useState({
    isOpen: false,
    document: null,
  })

  // React Query hooks
  const { data: documents = [], isLoading, error, refetch } = useDocuments()
  const deleteMutation = useDeleteDocument()
  const documentDetailsMutation = useDocumentDetails()

  // Filter out interactive documents - they belong in test management
  const nonInteractiveDocuments = useMemo(() => {
    return documents.filter((doc) => !doc.isInteractive)
  }, [documents])

  // Memoized filtered documents
  const filteredDocuments = useMemo(() => {
    return nonInteractiveDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDocumentTypeDisplay(doc.documentType)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())

      const status = getDocumentStatus(doc)
      const matchesStatus =
        filterStatus === 'All' || status === filterStatus.toLowerCase()

      const matchesType =
        filterType === 'All' || doc.documentType === filterType.toLowerCase()

      return matchesSearch && matchesStatus && matchesType
    })
  }, [nonInteractiveDocuments, searchQuery, filterStatus, filterType])

  // Callback functions
  const handleDelete = useCallback((document) => {
    setDeleteDialog({ isOpen: true, document })
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.document) return
    await deleteMutation.mutateAsync(deleteDialog.document._id)
    setDeleteDialog({ isOpen: false, document: null })
  }, [deleteDialog.document, deleteMutation])

  const handleView = useCallback(async (document) => {
    try {
      // Clear any existing viewer dialog first
      setViewerDialog({ isOpen: false, document: null })

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      console.log('Fetching document:', document._id, document.title) // Debug log

      const response = await axiosInstance.get(
        `/documents/${document._id}?t=${timestamp}`,
        {
          // Add headers to prevent caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load document')
      }

      const docWithContent = response.data.document
      console.log('Fetched document:', docWithContent._id, docWithContent.title) // Debug log
      console.log(
        'Document content preview:',
        docWithContent.content?.substring(0, 100)
      ) // Debug log

      // Small delay to ensure state is cleared, then set new document
      setTimeout(() => {
        setViewerDialog({ isOpen: true, document: docWithContent })
      }, 50)
    } catch (error) {
      console.error('Error loading document:', error)
      toast.error(
        error.response?.data?.message || 'Failed to load document details'
      )
    }
  }, [])

  const handleExportExcel = useCallback(() => {
    if (filteredDocuments.length === 0) {
      toast.error('No documents to export')
      return
    }

    try {
      const headers = [
        'Document Title',
        'Type',
        'Status',
        'Created Date',
        'Last Modified',
        'Details',
      ]
      const csvContent = [
        headers.join(','),
        ...filteredDocuments.map((doc) =>
          [
            `"${doc.title}"`,
            `"${getDocumentTypeDisplay(doc.documentType)}"`,
            getDocumentStatus(doc),
            new Date(doc.createdAt).toLocaleDateString(),
            new Date(doc.updatedAt).toLocaleDateString(),
            `"${getDocumentDetails(doc)}"`,
          ].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `documents-export-${
        new Date().toISOString().split('T')[0]
      }.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Documents exported successfully!')
    } catch (error) {
      toast.error('Failed to export documents')
    }
  }, [filteredDocuments])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setFilterStatus('All')
    setFilterType('All')
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
    toast.success('Documents refreshed!')
  }, [refetch])

  // Show error state
  if (error) {
    return (
      <motion.div
        className='max-w-7xl mx-auto'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <h3 className='text-lg font-medium text-red-600 mb-2'>
              Error loading documents
            </h3>
            <p className='text-gray-500 mb-4'>
              {error.message || 'Something went wrong. Please try again.'}
            </p>
            <Button
              onClick={handleRefresh}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Try Again
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className='max-w-7xl mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row justify-between items-center mb-3 lg:mb-6 gap-3'>
        <div className='w-full sm:w-auto text-center sm:text-left'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
            My Documents
          </h1>
          <p className='text-gray-500 text-sm sm:text-base'>
            Manage and organize your AI-generated materials.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='mb-6 animate-fadeIn'>
        <div className='flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4'>
          <div className='relative group flex-1'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            />
            <input
              type='text'
              placeholder='Search documents...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-3 h-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black'
            />
          </div>

          <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:items-center'>
            <div className='relative'>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[120px]'
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
            </div>

            <div className='relative'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[120px]'
              >
                <option value='All'>Status</option>
                <option value='Completed'>Completed</option>
                <option value='Draft'>Draft</option>
              </select>
              <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
            </div>

            {(filterStatus !== 'All' ||
              filterType !== 'All' ||
              searchQuery) && (
              <Button
                variant='outline'
                size='sm'
                onClick={clearFilters}
                className='h-9 lg:h-10 px-2 lg:px-3 text-sm font-medium lg:w-[120px] col-span-1'
              >
                Clear
              </Button>
            )}

            <Button
              onClick={handleExportExcel}
              className='h-9 lg:h-10 bg-green-600 hover:bg-green-700 text-white px-3 text-sm lg:text-sm font-medium lg:w-[120px]'
              disabled={filteredDocuments.length === 0}
            >
              <Download className='h-3 w-3 lg:h-4 lg:w-4 mr-1.5' />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Document Count */}
      {!isLoading && (
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            Showing {filteredDocuments.length} of{' '}
            {nonInteractiveDocuments.length} documents
            {filteredDocuments.length > 0 && searchQuery && (
              <span className='ml-2 text-blue-600'>for "{searchQuery}"</span>
            )}
          </p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center justify-center py-16'
        >
          <div className='text-center'>
            <Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Loading your documents...
            </h3>
            <p className='text-gray-500'>
              Please wait while we fetch your documents.
            </p>
          </div>
        </motion.div>
      ) : nonInteractiveDocuments.length === 0 ? (
        <EmptyState />
      ) : (
        <DocumentsTable
          documents={filteredDocuments}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      {/* Dialogs */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, document: null })}
        onConfirm={confirmDelete}
        document={deleteDialog.document}
        isDeleting={deleteMutation.isLoading}
      />

      <DocumentViewerDialog
        key={viewerDialog.document?._id || 'empty'} // Force re-render when document changes
        isOpen={viewerDialog.isOpen}
        onClose={() => setViewerDialog({ isOpen: false, document: null })}
        document={viewerDialog.document}
      />
    </motion.div>
  )
}

// Wrap with DashboardLayout
export default function MyDocumentsPage() {
  return (
    <DashboardLayout>
      <MyDocuments />
    </DashboardLayout>
  )
}
