'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { adminApi } from "@/lib/admin-api"
import ImageUpload from "./image-upload"
import type { TeamMember } from "@/lib/supabase"

interface TeamMemberFormProps {
  member?: TeamMember
  onSave: () => void
  onCancel: () => void
}

export default function TeamMemberForm({ member, onSave, onCancel }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
    email: member?.email || '',
    linkedin_url: member?.linkedin_url || '',
    order_index: member?.order_index || 0,
    active: member?.active ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = member ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} team member...`)
      
      if (member) {
        await adminApi.updateTeamMember(member.id, formData)
        toast.success('Team Member Updated Successfully!', {
          description: `"${formData.name}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createTeamMember(formData)
        toast.success('Team Member Added Successfully!', {
          description: `"${formData.name}" has been added to the team`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving team member:', error)
      toast.error('Failed to Save Team Member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="e.g., Program Director"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Brief biography and role description..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              label="Profile Image"
              placeholder="Upload or enter profile image URL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g., john@adlaiheroesfoundation.com.ng"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Display Order</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
            />
            <p className="text-sm text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Active (visible on website)</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}