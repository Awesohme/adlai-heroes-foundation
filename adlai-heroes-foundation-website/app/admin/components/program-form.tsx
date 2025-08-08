'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabaseApi, type Program } from "@/lib/supabase"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import WYSIWYGEditor from "@/components/wysiwyg-editor"
import GalleryManager from "./gallery-manager"

interface ProgramFormProps {
  program?: Program
  onSave: () => void
  onCancel: () => void
}

export default function ProgramForm({ program, onSave, onCancel }: ProgramFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: program?.title || '',
    slug: program?.slug || '',
    description: program?.description || '',
    content: program?.content || '',
    featured_image: program?.featured_image || '',
    gallery_images: program?.gallery_images || [],
    category: program?.category || 'education' as 'education' | 'health' | 'empowerment' | 'community',
    published: program?.published || false,
    meta_title: program?.meta_title || '',
    meta_description: program?.meta_description || '',
    meta_keywords: program?.meta_keywords || '',
    og_image: program?.og_image || ''
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: prev.meta_title || title
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Form submission started')
    console.log('📝 Form data:', formData)
    console.log('🏷️ Program ID:', program?.id)
    
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.slug.trim()) {
      toast.error('URL slug is required')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }
    
    setLoading(true)

    try {
      const action = program ? 'updating' : 'creating'
      console.log(`🔄 ${action} program...`)
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} program...`)
      
      if (program) {
        console.log('📤 Sending update to Supabase:', { id: program.id, data: formData })
        const result = await supabaseApi.updateProgram(program.id, formData)
        console.log('✅ Update result:', result)
        toast.success('Program Updated Successfully!', {
          description: `"${formData.title}" has been updated in the ${formData.category} category`,
          duration: 4000
        })
      } else {
        console.log('📤 Sending create to Supabase:', formData)
        const result = await supabaseApi.createProgram(formData)
        console.log('✅ Create result:', result)
        toast.success('Program Created Successfully!', {
          description: `"${formData.title}" has been added to the ${formData.category} category`,
          duration: 4000
        })
      }
      console.log('🎉 Operation completed, calling onSave()')
      onSave()
    } catch (error) {
      console.error('❌ Error saving program:', error)
      toast.error('Failed to Save Program', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      console.log('🏁 Finally block - setting loading to false')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>{program ? 'Edit Program' : 'Add New Program'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Program Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter program title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="program-url-slug"
              required
            />
            <p className="text-sm text-gray-500">This will be used in the URL: /programs/{formData.slug}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="empowerment">Empowerment</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description for program cards and previews"
              rows={3}
              required
            />
          </div>

          <WYSIWYGEditor
            label="Full Content"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            placeholder="Write the full program description and details..."
            minHeight="300px"
          />

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publish this program</Label>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <GalleryManager
                images={formData.gallery_images}
                featuredImage={formData.featured_image}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, gallery_images: images }))}
                onFeaturedImageChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                label="Program Gallery"
                maxImages={5}
                folder="programs/"
              />
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title for search engines"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500">{formData.meta_title.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Description for search engine results"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500">{formData.meta_description.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="Comma-separated keywords"
                />
              </div>

              <ImageUpload
                currentImageUrl={formData.og_image}
                onImageChange={(url) => setFormData(prev => ({ ...prev, og_image: url }))}
                label="Open Graph Image (Social Media)"
                folder="og/"
              />
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (program ? 'Update Program' : 'Create Program')}
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