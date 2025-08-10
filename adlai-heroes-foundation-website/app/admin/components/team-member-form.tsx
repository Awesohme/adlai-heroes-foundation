'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { adminApi } from "@/lib/admin-api"
import ImageUpload from "./image-upload"
import OrderInput from "./order-input"
import type { TeamMember } from "@/lib/supabase"

interface TeamMemberFormProps {
  member?: TeamMember
  existingMembers?: TeamMember[]
  onSave: () => void
  onCancel: () => void
  open?: boolean
}

type FormData = {
  name: string
  position: string
  bio: string
  image_url: string
  email: string
  linkedin_url: string
  order_index: number
  active: boolean
}

export default function TeamMemberForm({ member, existingMembers = [], onSave, onCancel, open = true }: TeamMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const initialised = useRef(false)
  
  const DEFAULTS: FormData = {
    name: '',
    position: '',
    bio: '',
    image_url: '',
    email: '',
    linkedin_url: '',
    order_index: 0,
    active: true
  }
  
  const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: DEFAULTS })

  useEffect(() => {
    if (!open) { initialised.current = false; return; }
    if (initialised.current) return;
    if (member) reset(member); else reset(DEFAULTS);
    initialised.current = true;
  }, [open, member?.id, reset])

  const onSubmit = async (formData: FormData) => {
    setLoading(true)

    try {
      const action = member ? 'updating' : 'creating'
      toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} team member...`)
      
      if (member) {
        await adminApi.updateTeamMember(member.id, formData)
        toast.success('Team Member Updated Successfully!', {
          description: `"${formData.name}" has been updated`,
          duration: 4000
        })
      } else {
        await adminApi.createTeamMember(formData)
        toast.success('Team Member Added Successfully!', {
          description: `"${formData.name}" has been added to the team`,
          duration: 4000
        })
      }
      onSave()
    } catch (error) {
      console.error('Error saving team member:', error)
      toast.error('Failed to Save Team Member', {
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
        <CardTitle>{member ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
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
                  placeholder="e.g., John Doe"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Controller
              name="position"
              control={control}
              rules={{ required: "Position is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="position"
                  placeholder="e.g., Program Director"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Controller
              name="bio"
              control={control}
              rules={{ required: "Bio is required" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="bio"
                  placeholder="Brief biography and role description..."
                  rows={4}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  currentImageUrl={field.value}
                  onImageChange={field.onChange}
                  label="Profile Image"
                  placeholder="Upload or enter profile image URL"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="e.g., john@adlaiheroesfoundation.com.ng"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Controller
                name="linkedin_url"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="linkedin_url"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                  />
                )}
              />
            </div>
          </div>

          <Controller
            name="order_index"
            control={control}
            render={({ field }) => (
              <OrderInput
                value={field.value}
                onChange={field.onChange}
                existingItems={existingMembers.map(m => ({
                  id: m.id,
                  title: `${m.name} (${m.position})`,
                  order_index: m.order_index
                }))}
                label="Display Order"
                currentItemId={member?.id}
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
              {loading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
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