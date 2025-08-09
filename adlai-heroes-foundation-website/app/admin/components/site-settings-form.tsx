'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { type SiteSettings } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ImageUpload from "./image-upload"
import { PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, LinkIcon, Share2Icon } from "lucide-react"

interface SiteSettingsFormProps {
  onSave: () => void
  onCancel: () => void
}

export default function SiteSettingsForm({ onSave, onCancel }: SiteSettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [settings, setSettings] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setInitialLoading(true)
      const allSettings = await adminApi.getSiteSettings()
      
      const settingsMap: { [key: string]: string } = {}
      allSettings.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value || ''
      })
      
      setSettings(settingsMap)
    } catch (error) {
      console.error('Error loading site settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      toast.loading('Updating site settings...')
      
      const updates = Object.entries(settings).map(([setting_key, setting_value]) => ({
        setting_key,
        setting_value
      }))

      await adminApi.updateSiteSettings(updates)
      
      toast.success('Site Settings Updated Successfully!', {
        description: 'Contact details, payment info, and social links have been updated',
        duration: 4000
      })
      
      onSave()
    } catch (error) {
      console.error('Error updating site settings:', error)
      toast.error('Failed to Update Settings', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        duration: 6000
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading site settings...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2Icon className="h-6 w-6" />
          Site Settings & Contact Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Manage contact details, social media links, and payment information displayed on your website
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="payment">Payment Details</TabsTrigger>
              <TabsTrigger value="links">Action Links</TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    Contact Email *
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="admin@adlaiheroesfoundation.com.ng"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    Contact Phone
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={settings.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+234 708 306 0892"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Contact Address
                </Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ''}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  placeholder="Physical address or location"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ''}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Brief description of your foundation"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={settings.facebook_url || ''}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/your-page"
                  />
                  <p className="text-xs text-gray-500">Leave empty to hide Facebook link on website</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter/X URL</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={settings.twitter_url || ''}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/your-handle"
                  />
                  <p className="text-xs text-gray-500">Leave empty to hide Twitter link on website</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={settings.instagram_url || ''}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/your-handle"
                  />
                  <p className="text-xs text-gray-500">Leave empty to hide Instagram link on website</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={settings.linkedin_url || ''}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/company/your-company"
                  />
                  <p className="text-xs text-gray-500">Leave empty to hide LinkedIn link on website</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    type="url"
                    value={settings.youtube_url || ''}
                    onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/@your-channel"
                  />
                  <p className="text-xs text-gray-500">Leave empty to hide YouTube link on website</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Social media links will only appear on your website if you provide URLs. 
                  Empty fields will be automatically hidden from visitors.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name" className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4" />
                    Bank Name
                  </Label>
                  <Input
                    id="bank_name"
                    value={settings.bank_name || ''}
                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                    placeholder="e.g., First Bank Nigeria"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    value={settings.account_number || ''}
                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  value={settings.account_name || ''}
                  onChange={(e) => handleInputChange('account_name', e.target.value)}
                  placeholder="Adlai Heroes Foundation"
                />
              </div>

              <ImageUpload
                currentImageUrl={settings.payment_qr_code || ''}
                onImageChange={(url) => handleInputChange('payment_qr_code', url)}
                label="Payment QR Code"
                folder="payments/"
              />

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>💳 Payment Info:</strong> This information will be displayed on donation pages 
                  to help supporters make direct bank transfers.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="donate_button_url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Donate Button URL
                  </Label>
                  <Input
                    id="donate_button_url"
                    type="url"
                    value={settings.donate_button_url || ''}
                    onChange={(e) => handleInputChange('donate_button_url', e.target.value)}
                    placeholder="/donate"
                  />
                  <p className="text-xs text-gray-500">Where the main donate button should link to</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volunteer_button_url">Volunteer Button URL</Label>
                  <Input
                    id="volunteer_button_url"
                    type="url"
                    value={settings.volunteer_button_url || ''}
                    onChange={(e) => handleInputChange('volunteer_button_url', e.target.value)}
                    placeholder="/volunteer"
                  />
                  <p className="text-xs text-gray-500">Where the volunteer signup button should link to</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>🔗 Action Links:</strong> These URLs control where your main call-to-action buttons 
                  redirect visitors. Use relative paths (like /donate) for internal pages or full URLs for external services.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Settings'}
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