'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Program } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import WYSIWYGEditor from "@/components/wysiwyg-editor"
import GalleryManager from "./gallery-manager"

interface ProgramFormProps {
  program?: Program
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

type FormData = {
  title: string
  slug: string
  description: string
  content: string
  featured_image: string
  gallery_images: string[]
  category: 'education' | 'health' | 'empowerment' | 'community'
  published: boolean
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_image: string
}

export default function ProgramForm({ program, onSave, onCancel, open = true }: ProgramFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    title: '',
    slug: '',
    description: '',
    content: '',
    featured_image: '',
    gallery_images: [],
    category: 'education',
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
    if (program) reset(program); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, program?.id, reset])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (formData: FormData) => {
    console.log('🚀 Form submission started')
    console.log('📝 Form data:', formData)
    console.log('🏷️ Program ID:', program?.id)
    console.log('🔍 Full program object:', program)
    
    setLoading(true)

    try {
      const action = program ? 'updating' : 'creating'
      console.log(`🔄 ${action} program...`)
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} program...`)
      
      if (program) {
        console.log('📤 Sending update to API:', { id: program.id, data: formData })
        try {
          const result = await adminApi.updateProgram(program.id, formData)
          console.log('✅ Update result:', result)
        } catch (updateError: any) {
          console.error('💥 API update error details:', updateError)
          console.error('💥 Error message:', updateError?.message)
          throw updateError
        }
        toast.success('Program Updated Successfully!', {
          description: `"${formData.title}" has been updated in the ${formData.category} category`,
          duration: 4000
        })
      } else {
        console.log('📤 Sending create to API:', formData)
        const result = await adminApi.createProgram(formData as any)
        console.log('✅ Create result:', result)
        toast.success('Program Created Successfully!', {
          description: `"${formData.title}" has been added to the ${formData.category} category`,
          duration: 4000
        })
        reset(DEFAULTS)
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Program Title *</Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Enter program title"
                  onChange={(e) => {
                    const title = e.target.value
                    field.onChange(title)
                    if (title && !program) {
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
                  placeholder="program-url-slug"
                />
              )}
            />
            <p className="text-sm text-gray-500">This will be used in the URL: /programs/{watch('slug')}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Brief description for program cards and previews"
                  rows={3}
                />
              )}
            />
          </div>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <WYSIWYGEditor
                label="Full Content"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write the full program description and details..."
                minHeight="300px"
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
                <Label htmlFor="published">Publish this program</Label>
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
                        label="Program Gallery"
                        maxImages={5}
                        folder="programs/"
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