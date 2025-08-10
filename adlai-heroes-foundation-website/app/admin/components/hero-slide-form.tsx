'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import OrderInput from "./order-input"

interface HeroSlideFormProps {
  slide?: HeroSlide
  existingSlides?: HeroSlide[]
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

const DEFAULTS = {
  title: '',
  subtitle: '',
  image_url: '',
  button_text: '',
  button_link: '',
  button_text_2: '',
  button_link_2: '',
  order_index: 0,
  active: true
}

export default function HeroSlideForm({ slide, existingSlides = [], onSave, onCancel, open }: HeroSlideFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const { control, handleSubmit, reset } = useForm({ 
    defaultValues: DEFAULTS 
  })

  // Reset form only once per dialog open or when slide ID changes
  useEffect(() => {
    if (!open) { 
      initialised.current = false
      return
    }
    if (initialised.current) return

    if (slide) {
      reset({
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        image_url: slide.image_url || '',
        button_text: slide.button_text || '',
        button_link: slide.button_link || '',
        button_text_2: slide.button_text_2 || '',
        button_link_2: slide.button_link_2 || '',
        order_index: slide.order_index || 0,
        active: slide.active ?? true
      })
    } else {
      reset(DEFAULTS)
    }

    initialised.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, slide?.id, reset])

  const onSubmit = async (formData: typeof DEFAULTS) => {
    setLoading(true)

    try {
      const action = slide ? 'updating' : 'creating'
      console.log(`🚀 Attempting to ${action} hero slide:`, formData)
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} hero slide...`)
      
      if (slide) {
        console.log('📝 Updating existing hero slide with ID:', slide.id)
        await adminApi.updateHeroSlide(slide.id, formData)
        toast.success('Hero Slide Updated Successfully!', {
          description: `"${formData.title}" has been updated`,
          duration: 4000
        })
      } else {
        console.log('➕ Creating new hero slide')
        const result = await adminApi.createHeroSlide(formData)
        console.log('✅ Hero slide created successfully:', result)
        toast.success('Hero Slide Created Successfully!', {
          description: `"${formData.title}" has been added`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('💥 Hero slide submission error:', error)
      
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          formData: formData
        })
      }
      
      let errorMessage = 'An unexpected error occurred. Please try again.'
      if (error instanceof Error) {
        if (error.message.includes('Failed to create hero slide')) {
          errorMessage = 'Could not create hero slide. Please check your data and try again.'
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'A hero slide with similar details already exists.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error('Failed to Save Hero Slide', {
        description: errorMessage,
        duration: 8000
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="e.g., Empowering Futures, One Child at a Time"
                  required
                  {...field}
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
                <Textarea
                  id="subtitle"
                  placeholder="Brief description or call to action"
                  rows={3}
                  {...field}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Background Image *</Label>
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  currentImageUrl={field.value}
                  onImageChange={field.onChange}
                  label="Background Image"
                  folder="hero-slides/"
                />
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Call-to-Action Buttons (1-2 buttons)</h3>
            
            {/* First Button (Required) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text">Button 1 Text *</Label>
                <Controller
                  name="button_text"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      id="button_text"
                      placeholder="e.g., Donate Now"
                      required
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link">Button 1 Link *</Label>
                <Controller
                  name="button_link"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      id="button_link"
                      placeholder="e.g., /donate"
                      required
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            {/* Second Button (Optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button_text_2">Button 2 Text (Optional)</Label>
                <Controller
                  name="button_text_2"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="button_text_2"
                      placeholder="e.g., Learn More"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button_link_2">Button 2 Link (Optional)</Label>
                <Controller
                  name="button_link_2"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="button_link_2"
                      placeholder="e.g., /about"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Controller
            name="order_index"
            control={control}
            render={({ field }) => (
              <OrderInput
                value={field.value}
                onChange={field.onChange}
                existingItems={existingSlides.map(s => ({
                  id: s.id,
                  title: s.title,
                  order_index: s.order_index
                }))}
                currentItemId={slide?.id}
                label="Display Order"
                className="space-y-2"
              />
            )}
          />

          <div className="flex items-center space-x-2">
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