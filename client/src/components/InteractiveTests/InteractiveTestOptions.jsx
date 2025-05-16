import {
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  Globe,
  Image,
  Link,
  Lock,
  Mail,
  Paintbrush,
  Palette,
  Percent,
  Shield,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

// Constants and configuration
const STYLES = {
  input:
    'block w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  sectionHeader: {
    base: 'w-full flex justify-between items-center py-3 px-4 text-left text-sm font-medium transition-colors duration-200',
    expanded: 'bg-gray-200 text-gray-700 border-b border-gray-200',
    collapsed: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
  },
  settingsGroup:
    'p-4 bg-white rounded-lg border border-gray-200 shadow-sm h-auto md:h-[250px] flex flex-col',
  toggleButton: {
    base: 'block w-10 h-5 rounded-full transition-colors duration-200',
    active: 'bg-blue-600',
    inactive: 'bg-gray-300',
  },
  toggleSlider: {
    base: 'absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out',
    active: 'transform translate-x-5',
  },
  button: {
    base: 'px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    success: 'bg-[#ffe772]  text-black hover:bg-yellow-500',
  },
}

// Default settings with sensible defaults
const DEFAULT_SETTINGS = {
  // Basic settings
  timeLimit: 30,
  showResults: true,
  allowRetry: true,
  isPublic: false,
  passingScore: 70,
  gradingScheme: 'standard',
  enablePartialCredit: false,
  showCorrectAnswers: true,

  // Appearance settings
  customTheme: 'default',
  showProgressBar: true,
  questionLayout: 'standard',
  logoUrl: '',
  showBranding: false,

  // Security settings - essential for online tests
  requireLogin: true,
  preventTabSwitching: true,
  disableCopyPaste: false,
  ipRestriction: false,

  // Notifications
  sendResultsEmail: true,
  emailTemplate: 'default',
  notifyInstructor: true,

  // Advanced settings
  randomizeQuestions: true,
  questionTimeLimit: false,
  allowSaving: true,
  showFeedback: true,
  feedbackType: 'detailed',
  accessPeriod: { start: '', end: '' },
  certificate: false,
  printable: true,
}

// Available options for dropdowns
const DROPDOWN_OPTIONS = {
  duration: [
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 0, label: 'No time limit' },
    { value: 'custom', label: 'Custom' },
  ],
  theme: [
    { value: 'default', label: 'Default' },
    { value: 'professional', label: 'Professional' },
    { value: 'academic', label: 'Academic' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'colorful', label: 'Colorful' },
  ],
  questionLayout: [
    { value: 'standard', label: 'One question per page' },
    { value: 'all', label: 'All questions on one page' },
    { value: 'sections', label: 'Questions grouped by sections' },
  ],
  emailTemplate: [
    { value: 'default', label: 'Default Template' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'detailed', label: 'Detailed Results' },
    { value: 'certificate', label: 'With Certificate' },
  ],
  gradingScheme: [
    { value: 'standard', label: 'Standard (A-F)' },
    { value: 'percentage', label: 'Percentage Only' },
    { value: 'passfail', label: 'Pass/Fail Only' },
    { value: 'points', label: 'Points Based' },
  ],
  feedbackType: [
    { value: 'detailed', label: 'Detailed Explanation' },
    { value: 'basic', label: 'Basic Correct/Incorrect' },
    { value: 'endOnly', label: 'Only at End of Test' },
  ],
}

// Reusable components
const ToggleSwitch = ({
  label,
  isChecked,
  onChange,
  activeLabel,
  inactiveLabel,
}) => (
  <div className='flex items-start space-x-3'>
    <label className='inline-flex items-center cursor-pointer flex-shrink-0'>
      <div className='relative'>
        <input
          type='checkbox'
          className='sr-only'
          checked={isChecked}
          onChange={onChange}
        />
        <div
          className={`${STYLES.toggleButton.base} ${
            isChecked
              ? STYLES.toggleButton.active
              : STYLES.toggleButton.inactive
          }`}
        ></div>
        <div
          className={`${STYLES.toggleSlider.base} ${
            isChecked ? STYLES.toggleSlider.active : ''
          }`}
        ></div>
      </div>
    </label>
    <span className='text-xs md:text-sm font-medium text-gray-700'>
      {isChecked ? activeLabel : inactiveLabel}
    </span>
  </div>
)

