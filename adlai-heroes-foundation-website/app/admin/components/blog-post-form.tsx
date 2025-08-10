'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import AuthorCombobox from "./author-combobox"

interface BlogPostFormProps {
  post?: BlogPost
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

type FormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  gallery_images: string[]
  author: string
  published: boolean
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_image: string
}

export default function BlogPostForm({ post, onSave, onCancel, open = true }: BlogPostFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    gallery_images: [],
    author: 'Adlai Heroes Team',
    published: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: ''
  }
  
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (post) reset(post); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, post?.id, reset])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (formData: FormData) => {
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
        reset(DEFAULTS)
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder="Enter blog post title"
                      onChange={(e) => {
                        const title = e.target.value
                        field.onChange(title)
                        if (title && !post) {
                          const slug = generateSlug(title)
                          setValue('slug', slug)
                          if (!watch('meta_title')) {
                            setValue('meta_title', title)
                          }
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Controller
                  name="slug"
                  control={control}
                  rules={{ required: "URL slug is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="slug"
                      placeholder="blog-post-url-slug"
                    />
                  )}
                />
                <p className="text-sm text-gray-500">This will be used in the URL: /blog/{watch('slug')}</p>
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <AuthorCombobox
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or create author..."
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Controller
                  name="excerpt"
                  control={control}
                  rules={{ required: "Excerpt is required" }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="excerpt"
                      placeholder="Brief summary for blog previews"
                      rows={3}
                    />
                  )}
                />
              </div>

              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <WYSIWYGEditor
                    label="Full Content *"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write the full blog post content..."
                    minHeight="400px"
                    required
                  />
                )}
              />

              <Controller
                name="featured_image"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    currentImageUrl={field.value}
                    onImageChange={field.onChange}
                    label="Featured Image"
                    folder="blog/"
                  />
                )}
              />

              <div className="flex items-center space-x-2">
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="published"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="published">Publish this post</Label>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <Controller
                name="gallery_images"
                control={control}
                render={({ field: galleryField }) => (
                  <Controller
                    name="featured_image"
                    control={control}
                    render={({ field: featuredField }) => (
                      <GalleryManager
                        images={galleryField.value}
                        featuredImage={featuredField.value}
                        onImagesChange={galleryField.onChange}
                        onFeaturedImageChange={featuredField.onChange}
                        label="Blog Post Gallery"
                        maxImages={5}
                        folder="blog/"
                      />
                    )}
                  />
                )}
              />
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Controller
                  name="meta_title"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        id="meta_title"
                        placeholder="SEO title for search engines"
                        maxLength={60}
                      />
                      <p className="text-sm text-gray-500">{field.value.length}/60 characters</p>
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Controller
                  name="meta_description"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Textarea
                        {...field}
                        id="meta_description"
                        placeholder="Description for search engine results"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-sm text-gray-500">{field.value.length}/160 characters</p>
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Controller
                  name="meta_keywords"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="meta_keywords"
                      placeholder="Comma-separated keywords"
                    />
                  )}
                />
              </div>

              <Controller
                name="og_image"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    currentImageUrl={field.value}
                    onImageChange={field.onChange}
                    label="Open Graph Image (Social Media)"
                    folder="og/"
                  />
                )}
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