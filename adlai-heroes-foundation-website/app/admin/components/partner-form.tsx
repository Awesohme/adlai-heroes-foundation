'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { type Partner } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import OrderInput from "./order-input"

interface PartnerFormProps {
  partner?: Partner
  existingPartners?: Partner[]
  onSave: () => void
  onCancel: () => void
}

export default function PartnerForm({ partner, existingPartners = [], onSave, onCancel }: PartnerFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    logo_url: partner?.logo_url || '',
    website_url: partner?.website_url || '',
    order_index: partner?.order_index || 0,
    active: partner?.active ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = partner ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} partner...`)
      
      if (partner) {
        await adminApi.updatePartner(partner.id, formData)
        toast.success('Partner Updated Successfully!', {
          description: `"${formData.name}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createPartner(formData)
        toast.success('Partner Created Successfully!', {
          description: `"${formData.name}" has been added`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving partner:', error)
      toast.error('Failed to Save Partner', {
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
        <CardTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Partner Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Microsoft Foundation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo *</Label>
            <ImageUpload
              currentImageUrl={formData.logo_url}
              onImageChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
              label="Partner Logo"
              folder="partners/"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <OrderInput
            value={formData.order_index}
            onChange={(value) => setFormData(prev => ({ ...prev, order_index: value }))}
            existingItems={existingPartners.map(p => ({
              id: p.id,
              title: p.name,
              order_index: p.order_index
            }))}
            label="Display Order"
            currentItemId={partner?.id}
            className="space-y-2"
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
            />
            <Label htmlFor="active">Active (visible on website)</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : (partner ? 'Update Partner' : 'Create Partner')}
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