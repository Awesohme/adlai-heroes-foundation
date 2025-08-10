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
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 border-0 group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-12 translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎯</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Our Mission</CardTitle>
            </div>
            <CardContent className="p-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                To create a safe haven for children all around the world, make the world a better and safer place.
              </p>
            </CardContent>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 border-0 group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-16 -translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👁️</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Our Vision</CardTitle>
            </div>
            <CardContent className="p-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers we come across are being met.
              </p>
            </CardContent>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 border-0 group">
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full translate-y-14 translate-x-14"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📚</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Our Story</CardTitle>
            </div>
            <CardContent className="p-0">
              <p className="text-gray-700 leading-relaxed text-lg">
                Founded with a passion for empowering the next generation, we work tirelessly to provide education, healthcare, and opportunity to those who need it most.
              </p>
            </CardContent>
          </div>
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
              <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 hover:text-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-8 py-4 text-lg font-semibold">
                <Link href={settings.donate_button_url} className="flex items-center gap-2 text-black">
                  <span>💖</span> Donate Now
                </Link>
              </Button>
            )}
            {settings.volunteer_button_url && (
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-black shadow-xl hover:shadow-2xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-8 py-4 text-lg font-semibold">
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