'use client'

import Image from "next/image"
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"

export default function ContactPage() {
  const [settings, setSettings] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center text-center mb-16 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src="/images/headers/contact-bg.jpg"
          alt="Contact us background"
          fill
          className="absolute inset-0 z-0 object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-pink-900/50 z-10"></div>
        <div className="relative z-20 max-w-4xl px-6">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <span className="text-4xl">📞</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Contact Information */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Details */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                <MailIcon className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Get In Touch</h2>
            </div>
            <div className="space-y-6">
              <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/50 transition-all duration-300 hover:shadow-md">
                <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <PhoneIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <Link 
                    href={`tel:${settings.contact_phone || '+2347083060892'}`}
                    className="text-lg text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {settings.contact_phone || '+234 708 306 0892'}
                  </Link>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/50 transition-all duration-300 hover:shadow-md">
                <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <MailIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <Link 
                    href={`mailto:${settings.contact_email || 'admin@adlaiheroesfoundation.com.ng'}`}
                    className="text-lg text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {settings.contact_email || 'admin@adlaiheroesfoundation.com.ng'}
                  </Link>
                </div>
              </div>
              
              <div className="group flex items-start gap-4 p-4 rounded-lg hover:bg-white/50 transition-all duration-300 hover:shadow-md">
                <div className="p-3 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <MapPinIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Address</p>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {settings.contact_address || 'Flat 1a, No. 28, Alhaji Isiakanda street, Ilasamaja, Lagos State'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media & CTA */}
        <div className="space-y-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                  <span className="text-lg">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Connect With Us</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Follow us on social media to stay updated on our latest activities and impact stories.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {settings.facebook_url && (
                  <Link 
                    href={settings.facebook_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
                  >
                    <FacebookIcon className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-700">Facebook</span>
                  </Link>
                )}
                {settings.instagram_url && (
                  <Link 
                    href={settings.instagram_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-pink-50 hover:shadow-md transition-all duration-300 group"
                  >
                    <InstagramIcon className="h-5 w-5 text-pink-600 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-700">Instagram</span>
                  </Link>
                )}
                {settings.twitter_url && (
                  <Link 
                    href={settings.twitter_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-gray-50 hover:shadow-md transition-all duration-300 group"
                  >
                    <svg className="h-5 w-5 text-black group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="font-medium text-gray-700">Twitter</span>
                  </Link>
                )}
                {settings.linkedin_url && (
                  <Link 
                    href={settings.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group"
                  >
                    <LinkedinIcon className="h-5 w-5 text-blue-700 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-700">LinkedIn</span>
                  </Link>
                )}
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-8 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-red-500/20 to-pink-500/20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <span className="text-2xl">💌</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                Ready to Make a Difference?
              </h3>
              <p className="text-white/90 mb-6 drop-shadow">
                Join our mission and help us create lasting change in children's lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {settings.donate_button_url && (
                  <Button asChild className="bg-white text-black hover:bg-gray-100 hover:text-black shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-6 py-3">
                    <Link href={settings.donate_button_url} className="flex items-center gap-2 text-black">
                      <span>💖</span> Donate Now
                    </Link>
                  </Button>
                )}
                {settings.volunteer_button_url && (
                  <Button asChild variant="outline" className="border-2 border-white bg-white text-black hover:bg-gray-100 hover:text-black shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-6 py-3">
                    <Link href={settings.volunteer_button_url} className="flex items-center gap-2 text-black">
                      <span>🌟</span> Volunteer
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          </section>
        </div>
      </section>
    </div>
  )
}
