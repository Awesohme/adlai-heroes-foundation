'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type BoardMember } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import WYSIWYGEditor from "@/components/wysiwyg-editor"
import OrderInput from "./order-input"

interface BoardMemberFormProps {
  member?: BoardMember
  existingMembers?: BoardMember[]
  onSave: () => void
  onCancel: () => void
}

export default function BoardMemberForm({ member, existingMembers = [], onSave, onCancel }: BoardMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    image: member?.image || '',
    order_index: member?.order_index || 0
  })

  // Reset form data when member prop changes
  useEffect(() => {
    setFormData({
      name: member?.name || '',
      position: member?.position || '',
      bio: member?.bio || '',
      image: member?.image || '',
      order_index: member?.order_index || 0
    })
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = member ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} board member...`)
      
      if (member) {
        await adminApi.updateBoardMember(member.id, formData)
        toast.success('Board Member Updated Successfully!', {
          description: `${formData.name} (${formData.position}) has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createBoardMember(formData)
        toast.success('Board Member Added Successfully!', {
          description: `${formData.name} (${formData.position}) has been added to the team`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving board member:', error)
      console.error('Form data:', formData)
      toast.error('Failed to Save Board Member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
      
      // Show detailed error for debugging
      if (error instanceof Error && error.message) {
        console.error('Detailed error:', error.message)
        if (error.message.includes('fetch')) {
          toast.error('Network Error', {
            description: 'Please check your internet connection and try again.',
            duration: 6000
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{member ? 'Edit Board Member' : 'Add New Board Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position/Title</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="e.g., Executive Director, Board Chair"
            />
          </div>

          <WYSIWYGEditor
            label="Biography"
            value={formData.bio}
            onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
            placeholder="Write a brief biography and background..."
            minHeight="250px"
          />

          <ImageUpload
            currentImageUrl={formData.image}
            onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            label="Profile Photo"
            folder="team/"
          />

          <OrderInput
            value={formData.order_index}
            onChange={(value) => setFormData(prev => ({ ...prev, order_index: value }))}
            existingItems={existingMembers.map(m => ({
              id: m.id,
              title: `${m.name} (${m.position})`,
              order_index: m.order_index
            }))}
            label="Display Order"
            currentItemId={member?.id}
            className="space-y-2"
          />

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