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
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
      {/* Top Contact Bar */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-sm py-2 hidden md:block transition-all duration-500 hover:from-blue-50 hover:to-purple-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href={`tel:${settings.contact_phone || '+2347083060892'}`} 
              className="flex items-center gap-1 hover:text-primary transition-all duration-300 hover:scale-105 group"
            >
              <PhoneIcon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="relative">
                {settings.contact_phone || '+234 708 306 0892'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </Link>
            <Link
              href={`mailto:${settings.contact_email || 'info@adlaiheroesfoundation.com.ng'}`}
              className="flex items-center gap-1 hover:text-primary transition-all duration-300 hover:scale-105 group"
            >
              <MailIcon className="h-4 w-4 transition-transform duration-300 group-hover:bounce" />
              <span className="relative">
                {settings.contact_email || 'info@adlaiheroesfoundation.com.ng'}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {settings.facebook_url && (
              <Link href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-all duration-300 hover:scale-125 transform hover:rotate-12">
                <FacebookIcon className="h-4 w-4" />
              </Link>
            )}
            {settings.twitter_url && (
              <Link href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-all duration-300 hover:scale-125 transform hover:-rotate-12">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
            )}
            {settings.instagram_url && (
              <Link href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-all duration-300 hover:scale-125 transform hover:rotate-12">
                <InstagramIcon className="h-4 w-4" />
              </Link>
            )}
            {settings.linkedin_url && (
              <Link href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-all duration-300 hover:scale-125 transform hover:-rotate-12">
                <LinkedinIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg"
                alt="Adlai Heroes Foundation"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full transition-all duration-300 group-hover:rotate-12 group-hover:shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold text-gradient-primary relative">
              Adlai
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 bg-clip-text text-transparent transition-opacity duration-500">
                Adlai
              </span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link className="relative group hover:text-primary transition-all duration-300 py-2" href="/">
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
            <div className="group relative">
              <div className="relative hover:text-primary transition-all duration-300 cursor-pointer flex items-center gap-1 py-2">
                About
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </div>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 w-48 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Link href="/about" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1">
                    <div className="flex items-center gap-2">
                      <span>📖</span> About Adlai
                    </div>
                  </Link>
                  <Link href="/impact" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1">
                    <div className="flex items-center gap-2">
                      <span>📊</span> Impact
                    </div>
                  </Link>
                  <Link href="/board" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1">
                    <div className="flex items-center gap-2">
                      <span>👥</span> Board
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link className="relative group hover:text-primary transition-all duration-300 py-2" href="/programs">
              Programs
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
            <Link className="relative group hover:text-primary transition-all duration-300 py-2" href="/blog">
              Blog
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
            <Link className="relative group hover:text-primary transition-all duration-300 py-2" href="/volunteer">
              Volunteer
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
            <Link className="relative group hover:text-primary transition-all duration-300 py-2" href="/contact">
              Contact Us
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </Link>
            {shouldShowDonateButton && (
              <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform hover:-translate-y-0.5 hover:rotate-12 relative overflow-hidden group">
                <Link href="/donate" className="relative z-10">
                  Donate
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </Link>
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
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">About</div>
                  <div className="pl-4 space-y-2">
                    <Link className="block text-sm hover:text-primary transition-colors" href="/about">
                      About Adlai
                    </Link>
                    <Link className="block text-sm hover:text-primary transition-colors" href="/impact">
                      Impact
                    </Link>
                    <Link className="block text-sm hover:text-primary transition-colors" href="/board">
                      Board
                    </Link>
                  </div>
                </div>
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
                  <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
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