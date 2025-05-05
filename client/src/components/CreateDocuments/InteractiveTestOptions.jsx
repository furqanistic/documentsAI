import { motion } from 'framer-motion'
import {
  ChevronDown,
  Clock,
  Copy,
  Eye,
  Link as LinkIcon,
  Lock,
  Settings,
  Shield,
  Shuffle,
  Smartphone,
  ToggleLeft,
  User,
  Users,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'

const InteractiveTestOptions = ({
  settings,
  onSettingsChange,
  onGenerateLink,
  interactiveLink,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState('basic')
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false)
  const [customTimeHours, setCustomTimeHours] = useState('')
  const [customTimeMinutes, setCustomTimeMinutes] = useState('')

  // Animation variants
  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: { opacity: 1 },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  // Handle settings changes
  const handleSettingChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  // Handle custom time limit input
  const handleCustomHoursChange = (e) => {
    // Only allow numeric inputs
    const value = e.target.value.replace(/\D/g, '')
    setCustomTimeHours(value)
  }

  const handleCustomMinutesChange = (e) => {
    // Only allow numeric inputs
    const value = e.target.value.replace(/\D/g, '')
    setCustomTimeMinutes(value)
  }

  const applyCustomTime = () => {
    const hours = parseInt(customTimeHours || '0', 10)
    const minutes = parseInt(customTimeMinutes || '0', 10)

    if ((hours > 0 || minutes > 0) && !isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes
      handleSettingChange('timeLimit', totalMinutes)
    }
    setShowCustomTimeInput(false)
  }

  // Handle link copy
  const handleCopyLink = () => {
    if (interactiveLink) {
      navigator.clipboard.writeText(interactiveLink)
    }
  }

  return (
    <div className='border rounded-lg border-gray-200 overflow-hidden shadow-md'>
      <div className='bg-gray-100 p-3 border-b border-gray-200'>
        <div className='flex items-center'>
          <Zap className='h-4 w-4 mr-2 text-blue-600' />
          <span className='text-sm font-medium'>Interactive Test Options</span>
        </div>
      </div>

      {/* Settings tabs */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='flex'>
          <motion.button
            variants={tabVariants}
            animate={activeTab === 'basic' ? 'active' : 'inactive'}
            className={`flex-1 py-2.5 px-3 text-center text-xs font-medium relative ${
              activeTab === 'basic'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            <div className='flex items-center justify-center'>
              <Clock className='h-4 w-4 mr-1.5' />
              <span>Basic Settings</span>
            </div>
            {activeTab === 'basic' && (
              <motion.div
                className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'
                layoutId='activeSettingsTab'
              />
            )}
          </motion.button>

          <motion.button
            variants={tabVariants}
            animate={activeTab === 'advanced' ? 'active' : 'inactive'}
            className={`flex-1 py-2.5 px-3 text-center text-xs font-medium relative ${
              activeTab === 'advanced'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('advanced')}
          >
            <div className='flex items-center justify-center'>
              <Settings className='h-4 w-4 mr-1.5' />
              <span>Advanced</span>
            </div>
            {activeTab === 'advanced' && (
              <motion.div
                className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'
                layoutId='activeSettingsTab'
              />
            )}
          </motion.button>

          <motion.button
            variants={tabVariants}
            animate={activeTab === 'sharing' ? 'active' : 'inactive'}
            className={`flex-1 py-2.5 px-3 text-center text-xs font-medium relative ${
              activeTab === 'sharing'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sharing')}
          >
            <div className='flex items-center justify-center'>
              <Users className='h-4 w-4 mr-1.5' />
              <span>Access</span>
            </div>
            {activeTab === 'sharing' && (
              <motion.div
                className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'
                layoutId='activeSettingsTab'
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Tab content */}
      <div className='p-4 bg-white'>
        {activeTab === 'basic' && (
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            key='basic-content'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Time Limit
                </label>
                <div className='relative'>
                  <select
                    className='w-full p-2 border border-gray-200 rounded-md text-xs'
                    value={showCustomTimeInput ? 'custom' : settings.timeLimit}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === 'custom') {
                        setShowCustomTimeInput(true)
                        setCustomTimeHours('')
                        setCustomTimeMinutes('')
                      } else {
                        setShowCustomTimeInput(false)
                        handleSettingChange('timeLimit', parseInt(value))
                      }
                    }}
                  >
                    <option value='0'>No time limit</option>
                    <option value='30'>30 minutes</option>
                    <option value='60'>1 hour</option>
                    <option value='90'>1.5 hours</option>
                    <option value='120'>2 hours</option>
                    <option value='custom'>Custom...</option>
                  </select>
                </div>

                {/* Custom time input */}
                {showCustomTimeInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='mt-2'
                  >
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                      <div className='flex items-center gap-2 flex-1'>
                        <div className='w-full'>
                          <label className='block text-xs text-gray-500 mb-1'>
                            Hours
                          </label>
                          <input
                            type='text'
                            placeholder='0'
                            value={customTimeHours}
                            onChange={handleCustomHoursChange}
                            className='p-2 border border-gray-200 rounded-md text-xs w-full'
                          />
                        </div>
                        <div className='w-full'>
                          <label className='block text-xs text-gray-500 mb-1'>
                            Minutes
                          </label>
                          <input
                            type='text'
                            placeholder='0'
                            value={customTimeMinutes}
                            onChange={handleCustomMinutesChange}
                            className='p-2 border border-gray-200 rounded-md text-xs w-full'
                          />
                        </div>
                      </div>
                      <div className='mt-4 sm:mt-0 w-full sm:w-auto'>
                        <button
                          onClick={applyCustomTime}
                          className='bg-blue-600 text-white py-2 px-3 rounded-md text-xs w-full sm:w-auto'
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Question Display
                </label>
                <div className='relative'>
                  <select
                    className='w-full p-2 border border-gray-200 rounded-md text-xs'
                    value={settings.questionDisplay || 'all'}
                    onChange={(e) =>
                      handleSettingChange('questionDisplay', e.target.value)
                    }
                  >
                    <option value='all'>Show all questions at once</option>
                    <option value='one'>One question at a time</option>
                    <option value='section'>Questions by section</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                  checked={settings.showResults}
                  onChange={(e) =>
                    handleSettingChange('showResults', e.target.checked)
                  }
                />
                <div>
                  <span className='font-medium text-gray-700 block mb-0.5'>
                    Show results immediately
                  </span>
                  <span className='text-xs text-gray-500'>
                    Students can see correct answers after submitting
                  </span>
                </div>
              </label>

              <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                  checked={settings.allowRetry}
                  onChange={(e) =>
                    handleSettingChange('allowRetry', e.target.checked)
                  }
                />
                <div>
                  <span className='font-medium text-gray-700 block mb-0.5'>
                    Allow multiple attempts
                  </span>
                  <span className='text-xs text-gray-500'>
                    Students can retake the test multiple times
                  </span>
                </div>
              </label>

              <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                <input
                  type='checkbox'
                  className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                  checked={settings.randomizeQuestions || false}
                  onChange={(e) =>
                    handleSettingChange('randomizeQuestions', e.target.checked)
                  }
                />
                <div>
                  <span className='font-medium text-gray-700 block mb-0.5'>
                    Randomize question order
                  </span>
                  <span className='text-xs text-gray-500'>
                    Questions appear in a different order for each student
                  </span>
                </div>
              </label>
            </div>
          </motion.div>
        )}

        {activeTab === 'advanced' && (
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            key='advanced-content'
          >
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Passing Score (%)
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-200 rounded-md text-xs'
                    value={
                      settings.passingScore !== undefined
                        ? settings.passingScore
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      handleSettingChange(
                        'passingScore',
                        value === '' ? '' : parseInt(value)
                      )
                    }}
                    placeholder='70'
                  />
                  <div className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500'>
                    %
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Results Display
                </label>
                <select
                  className='w-full p-2 border border-gray-200 rounded-md text-xs'
                  value={settings.resultsDisplay || 'detailed'}
                  onChange={(e) =>
                    handleSettingChange('resultsDisplay', e.target.value)
                  }
                >
                  <option value='detailed'>
                    Detailed feedback (show correct answers)
                  </option>
                  <option value='summary'>Summary only (total score)</option>
                  <option value='pass-fail'>Pass/Fail only</option>
                </select>
              </div>

              <div className='space-y-3'>
                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.preventBacktracking || false}
                    onChange={(e) =>
                      handleSettingChange(
                        'preventBacktracking',
                        e.target.checked
                      )
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Prevent question backtracking
                    </span>
                    <span className='text-xs text-gray-500'>
                      Students cannot go back to previous questions
                    </span>
                  </div>
                </label>

                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.showTimer || true}
                    onChange={(e) =>
                      handleSettingChange('showTimer', e.target.checked)
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Show countdown timer
                    </span>
                    <span className='text-xs text-gray-500'>
                      Display time remaining during the test
                    </span>
                  </div>
                </label>

                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.preventCopyPaste || false}
                    onChange={(e) =>
                      handleSettingChange('preventCopyPaste', e.target.checked)
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Prevent copy & paste
                    </span>
                    <span className='text-xs text-gray-500'>
                      Disable copy/paste functionality during the test
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'sharing' && (
          <motion.div
            variants={contentVariants}
            initial='hidden'
            animate='visible'
            key='sharing-content'
          >
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Access Control
                </label>
                <div className='relative'>
                  <select
                    className='w-full p-2 border border-gray-200 rounded-md text-xs'
                    value={settings.accessControl || 'link'}
                    onChange={(e) =>
                      handleSettingChange('accessControl', e.target.value)
                    }
                  >
                    <option value='link'>Anyone with the link</option>
                    <option value='password'>Password protected</option>
                    <option value='email'>Specific email addresses only</option>
                  </select>
                </div>
              </div>

              {settings.accessControl === 'password' && (
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type='password'
                      className='w-full p-2 border border-gray-200 rounded-md text-xs pr-10'
                      value={settings.password || ''}
                      onChange={(e) =>
                        handleSettingChange('password', e.target.value)
                      }
                      placeholder='Enter test password'
                    />
                    <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                      <Lock className='h-4 w-4 text-gray-400' />
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-3'>
                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.isPublic}
                    onChange={(e) =>
                      handleSettingChange('isPublic', e.target.checked)
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Make test publicly discoverable
                    </span>
                    <span className='text-xs text-gray-500'>
                      Test can be found through search
                    </span>
                  </div>
                </label>

                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.collectUserData || false}
                    onChange={(e) =>
                      handleSettingChange('collectUserData', e.target.checked)
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Collect user information
                    </span>
                    <span className='text-xs text-gray-500'>
                      Request name and email before taking the test
                    </span>
                  </div>
                </label>

                <label className='flex items-start space-x-2 text-xs group cursor-pointer p-1 rounded-md hover:bg-gray-50 transition-colors'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded mt-0.5 accent-blue-600'
                    checked={settings.enableMobile || true}
                    onChange={(e) =>
                      handleSettingChange('enableMobile', e.target.checked)
                    }
                  />
                  <div>
                    <span className='font-medium text-gray-700 block mb-0.5'>
                      Enable mobile access
                    </span>
                    <span className='text-xs text-gray-500'>
                      Allow students to take the test on mobile devices
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer with actions */}
      <div className='bg-gray-100 p-3 border-t border-gray-200'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <button
            onClick={onGenerateLink}
            className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center ${
              settings.generateLink
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors shadow-sm`}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className='h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2'
              />
            ) : (
              <LinkIcon className='h-4 w-4 mr-1.5' />
            )}
            <span>
              {settings.generateLink
                ? 'Regenerate Link'
                : 'Generate Shareable Link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InteractiveTestOptions