const SectionHeader = ({ icon: Icon, title, isExpanded, onToggle }) => (
  <button
    className={`${STYLES.sectionHeader.base} ${
      isExpanded
        ? STYLES.sectionHeader.expanded
        : STYLES.sectionHeader.collapsed
    }`}
    onClick={onToggle}
    aria-expanded={isExpanded}
  >
    <div className='flex items-center'>
      <Icon className='h-5 w-5 mr-3 text-gray-700' />
      <span className='text-base font-medium'>{title}</span>
    </div>
    {isExpanded ? (
      <ChevronUp className='h-5 w-5 mr-2 text-blue-600' />
    ) : (
      <ChevronDown className='h-5 w-5 mr-2 text-gray-500' />
    )}
  </button>
)

const SettingsGroup = ({ icon: Icon, title, children, className = '' }) => (
  <div className={`${STYLES.settingsGroup} ${className}`}>
    <div className='flex items-center pb-3 border-b border-gray-100 mb-4'>
      <Icon className='h-4 w-4 text-gray-700 mr-2' />
      <span className='text-sm font-semibold text-gray-800'>{title}</span>
    </div>
    <div className='flex-1 flex flex-col'>{children}</div>
  </div>
)

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  ariaLabel = '',
}) => (
  <div className={className}>
    {label && (
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
    )}
    <div className='relative'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${STYLES.input} appearance-none`}
        aria-label={ariaLabel || label}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none' />
    </div>
  </div>
)

const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  disabled = false,
  className = '',
  ariaLabel = '',
  suffix = '',
}) => (
  <div className={className}>
    {label && (
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
    )}
    <div
      className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const val =
            type === 'number' ? parseInt(e.target.value, 10) : e.target.value
          onChange(val)
        }}
        min={min}
        max={max}
        className={suffix ? `${STYLES.input} pr-16` : STYLES.input}
        aria-label={ariaLabel || label}
        disabled={disabled}
      />
      {suffix && (
        <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
          {suffix}
        </span>
      )}
    </div>
  </div>
)

const ImageUploader = ({ onImageChange, disabled, currentImage }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const processFile = (file) => {
    if (file && onImageChange) {
      const reader = new FileReader()
      reader.onload = (event) => onImageChange(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handlers = {
    click: () => fileInputRef.current.click(),
    fileChange: (e) => processFile(e.target.files[0]),
    dragOver: (e) => {
      e.preventDefault()
      if (!disabled) setIsDragging(true)
    },
    dragLeave: () => setIsDragging(false),
    drop: (e) => {
      e.preventDefault()
      setIsDragging(false)
      if (!disabled) processFile(e.dataTransfer.files[0])
    },
  }

  // Hidden file input (shared between layouts)
  const fileInput = (
    <input
      type='file'
      ref={fileInputRef}
      className='hidden'
      accept='image/*'
      onChange={handlers.fileChange}
      disabled={disabled}
    />
  )

  if (isMobile) {
    return (
      <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <label className='block text-sm font-medium text-gray-700 mb-1.5'>
          Organization Logo
        </label>
        {fileInput}
        <button onClick={handlers.click} type='button' className={STYLES.input}>
          <div className='flex items-center justify-center'>
            <Upload className='h-3 w-3 mr-1' />
            <span className='text-sm'>
              {currentImage ? 'Change logo' : 'Upload logo'}
            </span>
          </div>
        </button>
        {currentImage && (
          <div className='mt-1 flex justify-center'>
            <img
              src={currentImage}
              alt='Logo preview'
              className='max-h-10 max-w-full object-contain'
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        Organization Logo
      </label>
      {fileInput}
      <div
        onDragOver={handlers.dragOver}
        onDragLeave={handlers.dragLeave}
        onDrop={handlers.drop}
        onClick={handlers.click}
        className={`
          flex justify-center px-4 pt-3 pb-3 border-2 
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
          border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition-colors
          ${currentImage ? 'h-20' : 'h-16'}
        `}
      >
        <div className='space-y-1 text-center'>
          {currentImage ? (
            <div className='flex items-center'>
              <img
                src={currentImage}
                alt='Logo preview'
                className='max-h-12 max-w-full object-contain mr-2'
              />
              <div className='flex items-center text-sm text-blue-600'>
                <Upload className='h-3 w-3 mr-1' />
                <span>Change</span>
              </div>
            </div>
          ) : (
            <div className='flex items-center'>
              <svg
                className='h-10 w-10 text-gray-400 mr-2'
                stroke='currentColor'
                fill='none'
                viewBox='0 0 48 48'
                aria-hidden='true'
              >
                <path
                  d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <div>
                <p className='text-sm font-medium text-blue-600'>
                  Click to upload{' '}
                  <span className='text-gray-500 font-normal'>
                    or drag and drop
                  </span>
                </p>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Section content components
const TestSetupSection = ({ settings, onSettingsChange }) => {
  const [isCustomTime, setIsCustomTime] = useState(false)
  const [customTime, setCustomTime] = useState(null) // Default to 30 minutes
  const [isMobile, setIsMobile] = useState(false)

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize custom time state if needed
  useEffect(() => {
    const standardOptions = DROPDOWN_OPTIONS.duration
      .map((option) => option.value)
      .filter((val) => val !== 'custom')

    if (settings.timeLimit && !standardOptions.includes(settings.timeLimit)) {
      setIsCustomTime(true)
      setCustomTime(settings.timeLimit)
    }
  }, [settings.timeLimit])

  const handleTimeChange = (value) => {
    if (value === 'custom') {
      setIsCustomTime(true)
      onSettingsChange('timeLimit', customTime || null)
    } else {
      setIsCustomTime(false)
      onSettingsChange('timeLimit', parseInt(value, 10))
    }
  }

  const handleCustomTimeChange = (value) => {
    setCustomTime(value)
    if (isCustomTime) {
      onSettingsChange('timeLimit', value)
    }
  }

  return (
    <div className='p-4 sm:p-5 bg-white'>
      {/* On mobile, use a single column with consistent gaps */}
      <div className='md:hidden flex flex-col gap-5'>
        <SettingsGroup icon={Clock} title='Time Controls'>
          <div className='flex flex-col h-full'>
            <div className='space-y-4'>
              {/* Modified: Changed grid-cols-2 to flex-col on mobile */}
              <div className='flex flex-col gap-4'>
                <FormSelect
                  label='Test Duration'
                  value={isCustomTime ? 'custom' : settings.timeLimit}
                  onChange={handleTimeChange}
                  options={DROPDOWN_OPTIONS.duration}
                  ariaLabel='Select test duration'
                />
                <FormInput
                  label='Custom Duration'
                  type='number'
                  min='1'
                  value={
                    isCustomTime ? customTime || settings.timeLimit : customTime
                  }
                  onChange={handleCustomTimeChange}
                  ariaLabel='Enter custom test duration in minutes'
                  suffix='minutes'
                  disabled={!isCustomTime}
                />
              </div>
            </div>
            <div className='mt-auto pt-4'>
              <ToggleSwitch
                isChecked={settings.questionTimeLimit}
                onChange={() =>
                  onSettingsChange(
                    'questionTimeLimit',
                    !settings.questionTimeLimit
                  )
                }
                activeLabel='Per-question timer'
                inactiveLabel='No question timer'
              />
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup icon={Percent} title='Scoring & Grading'>
          <div className='flex flex-col h-full'>
            <div className='space-y-3'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormInput
                  label='Passing Score (%)'
                  type='number'
                  min='0'
                  max='100'
                  value={settings.passingScore}
                  onChange={(value) => onSettingsChange('passingScore', value)}
                  ariaLabel='Enter passing score percentage'
                />
                <FormSelect
                  label='Grading Scheme'
                  value={settings.gradingScheme}
                  onChange={(value) => onSettingsChange('gradingScheme', value)}
                  options={DROPDOWN_OPTIONS.gradingScheme}
                  ariaLabel='Select grading scheme'
                />
              </div>
            </div>
            <div className='mt-auto pt-4 space-y-4'>
              <ToggleSwitch
                isChecked={settings.enablePartialCredit}
                onChange={() =>
                  onSettingsChange(
                    'enablePartialCredit',
                    !settings.enablePartialCredit
                  )
                }
                activeLabel='Partial credit'
                inactiveLabel='No partial credit'
              />
              <ToggleSwitch
                isChecked={settings.certificate}
                onChange={() =>
                  onSettingsChange('certificate', !settings.certificate)
                }
                activeLabel='Issue certificate'
                inactiveLabel='No certificate'
              />
            </div>
          </div>
        </SettingsGroup>

        <SettingsGroup icon={Globe} title='Access & Attempts'>
          {/* Added padding to match form spacing */}
          <div className='pt-[3px] space-y-4'>
            <ToggleSwitch
              isChecked={settings.isPublic}
              onChange={() => onSettingsChange('isPublic', !settings.isPublic)}
              activeLabel='Public access'
              inactiveLabel='Private access'
            />
            <ToggleSwitch
              isChecked={settings.allowRetry}
              onChange={() =>
                onSettingsChange('allowRetry', !settings.allowRetry)
              }
              activeLabel='Multiple attempts'
              inactiveLabel='Single attempt'
            />
            <ToggleSwitch
              isChecked={settings.allowSaving}
              onChange={() =>
                onSettingsChange('allowSaving', !settings.allowSaving)
              }
              activeLabel='Save progress'
              inactiveLabel='No progress saving'
            />
            <ToggleSwitch
              isChecked={settings.randomizeQuestions}
              onChange={() =>
                onSettingsChange(
                  'randomizeQuestions',
                  !settings.randomizeQuestions
                )
              }
              activeLabel='Randomize questions'
              inactiveLabel='Fixed order'
            />
          </div>
        </SettingsGroup>

        <SettingsGroup icon={Eye} title='Results & Feedback'>
          <div className='flex flex-col h-full'>
            {/* Added padding to match form spacing */}
            <div className='pt-[3px] space-y-4'>
              <ToggleSwitch
                isChecked={settings.showResults}
                onChange={() =>
                  onSettingsChange('showResults', !settings.showResults)
                }
                activeLabel='Show results'
                inactiveLabel='Hide results'
              />
              <ToggleSwitch
                isChecked={settings.showCorrectAnswers}
                onChange={() =>
                  onSettingsChange(
                    'showCorrectAnswers',
                    !settings.showCorrectAnswers
                  )
                }
                activeLabel='Show answers'
                inactiveLabel='Hide answers'
              />
              <div>
                <ToggleSwitch
                  isChecked={settings.showFeedback}
                  onChange={() =>
                    onSettingsChange('showFeedback', !settings.showFeedback)
                  }
                  activeLabel='Show feedback'
                  inactiveLabel='No feedback'
                />
              </div>
            </div>
            <div className='mt-auto pt-4'>
              <FormSelect
                value={settings.feedbackType}
                onChange={(value) => onSettingsChange('feedbackType', value)}
                options={DROPDOWN_OPTIONS.feedbackType}
                label='Feedback Type'
                ariaLabel='Select feedback type'
                disabled={!settings.showFeedback}
                className={
                  settings.showFeedback ? '' : 'opacity-50 pointer-events-none'
                }
              />
            </div>
          </div>
        </SettingsGroup>
      </div>

      {/* Desktop layout with two columns */}
      <div className='hidden md:grid md:grid-cols-2 gap-5'>
        {/* Left Column - Test Settings */}
        <div className='flex flex-col gap-5'>
          <SettingsGroup icon={Clock} title='Time Controls'>
            <div className='flex flex-col h-full'>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <FormSelect
                    label='Test Duration'
                    value={isCustomTime ? 'custom' : settings.timeLimit}
                    onChange={handleTimeChange}
                    options={DROPDOWN_OPTIONS.duration}
                    ariaLabel='Select test duration'
                  />
                  <FormInput
                    label='Custom Duration'
                    type='number'
                    min='1'
                    value={
                      isCustomTime
                        ? customTime || settings.timeLimit
                        : customTime
                    }
                    onChange={handleCustomTimeChange}
                    ariaLabel='Enter custom test duration in minutes'
                    suffix='minutes'
                    disabled={!isCustomTime}
                  />
                </div>
              </div>
              <div className='mt-auto pt-4'>
                <ToggleSwitch
                  isChecked={settings.questionTimeLimit}
                  onChange={() =>
                    onSettingsChange(
                      'questionTimeLimit',
                      !settings.questionTimeLimit
                    )
                  }
                  activeLabel='Per-question timer'
                  inactiveLabel='No question timer'
                />
              </div>
            </div>
          </SettingsGroup>

          <SettingsGroup icon={Globe} title='Access & Attempts'>
            {/* Added padding to match form spacing */}
            <div className='pt-[3px] space-y-4'>
              <ToggleSwitch
                isChecked={settings.isPublic}
                onChange={() =>
                  onSettingsChange('isPublic', !settings.isPublic)
                }
                activeLabel='Public access'
                inactiveLabel='Private access'
              />
              <ToggleSwitch
                isChecked={settings.allowRetry}
                onChange={() =>
                  onSettingsChange('allowRetry', !settings.allowRetry)
                }
                activeLabel='Multiple attempts'
                inactiveLabel='Single attempt'
              />
              <ToggleSwitch
                isChecked={settings.allowSaving}
                onChange={() =>
                  onSettingsChange('allowSaving', !settings.allowSaving)
                }
                activeLabel='Save progress'
                inactiveLabel='No progress saving'
              />
              <ToggleSwitch
                isChecked={settings.randomizeQuestions}
                onChange={() =>
                  onSettingsChange(
                    'randomizeQuestions',
                    !settings.randomizeQuestions
                  )
                }
                activeLabel='Randomize questions'
                inactiveLabel='Fixed order'
              />
            </div>
          </SettingsGroup>
        </div>

        {/* Right Column - Grading Settings */}
        <div className='flex flex-col gap-5'>
          <SettingsGroup icon={Percent} title='Scoring & Grading'>
            <div className='flex flex-col h-full'>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormInput
                    label='Passing Score (%)'
                    type='number'
                    min='0'
                    max='100'
                    value={settings.passingScore}
                    onChange={(value) =>
                      onSettingsChange('passingScore', value)
                    }
                    ariaLabel='Enter passing score percentage'
                  />
                  <FormSelect
                    label='Grading Scheme'
                    value={settings.gradingScheme}
                    onChange={(value) =>
                      onSettingsChange('gradingScheme', value)
                    }
                    options={DROPDOWN_OPTIONS.gradingScheme}
                    ariaLabel='Select grading scheme'
                  />
                </div>
              </div>
              <div className='mt-auto pt-4 space-y-4'>
                <ToggleSwitch
                  isChecked={settings.enablePartialCredit}
                  onChange={() =>
                    onSettingsChange(
                      'enablePartialCredit',
                      !settings.enablePartialCredit
                    )
                  }
                  activeLabel='Partial credit'
                  inactiveLabel='No partial credit'
                />
                <ToggleSwitch
                  isChecked={settings.certificate}
                  onChange={() =>
                    onSettingsChange('certificate', !settings.certificate)
                  }
                  activeLabel='Issue certificate'
                  inactiveLabel='No certificate'
                />
              </div>
            </div>
          </SettingsGroup>

          <SettingsGroup icon={Eye} title='Results & Feedback'>
            <div className='flex flex-col h-full'>
              {/* Added padding to match form spacing */}
              <div className='pt-[3px] space-y-4'>
                <ToggleSwitch
                  isChecked={settings.showResults}
                  onChange={() =>
                    onSettingsChange('showResults', !settings.showResults)
                  }
                  activeLabel='Show results'
                  inactiveLabel='Hide results'
                />
                <ToggleSwitch
                  isChecked={settings.showCorrectAnswers}
                  onChange={() =>
                    onSettingsChange(
                      'showCorrectAnswers',
                      !settings.showCorrectAnswers
                    )
                  }
                  activeLabel='Show answers'
                  inactiveLabel='Hide answers'
                />
                <ToggleSwitch
                  isChecked={settings.showFeedback}
                  onChange={() =>
                    onSettingsChange('showFeedback', !settings.showFeedback)
                  }
                  activeLabel='Show feedback'
                  inactiveLabel='No feedback'
                />
              </div>
              <div className='mt-auto pt-4'>
                <FormSelect
                  value={settings.feedbackType}
                  onChange={(value) => onSettingsChange('feedbackType', value)}
                  options={DROPDOWN_OPTIONS.feedbackType}
                  label='Feedback Type'
                  ariaLabel='Select feedback type'
                  disabled={!settings.showFeedback}
                  className={
                    settings.showFeedback
                      ? ''
                      : 'opacity-50 pointer-events-none'
                  }
                />
              </div>
            </div>
          </SettingsGroup>
        </div>
      </div>
    </div>
  )
}

const AppearanceSection = ({ settings, onSettingsChange }) => (
  <div className='p-4 sm:p-5 bg-white'>
    {/* Mobile layout with single column */}
    <div className='md:hidden flex flex-col gap-5'>
      <SettingsGroup icon={Image} title='Visual Style'>
        <div className='space-y-3'>
          <FormSelect
            label='Theme'
            value={settings.customTheme}
            onChange={(value) => onSettingsChange('customTheme', value)}
            options={DROPDOWN_OPTIONS.theme}
            ariaLabel='Select theme'
          />
          <div className='pt-1'>
            <FormSelect
              label='Question Layout'
              value={settings.questionLayout}
              onChange={(value) => onSettingsChange('questionLayout', value)}
              options={DROPDOWN_OPTIONS.questionLayout}
              ariaLabel='Select question layout'
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup icon={Palette} title='Custom Branding'>
        {/* Added padding to match form spacing */}
        <div className='pt-[3px] space-y-4'>
          <div className='pb-1'>
            <ToggleSwitch
              isChecked={settings.showBranding}
              onChange={() =>
                onSettingsChange('showBranding', !settings.showBranding)
              }
              activeLabel='Use custom branding'
              inactiveLabel='No custom branding'
            />
          </div>
          <ImageUploader
            onImageChange={(imageData) =>
              onSettingsChange('logoUrl', imageData)
            }
            disabled={!settings.showBranding}
            currentImage={settings.logoUrl}
          />
        </div>
      </SettingsGroup>
    </div>

    {/* Desktop layout with two columns */}
    <div className='hidden md:grid md:grid-cols-2 gap-5'>
      <div className='flex flex-col gap-5'>
        <SettingsGroup icon={Image} title='Visual Style'>
          <div className='space-y-4'>
            <FormSelect
              label='Theme'
              value={settings.customTheme}
              onChange={(value) => onSettingsChange('customTheme', value)}
              options={DROPDOWN_OPTIONS.theme}
              ariaLabel='Select theme'
            />
            <FormSelect
              label='Question Layout'
              value={settings.questionLayout}
              onChange={(value) => onSettingsChange('questionLayout', value)}
              options={DROPDOWN_OPTIONS.questionLayout}
              ariaLabel='Select question layout'
            />
          </div>
        </SettingsGroup>
      </div>

      <div className='flex flex-col gap-5'>
        <SettingsGroup icon={Palette} title='Custom Branding'>
          <div className='flex flex-col h-full'>
            {/* Added padding to match form spacing */}
            <div className='pt-[3px]'>
              <ToggleSwitch
                isChecked={settings.showBranding}
                onChange={() =>
                  onSettingsChange('showBranding', !settings.showBranding)
                }
                activeLabel='Use custom branding'
                inactiveLabel='No custom branding'
              />
            </div>
            <div className='mt-auto pt-4'>
              <ImageUploader
                onImageChange={(imageData) =>
                  onSettingsChange('logoUrl', imageData)
                }
                disabled={!settings.showBranding}
                currentImage={settings.logoUrl}
              />
            </div>
          </div>
        </SettingsGroup>
      </div>
    </div>
  </div>
)

const SecuritySection = ({ settings, onSettingsChange }) => (
  <div className='p-4 sm:p-5 bg-white'>
    {/* Mobile layout with single column */}
    <div className='md:hidden flex flex-col gap-5'>
      <SettingsGroup icon={Shield} title='Proctoring Controls'>
        {/* Added padding to match form spacing */}
        <div className='pt-[3px] space-y-4'>
          <ToggleSwitch
            isChecked={settings.requireLogin}
            onChange={() =>
              onSettingsChange('requireLogin', !settings.requireLogin)
            }
            activeLabel='Require user login'
            inactiveLabel='No login required'
          />
          <ToggleSwitch
            isChecked={settings.ipRestriction}
            onChange={() =>
              onSettingsChange('ipRestriction', !settings.ipRestriction)
            }
            activeLabel='IP address restrictions'
            inactiveLabel='No IP restrictions'
          />
          <ToggleSwitch
            isChecked={settings.preventTabSwitching}
            onChange={() =>
              onSettingsChange(
                'preventTabSwitching',
                !settings.preventTabSwitching
              )
            }
            activeLabel='Prevent tab switching'
            inactiveLabel='Allow tab switching'
          />
          <ToggleSwitch
            isChecked={settings.disableCopyPaste}
            onChange={() =>
              onSettingsChange('disableCopyPaste', !settings.disableCopyPaste)
            }
            activeLabel='Disable copy/paste'
            inactiveLabel='Allow copy/paste'
          />
        </div>
      </SettingsGroup>

      <SettingsGroup icon={Mail} title='Email Notifications'>
        <div className='flex flex-col h-full'>
          {/* Added padding to match form spacing */}
          <div className='pt-[3px] space-y-4'>
            <ToggleSwitch
              isChecked={settings.sendResultsEmail}
              onChange={() =>
                onSettingsChange('sendResultsEmail', !settings.sendResultsEmail)
              }
              activeLabel='Email results to participants'
              inactiveLabel="Don't email results to participants"
            />
            <div className='pb-1'>
              <ToggleSwitch
                isChecked={settings.notifyInstructor}
                onChange={() =>
                  onSettingsChange(
                    'notifyInstructor',
                    !settings.notifyInstructor
                  )
                }
                activeLabel='Notify instructor'
                inactiveLabel="Don't notify instructor"
              />
            </div>
          </div>
          <div className='mt-auto pt-4'>
            <FormSelect
              label='Email Template'
              value={settings.emailTemplate}
              onChange={(value) => onSettingsChange('emailTemplate', value)}
              options={DROPDOWN_OPTIONS.emailTemplate}
              ariaLabel='Select email template'
              disabled={!settings.sendResultsEmail}
              className={
                settings.sendResultsEmail
                  ? ''
                  : 'opacity-50 pointer-events-none'
              }
            />
          </div>
        </div>
      </SettingsGroup>
    </div>

    {/* Desktop layout with two columns */}
    <div className='hidden md:grid md:grid-cols-2 gap-5'>
      <div className='flex flex-col gap-5'>
        <SettingsGroup icon={Shield} title='Proctoring Controls'>
          {/* Added padding to match form spacing */}
          <div className='pt-[3px] space-y-4'>
            <ToggleSwitch
              isChecked={settings.requireLogin}
              onChange={() =>
                onSettingsChange('requireLogin', !settings.requireLogin)
              }
              activeLabel='Require user login'
              inactiveLabel='No login required'
            />
            <ToggleSwitch
              isChecked={settings.ipRestriction}
              onChange={() =>
                onSettingsChange('ipRestriction', !settings.ipRestriction)
              }
              activeLabel='IP address restrictions'
              inactiveLabel='No IP restrictions'
            />
            <ToggleSwitch
              isChecked={settings.preventTabSwitching}
              onChange={() =>
                onSettingsChange(
                  'preventTabSwitching',
                  !settings.preventTabSwitching
                )
              }
              activeLabel='Prevent tab switching'
              inactiveLabel='Allow tab switching'
            />
            <ToggleSwitch
              isChecked={settings.disableCopyPaste}
              onChange={() =>
                onSettingsChange('disableCopyPaste', !settings.disableCopyPaste)
              }
              activeLabel='Disable copy/paste'
              inactiveLabel='Allow copy/paste'
            />
          </div>
        </SettingsGroup>
      </div>

      <div className='flex flex-col gap-5'>
        <SettingsGroup icon={Mail} title='Email Notifications'>
          <div className='flex flex-col h-full'>
            {/* Added padding to match form spacing */}
            <div className='pt-[3px] space-y-4'>
              <ToggleSwitch
                isChecked={settings.sendResultsEmail}
                onChange={() =>
                  onSettingsChange(
                    'sendResultsEmail',
                    !settings.sendResultsEmail
                  )
                }
                activeLabel='Email results to participants'
                inactiveLabel="Don't email results to participants"
              />
              <ToggleSwitch
                isChecked={settings.notifyInstructor}
                onChange={() =>
                  onSettingsChange(
                    'notifyInstructor',
                    !settings.notifyInstructor
                  )
                }
                activeLabel='Notify instructor'
                inactiveLabel="Don't notify instructor"
              />
            </div>
            <div className=' mt-9 pt-4'>
              <FormSelect
                label='Email Template'
                value={settings.emailTemplate}
                onChange={(value) => onSettingsChange('emailTemplate', value)}
                options={DROPDOWN_OPTIONS.emailTemplate}
                ariaLabel='Select email template'
                disabled={!settings.sendResultsEmail}
                className={
                  settings.sendResultsEmail
                    ? ''
                    : 'opacity-50 pointer-events-none'
                }
              />
            </div>
          </div>
        </SettingsGroup>
      </div>
    </div>
  </div>
)

// Main component
const InteractiveTestOptions = ({
  settings: initialSettings = {},
  onSettingsChange: externalOnSettingsChange,
  onGenerateLink,
  interactiveLink,
  isLoading,
}) => {
  // Check if we're on mobile or desktop
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use an object to track which sections are expanded
  // Initialize all sections as closed on desktop
  const [expandedSections, setExpandedSections] = useState({
    'test-setup': false,
    appearance: false,
    security: false,
  })

  // Merge provided settings with defaults
  const allSettings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...initialSettings }),
    [initialSettings]
  )

  const handleSettingChange = (setting, value) => {
    const newSettings = {
      ...initialSettings,
      [setting]: value,
    }
    externalOnSettingsChange(newSettings)
  }

  const toggleSection = (section) => {
    if (isMobile) {
      // On mobile, just toggle the clicked section without affecting others
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }))
    } else {
      // On desktop, implement accordion behavior
      setExpandedSections((prev) => {
        const isCurrentlyExpanded = prev[section]

        // If the section is closed, open it and close all others
        if (!isCurrentlyExpanded) {
          return {
            'test-setup': section === 'test-setup',
            appearance: section === 'appearance',
            security: section === 'security',
          }
        } else {
          // If the section is open, close it
          return {
            ...prev,
            [section]: false,
          }
        }
      })
    }
  }

  // Mapping between section IDs and their content components
  const sectionComponents = {
    'test-setup': (
      <TestSetupSection
        settings={allSettings}
        onSettingsChange={handleSettingChange}
      />
    ),
    appearance: (
      <AppearanceSection
        settings={allSettings}
        onSettingsChange={handleSettingChange}
      />
    ),
    security: (
      <SecuritySection
        settings={allSettings}
        onSettingsChange={handleSettingChange}
      />
    ),
  }

  // Mapping between section IDs and their metadata
  const sections = [
    { id: 'test-setup', title: 'Test Setup', icon: FileText },
    { id: 'appearance', title: 'Appearance & Layout', icon: Paintbrush },
    { id: 'security', title: 'Security & Privacy', icon: Lock },
  ]

  return (
    <div className='mt-4 sm:mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm'>
      {/* Main Configuration Header */}
      <div className='px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white'>
        <h3 className='text-lg font-medium text-gray-800 flex items-center'>
          Test Configuration
        </h3>
      </div>

      {/* Render all sections */}
      {sections.map((section, index) => (
        <div key={section.id} className='border-b border-gray-200'>
          <SectionHeader
            icon={section.icon}
            title={section.title}
            isExpanded={expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
          />
          {expandedSections[section.id] && sectionComponents[section.id]}
        </div>
      ))}

      {/* Generate Link Button */}
      <div className='p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex justify-end'>
        <button
          onClick={onGenerateLink}
          className={`${STYLES.button.base} ${
            interactiveLink ? STYLES.button.success : STYLES.button.primary
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2' />
          ) : (
            <Link className='h-4 w-4 mr-2' />
          )}
          <span>{interactiveLink ? 'Regenerate Link' : 'Generate Link'}</span>
        </button>
      </div>
    </div>
  )
}

export default InteractiveTestOptions
