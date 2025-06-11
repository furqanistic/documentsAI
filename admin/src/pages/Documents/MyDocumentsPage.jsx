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
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  MoreVertical,
  Search,
  Trash2,
} from 'lucide-react'
import React, { useState } from 'react'

// Mock data - replace with actual API calls
const mockDocuments = [
  {
    id: '1',
    title: 'Advanced Mathematics Exam',
    type: 'Exam',
    createdAt: '2025-05-20T14:45:00',
    lastModified: '2025-05-22T09:30:00',
    fileSize: '2.4 MB',
    status: 'completed',
    questions: 25,
  },
  {
    id: '2',
    title: 'History Study Guide - World War II',
    type: 'Study Guide',
    createdAt: '2025-05-18T10:15:00',
    lastModified: '2025-05-21T16:20:00',
    fileSize: '1.8 MB',
    status: 'completed',
    pages: 12,
  },
  {
    id: '3',
    title: 'Business Interview Questions',
    type: 'Interview',
    createdAt: '2025-05-15T08:30:00',
    lastModified: '2025-05-15T11:45:00',
    fileSize: '856 KB',
    status: 'draft',
    questions: 15,
  },
  {
    id: '4',
    title: 'Trade Analysis Report Q1 2025',
    type: 'Report',
    createdAt: '2025-05-10T13:20:00',
    lastModified: '2025-05-12T15:10:00',
    fileSize: '3.2 MB',
    status: 'completed',
    pages: 24,
  },
  {
    id: '5',
    title: 'Chemistry Lab Assessment',
    type: 'Exam',
    createdAt: '2025-05-08T07:45:00',
    lastModified: '2025-05-09T12:00:00',
    fileSize: '1.1 MB',
    status: 'completed',
    questions: 18,
  },
  {
    id: '6',
    title: 'Project Management Guidelines',
    type: 'Guide',
    createdAt: '2025-05-05T17:30:00',
    lastModified: '2025-05-06T09:15:00',
    fileSize: '2.7 MB',
    status: 'draft',
    pages: 16,
  },
]

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, document }) => {
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
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700'
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const DocumentViewerDialog = ({ isOpen, onClose, document }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle className='text-lg font-semibold'>
            {document?.title}
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            {document?.type} • {document?.fileSize}
          </DialogDescription>
        </DialogHeader>
        <div className='px-6 pb-6'>
          <div className='w-full h-[70vh] bg-gray-100 rounded-lg flex items-center justify-center border'>
            <div className='text-center'>
              <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Document Preview
              </h3>
              <p className='text-gray-500 mb-4'>{document?.title}</p>
              <div className='flex gap-2 justify-center'>
                <Button
                  variant='outline'
                  onClick={() => {
                    // Implement actual download
                    console.log('Download document:', document)
                  }}
                >
                  <Download className='w-4 h-4 mr-2' />
                  Download
                </Button>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const MyDocuments = () => {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    document: null,
  })
  const [viewerDialog, setViewerDialog] = useState({
    isOpen: false,
    document: null,
  })

  const handleExportExcel = () => {
    // Create CSV content from filtered documents
    const headers = [
      'Document Title',
      'Type',
      'Status',
      'Created Date',
      'Last Modified',
      'File Size',
      'Details',
    ]
    const csvContent = [
      headers.join(','),
      ...filteredDocuments.map((doc) =>
        [
          `"${doc.title}"`,
          `"${doc.type}"`,
          doc.status,
          doc.createdAt,
          doc.lastModified,
          `"${doc.fileSize}"`,
          doc.questions
            ? `${doc.questions} questions`
            : doc.pages
            ? `${doc.pages} pages`
            : '',
        ].join(',')
      ),
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'documents-export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || doc.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (document) => {
    setDeleteDialog({ isOpen: true, document })
  }

  const confirmDelete = () => {
    setDocuments((docs) =>
      docs.filter((doc) => doc.id !== deleteDialog.document.id)
    )
    setDeleteDialog({ isOpen: false, document: null })
  }

  const handleView = (document) => {
    setViewerDialog({ isOpen: true, document })
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
          {/* Search Bar - Takes all available space on desktop */}
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

          {/* Filters and Actions - Right aligned group */}
          <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:items-center'>
            {/* Status Filter */}
            <div className='relative'>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[120px]'
              >
                <option value='All'>Status</option>
                <option value='completed'>Completed</option>
                <option value='draft'>Draft</option>
              </select>
              <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
            </div>

            {/* Clear Button */}
            {(filterStatus !== 'All' || searchQuery) && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('All')
                }}
                className='h-9 lg:h-10 px-2 lg:px-3 text-sm font-medium lg:w-[120px] col-span-1'
              >
                Clear
              </Button>
            )}

            {/* Export Button */}
            <Button
              onClick={handleExportExcel}
              className='h-9 lg:h-10 bg-green-600 hover:bg-green-700 text-white px-3 text-sm lg:text-sm font-medium lg:w-[120px]'
            >
              <Download className='h-3 w-3 lg:h-4 lg:w-4 mr-1.5' />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Document Count */}
      <div className='mb-4'>
        <p className='text-gray-600 dark:text-gray-400 text-sm'>
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
      </div>

      {/* Documents Table */}
      {filteredDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12'
        >
          <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No documents found
          </h3>
          <p className='text-gray-500'>
            {searchQuery || filterStatus !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : "You haven't created any documents yet."}
          </p>
        </motion.div>
      ) : (
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
                  {filteredDocuments.map((document, index) => {
                    const createdDateTime = formatDateTime(document.createdAt)
                    const modifiedDateTime = formatDateTime(
                      document.lastModified
                    )

                    return (
                      <motion.tr
                        key={document.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className='hover:bg-gray-50 transition-colors duration-200'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div>
                              <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                                {document.title}
                              </div>
                              <div className='text-sm text-gray-500'>
                                Modified: {modifiedDateTime.date} ·{' '}
                                {modifiedDateTime.time}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Badge
                            variant='secondary'
                            className={
                              document.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1)}
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
                            {document.type}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {document.questions && (
                            <span>{document.questions} questions</span>
                          )}
                          {document.pages && (
                            <span>{document.pages} pages</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <div className='flex items-center gap-2'>
                            {/* View Button */}
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleView(document)}
                              className='h-8 px-4 text-xs font-medium bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-600 hover:from-blue-700 hover:to-blue-900 hover:text-white transition-all duration-200'
                            >
                              View
                            </Button>

                            {/* More Actions Dropdown */}
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
                                <DropdownMenuItem>
                                  <Download className='w-4 h-4 mr-2' />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(document)}
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
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, document: null })}
        onConfirm={confirmDelete}
        document={deleteDialog.document}
      />

      {/* Document Viewer Dialog */}
      <DocumentViewerDialog
        isOpen={viewerDialog.isOpen}
        onClose={() => setViewerDialog({ isOpen: false, document: null })}
        document={viewerDialog.document}
      />
    </motion.div>
  )
}

// Wrap with DashboardLayout
import DashboardLayout from '../Layout/DashboardLayout'

export default function MyDocumentsPage() {
  return (
    <DashboardLayout>
      <MyDocuments />
    </DashboardLayout>
  )
}
