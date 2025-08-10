'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { type ImpactTimeline } from '@/lib/supabase'
import { toast } from 'sonner'
import OrderInput from './order-input'

interface ImpactTimelineFormProps {
  timeline?: ImpactTimeline
  existingItems?: ImpactTimeline[]
  onSubmit: (data: Omit<ImpactTimeline, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel?: () => void
  open?: boolean
}

type FormData = {
  year: number
  title: string
  description: string
  order_index: number
  active: boolean
}

export function ImpactTimelineForm({ timeline, existingItems = [], onSubmit, onCancel, open = true }: ImpactTimelineFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    year: new Date().getFullYear(),
    title: '',
    description: '',
    order_index: 0,
    active: true
  }
  
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (timeline) {
      reset({
        year: timeline.year || new Date().getFullYear(),
        title: timeline.title || '',
        description: timeline.description || '',
        order_index: timeline.order_index || 0,
        active: timeline.active ?? true
      });
    } else {
      reset(DEFAULTS);
    }
    initialised.current = true;
  }, [open, timeline?.id, reset])

  const onSubmitHandler = async (formData: FormData) => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      toast.success(`Timeline item ${timeline ? 'updated' : 'created'} successfully!`)
      if (!timeline) {
        // Reset form for new items
        reset(DEFAULTS)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(`Failed to ${timeline ? 'update' : 'create'} timeline item`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-gradient-primary">
          {timeline ? 'Edit Timeline Item' : 'Create New Timeline Item'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Controller
              name="year"
              control={control}
              rules={{ required: "Year is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="year"
                  type="number"
                  min="1950"
                  max="2100"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                />
              )}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="e.g., Foundation Established"
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Describe what happened in this year..."
                  rows={3}
                />
              )}
            />
          </div>

          <Controller
            name="order_index"
            control={control}
            render={({ field }) => (
              <OrderInput
                value={field.value}
                onChange={field.onChange}
                existingItems={existingItems.map(item => ({
                  id: item.id,
                  title: `${item.year} - ${item.title}`,
                  order_index: item.order_index
                }))}
                label="Display Order"
                currentItemId={timeline?.id}
                className="space-y-2"
              />
            )}
          />

          {/* Active Toggle */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-adlaiBlue text-white hover:bg-adlaiBlue/90"
            >
              {isSubmitting ? 'Saving...' : (timeline ? 'Update Timeline Item' : 'Create Timeline Item')}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}