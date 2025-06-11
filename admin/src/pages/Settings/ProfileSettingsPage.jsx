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
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Import shadcn components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updateProfile } from '@/redux/userSlice' // Updated import path
import { axiosInstance } from '../../config'
import DashboardLayout from '../Layout/DashboardLayout'

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Current Password */}
          <div className='space-y-2'>
            <Label htmlFor='current-password'>Current Password</Label>
            <div className='relative'>
              <Input
                id='current-password'
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder='Enter current password'
                className='pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <Eye className='h-4 w-4' />
                ) : (
                  <EyeOff className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className='space-y-2'>
            <Label htmlFor='new-password'>New Password</Label>
            <div className='relative'>
              <Input
                id='new-password'
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder='Enter new password'
                className='pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <Eye className='h-4 w-4' />
                ) : (
                  <EyeOff className='h-4 w-4' />
                )}
              </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Password must be at least 8 characters long
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={
              !passwordData.currentPassword || !passwordData.newPassword
            }
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Reusable Section Component
const SettingsSection = ({ icon: Icon, title, children, delay = 0 }) => (
  <div
    className='animate-fadeIn'
    style={{ animationDelay: `${delay * 100}ms` }}
  >
    <Card className='shadow-sm hover:shadow-md transition-shadow duration-300'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-3 text-lg'>
          <div className='rounded-lg bg-muted p-2'>
            <Icon className='h-5 w-5 text-muted-foreground' />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </div>
)

// Reusable Form Field Component
const FormField = ({ label, children, description, htmlFor }) => (
  <div className='space-y-2'>
    <Label htmlFor={htmlFor} className='text-sm font-medium'>
      {label}
    </Label>
    {children}
    {description && (
      <p className='text-xs text-muted-foreground'>{description}</p>
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
    <div className='flex items-center justify-between p-3 bg-muted/50 rounded-lg border transition-all duration-200 hover:shadow-sm'>
      <div className='flex items-center gap-3'>
        <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground text-xs'>
          {initials}
        </div>
        <div>
          <p className='text-sm font-medium'>{member.name || member.email}</p>
          <p className='text-xs text-muted-foreground'>{member.email}</p>
        </div>
      </div>
      <Button
        size='sm'
        variant='destructive'
        onClick={() => onRemove(member.id)}
      >
        Delete
      </Button>
    </div>
  )
}

const ProfileSettingsPage = () => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  })

  const [teamMembers, setTeamMembers] = useState([])

  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isAddingMember, setIsAddingMember] = useState(false)

  const [saveStatus, setSaveStatus] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  })

  // Update profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      })
    }
  }, [currentUser])

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    // Try different possible ID fields from Redux user
    const userId = currentUser?.id || currentUser?._id

    if (!userId) {
      console.error('No user ID available. Current user:', currentUser)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 2000)
      return
    }

    setSaveStatus('saving')

    try {
      const response = await axiosInstance.put(
        `/auth/update/${userId}`,
        profileData
      )

      if (response.data) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)

        // Update Redux store with new profile data
        dispatch(
          updateProfile({
            name: profileData.name,
            email: profileData.email,
          })
        )

        console.log('Profile updated successfully:', response.data)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }

  const handlePasswordChange = async () => {
    try {
      const response = await axiosInstance.put(
        '/auth/change-password',
        passwordData
      )

      if (response.data) {
        alert('Password changed successfully!')
        setShowPasswordModal(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      const errorMessage =
        error.response?.data?.message ||
        'Failed to change password. Please try again.'
      alert(errorMessage)
    }
  }

  const handleAddTeamMember = () => {
    if (!newMemberEmail.trim()) return

    const newMember = {
      id: Date.now(),
      name: '',
      email: newMemberEmail.trim(),
    }

    setTeamMembers((prev) => [...prev, newMember])
    setNewMemberEmail('')
    setIsAddingMember(false)
  }

  const handleRemoveTeamMember = (memberId) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))
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
            <h1 className='text-2xl sm:text-3xl font-bold mb-1'>
              Profile Settings
            </h1>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Manage your account settings and preferences.
            </p>
          </div>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <Button
              onClick={handleSaveSettings}
              disabled={saveStatus === 'saving'}
              className='flex-1 sm:flex-none bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
            >
              {saveStatus === 'saving' ? (
                <div className='animate-spin mr-2'>
                  <Settings className='h-4 w-4' />
                </div>
              ) : saveStatus === 'saved' ? (
                <Check className='h-4 w-4 mr-2' />
              ) : saveStatus === 'error' ? (
                <X className='h-4 w-4 mr-2' />
              ) : (
                <Save className='h-4 w-4 mr-2' />
              )}
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'saved'
                ? 'Saved!'
                : saveStatus === 'error'
                ? 'Error!'
                : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className='space-y-6'>
          {/* Profile Information */}
          <SettingsSection icon={User} title='Profile Information' delay={0.1}>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField label='Full Name' htmlFor='full-name'>
                  <Input
                    id='full-name'
                    value={profileData.name}
                    onChange={(e) =>
                      handleProfileUpdate('name', e.target.value)
                    }
                    placeholder='Enter your full name'
                    className='h-10'
                  />
                </FormField>

                <FormField label='Email Address' htmlFor='email'>
                  <Input
                    id='email'
                    type='email'
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileUpdate('email', e.target.value)
                    }
                    placeholder='Enter your email'
                    className='h-10'
                  />
                </FormField>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField label='Password'>
                  <Button
                    variant='outline'
                    className='w-full justify-start h-10'
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </FormField>

                {currentUser?.lastLogin && (
                  <FormField label='Last Login' htmlFor='last-login'>
                    <Input
                      id='last-login'
                      value={
                        new Date(currentUser.lastLogin).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        ) +
                        ' at ' +
                        new Date(currentUser.lastLogin).toLocaleTimeString(
                          'en-US',
                          {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          }
                        )
                      }
                      disabled
                      className='bg-muted cursor-not-allowed h-10'
                    />
                  </FormField>
                )}
              </div>
            </div>
          </SettingsSection>

          {/* Team Management */}
          <SettingsSection icon={Users} title='Team Management' delay={0.2}>
            <div className='space-y-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                  <h3 className='font-medium'>Team Members</h3>
                  <p className='text-sm text-muted-foreground'>
                    Invite team members to collaborate on documents.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  variant='outline'
                  size='sm'
                >
                  {isAddingMember ? (
                    <X className='h-4 w-4 mr-2' />
                  ) : (
                    <Plus className='h-4 w-4 mr-2' />
                  )}
                  {isAddingMember ? 'Cancel' : 'Add Member'}
                </Button>
              </div>

              {/* Add Member Form */}
              {isAddingMember && (
                <Card className='bg-muted/50'>
                  <CardContent className='pt-4'>
                    <div className='space-y-4'>
                      <FormField label='Email Address' htmlFor='member-email'>
                        <Input
                          id='member-email'
                          type='email'
                          placeholder='colleague@company.com'
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className='h-10'
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
                        >
                          Send Invite
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                  <div className='text-center py-8 text-muted-foreground'>
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
