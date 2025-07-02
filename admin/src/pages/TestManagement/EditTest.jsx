import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Link as LinkIcon,
  Loader2,
  Mail,
  Palette,
  Percent,
  Save,
  Settings,
  Shield,
  Upload,
  Users,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { axiosInstance } from '../../../config' // Adjust path as needed
import DashboardLayout from '../Layout/DashboardLayout'

// API Functions
const documentAPI = {
  getDocument: async (id) => {
    const response = await axiosInstance.get(`/documents/${id}`)
    return response.data.document
  },

  updateDocument: async ({ id, data }) => {
    const response = await axiosInstance.put(`/documents/${id}`, data)
    return response.data.document
  },

  generateInteractiveLink: async (id) => {
    const response = await axiosInstance.post(
      `/documents/${id}/interactive-link`
    )
    return response.data
  },
}

// Reusable Toggle Component
const Toggle = ({ enabled, onChange, label, disabled = false }) => (
  <div className='flex items-center justify-between'>
    <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
      {label}
    </span>
    <motion.button
      type='button'
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        disabled
          ? 'bg-gray-200 cursor-not-allowed'
          : enabled
          ? 'bg-gray-800'
          : 'bg-gray-300'
      }`}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.span
        className='inline-block h-3 w-3 transform rounded-full bg-white shadow-sm'
        animate={{ x: enabled ? 20 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  </div>
)

// Reusable Input Component
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  suffix,
  min,
  max,
  disabled = false,
  className = '',
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className='block text-xs font-medium text-gray-600'>{label}</label>
    <div className='relative'>
      <input
        type={type}
        value={value || ''}
        onChange={(e) =>
          onChange(
            type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
          )
        }
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
          disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'
        } ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && (
        <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500'>
          {suffix}
        </span>
      )}
    </div>
  </div>
)

// Reusable Select Component
const Select = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}) => (
  <div className={`space-y-1 ${className}`}>
    <label className='block text-xs font-medium text-gray-600'>{label}</label>
    <div className='relative'>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500 appearance-none transition-colors ${
          disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
    </div>
  </div>
)

// Card Component
const Card = ({ title, icon: Icon, children, className = '' }) => (
  <div
    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
  >
    <div className='flex items-center space-x-2 mb-4'>
      <Icon className='h-4 w-4 text-gray-600' />
      <h3 className='text-sm font-semibold text-gray-900'>{title}</h3>
    </div>
    {children}
  </div>
)

// Image Upload Component
const ImageUpload = ({ onUpload, currentImage, disabled = false }) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => onUpload(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`space-y-1 ${disabled ? 'opacity-50' : ''}`}>
      <label className='block text-xs font-medium text-gray-600'>
        School Logo
      </label>
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        className='border border-dashed border-gray-300 rounded-md p-3 text-center cursor-pointer hover:border-gray-400 transition-colors'
      >
        {currentImage ? (
          <div className='space-y-1'>
            <img
              src={currentImage}
              alt='Logo'
              className='h-8 w-8 object-contain mx-auto'
            />
            <p className='text-xs text-gray-600'>Click to change</p>
          </div>
        ) : (
          <div className='space-y-1'>
            <Upload className='h-6 w-6 text-gray-400 mx-auto' />
            <p className='text-xs text-gray-600'>Upload logo</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className='hidden'
        disabled={disabled}
      />
    </div>
  )
}

// Default settings matching updated backend model
const DEFAULT_SETTINGS = {
  // Basic Test Settings
  timeLimit: 30,
  showResults: true,
  allowRetry: true,
  isPublic: false,
  allowSaving: true,
  randomizeQuestions: false,
  questionTimeLimit: false,

  // Grading & Scoring
  passingScore: 70,
  gradingScheme: 'standard',
  enablePartialCredit: false,
  certificate: false,

  // Appearance & Branding
  customTheme: 'default',
  showProgressBar: true,
  questionLayout: 'standard',
  showBranding: false,

  // Security & Privacy
  requireLogin: true,
  preventTabSwitching: false,
  disableCopyPaste: false,
  ipRestriction: false,

  // Results & Feedback
  showCorrectAnswers: true,
  showFeedback: true,
  feedbackType: 'detailed',

  // Email Notifications
  sendResultsEmail: false,
  emailTemplate: 'default',
  notifyInstructor: false,
}

// Default metadata
const DEFAULT_METADATA = {
  orgName: '',
  date: '',
  time: '',
  additionalInfo: '',
  logo: '',
}

const OPTIONS = {
  duration: [
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
    { value: 90, label: '90 min' },
    { value: 120, label: '2 hours' },
    { value: 0, label: 'No limit' },
  ],
  theme: [
    { value: 'default', label: 'Default' },
    { value: 'orion', label: 'Orion' },
    { value: 'kids', label: 'Kid-Friendly' },
    { value: 'minimal', label: 'Minimal' },
  ],
  questionLayout: [
    { value: 'standard', label: 'One per page' },
    { value: 'all', label: 'All on page' },
    { value: 'sections', label: 'By sections' },
  ],
  gradingScheme: [
    { value: 'standard', label: 'A-F Grades' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'passfail', label: 'Pass/Fail' },
    { value: 'points', label: 'Points' },
  ],
  emailTemplate: [
    { value: 'default', label: 'Default' },
    { value: 'friendly', label: 'Kid-Friendly' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'certificate', label: 'With Certificate' },
  ],
  feedbackType: [
    { value: 'detailed', label: 'Detailed' },
    { value: 'basic', label: 'Basic' },
    { value: 'endOnly', label: 'End Only' },
  ],
}

const EditTest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [metadata, setMetadata] = useState(DEFAULT_METADATA)
  const [interactiveLink, setInteractiveLink] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)

  // Fetch document data
  const {
    data: document,
    isLoading: documentLoading,
    error: documentError,
    isError,
  } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentAPI.getDocument(id),
    enabled: !!id,
    onSuccess: (data) => {
      // Update settings with document data
      if (data.interactiveSettings) {
        setSettings((prev) => ({
          ...prev,
          ...data.interactiveSettings,
        }))
      }

      // Update metadata
      if (data.metadata) {
        setMetadata((prev) => ({
          ...prev,
          ...data.metadata,
        }))
      }

      // Set interactive link if exists
      if (data.shareLink) {
        setInteractiveLink(
          `${window.location.origin}/interactive-test/${data.shareLink}`
        )
      }
    },
  })

  // Update document mutation
  const updateMutation = useMutation({
    mutationFn: documentAPI.updateDocument,
    onSuccess: () => {
      setSaveStatus('success')
      queryClient.invalidateQueries(['document', id])
      setTimeout(() => setSaveStatus(null), 3000)
    },
    onError: (error) => {
      setSaveStatus('error')
      console.error('Error updating document:', error)
      setTimeout(() => setSaveStatus(null), 3000)
    },
  })

  // Generate interactive link mutation
  const generateLinkMutation = useMutation({
    mutationFn: documentAPI.generateInteractiveLink,
    onSuccess: (data) => {
      setInteractiveLink(data.shareLink)
      queryClient.invalidateQueries(['document', id])
    },
    onError: (error) => {
      console.error('Error generating link:', error)
    },
  })

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const updateMetadata = (key, value) => {
    setMetadata((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    const updateData = {
      isInteractive: true,
      interactiveSettings: settings,
      metadata: metadata,
    }

    updateMutation.mutate({ id, data: updateData })
  }

  const handleGenerateLink = () => {
    generateLinkMutation.mutate(id)
  }

  // Show loading state
  if (documentLoading) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='flex items-center space-x-2'>
            <Loader2 className='w-6 h-6 animate-spin text-gray-600' />
            <span className='text-gray-600'>Loading test settings...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state
  if (isError) {
    return (
      <DashboardLayout>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Error Loading Test
            </h3>
            <p className='text-gray-600 mb-4'>
              {documentError?.response?.data?.message ||
                'Failed to load test settings'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className='px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors'
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
        >
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Edit Test Settings
            </h1>
            <p className='text-sm text-gray-600 mt-1'>
              {document?.title || 'Configure test parameters and options'}
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Generate Link Button */}
            <motion.button
              onClick={handleGenerateLink}
              disabled={generateLinkMutation.isLoading}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                interactiveLink
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {generateLinkMutation.isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Generating...
                </>
              ) : interactiveLink ? (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Link Generated
                </>
              ) : (
                <>
                  <LinkIcon className='w-4 h-4 mr-2' />
                  Generate Link
                </>
              )}
            </motion.button>

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              disabled={updateMutation.isLoading}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                updateMutation.isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
              }`}
              whileHover={{ scale: updateMutation.isLoading ? 1 : 1.02 }}
              whileTap={{ scale: updateMutation.isLoading ? 1 : 0.98 }}
            >
              {updateMutation.isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className='w-4 h-4 mr-2' />
                  Error
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Save Settings
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Interactive Link Display */}
        {interactiveLink && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-green-50 border border-green-200 rounded-lg p-4'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-sm font-medium text-green-800'>
                  Interactive Test Link Generated
                </h4>
                <p className='text-xs text-green-600 mt-1'>
                  Share this link with students to take the test
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(interactiveLink)}
                className='px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors'
              >
                Copy Link
              </button>
            </div>
            <div className='mt-2 p-2 bg-white border border-green-200 rounded text-xs text-gray-600 font-mono break-all'>
              {interactiveLink}
            </div>
          </motion.div>
        )}

        {/* Comprehensive Grid Layout - All Previous Options */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Basic Info */}
          <Card
            title='Basic Information'
            icon={FileText}
            className='lg:col-span-3'
          >
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <Input
                label='Test Name'
                value={document?.title || ''}
                onChange={() => {}}
                placeholder='Enter test name'
                disabled
              />
              <Input
                label='Subject'
                value={metadata.additionalInfo || 'Mathematics'}
                onChange={(value) => updateMetadata('additionalInfo', value)}
                placeholder='Subject'
              />
              <Input
                label='Grade Level'
                value={metadata.orgName || 'The Orion School'}
                onChange={(value) => updateMetadata('orgName', value)}
                placeholder='Grade'
              />
              <Input
                label='Duration'
                type='number'
                value={settings.timeLimit}
                onChange={(value) => updateSetting('timeLimit', value)}
                suffix='min'
                min={1}
                max={300}
              />
            </div>
          </Card>

          {/* Timing & Access */}
          <Card title='Timing & Access' icon={Clock}>
            <div className='space-y-3'>
              <Select
                label='Test Duration'
                value={settings.timeLimit}
                onChange={(value) =>
                  updateSetting('timeLimit', parseInt(value))
                }
                options={OPTIONS.duration}
              />
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.questionTimeLimit}
                  onChange={(value) =>
                    updateSetting('questionTimeLimit', value)
                  }
                  label='Per-question timer'
                />
                <Toggle
                  enabled={settings.isPublic}
                  onChange={(value) => updateSetting('isPublic', value)}
                  label='Public access'
                />
                <Toggle
                  enabled={settings.allowRetry}
                  onChange={(value) => updateSetting('allowRetry', value)}
                  label='Multiple attempts'
                />
                <Toggle
                  enabled={settings.allowSaving}
                  onChange={(value) => updateSetting('allowSaving', value)}
                  label='Save progress'
                />
              </div>
            </div>
          </Card>

          {/* Grading */}
          <Card title='Grading & Scoring' icon={Percent}>
            <div className='space-y-3'>
              <Input
                label='Passing Score'
                type='number'
                value={settings.passingScore}
                onChange={(value) => updateSetting('passingScore', value)}
                min={0}
                max={100}
                suffix='%'
              />
              <Select
                label='Grading Scheme'
                value={settings.gradingScheme}
                onChange={(value) => updateSetting('gradingScheme', value)}
                options={OPTIONS.gradingScheme}
              />
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.enablePartialCredit}
                  onChange={(value) =>
                    updateSetting('enablePartialCredit', value)
                  }
                  label='Partial credit'
                />
                <Toggle
                  enabled={settings.certificate}
                  onChange={(value) => updateSetting('certificate', value)}
                  label='Generate certificates'
                />
                <Toggle
                  enabled={settings.randomizeQuestions}
                  onChange={(value) =>
                    updateSetting('randomizeQuestions', value)
                  }
                  label='Randomize questions'
                />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card title='Appearance' icon={Palette}>
            <div className='space-y-3'>
              <Select
                label='Theme'
                value={settings.customTheme}
                onChange={(value) => updateSetting('customTheme', value)}
                options={OPTIONS.theme}
              />
              <Select
                label='Question Layout'
                value={settings.questionLayout}
                onChange={(value) => updateSetting('questionLayout', value)}
                options={OPTIONS.questionLayout}
              />
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.showProgressBar}
                  onChange={(value) => updateSetting('showProgressBar', value)}
                  label='Progress bar'
                />
                <Toggle
                  enabled={settings.showBranding}
                  onChange={(value) => updateSetting('showBranding', value)}
                  label='Custom branding'
                />
              </div>
              <ImageUpload
                onUpload={(imageData) => updateMetadata('logo', imageData)}
                currentImage={metadata.logo}
                disabled={!settings.showBranding}
              />
            </div>
          </Card>

          {/* Security */}
          <Card title='Security & Privacy' icon={Shield}>
            <div className='space-y-3'>
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.requireLogin}
                  onChange={(value) => updateSetting('requireLogin', value)}
                  label='Require login'
                />
                <Toggle
                  enabled={settings.ipRestriction}
                  onChange={(value) => updateSetting('ipRestriction', value)}
                  label='IP restrictions'
                />
                <Toggle
                  enabled={settings.preventTabSwitching}
                  onChange={(value) =>
                    updateSetting('preventTabSwitching', value)
                  }
                  label='Prevent tab switching'
                />
                <Toggle
                  enabled={settings.disableCopyPaste}
                  onChange={(value) => updateSetting('disableCopyPaste', value)}
                  label='Disable copy/paste'
                />
              </div>
            </div>
          </Card>

          {/* Results & Feedback */}
          <Card title='Results & Feedback' icon={Eye}>
            <div className='space-y-3'>
              <Select
                label='Feedback Type'
                value={settings.feedbackType}
                onChange={(value) => updateSetting('feedbackType', value)}
                options={OPTIONS.feedbackType}
                disabled={!settings.showFeedback}
              />
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.showResults}
                  onChange={(value) => updateSetting('showResults', value)}
                  label='Show results immediately'
                />
                <Toggle
                  enabled={settings.showCorrectAnswers}
                  onChange={(value) =>
                    updateSetting('showCorrectAnswers', value)
                  }
                  label='Show correct answers'
                />
                <Toggle
                  enabled={settings.showFeedback}
                  onChange={(value) => updateSetting('showFeedback', value)}
                  label='Show feedback'
                />
              </div>
            </div>
          </Card>

          {/* Email Notifications */}
          <Card title='Email Notifications' icon={Mail}>
            <div className='space-y-3'>
              <Select
                label='Email Template'
                value={settings.emailTemplate}
                onChange={(value) => updateSetting('emailTemplate', value)}
                options={OPTIONS.emailTemplate}
                disabled={!settings.sendResultsEmail}
              />
              <div className='space-y-2'>
                <Toggle
                  enabled={settings.sendResultsEmail}
                  onChange={(value) => updateSetting('sendResultsEmail', value)}
                  label='Email results to students'
                />
                <Toggle
                  enabled={settings.notifyInstructor}
                  onChange={(value) => updateSetting('notifyInstructor', value)}
                  label='Notify instructors'
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditTest
