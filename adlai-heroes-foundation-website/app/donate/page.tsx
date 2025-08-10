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
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center mb-16 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src="/images/headers/donate-bg.jpg"
          alt="Donation background"
          fill
          className="absolute inset-0 z-0 object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 via-blue-900/40 to-purple-900/50 z-10"></div>
        <div className="relative z-20 max-w-4xl px-6">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <span className="text-4xl">💖</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Support Our Cause
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Your generosity creates lasting change in children's lives
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
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
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 border-0 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-12 translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BanknoteIcon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Bank Transfer</CardTitle>
                  </div>
                  <CardContent className="p-0 text-gray-700 space-y-4 w-full">
                    {settings.bank_name && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                        <div className="flex-1">
                          <strong className="text-gray-800 block">Bank Name:</strong>
                          <div className="text-gray-700">{settings.bank_name}</div>
                        </div>
                        <CopyButton text={settings.bank_name} fieldName="Bank Name" />
                      </div>
                    )}
                    {settings.account_name && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                        <div className="flex-1">
                          <strong className="text-gray-800 block">Account Name:</strong>
                          <div className="text-gray-700">{settings.account_name}</div>
                        </div>
                        <CopyButton text={settings.account_name} fieldName="Account Name" />
                      </div>
                    )}
                    {settings.account_number && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                        <div className="flex-1">
                          <strong className="text-gray-800 block">Account Number:</strong>
                          <div className="text-gray-700 font-mono">{settings.account_number}</div>
                        </div>
                        <CopyButton text={settings.account_number} fieldName="Account Number" />
                      </div>
                    )}
                    <div className="mt-6 p-3 bg-green-100/50 rounded-lg">
                      <p className="text-sm text-green-800 flex items-center gap-2">
                        <span>💡</span> Please use your name as the reference for bank transfers.
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}
            
            {/* QR Code Card - Only show if QR code exists */}
            {hasQRCode && (
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 border-0 group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 -translate-x-16"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <QrCodeIcon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-6">Scan to Donate</CardTitle>
                  <CardContent className="p-0 text-gray-700 space-y-4">
                    <div className="p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                      <Image
                        src={settings.payment_qr_code}
                        alt="QR Code for Bank Transfer"
                        width={200}
                        height={200}
                        className="rounded-lg mx-auto shadow-md"
                      />
                    </div>
                    <div className="p-3 bg-blue-100/50 rounded-lg">
                      <p className="text-sm text-blue-800 flex items-center gap-2">
                        <span>📱</span> Scan this QR code with your banking app to make a quick transfer.
                      </p>
                    </div>
                  </CardContent>
                </div>
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
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-12 text-center shadow-2xl max-w-3xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-orange-500/20 animate-pulse"></div>
          <div className="relative z-10">
            <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Prefer Online Payments?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
              You can also donate securely through our online payment partners with just a few clicks.
            </p>
            <Button asChild className="bg-white text-black hover:bg-gray-100 hover:text-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-10 py-4 text-xl font-semibold rounded-full">
              <Link href={settings.donate_button_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-black">
                <span>🚀</span> Donate Online <span>→</span>
              </Link>
            </Button>
          </div>
          <div className="absolute top-6 right-6 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-6 left-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </section>
      )}
    </div>
  )
}