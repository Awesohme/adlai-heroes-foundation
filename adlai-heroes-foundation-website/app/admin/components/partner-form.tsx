'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
  open?: boolean
}

type FormData = {
  name: string
  logo_url: string
  website_url: string
  order_index: number
  active: boolean
}

export default function PartnerForm({ partner, existingPartners = [], onSave, onCancel, open = true }: PartnerFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    name: '',
    logo_url: '',
    website_url: '',
    order_index: 0,
    active: true
  }
  
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (partner) reset(partner); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, partner?.id, reset])

  const onSubmit = async (formData: FormData) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Partner Name *</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Partner name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="e.g., Microsoft Foundation"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo *</Label>
            <Controller
              name="logo_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  currentImageUrl={field.value}
                  onImageChange={field.onChange}
                  label="Partner Logo"
                  folder="partners/"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Controller
              name="website_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="website_url"
                  type="url"
                  placeholder="https://example.com"
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
                existingItems={existingPartners.map(p => ({
                  id: p.id,
                  title: p.name,
                  order_index: p.order_index
                }))}
                label="Display Order"
                currentItemId={partner?.id}
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