'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"

export function Header() {
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

  // Determine if we should show the donate button
  const shouldShowDonateButton = settings.donate_button_url || settings.bank_name || settings.account_number || settings.payment_qr_code

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-gray-100 text-gray-700 text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href={`tel:${settings.contact_phone || '+2347083060892'}`} 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>{settings.contact_phone || '+234 708 306 0892'}</span>
            </Link>
            <Link
              href={`mailto:${settings.contact_email || 'info@adlaiheroesfoundation.com.ng'}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <MailIcon className="h-4 w-4" />
              <span>{settings.contact_email || 'info@adlaiheroesfoundation.com.ng'}</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {settings.facebook_url && (
              <Link href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FacebookIcon className="h-4 w-4" />
              </Link>
            )}
            {settings.twitter_url && (
              <Link href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            )}
            {settings.instagram_url && (
              <Link href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <InstagramIcon className="h-4 w-4" />
              </Link>
            )}
            {settings.linkedin_url && (
              <Link href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <LinkedinIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg"
              alt="Adlai Heroes Foundation"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold text-gradient-primary">Adlai</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link className="hover:text-primary transition-colors" href="/">
              Home
            </Link>
            <Link className="hover:text-primary transition-colors" href="/about">
              About Adlai
            </Link>
            <Link className="hover:text-primary transition-colors" href="/impact">
              Impact
            </Link>
            <Link className="hover:text-primary transition-colors" href="/board">
              Board
            </Link>
            <Link className="hover:text-primary transition-colors" href="/programs">
              Programs
            </Link>
            <Link className="hover:text-primary transition-colors" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-primary transition-colors" href="/volunteer">
              Volunteer
            </Link>
            <Link className="hover:text-primary transition-colors" href="/contact">
              Contact Us
            </Link>
            {shouldShowDonateButton && (
              <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg">
                <Link href="/donate">Donate</Link>
              </Button>
            )}
          </nav>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="md:hidden bg-transparent"
                size="icon"
                variant="outline"
                aria-label="Toggle navigation menu"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                <Link className="font-medium hover:text-primary transition-colors" href="/">
                  Home
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/about">
                  About Adlai
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/impact">
                  Impact
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/board">
                  Board
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/programs">
                  Programs
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/blog">
                  Blog
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/volunteer">
                  Volunteer
                </Link>
                <Link className="font-medium hover:text-primary transition-colors" href="/contact">
                  Contact Us
                </Link>
                {shouldShowDonateButton && (
                  <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg">
                    <Link href="/donate">Donate</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}