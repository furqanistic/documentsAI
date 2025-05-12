// file 1

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
  Percent,
  Settings,
  Shield,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

// Common styles extracted as constants for consistency
const STYLES = {
  input:
    'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  sectionHeader: {
    base: 'w-full flex justify-between items-center py-3 px-4 text-left text-sm font-medium transition-colors duration-200',
    expanded: 'bg-blue-50 text-gray-700 border-b border-gray-200',
    collapsed: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
  },
  settingsGroup:
    'mb-5 p-4 bg-white rounded-lg border border-gray-200 shadow-sm h-auto md:h-[250px] flex flex-col',
  toggleButton: {
    base: 'block w-10 h-5 rounded-full transition-colors duration-200',
    active: 'bg-blue-600',
    inactive: 'bg-gray-300',
  },
  toggleSlider: {
    base: 'absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out',
    active: 'transform translate-x-5',
  },
}

// Reusable ToggleSwitch component
const ToggleSwitch = ({
  label,
  isChecked,
  onChange,
  activeLabel,
  inactiveLabel,
}) => (
  <div className='flex items-center space-x-3'>
    <label className='inline-flex items-center cursor-pointer'>
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

// Reusable section header
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
      <ChevronUp className='h-5 w-5 text-blue-600' />
    ) : (
      <ChevronDown className='h-5 w-5 text-gray-500' />
    )}
  </button>
)

// Reusable settings group
const SettingsGroup = ({ icon: Icon, title, children, className = '' }) => (
  <div className={`${STYLES.settingsGroup} ${className}`}>
    <div className='flex items-center pb-2 border-b border-gray-100 mb-3'>
      <Icon className='h-4 w-4 text-gray-700 mr-2' />
      <span className='text-sm font-semibold text-gray-800'>{title}</span>
    </div>
    <div className='flex-1 flex flex-col justify-between'>{children}</div>
  </div>
)

// Improved image uploader with preview
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
        <label className='block text-xs font-medium text-gray-700 mb-1.5'>
          Organization Logo
        </label>
        {fileInput}
        <button
          onClick={handlers.click}
          type='button'
          className='w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white'
        >
          <Upload className='h-3 w-3 mr-1' />
          {currentImage ? 'Change logo' : 'Upload logo'}
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

  // Security settings
  requireLogin: false,
  preventTabSwitching: false,
  disableCopyPaste: false,
  ipRestriction: false,

  // Notifications
  sendResultsEmail: false,
  emailTemplate: 'default',
  notifyInstructor: false,

  // Advanced settings
  randomizeQuestions: false,
  questionTimeLimit: false,
  allowSaving: true,
  showFeedback: true,
  feedbackType: 'detailed',
  accessPeriod: { start: '', end: '' },
  certificate: false,
  printable: true,
}

