'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { SiteSettings } from "@/lib/supabase"

export default function VolunteerPage() {
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
          src="/placeholder.svg?height=500&width=1200"
          alt="Volunteers helping children"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-pink-900/70 z-10"></div>
        <div className="relative z-20 max-w-4xl px-6">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <span className="text-4xl">🌟</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Become a Volunteer
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Transform lives, including your own. Join our mission to create lasting change.
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Volunteer Information */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">
          Make a Real Difference in a Child's Life
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Volunteering with Adlai Heroes Foundation is a rewarding experience that allows you to directly contribute to
          the well-being and future of underprivileged children. Your time and skills can help us expand our reach and
          deepen our impact.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Who We Need</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-blue-500">👨‍🏫</span> Educators and Tutors
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-green-500">👩‍⚕️</span> Healthcare Professionals
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-purple-500">🤝</span> Mentors and Role Models
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-orange-500">🎉</span> Event Organizers
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-pink-500">📋</span> Administrative Support
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-indigo-500">🌍</span> Community Outreach Specialists
                </li>
              </ul>
            </div>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                  <CheckCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">What You'll Do</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-blue-500">📚</span> Assist with educational programs and homework support
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-green-500">🏥</span> Participate in health awareness campaigns and screenings
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-yellow-500">🎯</span> Organize and supervise recreational activities
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-red-500">💰</span> Help with fundraising events and administrative tasks
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                  <span className="text-purple-500">💡</span> Provide mentorship and guidance to children
                </li>
              </ul>
            </div>
          </Card>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mt-8">
          No matter your background or experience, there's a place for you in our team. We provide training and support
          to ensure you have a fulfilling volunteering experience.
        </p>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 p-12 text-center shadow-2xl max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-teal-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Fill out our volunteer application form to get started. We look forward to welcoming you to our family!
          </p>
          {settings.volunteer_button_url && (
            <Button asChild className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:rotate-12 transition-all duration-300 px-10 py-4 text-xl font-semibold rounded-full">
              <Link href={settings.volunteer_button_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <span>🚀</span> Apply to Volunteer <span>→</span>
              </Link>
            </Button>
          )}
        </div>
        <div className="absolute top-6 right-6 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </section>
    </div>
  )
}
