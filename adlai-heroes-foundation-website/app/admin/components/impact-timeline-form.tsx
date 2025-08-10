'use client'

import { useState } from 'react'
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
}

export function ImpactTimelineForm({ timeline, existingItems = [], onSubmit, onCancel }: ImpactTimelineFormProps) {
  const [formData, setFormData] = useState({
    year: timeline?.year || new Date().getFullYear(),
    title: timeline?.title || '',
    description: timeline?.description || '',
    order_index: timeline?.order_index || 0,
    active: timeline?.active ?? true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
        setFormData({
          year: new Date().getFullYear(),
          title: '',
          description: '',
          order_index: 0,
          active: true
        })
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year */}
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              type="number"
              min="1950"
              max="2100"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Foundation Established"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happened in this year..."
              rows={3}
              required
            />
          </div>

          <OrderInput
            value={formData.order_index}
            onChange={(value) => setFormData({ ...formData, order_index: value })}
            existingItems={existingItems.map(item => ({
              id: item.id,
              title: `${item.year} - ${item.title}`,
              order_index: item.order_index
            }))}
            label="Display Order"
            currentItemId={timeline?.id}
            className="space-y-2"
          />

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
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