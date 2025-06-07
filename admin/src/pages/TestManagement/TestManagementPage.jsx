import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  BarChart3,
  ChevronDown,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Link,
  MoreVertical,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'

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
    const config = statusConfig[status] || statusConfig['Draft']
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    )
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

  const createdDateTime = formatDateTime(test.createdAt)

  return (
    <tr className='hover:bg-gray-50 transition-colors duration-200'>
      {/* Test Details (Name & Type) */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div>
            <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
              {test.name}
            </div>
            <div className='text-sm text-gray-500'>{test.type}</div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4 whitespace-nowrap'>
        {getStatusBadge(test.status)}
      </td>

      {/* Subject */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='text-sm text-gray-900'>{test.subject}</span>
      </td>

      {/* Created By */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='text-sm text-gray-900'>{test.createdBy}</span>
      </td>

      {/* Participants */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='text-sm text-gray-900'>{test.participants}</span>
      </td>

      {/* Created Date */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 font-medium'>
          {createdDateTime.date}
        </div>
        <div className='text-sm text-gray-500'>{createdDateTime.time}</div>
      </td>

      {/* Actions */}
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex items-center gap-2'>
          {/* View Report Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAction('viewReport', test)}
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
              <DropdownMenuItem onClick={() => onAction('view', test)}>
                <Eye className='h-4 w-4 mr-2' />
                View Test
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('edit', test)}>
                <Edit3 className='h-4 w-4 mr-2' />
                Edit Test
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('copyLink', test)}>
                <Link className='h-4 w-4 mr-2' />
                Copy Test Link
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
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterType, setFilterType] = useState('All')

  // Mock test data - Updated with datetime strings like My Documents
  const [tests] = useState([
    {
      id: 1,
      name: 'Algebra Final Exam',
      type: 'Multiple Choice',
      subject: 'Mathematics',
      questions: 25,
      createdAt: '2024-01-15T14:30:00',
      createdBy: 'Dr. Sarah Johnson',
      status: 'Active',
      participants: 45,
    },
    {
      id: 2,
      name: 'History Essay Assessment',
      type: 'Essay',
      subject: 'History',
      questions: 5,
      createdAt: '2024-01-12T09:15:00',
      createdBy: 'Prof. Michael Chen',
      status: 'Draft',
      participants: 0,
    },
    {
      id: 3,
      name: 'Science Quiz - Chapter 4',
      type: 'Mixed',
      subject: 'Science',
      questions: 15,
      createdAt: '2024-01-10T16:45:00',
      createdBy: 'Ms. Emily Rodriguez',
      status: 'Active',
      participants: 32,
    },
    {
      id: 4,
      name: 'English Literature Review',
      type: 'Multiple Choice',
      subject: 'English',
      questions: 20,
      createdAt: '2024-01-08T11:20:00',
      createdBy: 'Dr. James Wilson',
      status: 'Archived',
      participants: 28,
    },
    {
      id: 5,
      name: 'Physics Lab Assessment',
      type: 'Mixed',
      subject: 'Physics',
      questions: 12,
      createdAt: '2024-01-05T13:10:00',
      createdBy: 'Prof. Lisa Anderson',
      status: 'Active',
      participants: 22,
    },
  ])

  const handleTestAction = (action, test) => {
    console.log(`${action} test:`, test)
    // Handle different actions here
    switch (action) {
      case 'view':
        alert(`Viewing test: ${test.name}`)
        break
      case 'edit':
        alert(`Editing test: ${test.name}`)
        break
      case 'viewReport':
        window.location.href = '/management/report'
        break
      case 'copyLink':
        // Generate test link and copy to clipboard
        const testLink = `${window.location.origin}/test/${test.id}`
        navigator.clipboard
          .writeText(testLink)
          .then(() => {
            alert(`Test link copied to clipboard: ${testLink}`)
          })
          .catch(() => {
            alert(`Test link: ${testLink}`)
          })
        break
      case 'export':
        alert(`Exporting test: ${test.name}`)
        break
      case 'delete':
        if (confirm(`Are you sure you want to delete "${test.name}"?`)) {
          alert(`Deleted test: ${test.name}`)
        }
        break
      default:
        break
    }
  }

  const handleExportExcel = () => {
    // Create CSV content from filtered tests
    const headers = [
      'Test Name',
      'Type',
      'Subject',
      'Created By',
      'Created Date',
      'Status',
      'Participants',
    ]
    const csvContent = [
      headers.join(','),
      ...filteredTests.map((test) =>
        [
          `"${test.name}"`,
          `"${test.type}"`,
          `"${test.subject}"`,
          `"${test.createdBy}"`,
          test.createdAt,
          test.status,
          test.participants,
        ].join(',')
      ),
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tests-export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || test.status === filterStatus
    const matchesSubject =
      filterSubject === 'All' || test.subject === filterSubject
    const matchesType = filterType === 'All' || test.type === filterType
    return matchesSearch && matchesStatus && matchesSubject && matchesType
  })

  // Get unique values for filter options
  const uniqueSubjects = [...new Set(tests.map((test) => test.subject))].sort()
  const uniqueTypes = [...new Set(tests.map((test) => test.type))].sort()

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
              Create, manage, and track all your tests in one place.
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
                className='w-full pl-10 pr-3 h-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black `'
              />
            </div>

            {/* Filters and Actions - Right aligned group */}
            <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:items-center'>
              {/* Status Filter */}
              <div className='relative'>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[120px]' // Added text-sm here
                >
                  <option value='All' className='text-sm'>
                    Status
                  </option>
                  <option value='Active' className='text-sm'>
                    Active
                  </option>
                  <option value='Draft' className='text-sm'>
                    Draft
                  </option>
                  <option value='Archived' className='text-sm'>
                    Archived
                  </option>
                </select>
                <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
              </div>

              {/* Subject Filter */}
              <div className='relative'>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors lg:w-[120px]' // Added text-sm here
                >
                  <option value='All' className='text-sm'>
                    Subject
                  </option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject} className='text-sm'>
                      {subject}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
              </div>

              {/* Type Filter */}
              <div className='relative'>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[120px]' // Added text-sm here
                >
                  <option value='All' className='text-sm'>
                    Type
                  </option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type} className='text-sm'>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
              </div>

              {/* Clear Button */}
              {(filterStatus !== 'All' ||
                filterSubject !== 'All' ||
                filterType !== 'All' ||
                searchQuery) && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSearchQuery('')
                    setFilterStatus('All')
                    setFilterSubject('All')
                    setFilterType('All')
                  }}
                  className='h-9 lg:h-10 px-2 lg:px-3 text-xs lg:text-sm font-medium lg:w-[120px]' // Keep text-xs for mobile, lg:text-sm for desktop
                >
                  Clear
                </Button>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExportExcel}
                className='h-9 lg:h-10 bg-green-600 hover:bg-green-700 text-white px-3 text-xs lg:text-sm' // Keep text-xs for mobile, lg:text-sm for desktop
              >
                <Download className='h-3 w-3 lg:h-4 lg:w-4 mr-1.5' />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Test Count */}
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            Showing {filteredTests.length} of {tests.length} tests
          </p>
        </div>

        {/* Tests Table */}
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
                    Subject
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created By
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Participants
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Created
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredTests.map((test) => (
                  <TestRow
                    key={test.id}
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
              <FileText className='h-12 w-12 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No tests found
              </h3>
              <p className='text-gray-500 mb-4'>
                {searchQuery ||
                filterStatus !== 'All' ||
                filterSubject !== 'All' ||
                filterType !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first test.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TestManagementPage
