'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
  open?: boolean
}

type FormData = {
  section_key: string
  page_key: string
  title: string
  subtitle: string
  content: string
  image_url: string
  button_text: string
  button_link: string
  order_index: number
  active: boolean
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

export default function ContentSectionForm({ section, existingSections = [], onSave, onCancel, open = true }: ContentSectionFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    section_key: '',
    page_key: 'home',
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    button_text: '',
    button_link: '',
    order_index: 0,
    active: true
  }
  
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({ defaultValues: DEFAULTS })
  
  // Watch title and page_key to generate section_key
  const watchedTitle = watch('title')
  const watchedPageKey = watch('page_key')

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (section) reset(section); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, section?.id, reset])

  const generateSectionKey = (title: string, pageKey: string) => {
    const baseKey = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '_')
      .replace(/-+/g, '_')
      .trim()
    return `${pageKey}_${baseKey}`
  }

  const onSubmit = async (formData: FormData) => {
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
        reset(DEFAULTS)
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page_key">Page *</Label>
              <Controller
                name="page_key"
                control={control}
                rules={{ required: "Page is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section_key">Section Key *</Label>
              <Controller
                name="section_key"
                control={control}
                rules={{ required: "Section key is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="section_key"
                    placeholder="unique_section_identifier"
                  />
                )}
              />
              <p className="text-sm text-gray-500">Unique identifier for this section</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Main heading for this section"
                  onChange={(e) => {
                    const title = e.target.value
                    field.onChange(title)
                    if (title && !section && !watch('section_key')) {
                      const currentPageKey = watch('page_key')
                      const newSectionKey = generateSectionKey(title, currentPageKey)
                      setValue('section_key', newSectionKey)
                    }
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Controller
              name="subtitle"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="subtitle"
                  placeholder="Subheading or tagline"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="content"
                  placeholder="Main content text for this section"
                  rows={6}
                />
              )}
            />
          </div>

          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageUpload
                currentImageUrl={field.value}
                onImageChange={field.onChange}
                label="Section Image"
                folder="sections/"
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_text">Button Text</Label>
              <Controller
                name="button_text"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="button_text"
                    placeholder="e.g., Learn More"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button_link">Button Link</Label>
              <Controller
                name="button_link"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="button_link"
                    placeholder="e.g., /about or #section"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="order_index"
              control={control}
              render={({ field }) => (
                <OrderInput
                  value={field.value}
                  onChange={field.onChange}
                  existingItems={existingSections.map(s => ({
                    id: s.id,
                    title: `${s.title} (${s.page_key})`,
                    order_index: s.order_index
                  }))}
                  label="Display Order"
                  currentItemId={section?.id}
                  className="space-y-2"
                />
              )}
            />

            <div className="flex items-center space-x-2 pt-6">
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
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