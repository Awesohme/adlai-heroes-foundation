'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseApi, type Testimonial } from "@/lib/supabase"
import ImageUpload from "./image-upload"

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
      if (testimonial) {
        await supabaseApi.updateTestimonial(testimonial.id, formData)
      } else {
        await supabaseApi.createTestimonial(formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Error saving testimonial. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
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

          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the testimonial text"
              rows={6}
              required
            />
          </div>

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