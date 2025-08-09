'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BanknoteIcon, QrCodeIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"
import { toast } from "sonner"

export default function DonatePage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const allSettings = await supabaseApi.getSiteSettings() as SiteSettings[]
      const settingsMap: { [key: string]: string } = {}
      allSettings.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value || ''
      })
      setSettings(settingsMap)
    } catch (error) {
      console.error('Error loading site settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} copied to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const CopyButton = ({ text, fieldName }: { text: string, fieldName: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, fieldName)}
      className="ml-2 p-1 h-6 w-6"
    >
      {copiedField === fieldName ? (
        <CheckIcon className="h-3 w-3 text-green-600" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </Button>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-12"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const hasPaymentInfo = settings.bank_name || settings.account_number || settings.account_name
  const hasQRCode = settings.payment_qr_code
  const hasDonateUrl = settings.donate_button_url

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Donation background"
          fill
          className="absolute inset-0 z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Support Our Cause</h1>
      </section>

      {/* Donation Information */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Your Contribution Changes Lives</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Every donation, no matter how small, directly impacts our ability to provide education, healthcare, and
          support to underprivileged children. Your generosity helps us build a brighter future for those who need it
          most.
        </p>
        
        {(hasPaymentInfo || hasQRCode) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Bank Transfer Card - Only show if payment info exists */}
            {hasPaymentInfo && (
              <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
                <BanknoteIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Bank Transfer</CardTitle>
                <CardContent className="p-0 text-gray-900 space-y-2">
                  {settings.bank_name && (
                    <p className="flex items-center justify-center">
                      <strong>Bank Name:</strong> 
                      <span className="ml-2">{settings.bank_name}</span>
                      <CopyButton text={settings.bank_name} fieldName="Bank Name" />
                    </p>
                  )}
                  {settings.account_name && (
                    <p className="flex items-center justify-center">
                      <strong>Account Name:</strong> 
                      <span className="ml-2">{settings.account_name}</span>
                      <CopyButton text={settings.account_name} fieldName="Account Name" />
                    </p>
                  )}
                  {settings.account_number && (
                    <p className="flex items-center justify-center">
                      <strong>Account Number:</strong> 
                      <span className="ml-2">{settings.account_number}</span>
                      <CopyButton text={settings.account_number} fieldName="Account Number" />
                    </p>
                  )}
                  <p className="text-sm italic mt-4">Please use your name as the reference for bank transfers.</p>
                </CardContent>
              </Card>
            )}
            
            {/* QR Code Card - Only show if QR code exists */}
            {hasQRCode && (
              <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
                <QrCodeIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Scan to Donate</CardTitle>
                <CardContent className="p-0 text-gray-900 space-y-2">
                  <Image
                    src={settings.payment_qr_code}
                    alt="QR Code for Bank Transfer"
                    width={200}
                    height={200}
                    className="mb-4 rounded-md mx-auto"
                  />
                  <p className="text-sm italic">Scan this QR code with your banking app to make a quick transfer.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* If no payment info at all, show default message */}
        {!hasPaymentInfo && !hasQRCode && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="text-yellow-800">
              Donation methods are being set up. Please contact us directly for donation information.
            </p>
          </div>
        )}
      </section>

      {/* External Payment Gateway CTA - Only show if donate URL exists */}
      {hasDonateUrl && (
        <Card variant="glass" className="text-center p-10 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gradient-primary mb-6">Prefer Online Payments?</h2>
          <p className="text-lg text-gray-900 mb-8">You can also donate securely through our online payment partners.</p>
          <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 px-8 py-3 text-lg">
            <Link href={settings.donate_button_url} target="_blank" rel="noopener noreferrer">
              Donate Online
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}