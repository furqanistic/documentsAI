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
    createdAt: '2024-05-20',
    lastModified: '2024-05-22',
    fileSize: '2.4 MB',
    status: 'completed',
    questions: 25,
  },
  {
    id: '2',
    title: 'History Study Guide - World War II',
    type: 'Study Guide',
    createdAt: '2024-05-18',
    lastModified: '2024-05-21',
    fileSize: '1.8 MB',
    status: 'completed',
    pages: 12,
  },
  {
    id: '3',
    title: 'Business Interview Questions',
    type: 'Interview',
    createdAt: '2024-05-15',
    lastModified: '2024-05-15',
    fileSize: '856 KB',
    status: 'draft',
    questions: 15,
  },
  {
    id: '4',
    title: 'Trade Analysis Report Q1 2024',
    type: 'Report',
    createdAt: '2024-05-10',
    lastModified: '2024-05-12',
    fileSize: '3.2 MB',
    status: 'completed',
    pages: 24,
  },
  {
    id: '5',
    title: 'Chemistry Lab Assessment',
    type: 'Exam',
    createdAt: '2024-05-08',
    lastModified: '2024-05-09',
    fileSize: '1.1 MB',
    status: 'completed',
    questions: 18,
  },
  {
    id: '6',
    title: 'Project Management Guidelines',
    type: 'Guide',
    createdAt: '2024-05-05',
    lastModified: '2024-05-06',
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

const MyDocuments = () => {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    document: null,
  })

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
    // Implement view functionality
    console.log('View document:', document)
  }

  return (
    <motion.div
      className='max-w-7xl mx-auto'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Updated to match My Templates layout */}
      <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-3'>
        <div className='w-full sm:w-auto text-center sm:text-left'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1'>
            My Documents
          </h1>
          <p className='text-gray-500 text-sm sm:text-base'>
            Manage and organize your AI-generated materials.
          </p>
        </div>
        {/* Search Bar positioned where CTA buttons are in My Templates - mobile only */}
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <div className='relative flex-1 sm:w-[300px]'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
            />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search documents...'
              className='pl-10 py-2 pr-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black shadow-sm h-10'
            />
          </div>
        </div>
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
            {searchQuery
              ? 'Try adjusting your search criteria.'
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
                  <th className='relative px-6 py-3'>
                    <span className='sr-only'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                <AnimatePresence>
                  {filteredDocuments.map((document, index) => (
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
                          <div className='p-2 bg-gray-100 rounded-lg mr-3'>
                            <FileText className='w-5 h-5 text-gray-600' />
                          </div>
                          <div>
                            <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
                              {document.title}
                            </div>
                            <div className='text-sm text-gray-500'>
                              Modified{' '}
                              {new Date(
                                document.lastModified
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
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
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(document.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
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
                        {document.pages && <span>{document.pages} pages</span>}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0'
                            >
                              <MoreVertical className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => handleView(document)}
                            >
                              <Eye className='w-4 h-4 mr-2' />
                              View
                            </DropdownMenuItem>
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
                      </td>
                    </motion.tr>
                  ))}
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
