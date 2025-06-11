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
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  Search,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'

// Participant Row Component
const ParticipantRow = ({ participant, onAction }) => {
  const getGradeColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-800'
    if (score >= 70) return 'text-blue-400'
    if (score >= 60) return 'text-fuchsia-600'
    if (score >= 50) return 'text-gray-900'
    return 'text-red-600'
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return null
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

  const submissionDateTime = formatDateTime(participant.submissionDate)

  return (
    <tr className='hover:bg-gray-50 transition-colors duration-200'>
      {/* Participant Info */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div>
            <div className='text-sm font-medium text-gray-900 max-w-xs truncate'>
              {participant.name}
            </div>
            <div className='text-sm text-gray-500'>{participant.email}</div>
          </div>
        </div>
      </td>
      {/* Score */}
      <td className='px-6 py-4 whitespace-nowrap'>
        {participant.score !== null && participant.score !== undefined ? (
          <div
            className={`text-sm font-semibold ${getGradeColor(
              participant.score
            )}`}
          >
            {participant.score}%
          </div>
        ) : (
          <div className='text-sm text-gray-400'>-</div>
        )}
      </td>
      {/* Contact Info */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>{participant.phone}</div>
        {participant.organization && (
          <div className='text-sm text-gray-500'>
            {participant.organization}
          </div>
        )}
      </td>
      {/* Time Taken */}
      <td className='px-6 py-4 whitespace-nowrap'>
        <span className='text-sm text-gray-900'>
          {participant.timeTaken || '-'}
        </span>
      </td>
      {/* Submission Date */}
      <td className='px-6 py-4 whitespace-nowrap'>
        {submissionDateTime ? (
          <div>
            <div className='text-sm text-gray-900 font-medium'>
              {submissionDateTime.date}
            </div>
            <div className='text-sm text-gray-500'>
              {submissionDateTime.time}
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-400'>-</div>
        )}
      </td>
      {/* Actions */}
      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
        <div className='flex items-center gap-2'>
          {/* View Details Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onAction('view', participant)}
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
              <DropdownMenuItem
                onClick={() => onAction('contact', participant)}
              >
                <Mail className='h-4 w-4 mr-2' />
                Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('export', participant)}>
                <Download className='h-4 w-4 mr-2' />
                Export Results
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}

// Statistics Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green:
      'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow:
      'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
  return (
    <div className='bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-200'>
      <div className='flex items-center justify-between mb-4'>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className='h-6 w-6' />
        </div>
        {trend && (
          <div className='flex items-center gap-1 text-green-600 dark:text-green-400 text-sm'>
            <TrendingUp className='h-4 w-4' />
            {trend}
          </div>
        )}
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
          {title}
        </p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {value}
        </p>
        {subtitle && (
          <p className='text-xs text-gray-500 dark:text-gray-400'>{subtitle}</p>
        )}
      </div>
    </div>
  )
}

const TestReportPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterScore, setFilterScore] = useState('All')

  // Mock test data (this would come from props or API in real app)
  const testData = {
    id: 1,
    name: 'Algebra Final Exam',
    type: 'Multiple Choice',
    subject: 'Mathematics',
    createdBy: 'Dr. Sarah',
    createdDate: 'May 22, 2025',
    status: 'Active',
    totalQuestions: 25,
    duration: '90 minutes',
    passingScore: 60,
  }

  // Mock participants data with varied scores to show all color ranges
  const [participants] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      organization: 'Springfield High School',
      score: 87,
      timeTaken: '78 minutes',
      submissionDate: '2024-01-16T10:30:00',
    },
    {
      id: 2,
      name: 'Emily Johnson',
      email: 'emily.j@email.com',
      phone: '+1 (555) 234-5678',
      organization: 'Springfield High School',
      score: 92,
      timeTaken: '65 minutes',
      submissionDate: '2024-01-16T11:15:00',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
      organization: 'Oakland Academy',
      score: 45,
      timeTaken: '88 minutes',
      submissionDate: '2024-01-16T09:45:00',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 456-7890',
      organization: 'Springfield High School',
      score: null,
      timeTaken: null,
      submissionDate: null,
    },
    {
      id: 5,
      name: 'David Rodriguez',
      email: 'david.r@email.com',
      phone: '+1 (555) 567-8901',
      organization: 'Lincoln Institute',
      score: 78,
      timeTaken: '82 minutes',
      submissionDate: '2024-01-16T14:20:00',
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 678-9012',
      organization: 'Oakland Academy',
      score: 65,
      timeTaken: '75 minutes',
      submissionDate: '2024-01-16T15:30:00',
    },
    {
      id: 7,
      name: 'Robert Brown',
      email: 'robert.b@email.com',
      phone: '+1 (555) 789-0123',
      organization: 'Central Academy',
      score: 55,
      timeTaken: '90 minutes',
      submissionDate: '2024-01-16T16:45:00',
    },
    {
      id: 8,
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '+1 (555) 890-1234',
      organization: 'Westside School',
      score: 74,
      timeTaken: '70 minutes',
      submissionDate: '2024-01-16T17:20:00',
    },
  ])

  const handleParticipantAction = (action, participant) => {
    console.log(`${action} participant:`, participant)
    switch (action) {
      case 'view':
        window.location.href = '/management/report/result'
        break
      case 'contact':
        alert(`Contacting: ${participant.name} at ${participant.email}`)
        break
      case 'export':
        alert(`Exporting results for: ${participant.name}`)
        break
      default:
        break
    }
  }

  const handleExportReport = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Organization',
      'Score',
      'Time',
      'Submission Date',
    ]
    const csvContent = [
      headers.join(','),
      ...filteredParticipants.map((p) =>
        [
          `"${p.name}"`,
          `"${p.email}"`,
          `"${p.phone}"`,
          `"${p.organization || ''}"`,
          p.score || '',
          `"${p.timeTaken || ''}"`,
          `"${p.submissionDate || ''}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${testData.name}-report.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (participant.organization &&
        participant.organization
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))

    const matchesScore = () => {
      if (filterScore === 'All') return true

      const score = participant.score

      if (score === null || score === undefined) {
        return filterScore === 'Incomplete'
      }

      switch (filterScore) {
        case '90-100':
          return score >= 90
        case '80-89':
          return score >= 80 && score < 90
        case '70-79':
          return score >= 70 && score < 80
        case '60-69':
          return score >= 60 && score < 70
        case '50-59':
          return score >= 50 && score < 60
        case '0-49':
          return score < 50
        case 'Incomplete':
          return false
        default:
          return true
      }
    }

    return matchesSearch && matchesScore()
  })

  // Calculate statistics
  const completedParticipants = participants.filter(
    (p) => p.score !== null && p.score !== undefined
  )
  const averageScore =
    completedParticipants.length > 0
      ? Math.round(
          completedParticipants.reduce((sum, p) => sum + p.score, 0) /
            completedParticipants.length
        )
      : 0
  const passedCount = completedParticipants.filter(
    (p) => p.score >= testData.passingScore
  ).length
  const passRate =
    completedParticipants.length > 0
      ? Math.round((passedCount / completedParticipants.length) * 100)
      : 0

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-3 lg:mb-6 gap-3'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
                {testData.name} - Report
              </h1>
              <div className='flex flex-wrap items-center gap-3 text-sm sm:text-base text-gray-500 '>
                <div className='flex items-center gap-1'>
                  <FileText className='h-4 w-4' />
                  {testData.type}
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {testData.createdDate}
                </div>
                <div className='flex items-center gap-1'>
                  <User className='h-4 w-4' />
                  {testData.createdBy}
                </div>
              </div>
            </div>
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
                placeholder='Search participants...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-3 h-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black'
              />
            </div>

            {/* Filters and Actions - Right aligned group */}
            <div className='grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 lg:items-center'>
              {/* Score Filter */}
              <div className='relative'>
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value)}
                  className='appearance-none w-full flex items-center justify-between pl-2 pr-6 h-9 lg:h-10 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none bg-white text-gray-700 transition-colors text-sm lg:w-[140px]'
                >
                  <option value='All'>All Scores</option>
                  <option value='90-100'>90-100</option>
                  <option value='80-89'>80-89</option>
                  <option value='70-79'>70-79</option>
                  <option value='60-69'>60-69</option>
                  <option value='50-59'>50-59</option>
                  <option value='0-49'>0-49</option>
                  <option value='Incomplete'>Incomplete</option>
                </select>
                <ChevronDown className='absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ml-3 text-gray-400 pointer-events-none' />
              </div>

              {/* Clear Button */}
              {(filterScore !== 'All' || searchQuery) && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSearchQuery('')
                    setFilterScore('All')
                  }}
                  className='h-9 lg:h-10 px-2 lg:px-3 text-sm font-medium lg:w-[120px]'
                >
                  Clear
                </Button>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExportReport}
                className='h-9 lg:h-10 bg-green-600 hover:bg-green-700 text-white px-3 text-sm lg:text-sm font-medium lg:w-[120px]'
              >
                <Download className='h-3 w-3 lg:h-4 lg:w-4 mr-1.5' />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Participants Count */}
        <div className='mb-4'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            Showing {filteredParticipants.length} of {participants.length}{' '}
            participants
          </p>
        </div>

        {/* Participants Table */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Participant
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Score
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Contact Info
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Submitted
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredParticipants.map((participant) => (
                  <ParticipantRow
                    key={participant.id}
                    participant={participant}
                    onAction={handleParticipantAction}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredParticipants.length === 0 && (
            <div className='text-center py-12'>
              <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No participants found
              </h3>
              <p className='text-gray-500'>
                {searchQuery || filterScore !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No participants have registered for this test yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TestReportPage
