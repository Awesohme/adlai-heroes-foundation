'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type BlogPost } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import WYSIWYGEditor from "@/components/wysiwyg-editor"
import GalleryManager from "./gallery-manager"

interface BlogPostFormProps {
  post?: BlogPost
  onSave: () => void
  onCancel: () => void
}

export default function BlogPostForm({ post, onSave, onCancel }: BlogPostFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    gallery_images: post?.gallery_images || [],
    author: post?.author || '',
    published: post?.published || false,
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    meta_keywords: post?.meta_keywords || '',
    og_image: post?.og_image || ''
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
    setLoading(true)

    try {
      const action = post ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} blog post...`)
      
      if (post) {
        await adminApi.updateBlogPost(post.id, formData)
        toast.success('Blog Post Updated Successfully!', {
          description: `"${formData.title}" has been updated by ${formData.author || 'Admin'}`,
          duration: 4000
        })
      } else {
        await adminApi.createBlogPost(formData)
        toast.success('Blog Post Created Successfully!', {
          description: `"${formData.title}" has been created by ${formData.author || 'Admin'}`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast.error('Failed to Save Blog Post', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>{post ? 'Edit Blog Post' : 'Add New Blog Post'}</CardTitle>
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
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="blog-post-url-slug"
                  required
                />
                <p className="text-sm text-gray-500">This will be used in the URL: /blog/{formData.slug}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary for blog previews"
                  rows={3}
                  required
                />
              </div>

              <WYSIWYGEditor
                label="Full Content"
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Write the full blog post content..."
                minHeight="400px"
                required
              />

              <ImageUpload
                currentImageUrl={formData.featured_image}
                onImageChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                label="Featured Image"
                folder="blog/"
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publish this post</Label>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <GalleryManager
                images={formData.gallery_images}
                featuredImage={formData.featured_image}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, gallery_images: images }))}
                onFeaturedImageChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                label="Blog Post Gallery"
                maxImages={5}
                folder="blog/"
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
              {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
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