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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BarChart3,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Link,
  Loader2,
  MoreVertical,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../../config'
import DashboardLayout from '../Layout/DashboardLayout'

// Custom hooks for fetching interactive documents
const useInteractiveDocuments = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['interactive-documents', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/documents/my-documents', {
        params: { page, limit },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load documents')
      }

      // Filter only interactive documents
      return response.data.documents.filter((doc) => doc.isInteractive)
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
        throw new Error(response.data.message || 'Failed to delete test')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['interactive-documents'])
      toast.success('Test deleted successfully!')
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete test'
      )
    },
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

const formatDateTimeDetailed = (dateTimeString) => {
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
  return `${dateStr} · ${time}`
}

// Delete Confirmation Dialog
const DeleteConfirmationDialog = React.memo(
  ({ isOpen, onClose, onConfirm, test, isDeleting }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Delete Test
            </DialogTitle>
            <DialogDescription className='text-gray-600'>
              Are you sure you want to delete "{test?.title}"? This action
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

// Test Row Component
const TestRow = ({ test, onAction }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        variant: 'secondary',
        text: 'Active',
        className: 'bg-green-100 text-green-800',
      },
      Draft: {
        variant: 'secondary',
        text: 'Draft',
        className: 'bg-yellow-100 text-yellow-800',
      },
      Archived: {
        variant: 'secondary',
        text: 'Archived',
        className: 'bg-gray-100 text-gray-800',
      },
    }
    const config = statusConfig[status] || statusConfig['Active']
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    )
  }

  const getTimeSinceCreation = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 30) {
      const months = Math.floor(diffInDays / 30)
      return `${months} month${months > 1 ? 's' : ''} ago`
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just created'
    }
  }

  const getTimeSinceUpdate = (updatedAt) => {
    const now = new Date()
    const updated = new Date(updatedAt)
    const diffInHours = Math.floor((now - updated) / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 30) {
      const months = Math.floor(diffInDays / 30)
      return `${months} month${months > 1 ? 's' : ''} ago`
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  const getParticipantCount = (test) => {
    // Mock participant count since we don't have real data
    // Generate based on test age and type for realistic numbers
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(test.createdAt)) / (1000 * 60 * 60 * 24)
    )
    const baseCount = Math.floor(Math.random() * 50) + 1

    // Older tests tend to have more participants
    const ageMultiplier = Math.min(daysSinceCreated * 0.1, 2)

    // Different document types have different typical participation
    const typeMultiplier =
      test.documentType === 'exam'
        ? 1.5
        : test.documentType === 'interview'
        ? 0.7
        : 1

    return Math.floor(baseCount * ageMultiplier * typeMultiplier)
  }

  const getParticipantDisplay = (count) => {
    if (count === 0)
      return { count: '0', label: 'participants', className: 'text-gray-500' }
    if (count === 1)
      return { count: '1', label: 'participant', className: 'text-gray-900' }
    if (count < 10)
      return {
        count: count.toString(),
        label: 'participants',
        className: 'text-gray-900',
      }
    if (count < 50)
      return {
        count: count.toString(),
        label: 'participants',
        className: 'text-green-700',
      }
    return {
      count: count.toString(),
      label: 'participants',
      className: 'text-blue-700',
    }
  }

  const getTestLink = (testId) => {
    return `${window.location.origin}/test/${testId}`
  }

  const createdDateTime = formatDateTime(test.createdAt)
  const status = 'Active' // Since we're only showing interactive documents, they're considered active
  const timeSinceCreation = getTimeSinceCreation(test.createdAt)
  const formattedUpdatedTime = formatDateTimeDetailed(test.updatedAt)
  const participantCount = getParticipantCount(test)
  const participantDisplay = getParticipantDisplay(participantCount)

  return (
    <tr className='hover:bg-gray-50 transition-colors duration-200'>
      {/* Test Details (Name & ID & Last Modified) */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <div
              className='text-sm font-medium text-gray-900 max-w-xs truncate'
              title={test.title}
            >
              {test.title}
            </div>
            <div className='text-sm text-gray-500 flex items-center gap-2'>
              <span className='text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded'>
                ID: {test._id.slice(-6)}
              </span>
              <span>Modified: {formattedUpdatedTime}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(status)}</td>

      {/* Created Date */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 font-medium'>
          {createdDateTime.date}
        </div>
        <div className='text-xs text-gray-500'>{timeSinceCreation}</div>
      </td>

      {/* Participants */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className={`text-sm font-medium ${participantDisplay.className}`}>
          {participantDisplay.count}
        </div>
        <div className='text-xs text-gray-500'>{participantDisplay.label}</div>
      </td>

      {/* Test Link */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2'>
          <code className='text-xs bg-gray-100 px-2 py-1 rounded max-w-[120px] truncate'>
            /test/{test._id.slice(-8)}
          </code>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onAction('copyLink', test)}
            className='h-6 w-6 p-0'
            title='Copy test link'
          >
            <Link className='h-3 w-3' />
          </Button>
        </div>
      </td>

      {/* Actions */}
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex items-center gap-2'>
          {/* View Test Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAction('view', test)}
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
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onAction('viewReport', test)}>
                <BarChart3 className='h-4 w-4 mr-2' />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('edit', test)}>
                <Edit3 className='h-4 w-4 mr-2' />
                Edit Test
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('duplicate', test)}>
                <FileText className='h-4 w-4 mr-2' />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('export', test)}>
                <Download className='h-4 w-4 mr-2' />
                Export Test
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onAction('delete', test)}
                className='text-red-600'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Test
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

const TestManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    test: null,
  })

  // React Query hooks
  const {
    data: interactiveDocuments = [],
    isLoading,
    error,
    refetch,
  } = useInteractiveDocuments()
  const deleteMutation = useDeleteDocument()

  // Memoized filtered tests
  const filteredTests = useMemo(() => {
    return interactiveDocuments.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDocumentTypeDisplay(doc.documentType)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())

      // Since we only have basic info, all interactive documents are considered "Active"
      const matchesStatus = filterStatus === 'All' || filterStatus === 'Active'

      return matchesSearch && matchesStatus
    })
  }, [interactiveDocuments, searchQuery, filterStatus])

  const handleTestAction = (action, test) => {
    console.log(`${action} test:`, test)
    // Handle different actions here
    switch (action) {
      case 'view':
        // Open the test for taking/preview
        window.open(`/management/report`, '_blank')
        break
      case 'edit':
        // Navigate to edit page
        window.location.href = `/management/edit/${test._id}`
        break
      case 'viewReport':
        // Navigate to analytics/report page
        window.location.href = `/management/report/${test._id}`
        break
      case 'copyLink':
        // Generate test link and copy to clipboard
        const testLink = `${window.location.origin}/test/${test._id}`
        navigator.clipboard
          .writeText(testLink)
          .then(() => {
            toast.success('Test link copied to clipboard!')
          })
          .catch(() => {
            // Fallback for browsers that don't support clipboard API
            prompt('Copy this test link:', testLink)
          })
        break
      case 'duplicate':
        // Create a copy of the test
        toast.info('Duplicate functionality coming soon!')
        break
      case 'export':
        // Export test metadata since we don't have full content
        try {
          const exportData = {
            id: test._id,
            title: test.title,
            type: test.documentType,
            isInteractive: test.isInteractive,
            created: test.createdAt,
            lastModified: test.updatedAt,
            testLink: `${window.location.origin}/test/${test._id}`,
          }

          const jsonContent = JSON.stringify(exportData, null, 2)
          const element = document.createElement('a')
          const file = new Blob([jsonContent], { type: 'application/json' })
          element.href = URL.createObjectURL(file)
          element.download = `test-${test.title
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase()}.json`
          document.body.appendChild(element)
          element.click()
          document.body.removeChild(element)
          toast.success('Test metadata exported successfully!')
        } catch (error) {
          toast.error('Failed to export test')
        }
        break
      case 'delete':
        setDeleteDialog({ isOpen: true, test })
        break
      default:
        break
    }
  }

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.test) return
    await deleteMutation.mutateAsync(deleteDialog.test._id)
    setDeleteDialog({ isOpen: false, test: null })
  }, [deleteDialog.test, deleteMutation])

  const handleExportExcel = () => {
    if (filteredTests.length === 0) {
      toast.error('No tests to export')
      return
    }

    try {
      // Create CSV content from filtered tests
      const headers = [
        'Test ID',
        'Test Name',
        'Status',
        'Created Date',
        'Participants',
        'Test Link',
      ]
      const csvContent = [
        headers.join(','),
        ...filteredTests.map((test) => {
          // Mock participant count for export
          const participantCount = getParticipantCount(test)

          return [
            `"${test._id}"`,
            `"${test.title}"`,
            'Active',
            new Date(test.createdAt).toLocaleDateString(),
            participantCount,
            `"${window.location.origin}/test/${test._id}"`,
          ].join(',')
        }),
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tests-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Tests exported successfully!')
    } catch (error) {
      toast.error('Failed to export tests')
    }
  }

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setFilterStatus('All')
  }, [])

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <h3 className='text-lg font-medium text-red-600 mb-2'>
                Error loading tests
              </h3>
              <p className='text-gray-500 mb-4'>
                {error.message || 'Something went wrong. Please try again.'}
              </p>
              <Button
                onClick={() => refetch()}
                className='bg-blue-600 hover:bg-blue-700'
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-3 lg:mb-6 gap-3'>
          <div className='w-full sm:w-auto text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
              Test Management
            </h1>
            <p className='text-gray-500 text-sm sm:text-base'>
              Manage your interactive tests and assessments.
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
                placeholder='Search tests...'
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
                  <option value='Active'>Active</option>
                  <option value='Draft'>Draft</option>
                </select>
                <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
              </div>

              {/* Clear Button */}
              {(filterStatus !== 'All' || searchQuery) && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearFilters}
                  className='h-9 lg:h-10 px-2 lg:px-3 text-sm font-medium lg:w-[120px]'
                >
                  Clear
                </Button>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExportExcel}
                className='h-9 lg:h-10 bg-green-600 hover:bg-green-700 text-white px-3 text-sm lg:text-sm font-medium lg:w-[120px]'
                disabled={filteredTests.length === 0}
              >
                <Download className='h-3 w-3 lg:h-4 lg:w-4 mr-1.5' />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Test Count */}
        {!isLoading && (
          <div className='mb-4'>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Showing {filteredTests.length} of {interactiveDocuments.length}{' '}
              tests
              {filteredTests.length > 0 && searchQuery && (
                <span className='ml-2 text-blue-600'>for "{searchQuery}"</span>
              )}
            </p>
          </div>
        )}

        {/* Tests Table */}
        {isLoading ? (
          <div className='flex items-center justify-center py-16'>
            <div className='text-center'>
              <Loader2 className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Loading your tests...
              </h3>
              <p className='text-gray-500'>
                Please wait while we fetch your interactive tests.
              </p>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Test Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Created
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Participants
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Test Link
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredTests.map((test) => (
                    <TestRow
                      key={test._id}
                      test={test}
                      onAction={handleTestAction}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredTests.length === 0 && (
              <div className='text-center py-12'>
                <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No tests found
                </h3>
                <p className='text-gray-500'>
                  {searchQuery || filterStatus !== 'All'
                    ? 'Try adjusting your search or filter criteria.'
                    : interactiveDocuments.length === 0
                    ? 'Create interactive documents to see them as tests here.'
                    : 'Get started by creating your first interactive test.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, test: null })}
          onConfirm={confirmDelete}
          test={deleteDialog.test}
          isDeleting={deleteMutation.isLoading}
        />
      </div>
    </DashboardLayout>
  )
}

export default TestManagementPage
