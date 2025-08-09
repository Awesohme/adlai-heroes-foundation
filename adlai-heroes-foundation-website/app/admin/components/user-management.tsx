'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, EditIcon, TrashIcon, UserIcon, ShieldIcon } from 'lucide-react'
import { toast } from 'sonner'

interface AdminUser {
  id: number
  email: string
  role: string
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

interface UserManagementProps {
  onClose: () => void
}

const AVAILABLE_PERMISSIONS = [
  { key: 'programs', label: 'Programs', description: 'Manage programs and initiatives' },
  { key: 'impact_stats', label: 'Impact Stats', description: 'Manage impact statistics' },
  { key: 'testimonials', label: 'Testimonials', description: 'Manage testimonials' },
  { key: 'blog_posts', label: 'Blog Posts', description: 'Manage blog posts and articles' },
  { key: 'board_members', label: 'Board Members', description: 'Manage board member profiles' },
  { key: 'content_sections', label: 'Content Sections', description: 'Manage page content sections' },
  { key: 'pages', label: 'Pages', description: 'Manage static pages' },
  { key: 'hero_slides', label: 'Hero Slides', description: 'Manage homepage hero slides' },
  { key: 'partners', label: 'Partners', description: 'Manage partner organizations' },
  { key: 'timeline', label: 'Timeline', description: 'Manage impact timeline' },
  { key: 'site_settings', label: 'Site Settings', description: 'Manage site configuration and settings' },
  { key: 'user_management', label: 'User Management', description: 'Manage admin users and permissions' }
]

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to all features' },
  { value: 'admin', label: 'Admin', description: 'Access to most features' },
  { value: 'editor', label: 'Editor', description: 'Content creation and editing' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
]

export default function UserManagement({ onClose }: UserManagementProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'editor',
    permissions: [] as string[]
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        throw new Error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || (!editingUser && !formData.password)) {
      toast.error('Email and password are required')
      return
    }

    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingUser ? 'User updated successfully!' : 'User created successfully!')
        setShowUserForm(false)
        setEditingUser(null)
        setFormData({ email: '', password: '', role: 'editor', permissions: [] })
        loadUsers()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save user')
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      permissions: user.permissions
    })
    setShowUserForm(true)
  }

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully!')
        loadUsers()
      } else {
        throw new Error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: role === 'super_admin' ? ['all'] : prev.permissions.filter(p => p !== 'all')
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage admin users and their permissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? 'Edit User' : 'Create New User'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password {editingUser && '(leave blank to keep current)'}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        required={!editingUser}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{role.label}</span>
                              <span className="text-xs text-gray-500">{role.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.role !== 'super_admin' && (
                    <div className="space-y-4">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                        {AVAILABLE_PERMISSIONS.map(permission => (
                          <div key={permission.key} className="flex items-start space-x-3">
                            <Checkbox
                              id={permission.key}
                              checked={formData.permissions.includes(permission.key)}
                              onCheckedChange={() => handlePermissionToggle(permission.key)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={permission.key}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {permission.label}
                              </Label>
                              <p className="text-xs text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowUserForm(false)
                        setEditingUser(null)
                        setFormData({ email: '', password: '', role: 'editor', permissions: [] })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingUser ? 'Update User' : 'Create User'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found. Create your first admin user.
                </div>
              ) : (
                users.map(user => (
                  <Card key={user.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{user.email}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                                <ShieldIcon className="h-3 w-3 mr-1" />
                                {user.role.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <EditIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <TrashIcon className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.email}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {user.permissions.length > 0 && user.role !== 'super_admin' && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.permissions.map(permission => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {AVAILABLE_PERMISSIONS.find(p => p.key === permission)?.label || permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}