import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardLayout from '../Layout/DashboardLayout'

//Reusable Components
const StatCard = ({
  icon: Icon,
  title,
  value,
  bgColor = 'bg-gray-100',
  iconColor = 'text-gray-600',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className='bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300'
  >
    <div className='flex items-center space-x-3 sm:space-x-4'>
      <div className={`p-2 sm:p-3 ${bgColor} rounded-xl`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
      </div>
      <div>
        <p className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide'>
          {title}
        </p>
        <p className='text-2xl sm:text-3xl font-bold text-gray-900 mt-1'>
          {value}
        </p>
      </div>
    </div>
  </motion.div>
)

const ChartCard = ({ title, children, action, isGraph = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className='bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6'
  >
    <div className='flex items-center justify-between mb-3 sm:mb-6'>
      <h3 className='text-lg sm:text-xl font-semibold text-black'>{title}</h3>
      {action && action}
    </div>
    <div className={isGraph ? 'px-0 sm:px-0 -ml-6' : ''}>{children}</div>
  </motion.div>
)

const ActivityItem = ({ icon: Icon, title, subtitle, time, status }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors'
  >
    <div
      className={`p-1.5 rounded-lg ${
        status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
      }`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${
          status === 'completed' ? 'text-green-600' : 'text-gray-600'
        }`}
      />
    </div>
    <div className='flex-1'>
      <p className='text-sm font-medium text-black'>{title}</p>
      <p className='text-xs text-gray-500'>{subtitle}</p>
    </div>
    <span className='text-xs text-gray-400'>{time}</span>
  </motion.div>
)

// Custom Tooltip Component for Speedometer
const SpeedometerTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    const total = 650 // Total limit
    const textColor = data.name === 'Used' ? 'text-red-600' : 'text-blue-600'
    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
        <p className={`font-medium mb-1 ${textColor}`}>{data.name}</p>
        <p className='text-sm text-gray-600'>
          <span className='font-semibold'>{data.value}</span> of {total}{' '}
          generations
        </p>
        <p className='text-xs text-gray-500'>
          {Math.round((data.value / total) * 100)}% of total
        </p>
      </div>
    )
  }
  return null
}

// Custom Tooltip Component for Creation Trends
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Generate dates for the current week
    const dayMap = {
      Mon: 'Monday, May 26, 2025',
      Tue: 'Tuesday, May 27, 2025',
      Wed: 'Wednesday, May 28, 2025',
      Thu: 'Thursday, May 29, 2025',
      Fri: 'Friday, May 30, 2025',
      Sat: 'Saturday, May 31, 2025',
      Sun: 'Sunday, June 1, 2025',
    }

    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
        <p className='text-gray-700 font-medium mb-2'>
          {dayMap[label] || label}
        </p>
        {payload.map((entry, index) => {
          const color =
            entry.name === 'Documents Generated' ? '#2563EB' : '#9333EA'
          return (
            <p key={index} style={{ color: color }} className='font-medium'>
              {`${entry.name}: ${entry.value}`}
            </p>
          )
        })}
      </div>
    )
  }
  return null
}

// Custom Tooltip Component for Usage Statistics
const UsageTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Map abbreviated months to full names with year
    const monthMap = {
      Jan: 'January 2025',
      Feb: 'February 2025',
      Mar: 'March 2025',
      Apr: 'April 2025',
      May: 'May 2025',
      Jun: 'June 2025',
    }

    return (
      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
        <p className='text-gray-700 font-medium mb-2'>
          {monthMap[label] || label}
        </p>
        <p className='text-blue-600 font-medium'>
          Total Usage: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPerson, setSelectedPerson] = useState('All Users')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // People data with their usage statistics
  const peopleData = {
    'All Users': { used: 1265, limit: 1850 }, // Combined totals
    'Sarah Johnson': { used: 442, limit: 650 },
    'Michael Chen': { used: 378, limit: 500 },
    'Emily Rodriguez': { used: 289, limit: 400 },
    'David Thompson': { used: 156, limit: 300 },
  }

  // Filter people based on search query
  const filteredPeople = Object.keys(peopleData).filter((person) =>
    person.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Navigation links for quick actions
  const navLinks = [
    {
      name: 'Create Documents',
      description: 'Create professional docs with intelligence.',
      href: '/create',
    },
    {
      name: 'Interactive Tests',
      description: 'Create engaging assessments with ease.',
      href: '/tests',
    },
    {
      name: 'Smart Templates',
      description: 'Create docs in seconds with templates.',
      href: '/templates',
    },
    {
      name: 'Examples',
      description: 'Real documents generated by our AI.',
      href: '/examples',
    },
    {
      name: 'Pricing',
      description: 'Affordable plans for all your needs',
      href: '/pricing',
    },
  ]

  // Mock data
  const documentData = [
    { name: 'Mon', documents: 25, tests: 12 },
    { name: 'Tue', documents: 39, tests: 19 },
    { name: 'Wed', documents: 45, tests: 15 },
    { name: 'Thu', documents: 49, tests: 22 },
    { name: 'Fri', documents: 63, tests: 28 },
    { name: 'Sat', documents: 39, tests: 18 },
    { name: 'Sun', documents: 52, tests: 25 },
  ]

  const usageData = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 190 },
    { name: 'Mar', value: 280 },
    { name: 'Apr', value: 220 },
    { name: 'May', value: 350 },
    { name: 'Jun', value: 420 },
  ]

  // Get selected person's data
  const currentPersonData = peopleData[selectedPerson]
  const totalUsed = currentPersonData.used
  const totalLimit = currentPersonData.limit
  const totalRemaining = totalLimit - totalUsed
  const usagePercentage = (totalUsed / totalLimit) * 100

  const speedometerData = [
    { name: 'Used', value: totalUsed, color: '#e7000b' }, // red-600
    { name: 'Remaining', value: totalRemaining, color: '#2563EB' }, // blue-600
  ]

  const recentActivities = [
    {
      icon: FileText,
      title: 'Math Exam Created',
      subtitle: 'Grade 10 Algebra',
      time: '2m ago',
      status: 'completed',
    },
    {
      icon: BookOpen,
      title: 'Study Guide Generated',
      subtitle: 'Physics Chapter 5',
      time: '15m ago',
      status: 'completed',
    },
    {
      icon: Users,
      title: 'Test Shared',
      subtitle: '25 students invited',
      time: '1h ago',
      status: 'completed',
    },
    {
      icon: CheckCircle,
      title: 'Report Exported',
      subtitle: 'Q3 Trade Analysis',
      time: '2h ago',
      status: 'completed',
    },
    {
      icon: Activity,
      title: 'Interactive Test',
      subtitle: 'Biology Quiz - 18 responses',
      time: '3h ago',
      status: 'active',
    },
  ]

  return (
    <DashboardLayout>
      <div className='max-w-7xl mx-auto'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-6 gap-2 sm:gap-3'>
          <div className='w-full sm:w-auto text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
              Dashboard
            </h1>
            <p className='text-gray-500 text-sm sm:text-base'>
              <span className='sm:hidden'>
                Welcome back! Here's your docs creation overview.
              </span>
              <span className='hidden sm:inline'>
                Welcome back! Here's your document creation overview.
              </span>
            </p>
          </div>

          {/* Person Selection Dropdown - Updated to match card width */}
          <div className='relative w-full lg:w-70' ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full'
            >
              <span>{selectedPerson}</span>
              <ChevronDown
                className={`w-4 h-4 ml-3 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className='absolute z-20 right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg'>
                {/* Search Input */}
                <div className='p-2 border-b border-gray-100'>
                  <input
                    type='text'
                    placeholder='Search users...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Dropdown Options */}
                <div className='max-h-48 overflow-y-auto'>
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <button
                        key={person}
                        onClick={() => {
                          setSelectedPerson(person)
                          setIsDropdownOpen(false)
                          setSearchQuery('')
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50  last:rounded-b-lg transition-colors ${
                          selectedPerson === person
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {person}
                      </button>
                    ))
                  ) : (
                    <div className='px-4 py-3 text-center text-gray-500 text-sm'>
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Sections */}
        <div className='space-y-4 sm:space-y-6'>
          {/* Stats Grid - Reordered */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6'>
            <StatCard
              icon={FileText}
              title='Documents Created'
              value='1,234'
              bgColor='bg-blue-50'
              iconColor='text-blue-600'
            />
            <StatCard
              icon={CheckCircle}
              title='Tests Completed'
              value='892'
              bgColor='bg-green-50'
              iconColor='text-green-600'
            />
            <StatCard
              icon={Clock}
              title='Avg. Creation Time'
              value='3.2min'
              bgColor='bg-purple-50'
              iconColor='text-purple-600'
            />
            <StatCard
              icon={Users}
              title='Active Students'
              value='2,856'
              bgColor='bg-red-50'
              iconColor='text-red-600'
            />
          </div>

          {/* Charts Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6'>
            {/* Document Creation Trends */}
            <ChartCard
              title='Creation Trends'
              isGraph={true}
              action={
                <div className='flex items-center space-x-4 text-xs'>
                  <div className='flex items-center space-x-1'>
                    <div className='w-3 h-3 rounded bg-blue-600'></div>
                    <span className='text-gray-600'>Documents</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <div className='w-3 h-3 rounded bg-purple-600'></div>
                    <span className='text-gray-600'>Tests</span>
                  </div>
                </div>
              }
            >
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={documentData}>
                  <defs>
                    <linearGradient
                      id='blueGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#2563EB' stopOpacity={1} />
                      <stop offset='100%' stopColor='#1E40AF' stopOpacity={1} />
                    </linearGradient>
                    <linearGradient
                      id='purpleGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#9333EA' stopOpacity={1} />
                      <stop offset='100%' stopColor='#6B21A8' stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='name' stroke='#666' />
                  <YAxis stroke='#666' />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey='documents'
                    fill='url(#blueGradient)'
                    name='Documents Generated'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='tests'
                    fill='url(#purpleGradient)'
                    name='Tests Generated'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Total Generated */}
            <ChartCard
              title='Total Generated'
              action={
                <div className='flex items-center space-x-3 text-xs'>
                  <div className='flex items-center space-x-1'>
                    <div className='w-3 h-3 rounded bg-red-600'></div>
                    <span className='text-gray-600'>Used</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <div className='w-3 h-3 rounded bg-blue-600'></div>
                    <span className='text-gray-600'>Remaining</span>
                  </div>
                </div>
              }
            >
              <div
                className='flex flex-col items-center -mt-2 pt-0 pb-1 sm:-mt-3 sm:pt-1 sm:pb-2'
                style={{ height: '250px' }}
              >
                {/* Speedometer Chart - More compact */}
                <div className='relative mb-1 md:mt-4 w-full max-w-md flex-1 flex items-center justify-center'>
                  <ResponsiveContainer width='100%' height={130}>
                    <PieChart>
                      <defs>
                        <linearGradient
                          id='redGradient'
                          x1='0'
                          y1='0'
                          x2='1'
                          y2='1'
                        >
                          <stop
                            offset='0%'
                            stopColor='#e7000b'
                            stopOpacity={1}
                          />
                          <stop
                            offset='100%'
                            stopColor='#e7000b'
                            stopOpacity={1}
                          />
                        </linearGradient>
                        <linearGradient
                          id='blueGradientSpeedometer'
                          x1='0'
                          y1='0'
                          x2='1'
                          y2='1'
                        >
                          <stop
                            offset='0%'
                            stopColor='#2563EB'
                            stopOpacity={1}
                          />
                          <stop
                            offset='100%'
                            stopColor='#1D4ED8'
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<SpeedometerTooltip />} />
                      <Pie
                        data={speedometerData}
                        cx='50%'
                        cy='85%'
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={1}
                        dataKey='value'
                      >
                        <Cell fill='url(#redGradient)' />
                        <Cell fill='url(#blueGradientSpeedometer)' />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats Grid - Very compact */}
                <div className='w-full max-w-sm px-2'>
                  <div className='text-center p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200'>
                    <div className='flex items-center justify-center space-x-1 sm:space-x-2'>
                      <span className='text-xs sm:text-sm font-semibold text-gray-700'>
                        Total Usage:
                      </span>
                      <span className='text-lg sm:text-xl font-bold text-blue-600'>
                        {Math.round(usagePercentage)}%
                      </span>
                    </div>
                    <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden my-1'>
                      <div
                        className='h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500'
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                    <div className='flex justify-between items-center text-xs text-gray-600'>
                      <span className='font-medium'>{totalUsed} used</span>
                      <span className='font-medium'>
                        {totalRemaining} remaining
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Bottom Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6'>
            {/* Usage Analytics */}
            <ChartCard
              title='Usage Statistics'
              isGraph={true}
              action={
                <div className='flex items-center space-x-1 text-xs'>
                  <div className='w-3 h-3 rounded bg-blue-600'></div>
                  <span className='text-gray-600'>Total Document Usage</span>
                </div>
              }
            >
              <ResponsiveContainer width='100%' height={250}>
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id='colorUsage' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#2563EB' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#1E40AF'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                  <XAxis dataKey='name' stroke='#666' />
                  <YAxis stroke='#666' />
                  <Tooltip content={<UsageTooltip />} />
                  <Area
                    type='monotone'
                    dataKey='value'
                    stroke='#2563EB'
                    strokeWidth={3}
                    fillOpacity={1}
                    fill='url(#colorUsage)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Recent Activity - Made more compact */}
            <ChartCard
              title='Recent Activity'
              action={
                <button className='text-sm text-gray-500 hover:text-black transition-colors flex items-center space-x-1'>
                  <Eye className='w-4 h-4' />
                  <span>View All</span>
                </button>
              }
            >
              <div
                className='space-y-0'
                style={{ height: '250px', overflowY: 'auto' }}
              >
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-gray-200'
          >
            <h3 className='text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4'>
              Quick Actions
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4'>
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='p-3 sm:p-4 text-left border border-gray-200 rounded-lg hover:border-black hover:shadow-sm transition-all block'
                >
                  <p className='font-medium text-black text-sm sm:text-base'>
                    {link.name}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {link.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
