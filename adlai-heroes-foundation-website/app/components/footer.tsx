'use client'

import Link from "next/link"
import Image from "next/image"
import { FacebookIcon, InstagramIcon, LinkedinIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"

export function Footer() {
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

  // Check if we should show the donate link
  const shouldShowDonateLink = settings.donate_button_url || settings.bank_name || settings.account_number || settings.payment_qr_code

  return (
    <footer className="bg-gradient-to-r from-adlaiBlue via-adlaiPink to-adlaiOrange text-white py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="space-y-4 md:col-span-1">
          <Image
            src="https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg"
            alt="Adlai Heroes Foundation Logo"
            width={150}
            height={60}
            className="h-16 w-auto mb-4"
          />
          <p className="text-sm leading-relaxed">
            {settings.site_description || "We seek to create a platform where we can bridge the gap between the privileged and the underprivileged, the vulnerable and the strong, the haves and the haves not."}
          </p>
          <div className="flex space-x-4 pt-2">
            {settings.facebook_url && (
              <Link aria-label="Facebook" href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </Link>
            )}
            {settings.twitter_url && (
              <Link aria-label="X (formerly Twitter)" href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            )}
            {settings.instagram_url && (
              <Link aria-label="Instagram" href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <InstagramIcon className="h-6 w-6" />
              </Link>
            )}
            {settings.linkedin_url && (
              <Link aria-label="LinkedIn" href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <LinkedinIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
        <div className="space-y-4 md:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-white" />
            <span>{settings.contact_phone || '+234 708 306 0892'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="h-5 w-5 text-white" />
            <span>{settings.contact_email || 'admin@adlaiheroesfoundation.com.ng'}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-5 w-5 mt-1" />
            <span>{settings.contact_address || 'Flat 1a, No. 28, Alhaji Isiakanda street, Ilasamaja, Lagos State'}</span>
          </div>
        </div>
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <nav className="grid grid-cols-2 gap-y-1 gap-x-2 text-sm">
            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/about">
              About Adlai
            </Link>
            <Link className="hover:underline" href="/impact">
              Impact
            </Link>
            <Link className="hover:underline" href="/board">
              Board
            </Link>
            <Link className="hover:underline" href="/programs">
              Programs
            </Link>
            <Link className="hover:underline" href="/blog">
              Blog
            </Link>
            <Link className="hover:underline" href="/volunteer">
              Volunteer
            </Link>
            {shouldShowDonateLink && (
              <Link className="hover:underline" href="/donate">
                Donate
              </Link>
            )}
            <Link className="hover:underline" href="/contact">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-white/20 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Adlai Heroes Foundation. All rights reserved.</p>
      </div>
    </footer>
  )
}