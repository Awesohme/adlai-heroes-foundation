'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabaseApi, type ImpactStat } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { TrendingUpIcon, UsersIcon, HeartIcon, BookOpenIcon, HomeIcon, StarIcon, TargetIcon, AwardIcon } from "lucide-react"
import { toast } from "sonner"

interface ImpactStatFormProps {
  stat?: ImpactStat
  onSave: () => void
  onCancel: () => void
}

const iconOptions = [
  { value: 'trending-up', label: 'Trending Up', icon: TrendingUpIcon },
  { value: 'users', label: 'Users', icon: UsersIcon },
  { value: 'heart', label: 'Heart', icon: HeartIcon },
  { value: 'book-open', label: 'Book Open', icon: BookOpenIcon },
  { value: 'home', label: 'Home', icon: HomeIcon },
  { value: 'star', label: 'Star', icon: StarIcon },
  { value: 'target', label: 'Target', icon: TargetIcon },
  { value: 'award', label: 'Award', icon: AwardIcon }
]

export default function ImpactStatForm({ stat, onSave, onCancel }: ImpactStatFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: stat?.title || '',
    value: stat?.value || '',
    description: stat?.description || '',
    icon: stat?.icon || 'users',
    order_index: stat?.order_index || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = stat ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} impact statistic...`)
      
      if (stat) {
        await adminApi.updateImpactStat(stat.id, formData)
        toast.success('Impact Statistic Updated Successfully!', {
          description: `"${formData.title}" has been updated with value "${formData.value}"`,
          duration: 4000
        })
      } else {
        await adminApi.createImpactStat(formData)
        toast.success('Impact Statistic Created Successfully!', {
          description: `"${formData.title}" has been added with value "${formData.value}"`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving impact stat:', error)
      toast.error('Failed to Save Impact Statistic', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{stat ? 'Edit Impact Statistic' : 'Add New Impact Statistic'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Children Helped"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value *</Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., 1,000+ or 50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this statistic"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select 
              value={formData.icon} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Display Order</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
            />
            <p className="text-sm text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (stat ? 'Update Statistic' : 'Create Statistic')}
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