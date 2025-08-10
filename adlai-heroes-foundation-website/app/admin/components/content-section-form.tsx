'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ContentSection } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import OrderInput from "./order-input"

interface ContentSectionFormProps {
  section?: ContentSection
  existingSections?: ContentSection[]
  onSave: () => void
  onCancel: () => void
}

const pageOptions = [
  { value: 'home', label: 'Homepage' },
  { value: 'about', label: 'About Page' },
  { value: 'programs', label: 'Programs Page' },
  { value: 'volunteer', label: 'Volunteer Page' },
  { value: 'donate', label: 'Donate Page' },
  { value: 'contact', label: 'Contact Page' },
  { value: 'global', label: 'Global (All Pages)' }
]

export default function ContentSectionForm({ section, existingSections = [], onSave, onCancel }: ContentSectionFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    section_key: section?.section_key || '',
    page_key: section?.page_key || 'home',
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    content: section?.content || '',
    image_url: section?.image_url || '',
    button_text: section?.button_text || '',
    button_link: section?.button_link || '',
    order_index: section?.order_index || 0,
    active: section?.active ?? true
  })

  const generateSectionKey = (title: string, pageKey: string) => {
    const baseKey = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .trim()
    return `${pageKey}_${baseKey}`
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      section_key: prev.section_key || generateSectionKey(title, prev.page_key)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = section ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} content section...`)
      
      if (section) {
        await adminApi.updateContentSection(section.id, formData)
        toast.success('Content Section Updated Successfully!', {
          description: `"${formData.title || formData.section_key}" on ${formData.page_key} page has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createContentSection(formData)
        toast.success('Content Section Created Successfully!', {
          description: `"${formData.title || formData.section_key}" has been added to ${formData.page_key} page`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving content section:', error)
      toast.error('Failed to Save Content Section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{section ? 'Edit Content Section' : 'Add New Content Section'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page_key">Page *</Label>
              <Select 
                value={formData.page_key} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, page_key: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {pageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section_key">Section Key *</Label>
              <Input
                id="section_key"
                value={formData.section_key}
                onChange={(e) => setFormData(prev => ({ ...prev, section_key: e.target.value }))}
                placeholder="unique_section_identifier"
                required
              />
              <p className="text-sm text-gray-500">Unique identifier for this section</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Main heading for this section"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Subheading or tagline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Main content text for this section"
              rows={6}
            />
          </div>

          <ImageUpload
            currentImageUrl={formData.image_url}
            onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            label="Section Image"
            folder="sections/"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_text">Button Text</Label>
              <Input
                id="button_text"
                value={formData.button_text}
                onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                placeholder="e.g., Learn More"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button_link">Button Link</Label>
              <Input
                id="button_link"
                value={formData.button_link}
                onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                placeholder="e.g., /about or #section"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OrderInput
              value={formData.order_index}
              onChange={(value) => setFormData(prev => ({ ...prev, order_index: value }))}
              existingItems={existingSections.map(s => ({
                id: s.id,
                title: `${s.title} (${s.page_key})`,
                order_index: s.order_index
              }))}
              label="Display Order"
              currentItemId={section?.id}
              className="space-y-2"
            />

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Section is active</Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (section ? 'Update Section' : 'Create Section')}
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