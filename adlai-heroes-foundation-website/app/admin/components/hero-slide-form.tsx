'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { type HeroSlide } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"

interface HeroSlideFormProps {
  slide?: HeroSlide
  onSave: () => void
  onCancel: () => void
}

export default function HeroSlideForm({ slide, onSave, onCancel }: HeroSlideFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image_url: slide?.image_url || '',
    button_text: slide?.button_text || '',
    button_link: slide?.button_link || '',
    button_text_2: slide?.button_text_2 || '',
    button_link_2: slide?.button_link_2 || '',
    order_index: slide?.order_index || 0,
    active: slide?.active ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = slide ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} hero slide...`)
      
      if (slide) {
        await adminApi.updateHeroSlide(slide.id, formData)
        toast.success('Hero Slide Updated Successfully!', {
          description: `"${formData.title}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createHeroSlide(formData)
        toast.success('Hero Slide Created Successfully!', {
          description: `"${formData.title}" has been added`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving hero slide:', error)
      toast.error('Failed to Save Hero Slide', {
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
        <CardTitle>{slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Empowering Futures, One Child at a Time"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Brief description or call to action"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Background Image *</Label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              placeholder="Upload or enter background image URL"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Call-to-Action Buttons (1-2 buttons)</h3>
            
            {/* First Button (Required) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Button 1 Text *</Label>
                <Input
                  id="button_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                  placeholder="e.g., Donate Now"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link">Button 1 Link *</Label>
                <Input
                  id="button_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                  placeholder="e.g., /donate"
                  required
                />
              </div>
            </div>

            {/* Second Button (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text_2">Button 2 Text (Optional)</Label>
                <Input
                  id="button_text_2"
                  value={formData.button_text_2}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_text_2: e.target.value }))}
                  placeholder="e.g., Learn More"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link_2">Button 2 Link (Optional)</Label>
                <Input
                  id="button_link_2"
                  value={formData.button_link_2}
                  onChange={(e) => setFormData(prev => ({ ...prev, button_link_2: e.target.value }))}
                  placeholder="e.g., /about"
                />
              </div>
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
              {loading ? 'Saving...' : (slide ? 'Update Slide' : 'Create Slide')}
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