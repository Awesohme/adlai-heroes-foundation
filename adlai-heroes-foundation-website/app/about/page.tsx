'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"

export default function AboutPage() {
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
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Children learning together"
          fill
          className="absolute inset-0 z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">About Us</h1>
      </section>

      {/* Mission, Vision, History */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To create a safe haven for children all around the world, make the world a better and safer place.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers we come across are being met.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Founded with a passion for empowering the next generation, we work tirelessly to provide education, healthcare, and opportunity to those who need it most.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
              <span className="text-3xl">🤝</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Join Our Mission
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Together, we can make a lasting impact on the lives of children and communities across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {settings.donate_button_url && (
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                <Link href={settings.donate_button_url} className="flex items-center gap-2">
                  <span>💖</span> Donate Now
                </Link>
              </Button>
            )}
            {settings.volunteer_button_url && (
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                <Link href={settings.volunteer_button_url} className="flex items-center gap-2">
                  <span>🌟</span> Become a Volunteer
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
      </section>
    </div>
  )
}