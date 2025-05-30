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
      Active: { variant: 'default', text: 'Active' },
      Draft: { variant: 'secondary', text: 'Draft' },
      Archived: { variant: 'outline', text: 'Archived' },
    }
    const config = statusConfig[status] || statusConfig['Draft']
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  return (
    <tr className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
      {/* Test Details (Name & Type) */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div>
            <div className='font-medium text-gray-900 dark:text-white'>
              {test.name}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {test.type}
            </div>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4 hidden sm:table-cell'>
        {getStatusBadge(test.status)}
      </td>

      {/* Subject */}
      <td className='px-6 py-4 text-sm text-gray-900 dark:text-white hidden md:table-cell'>
        {test.subject}
      </td>

      {/* Created By */}
      <td className='px-6 py-4 text-sm text-gray-900 dark:text-white hidden lg:table-cell'>
        <div className='flex items-center gap-1'>
          <Users className='h-4 w-4 text-gray-400' />
          {test.createdBy}
        </div>
      </td>

      {/* Participants */}
      <td className='px-6 py-4 text-sm text-gray-900 dark:text-white hidden lg:table-cell'>
        <div className='flex items-center gap-1'>
          <span className='text-gray-400'>#</span>
          {test.participants}
        </div>
      </td>

      {/* Created Date */}
      <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell'>
        {test.createdDate}
      </td>

      {/* Actions - View Report Button + Dropdown Menu */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          {/* View Report Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAction('viewReport', test)}
            className='h-8 px-4 text-xs font-medium bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-600 hover:from-blue-700 hover:to-blue-900 hover:text-white transition-all duration-200'
          >
            View Report
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
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
                className='text-red-600 dark:text-red-400'
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

  // Mock test data
  const [tests] = useState([
    {
      id: 1,
      name: 'Algebra Final Exam',
      type: 'Multiple Choice',
      subject: 'Mathematics',
      questions: 25,
      createdDate: '2024-01-15',
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
      createdDate: '2024-01-12',
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
      createdDate: '2024-01-10',
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
      createdDate: '2024-01-08',
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
      createdDate: '2024-01-05',
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
        alert(`Viewing report for test: ${test.name}`)
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
          test.createdDate,
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
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className='max-w-7xl mx-auto'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-3'>
          <div className='w-full sm:w-auto text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
              Test Management
            </h1>
            <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base'>
              Create, manage, and track all your tests in one place.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='mb-6 animate-fadeIn'>
          <div className='flex flex-col lg:flex-row gap-4 lg:items-center'>
            {/* Search */}
            <div className='flex-1 relative group'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors' />
              <Input
                type='text'
                placeholder='Search tests by name or subject...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-12 pr-4 h-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              />
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-3 items-center'>
              {/* Status Filter */}
              <div className='relative'>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='appearance-none pl-3 pr-8 py-2 h-10 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-black bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 text-sm min-w-[110px]'
                >
                  <option value='All'>All Status</option>
                  <option value='Active'>Active</option>
                  <option value='Draft'>Draft</option>
                  <option value='Archived'>Archived</option>
                </select>
                <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
              </div>

              {/* Subject Filter */}
              <div className='relative'>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className='appearance-none pl-3 pr-8 py-2 h-10 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-black bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 text-sm min-w-[110px]'
                >
                  <option value='All'>All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
              </div>

              {/* Type Filter */}
              <div className='relative'>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className='appearance-none pl-3 pr-8 py-2 h-10 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-black bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 text-sm min-w-[110px]'
                >
                  <option value='All'>All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
              </div>

              {/* Clear Filters */}
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
                  className='h-10 px-3 text-sm'
                >
                  Clear
                </Button>
              )}

              {/* Export Excel */}
              <Button
                onClick={handleExportExcel}
                className='h-10 bg-green-600 hover:bg-green-700 text-white'
              >
                <Download className='h-4 w-4 mr-2' />
                Export Excel
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
        <div
          className='bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 animate-fadeIn overflow-hidden'
          style={{ animationDelay: '100ms' }}
        >
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Test Details
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell'>
                    Subject
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell'>
                    Created By
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell'>
                    Participants
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell'>
                    Created
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
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
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                No tests found
              </h3>
              <p className='text-gray-500 dark:text-gray-400 mb-4'>
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
