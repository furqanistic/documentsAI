import { motion } from 'framer-motion'
import {
  Building,
  Calendar,
  Clock,
  HelpCircle,
  Image,
  Upload,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DocumentBranding = ({
  metadata,
  onMetadataChange,
  enabled,
  onToggleEnabled,
}) => {
  const logoInputRef = useRef(null)
  const [previewLogo, setPreviewLogo] = useState(null)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const timeInputRef = useRef(null)

  useEffect(() => {
    if (!metadata.documentDate) {
      handleDateChange(new Date())
    }
    if (!metadata.documentTime) {
      handleTimeChange(new Date())
    }
  }, [])

  // Format time for display
  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      onMetadataChange({ ...metadata, logo: file })
      const reader = new FileReader()
      reader.onload = (e) => setPreviewLogo(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onMetadataChange({ ...metadata, [name]: value })
  }

  const handleDateChange = (date) => {
    onMetadataChange({ ...metadata, documentDate: date })
  }

  const handleTimeChange = (time) => {
    onMetadataChange({ ...metadata, documentTime: time })
  }

  const handleRemoveLogo = (e) => {
    e.stopPropagation()
    onMetadataChange({ ...metadata, logo: null })
    setPreviewLogo(null)
  }

  // Parse time string and convert to Date object
  const parseTime = (timeString) => {
    const time = timeString.trim()
    const result = new Date()

    // Try to parse various time formats
    const timeRegex12Hr = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/
    const timeRegex24Hr = /^(\d{1,2}):(\d{2})$/

    let match = time.match(timeRegex12Hr)
    if (match) {
      let hours = parseInt(match[1])
      const minutes = parseInt(match[2])
      const meridiem = match[3].toUpperCase()

      if (meridiem === 'PM' && hours !== 12) {
        hours += 12
      } else if (meridiem === 'AM' && hours === 12) {
        hours = 0
      }

      result.setHours(hours, minutes, 0, 0)
      return result
    }

    match = time.match(timeRegex24Hr)
    if (match) {
      const hours = parseInt(match[1])
      const minutes = parseInt(match[2])

      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        result.setHours(hours, minutes, 0, 0)
        return result
      }
    }

    return null
  }

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className='relative w-full'>
      <input
        value={value}
        onClick={onClick}
        readOnly
        ref={ref}
        placeholder='Enter Date'
        className='w-full p-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none'
        style={{ minWidth: 0, overflow: 'visible' }}
      />
      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
        <Calendar className='h-4 w-4 text-gray-400' />
      </div>
    </div>
  ))

  const CustomTimeInput = React.forwardRef(({ value, onClick }, ref) => {
    // Use local state for the input value to prevent focus loss
    const [localValue, setLocalValue] = useState(
      formatTime(metadata.documentTime)
    )

    // Update local value when metadata changes from picker
    useEffect(() => {
      if (metadata.documentTime && !timeInputRef.current?.matches(':focus')) {
        setLocalValue(formatTime(metadata.documentTime))
      }
    }, [metadata.documentTime])

    return (
      <div className='relative w-full'>
        <input
          ref={(el) => {
            timeInputRef.current = el
            if (ref) {
              if (typeof ref === 'function') ref(el)
              else ref.current = el
            }
          }}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={(e) => {
            const parsedTime = parseTime(e.target.value)
            if (parsedTime) {
              handleTimeChange(parsedTime)
            } else {
              // Reset to previous valid time if parsing fails
              setLocalValue(formatTime(metadata.documentTime))
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }}
          onClick={(e) => {
            // Only open picker if clicking on an empty area or if already focused
            if (e.target.selectionStart === e.target.selectionEnd) {
              onClick(e)
            }
          }}
          className='w-full p-3 border border-gray-300 rounded-lg bg-white text-sm'
          style={{ minWidth: 0, overflow: 'visible' }}
          placeholder='Type time (e.g., 3:30 PM)'
        />
      </div>
    )
  })

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={itemVariant}
      className='mt-6 border-t border-gray-200 pt-6'
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <h3 className='text-base font-medium text-gray-800'>
            Document Branding
          </h3>
          <div className='ml-2 relative group'>
            <HelpCircle className='h-4 w-4 text-gray-400 cursor-help' />
            <div className='absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10'>
              Add your organization's branding to the document. This will appear
              at the top of your generated document.
            </div>
          </div>
        </div>
        <div className='bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-1 flex items-center'>
          <button
            onClick={() => onToggleEnabled(false)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !enabled ? 'bg-white text-blue-800 shadow' : 'text-white'
            }`}
          >
            Off
          </button>
          <button
            onClick={() => onToggleEnabled(true)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              enabled ? 'bg-white text-blue-800 shadow' : 'text-white'
            }`}
          >
            On
          </button>
        </div>
      </div>

      {enabled && (
        <div className='space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Organization Logo
            </label>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors bg-white'
              onClick={() => logoInputRef.current.click()}
            >
              <input
                type='file'
                ref={logoInputRef}
                onChange={handleLogoUpload}
                className='hidden'
                accept='image/*'
              />
              {previewLogo ? (
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <img
                      src={previewLogo}
                      alt='Logo preview'
                      className='h-12 w-auto object-contain mr-3'
                    />
                    <div>
                      <p className='text-sm font-medium'>Logo uploaded</p>
                      <p className='text-xs text-gray-500'>Click to change</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className='p-1 bg-gray-100 rounded-full hover:bg-gray-200'
                  >
                    <X className='h-4 w-4 text-gray-600' />
                  </button>
                </div>
              ) : (
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-gray-100 rounded-full p-3 mb-2'>
                    <Image className='h-6 w-6 text-gray-500' />
                  </div>
                  <p className='text-sm font-medium text-gray-700'>
                    Upload your organization logo
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    Drag & drop or click to browse
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Organization Name
            </label>
            <input
              type='text'
              name='orgName'
              value={metadata.orgName || ''}
              onChange={handleInputChange}
              placeholder='Enter Organization'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none text-sm bg-white'
            />
          </div>

          <div className='grid grid-cols-2 gap-4 w-full'>
            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Date
              </label>
              <DatePicker
                selected={metadata.documentDate}
                onChange={handleDateChange}
                customInput={<CustomDateInput />}
                dateFormat='MMM d, yyyy'
                calendarClassName='bg-white shadow-lg rounded-lg border border-gray-200'
                wrapperClassName='w-full'
              />
            </div>
            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Time
              </label>
              <DatePicker
                selected={metadata.documentTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                customInput={<CustomTimeInput />}
                calendarClassName='bg-white shadow-lg rounded-lg border border-gray-200'
                wrapperClassName='w-full'
                onOpen={() => setIsTimePickerOpen(true)}
                onClose={() => setIsTimePickerOpen(false)}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Additional Information
            </label>
            <textarea
              name='additionalInfo'
              value={metadata.additionalInfo || ''}
              onChange={handleInputChange}
              placeholder='Any additional information to include in the header (department, course code, etc.)'
              className='w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none text-sm bg-white'
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default DocumentBranding
