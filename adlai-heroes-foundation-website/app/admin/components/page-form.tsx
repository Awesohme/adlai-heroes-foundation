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
import { supabaseApi, type Page } from "@/lib/supabase"
import { toast } from "sonner"
import ImageUpload from "./image-upload"

interface PageFormProps {
  page?: Page
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

type FormData = {
  title: string
  slug: string
  content: string
  published: boolean
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_image: string
}

export default function PageForm({ page, onSave, onCancel, open = true }: PageFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    title: '',
    slug: '',
    content: '',
    published: true,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_image: ''
  }
  
  const { control, handleSubmit, reset, watch } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (page) reset(page); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, page?.id, reset])

  const onSubmit = async (formData: FormData) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder="Enter page title"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="slug"
                      placeholder="page-url-slug"
                      disabled={page?.page_key === 'home'}
                    />
                  )}
                />
                <p className="text-sm text-gray-500">
                  {page?.page_key === 'home' ? 'Homepage URL cannot be changed' : `This will be the URL: /${watch('slug')}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Page Content</Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="content"
                      placeholder="Brief description of this page"
                      rows={4}
                    />
                  )}
                />
              </div>

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
                <Label htmlFor="published">Page is published</Label>
              </div>
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

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">SEO Preview</h4>
                <div className="space-y-1">
                  <div className="text-blue-600 text-lg">{watch('meta_title') || watch('title')}</div>
                  <div className="text-green-700 text-sm">
                    adlaiheroesfoundation.org{watch('slug') === '/' ? '' : `/${watch('slug')}`}
                  </div>
                  <div className="text-gray-600 text-sm">{watch('meta_description')}</div>
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