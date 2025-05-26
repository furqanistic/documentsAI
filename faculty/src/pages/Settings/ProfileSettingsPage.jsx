import {
  Check,
  Eye,
  EyeOff,
  Plus,
  Save,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'

// Simple UI components
const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline:
      'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800',
    ghost:
      'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800',
  }
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-semibold text-lg ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>{children}</div>
)

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none ${className}`}
    {...props}
  />
)

const Label = ({ children, className = '' }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
)

// Password Modal Component
const PasswordModal = ({
  isOpen,
  onClose,
  passwordData,
  setPasswordData,
  onSave,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 transition-opacity duration-300'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100'>
        {/* Header */}
        <div className='flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Change Password
          </h2>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          {/* Current Password */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Current Password
            </Label>
            <div className='relative'>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className='bg-white dark:bg-gray-800 pr-10'
                placeholder='Enter current password'
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showCurrentPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              New Password
            </Label>
            <div className='relative'>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className='bg-white dark:bg-gray-800 pr-10'
                placeholder='Enter new password'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showNewPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Password must be at least 8 characters long
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              !passwordData.currentPassword || !passwordData.newPassword
            }
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}

// Reusable Section Component
const SettingsSection = ({ icon: Icon, title, children, delay = 0 }) => (
  <div
    className='animate-fadeIn'
    style={{ animationDelay: `${delay * 100}ms` }}
  >
    <Card className='border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white'>
          <div className='rounded-lg bg-gray-100 dark:bg-gray-800 p-2'>
            <Icon className='h-5 w-5 text-gray-600 dark:text-gray-400' />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
)

// Reusable Form Field Component
const FormField = ({ label, children, description }) => (
  <div className='space-y-2'>
    <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
      {label}
    </Label>
    {children}
    {description && (
      <p className='text-xs text-gray-500 dark:text-gray-400'>{description}</p>
    )}
  </div>
)

// Team Member Component
const TeamMember = ({ member, onRemove }) => {
  const initials = member.name
    ? member.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : member.email.charAt(0).toUpperCase()

  return (
    <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm'>
      <div className='flex items-center gap-3'>
        <div className='h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-medium text-gray-600 dark:text-gray-300 text-xs'>
          {initials}
        </div>
        <div>
          <p className='text-sm font-medium text-gray-900 dark:text-white'>
            {member.name || member.email}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {member.email}
          </p>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => onRemove(member.id)}
          className='text-red-500 bg-red-50 hover:bg-red-100 '
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

const ProfileSettingsPage = () => {
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@calani.com',
    avatar: '',
  })

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      avatar: '',
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      email: 'mike.r@company.com',
      avatar: '',
    },
  ])

  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  })

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTeamMember = () => {
    if (!newMemberEmail.trim()) return

    const newMember = {
      id: Date.now(),
      name: '',
      email: newMemberEmail.trim(),
      avatar: '',
    }

    setTeamMembers((prev) => [...prev, newMember])
    setNewMemberEmail('')
    setIsAddingMember(false)
  }

  const handleRemoveTeamMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  const handleSaveSettings = () => {
    setSaveStatus('saving')
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 2000)
    }, 1000)
  }

  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log('Changing password...', passwordData)
    alert('Password changed successfully!')
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
    })
  }

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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className='max-w-7xl mx-auto'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-3'>
          <div className='w-full sm:w-auto text-center sm:text-left'>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1'>
              Profile Settings
            </h1>
            <p className='text-gray-500 dark:text-gray-400 text-sm sm:text-base'>
              Manage your account settings and team access
            </p>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className='flex-1 sm:flex-none px-4 py-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg font-medium flex items-center transition-all duration-200 justify-center hover:scale-105 active:scale-95 disabled:opacity-50'
            >
              {saveStatus === 'saving' ? (
                <div className='animate-spin mr-2'>
                  <Settings className='h-4 w-4' />
                </div>
              ) : saveStatus === 'saved' ? (
                <Check className='h-4 w-4 mr-2' />
              ) : (
                <Save className='h-4 w-4 mr-2' />
              )}
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                ? 'Saved!'
                : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className='space-y-6'>
          {/* Profile Information */}
          <SettingsSection icon={User} title='Profile Information' delay={0.1}>
            <div className='space-y-6'>
              {/* Form Fields */}
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField label='Full Name'>
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        handleProfileUpdate('name', e.target.value)
                      }
                      className='bg-white dark:bg-gray-900'
                    />
                  </FormField>

                  <FormField label='Email Address'>
                    <Input
                      type='email'
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileUpdate('email', e.target.value)
                      }
                      className='bg-white dark:bg-gray-900'
                    />
                  </FormField>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField label='Password'>
                    <Button
                      variant='outline'
                      className='w-full justify-start h-10 bg-white dark:bg-gray-900'
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </Button>
                  </FormField>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Team Management */}
          <SettingsSection icon={Users} title='Team Management' delay={0.2}>
            <div className='space-y-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Team Members
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Invite team members to collaborate on documents
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  {isAddingMember ? (
                    <X className='h-4 w-4' />
                  ) : (
                    <Plus className='h-4 w-4' />
                  )}
                  {isAddingMember ? 'Cancel' : 'Add Member'}
                </Button>
              </div>

              {/* Add Member Form */}
              {isAddingMember && (
                <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300'>
                  <div className='space-y-4'>
                    <FormField label='Email Address'>
                      <Input
                        type='email'
                        placeholder='colleague@company.com'
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className='bg-white dark:bg-gray-900'
                      />
                    </FormField>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddingMember(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        onClick={handleAddTeamMember}
                        disabled={!newMemberEmail.trim()}
                        className='bg-gray-900 hover:bg-gray-800 text-white'
                      >
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Members List */}
              <div className='space-y-3'>
                {teamMembers.map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    onRemove={handleRemoveTeamMember}
                  />
                ))}
                {teamMembers.length === 0 && (
                  <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                    <Users className='h-12 w-12 mx-auto mb-3 opacity-50' />
                    <p>No team members yet. Invite someone to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        onSave={handlePasswordChange}
      />
    </DashboardLayout>
  )
}

export default ProfileSettingsPage