// Main component
const InteractiveTestOptions = ({
  settings = {},
  onSettingsChange,
  onGenerateLink,
  interactiveLink,
  isLoading,
}) => {
  const [expandedSection, setExpandedSection] = useState('test-setup')

  // Merge provided settings with defaults
  const allSettings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...settings }),
    [settings]
  )

  // Generalized handlers
  const handleToggleChange = (setting) => {
    onSettingsChange({
      ...settings,
      [setting]: !settings[setting],
    })
  }

  const handleInputChange = (setting, value) => {
    onSettingsChange({
      ...settings,
      [setting]: value,
    })
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Render test setup section content
  const renderTestSetupContent = () => (
    <div className='p-4 sm:p-5 bg-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        {/* Left Column - Test Settings */}
        <div>
          <h4 className='font-medium text-gray-800 mb-3 sm:mb-4 text-sm uppercase tracking-wider'>
            Basic Settings
          </h4>

          <SettingsGroup icon={Clock} title='Time Controls'>
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Test Duration
                  </label>
                  <select
                    value={allSettings.timeLimit}
                    onChange={(e) =>
                      handleInputChange(
                        'timeLimit',
                        parseInt(e.target.value, 10)
                      )
                    }
                    className={STYLES.input}
                    aria-label='Select test duration'
                  >
                    {[5, 10, 15, 30, 45, 60, 90, 120, 0].map((val) => (
                      <option key={val} value={val}>
                        {val === 0
                          ? 'No time limit'
                          : val >= 60
                          ? `${val / 60} hour${val > 60 ? 's' : ''}`
                          : `${val} minutes`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex items-center h-full pt-6'>
                  <ToggleSwitch
                    isChecked={allSettings.questionTimeLimit}
                    onChange={() => handleToggleChange('questionTimeLimit')}
                    activeLabel='Per-question timer'
                    inactiveLabel='No question timer'
                  />
                </div>
              </div>
            </div>
            <div className='mt-auto pt-4 hidden md:block'></div>
          </SettingsGroup>

          <SettingsGroup icon={Globe} title='Access & Attempts'>
            <div>
              <div className='grid grid-cols-1 gap-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-center'>
                    <ToggleSwitch
                      isChecked={allSettings.isPublic}
                      onChange={() => handleToggleChange('isPublic')}
                      activeLabel='Public access'
                      inactiveLabel='Private access'
                    />
                  </div>

                  <div className='flex items-center'>
                    <ToggleSwitch
                      isChecked={allSettings.allowRetry}
                      onChange={() => handleToggleChange('allowRetry')}
                      activeLabel='Multiple attempts'
                      inactiveLabel='Single attempt'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-center'>
                    <ToggleSwitch
                      isChecked={allSettings.allowSaving}
                      onChange={() => handleToggleChange('allowSaving')}
                      activeLabel='Save progress'
                      inactiveLabel='No progress saving'
                    />
                  </div>

                  <div className='flex items-center'>
                    <ToggleSwitch
                      isChecked={allSettings.randomizeQuestions}
                      onChange={() => handleToggleChange('randomizeQuestions')}
                      activeLabel='Randomize questions'
                      inactiveLabel='Fixed order'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-auto pt-4 hidden md:block'></div>
          </SettingsGroup>
        </div>

        {/* Right Column - Grading Settings */}
        <div>
          <h4 className='font-medium text-gray-800 mb-3 sm:mb-4 text-sm uppercase tracking-wider'>
            Grading Settings
          </h4>

          <SettingsGroup icon={Percent} title='Scoring & Grading'>
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Passing Score (%)
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    value={allSettings.passingScore}
                    onChange={(e) =>
                      handleInputChange(
                        'passingScore',
                        parseInt(e.target.value, 10)
                      )
                    }
                    className={STYLES.input}
                    aria-label='Enter passing score percentage'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Grading Scheme
                  </label>
                  <select
                    value={allSettings.gradingScheme}
                    onChange={(e) =>
                      handleInputChange('gradingScheme', e.target.value)
                    }
                    className={STYLES.input}
                    aria-label='Select grading scheme'
                  >
                    <option value='standard'>Standard (A-F)</option>
                    <option value='percentage'>Percentage Only</option>
                    <option value='passfail'>Pass/Fail Only</option>
                    <option value='points'>Points Based</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-center'>
                  <ToggleSwitch
                    isChecked={allSettings.enablePartialCredit}
                    onChange={() => handleToggleChange('enablePartialCredit')}
                    activeLabel='Partial credit'
                    inactiveLabel='No partial credit'
                  />
                </div>

                <div className='flex items-center'>
                  <ToggleSwitch
                    isChecked={allSettings.certificate}
                    onChange={() => handleToggleChange('certificate')}
                    activeLabel='Issue certificate'
                    inactiveLabel='No certificate'
                  />
                </div>
              </div>
            </div>
            <div className='mt-auto hidden md:block'></div>
          </SettingsGroup>

          <SettingsGroup icon={Eye} title='Results & Feedback'>
            <div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3'>
                <div className='flex items-center'>
                  <ToggleSwitch
                    isChecked={allSettings.showResults}
                    onChange={() => handleToggleChange('showResults')}
                    activeLabel='Show results'
                    inactiveLabel='Hide results'
                  />
                </div>

                <div className='flex items-center'>
                  <ToggleSwitch
                    isChecked={allSettings.showCorrectAnswers}
                    onChange={() => handleToggleChange('showCorrectAnswers')}
                    activeLabel='Show answers'
                    inactiveLabel='Hide answers'
                  />
                </div>
              </div>

              <div className='flex items-center mb-3'>
                <ToggleSwitch
                  isChecked={allSettings.showFeedback}
                  onChange={() => handleToggleChange('showFeedback')}
                  activeLabel='Show feedback'
                  inactiveLabel='No feedback'
                />
              </div>

              <div
                className={
                  allSettings.showFeedback
                    ? ''
                    : 'opacity-50 pointer-events-none'
                }
              >
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Feedback Type
                </label>
                <select
                  value={allSettings.feedbackType}
                  onChange={(e) =>
                    handleInputChange('feedbackType', e.target.value)
                  }
                  className={STYLES.input}
                  aria-label='Select feedback type'
                  disabled={!allSettings.showFeedback}
                >
                  <option value='detailed'>Detailed Explanation</option>
                  <option value='basic'>Basic Correct/Incorrect</option>
                  <option value='endOnly'>Only at End of Test</option>
                </select>
              </div>
            </div>
          </SettingsGroup>
        </div>
      </div>
    </div>
  )

  // Render appearance section content
  const renderAppearanceContent = () => (
    <div className='p-4 sm:p-5 bg-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        {/* Theme and Layout */}
        <div>
          <h4 className='font-medium text-gray-800 mb-3 sm:mb-4 text-sm uppercase tracking-wider'>
            Theme & Layout
          </h4>

          <SettingsGroup icon={Image} title='Visual Style'>
            <div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Theme
                </label>
                <select
                  value={allSettings.customTheme}
                  onChange={(e) =>
                    handleInputChange('customTheme', e.target.value)
                  }
                  className={STYLES.input}
                  aria-label='Select theme'
                >
                  {[
                    'default',
                    'professional',
                    'academic',
                    'minimal',
                    'colorful',
                  ].map((theme) => (
                    <option key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Question Layout
                </label>
                <select
                  value={allSettings.questionLayout}
                  onChange={(e) =>
                    handleInputChange('questionLayout', e.target.value)
                  }
                  className={STYLES.input}
                  aria-label='Select question layout'
                >
                  <option value='standard'>One question per page</option>
                  <option value='all'>All questions on one page</option>
                  <option value='sections'>
                    Questions grouped by sections
                  </option>
                </select>
              </div>
            </div>
            <div className='mt-auto'></div>
          </SettingsGroup>
        </div>

        {/* Branding */}
        <div>
          <h4 className='font-medium text-gray-800 mb-3 sm:mb-4 text-sm uppercase tracking-wider'>
            Branding
          </h4>

          <SettingsGroup icon={Image} title='Custom Branding'>
            <div>
              <div className='flex items-center mb-3'>
                <ToggleSwitch
                  isChecked={allSettings.showBranding}
                  onChange={() => handleToggleChange('showBranding')}
                  activeLabel='Use custom branding'
                  inactiveLabel='Default branding'
                />
              </div>

              <ImageUploader
                onImageChange={(imageData) =>
                  handleInputChange('logoUrl', imageData)
                }
                disabled={!allSettings.showBranding}
                currentImage={allSettings.logoUrl}
              />
            </div>
          </SettingsGroup>
        </div>
      </div>
    </div>
  )

  // Render security section content
  const renderSecurityContent = () => (
    <div className='p-4 sm:p-5 bg-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
        <SettingsGroup icon={Shield} title='Proctoring Controls'>
          <div>
            <div className='space-y-4'>
              {/* Former Authentication controls */}
              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.requireLogin}
                  onChange={() => handleToggleChange('requireLogin')}
                  activeLabel='Require user login'
                  inactiveLabel='No login required'
                />
              </div>

              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.ipRestriction}
                  onChange={() => handleToggleChange('ipRestriction')}
                  activeLabel='IP address restrictions'
                  inactiveLabel='No IP restrictions'
                />
              </div>

              {/* Former Proctoring controls */}
              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.preventTabSwitching}
                  onChange={() => handleToggleChange('preventTabSwitching')}
                  activeLabel='Prevent tab switching'
                  inactiveLabel='Allow tab switching'
                />
              </div>

              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.disableCopyPaste}
                  onChange={() => handleToggleChange('disableCopyPaste')}
                  activeLabel='Disable copy/paste'
                  inactiveLabel='Allow copy/paste'
                />
              </div>
            </div>
          </div>
          <div className='mt-auto pt-8'></div>
        </SettingsGroup>

        <SettingsGroup icon={Mail} title='Email Notifications'>
          <div>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.sendResultsEmail}
                  onChange={() => handleToggleChange('sendResultsEmail')}
                  activeLabel='Email results to participants'
                  inactiveLabel='No result emails'
                />
              </div>

              <div className='flex items-center'>
                <ToggleSwitch
                  isChecked={allSettings.notifyInstructor}
                  onChange={() => handleToggleChange('notifyInstructor')}
                  activeLabel='Notify instructor'
                  inactiveLabel="Don't notify instructor"
                />
              </div>
            </div>

            <div
              className={`mt-3 ${
                allSettings.sendResultsEmail
                  ? ''
                  : 'opacity-50 pointer-events-none'
              }`}
            >
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Template
              </label>
              <select
                value={allSettings.emailTemplate}
                onChange={(e) =>
                  handleInputChange('emailTemplate', e.target.value)
                }
                className={STYLES.input}
                aria-label='Select email template'
                disabled={!allSettings.sendResultsEmail}
              >
                <option value='default'>Default Template</option>
                <option value='minimal'>Minimal</option>
                <option value='detailed'>Detailed Results</option>
                <option value='certificate'>With Certificate</option>
              </select>
            </div>
          </div>
        </SettingsGroup>
      </div>
    </div>
  )

  return (
    <div className='mt-4 sm:mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm'>
      {/* Main Configuration Header */}
      <div className='px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white'>
        <h3 className='text-lg font-medium text-gray-800 flex items-center'>
          <Settings className='h-5 w-5 mr-2 text-blue-600' />
          Test Configuration
        </h3>
        <p className='text-sm text-gray-500 mt-1'>Configure test settings</p>
      </div>

      {/* Test Setup Section */}
      <div className='border-b border-gray-200'>
        <SectionHeader
          icon={FileText}
          title='Test Setup'
          isExpanded={expandedSection === 'test-setup'}
          onToggle={() => toggleSection('test-setup')}
        />
        {expandedSection === 'test-setup' && renderTestSetupContent()}
      </div>

      {/* Appearance Section */}
      <div className='border-b border-gray-200'>
        <SectionHeader
          icon={Image}
          title='Appearance & Layout'
          isExpanded={expandedSection === 'appearance'}
          onToggle={() => toggleSection('appearance')}
        />
        {expandedSection === 'appearance' && renderAppearanceContent()}
      </div>

      {/* Security Section */}
      <div className='border-b border-gray-200'>
        <SectionHeader
          icon={Lock}
          title='Security & Privacy'
          isExpanded={expandedSection === 'security'}
          onToggle={() => toggleSection('security')}
        />
        {expandedSection === 'security' && renderSecurityContent()}
      </div>

      {/* Generate Link Button */}
      <div className='p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex justify-end'>
        <button
          onClick={onGenerateLink}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-sm ${
            interactiveLink
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
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
