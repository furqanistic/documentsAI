import {
  BookOpen,
  Briefcase,
  File,
  FileText,
  Monitor,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useRef, useState } from 'react'

export default function NewTemplateForm({ isOpen = true, onClose = () => {} }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Academic',
    documentType: 'exam',
    uploadedFile: null,
  })

  const fileInputRef = useRef(null)

  // Original order for desktop (4 columns)
  const documentTypesDesktop = [
    { value: 'exam', label: 'Exam/Test', icon: BookOpen },
    { value: 'quiz', label: 'Quiz', icon: Zap },
    { value: 'study-guide', label: 'Study Guide', icon: FileText },
    { value: 'interview', label: 'Interview Questions', icon: Users },
    { value: 'proposal', label: 'Project Proposal', icon: Briefcase },
    { value: 'report', label: 'Business Report', icon: TrendingUp },
    { value: 'presentation', label: 'Presentation', icon: Monitor },
    { value: 'other', label: 'Other', icon: File },
  ]

  // Reordered for mobile (2 columns)
  const documentTypesMobile = [
    { value: 'exam', label: 'Exam/Test', icon: BookOpen },
    { value: 'report', label: 'Business Report', icon: TrendingUp },
    { value: 'quiz', label: 'Quiz', icon: Zap },
    { value: 'proposal', label: 'Project Proposal', icon: Briefcase },
    { value: 'study-guide', label: 'Study Guide', icon: FileText },
    { value: 'presentation', label: 'Presentation', icon: Monitor },
    { value: 'interview', label: 'Interview Questions', icon: Users },
    { value: 'other', label: 'Other', icon: File },
  ]

  const templateTypes = [
    {
      value: 'Academic',
      label: 'Academic',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      value: 'Education',
      label: 'Education',
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      value: 'Professional',
      label: 'Professional',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      value: 'Business',
      label: 'Business',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      value: 'Recruitment',
      label: 'Recruitment',
      color: 'bg-rose-100 text-rose-700',
    },
    { value: 'Other', label: 'Other', color: 'bg-sky-100 text-sky-700' },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setFormData((prev) => ({ ...prev, uploadedFile: file }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, uploadedFile: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Saving template with data:', formData)
    setFormData({
      title: '',
      description: '',
      type: 'Education',
      documentType: 'exam',
      uploadedFile: null,
    })
    onClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Education',
      documentType: 'exam',
      uploadedFile: null,
    })
    onClose()
  }

  const renderDocumentTypeButton = (type) => {
    const IconComponent = type.icon
    return (
      <button
        key={type.value}
        type='button'
        className={`p-3 border rounded-lg text-center transition-all hover:scale-105 ${
          formData.documentType === type.value
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-gray-300 text-gray-700'
        }`}
        onClick={() => handleInputChange('documentType', type.value)}
      >
        <IconComponent size={20} className='mx-auto mb-1' />
        <div className='text-xs font-medium'>{type.label}</div>
      </button>
    )
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className='bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-sm sm:max-w-2xl max-h-screen sm:max-h-[95vh] flex flex-col border border-gray-200 mx-1 sm:mx-0 overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white'>
          <div className='flex items-center gap-3'>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-gray-900'>
                Create New Template
              </h2>
              <p className='text-xs text-gray-600'>
                Build your custom document template
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='space-y-6'>
            <div>
              <label className='block text-lg font-bold text-black mb-2'>
                Template Title
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder='e.g., "Physics Final Exam" or "Marketing Strategy Report"'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm'
              />
            </div>

            <div>
              <label className='block text-lg font-bold text-black mb-3'>
                Document Type
              </label>

              {/* Mobile Grid (2 columns) */}
              <div className='grid grid-cols-2 gap-2 sm:hidden'>
                {documentTypesMobile.map(renderDocumentTypeButton)}
              </div>

              {/* Desktop Grid (4 columns) */}
              <div className='hidden sm:grid sm:grid-cols-4 gap-2'>
                {documentTypesDesktop.map(renderDocumentTypeButton)}
              </div>
            </div>

            <div>
              <label className='block text-lg font-bold text-black mb-3'>
                Category
              </label>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {templateTypes.map((type) => (
                  <button
                    key={type.value}
                    type='button'
                    className={`p-2 rounded-lg text-center transition-all hover:scale-105 ${
                      formData.type === type.value
                        ? 'ring-2 ring-blue-500 ' + type.color
                        : type.color + ' opacity-60 hover:opacity-80'
                    }`}
                    onClick={() => handleInputChange('type', type.value)}
                  >
                    <div className='text-sm font-medium'>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className='mb-5'>
              <div className='flex items-center justify-between mb-3'>
                <label className='block text-lg font-bold text-black'>
                  Upload a File (Optional)
                </label>
              </div>
              <div
                className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors'
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className='hidden'
                  accept='.pdf,.docx,.doc,.txt,.rtf'
                />
                <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                  <div className='bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center text-black'>
                    <Upload className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-sm md:text-base font-medium mb-1'>
                      {formData.uploadedFile
                        ? formData.uploadedFile.name
                        : 'Drag & drop or click to browse'}
                    </h3>
                    <p className='text-xs sm:text-sm text-gray-500'>
                      {formData.uploadedFile
                        ? `${(formData.uploadedFile.size / 1024).toFixed(1)} KB`
                        : 'Supports PDF, DOC, DOCX, TXT files (Max 10MB)'}
                    </p>
                  </div>
                  {formData.uploadedFile && (
                    <button
                      className='text-xs text-gray-500 hover:text-black border border-gray-200 rounded px-2 py-1'
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData((prev) => ({ ...prev, uploadedFile: null }))
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className='block text-lg font-bold text-black mb-2'>
                Detailed Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder='Describe what you want to create. Be specific about topics, format, and requirements.'
                rows={4}
                className='h-35 md:h-40 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none text-xs md:text-sm placeholder:text-xs md:placeholder:text-sm'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row justify-end items-center p-4 sm:p-6 border-t border-gray-200 bg-gray-50 gap-3'>
          <div className='flex gap-3 order-1'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors hover:scale-105'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className='px-6 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all flex items-center gap-2 hover:scale-105'
            >
              <FileText size={16} />
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
