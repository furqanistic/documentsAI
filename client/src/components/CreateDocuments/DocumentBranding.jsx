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

  useEffect(() => {
    if (!metadata.documentDate) {
      handleDateChange(new Date())
    }
    if (!metadata.documentTime) {
      handleTimeChange(new Date())
    }
  }, [])

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
        className='w-full p-3 border border-gray-300 rounded-lg bg-white text-sm' // Removed pl-10 and icon-related padding
        style={{ minWidth: 0, overflow: 'visible' }} // Ensure full text is visible
        placeholder='Select date'
      />
    </div>
  ))

  const CustomTimeInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className='relative w-full'>
      <input
        value={value}
        onClick={onClick}
        readOnly
        ref={ref}
        className='w-full p-3 border border-gray-300 rounded-lg bg-white text-sm' // Removed pl-10 and icon-related padding
        style={{ minWidth: 0, overflow: 'visible' }} // Ensure full text is visible
        placeholder='Select time'
      />
    </div>
  ))

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
                    Drag and drop or click to browse
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
              placeholder='Enter organization name'
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
                dateFormat='MMM d, yyyy' // Changed from 'MMMM d, yyyy' to 'MMM d, yyyy'
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
              placeholder='Any additional information to include in the header (e.g., department, course code)'
              className='w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none resize-none text-sm bg-white'
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default DocumentBranding
