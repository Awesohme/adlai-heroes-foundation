'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Testimonial } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import WYSIWYGEditor from "@/components/wysiwyg-editor"

interface TestimonialFormProps {
  testimonial?: Testimonial
  onSave: () => void
  onCancel: () => void
}

export default function TestimonialForm({ testimonial, onSave, onCancel }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    content: testimonial?.content || '',
    image: testimonial?.image || '',
    location: testimonial?.location || '',
    featured: testimonial?.featured || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = testimonial ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} testimonial...`)
      
      if (testimonial) {
        await adminApi.updateTestimonial(testimonial.id, formData)
        toast.success('Testimonial Updated Successfully!', {
          description: `Testimonial from "${formData.name}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createTestimonial(formData)
        toast.success('Testimonial Created Successfully!', {
          description: `New testimonial from "${formData.name}" has been added`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Failed to Save Testimonial', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter person's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Lagos, Nigeria"
            />
          </div>

          <WYSIWYGEditor
            label="Testimonial Content *"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write the testimonial content..."
            minHeight="200px"
            required
          />

          <ImageUpload
            currentImageUrl={formData.image}
            onImageChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
            label="Profile Photo"
            folder="testimonials/"
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Feature this testimonial on homepage</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (testimonial ? 'Update Testimonial' : 'Create Testimonial')}
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