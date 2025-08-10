'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Testimonial } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import WYSIWYGEditor from "@/components/wysiwyg-editor"

interface TestimonialFormProps {
  testimonial?: Testimonial
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

type FormData = {
  name: string
  content: string
  location: string
  featured: boolean
}

export default function TestimonialForm({ testimonial, onSave, onCancel, open = true }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    name: '',
    content: '',
    location: '',
    featured: false
  }
  
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (testimonial) reset(testimonial); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, testimonial?.id, reset])

  const onSubmit = async (formData: FormData) => {
    setLoading(true)

    try {
      const action = testimonial ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} testimonial...`)
      
      if (testimonial) {
        await adminApi.updateTestimonial(testimonial.id, formData)
        toast.success('Testimonial Updated Successfully!', {
          description: `Testimonial from "${formData.name}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createTestimonial(formData)
        toast.success('Testimonial Created Successfully!', {
          description: `New testimonial from "${formData.name}" has been added`,
          duration: 4000
        })
        reset(DEFAULTS)
      }
      onSave()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Failed to Save Testimonial', {
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
        <CardTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Enter person's name"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="location"
                  placeholder="e.g., Lagos, Nigeria"
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
                label="Testimonial Content *"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write the testimonial content..."
                minHeight="200px"
                required
              />
            )}
          />

          <div className="flex items-center space-x-2">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Switch
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
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