'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseApi, type BoardMember } from "@/lib/supabase"
import { toast } from "sonner"
import ImageUpload from "./image-upload"

interface BoardMemberFormProps {
  member?: BoardMember
  onSave: () => void
  onCancel: () => void
}

export default function BoardMemberForm({ member, onSave, onCancel }: BoardMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    image: member?.image || '',
    order_index: member?.order_index || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = member ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} board member...`)
      
      if (member) {
        await supabaseApi.updateBoardMember(member.id, formData)
        toast.success('Board Member Updated Successfully!', {
          description: `${formData.name} (${formData.position}) has been updated`,
          duration: 4000
        })
      } else {
        await supabaseApi.createBoardMember(formData)
        toast.success('Board Member Added Successfully!', {
          description: `${formData.name} (${formData.position}) has been added to the team`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving board member:', error)
      toast.error('Failed to Save Board Member', {
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

          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Brief biography and background"
              rows={6}
            />
          </div>

          <ImageUpload
            currentImageUrl={formData.image}
            onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            label="Profile Photo"
            folder="team/"
          />

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
            <p className="text-sm text-gray-500">Lower numbers appear first on the team page</p>
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