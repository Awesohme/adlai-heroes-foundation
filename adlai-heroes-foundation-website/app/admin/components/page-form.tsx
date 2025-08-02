'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabaseApi, type Page } from "@/lib/supabase"
import { toast } from "sonner"
import ImageUpload from "./image-upload"

interface PageFormProps {
  page?: Page
  onSave: () => void
  onCancel: () => void
}

export default function PageForm({ page, onSave, onCancel }: PageFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    published: page?.published ?? true,
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    meta_keywords: page?.meta_keywords || '',
    og_image: page?.og_image || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!page) return

    setLoading(true)

    try {
      toast.loading('Updating page...')
      
      await supabaseApi.updatePage(page.id, formData)
      toast.success('Page Updated Successfully!', {
        description: `"${formData.title}" page has been updated with new content`,
        duration: 4000
      })
      onSave()
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to Update Page', {
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
        <CardTitle>Edit Page: {page?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter page title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-url-slug"
                  disabled={page?.page_key === 'home'}
                />
                <p className="text-sm text-gray-500">
                  {page?.page_key === 'home' ? 'Homepage URL cannot be changed' : `This will be the URL: /${formData.slug}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Page Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Brief description of this page"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Page is published</Label>
              </div>
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

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">SEO Preview</h4>
                <div className="space-y-1">
                  <div className="text-blue-600 text-lg">{formData.meta_title || formData.title}</div>
                  <div className="text-green-700 text-sm">
                    adlaiheroesfoundation.org{formData.slug === '/' ? '' : `/${formData.slug}`}
                  </div>
                  <div className="text-gray-600 text-sm">{formData.meta_description}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Update Page'}
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