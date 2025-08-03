'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { UsersIcon, HeartHandshakeIcon, BookOpenIcon } from "lucide-react"
import { supabaseApi, type ImpactStat, type ImpactTimeline } from "@/lib/supabase"

export default function ImpactPage() {
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([])
  const [impactTimeline, setImpactTimeline] = useState<ImpactTimeline[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fallback data
  const fallbackStats = [
    { id: 1, title: "Beneficiaries", value: "20,000+", description: "Lives impacted", icon: "users", order_index: 1, created_at: "" },
    { id: 2, title: "Communities Reached", value: "50+", description: "Across regions", icon: "heart-handshake", order_index: 2, created_at: "" },
    { id: 3, title: "Active Programs", value: "10+", description: "Running initiatives", icon: "book-open", order_index: 3, created_at: "" }
  ]

  const fallbackTimeline = [
    { id: 1, year: 2018, title: "Foundation Established", description: "Foundation established, initial focus on primary education in one community.", order_index: 1, active: true, created_at: "", updated_at: "" },
    { id: 2, year: 2019, title: "First Healthcare Outreach", description: "Launched first healthcare outreach program, reaching 200+ children.", order_index: 2, active: true, created_at: "", updated_at: "" },
    { id: 3, year: 2020, title: "Educational Expansion", description: "Expanded educational support to three new communities, providing school supplies.", order_index: 3, active: true, created_at: "", updated_at: "" },
    { id: 4, year: 2021, title: "Vocational Training Launch", description: "Initiated vocational training workshops for older children and youth.", order_index: 4, active: true, created_at: "", updated_at: "" },
    { id: 5, year: 2022, title: "Healthcare Partnership", description: "Partnered with local clinics to offer free medical check-ups and vaccinations.", order_index: 5, active: true, created_at: "", updated_at: "" },
    { id: 6, year: 2023, title: "Major Milestone", description: "Reached over 1,000 beneficiaries across 20 communities.", order_index: 6, active: true, created_at: "", updated_at: "" },
    { id: 7, year: 2024, title: "Digital Literacy Program", description: "Launched digital literacy program, equipping children with essential tech skills.", order_index: 7, active: true, created_at: "", updated_at: "" }
  ]

  useEffect(() => {
    async function loadImpactData() {
      try {
        setIsLoading(true)
        const [statsData, timelineData] = await Promise.all([
          supabaseApi.getImpactStats().catch(() => fallbackStats),
          supabaseApi.getImpactTimeline().catch(() => fallbackTimeline)
        ])
        
        setImpactStats(statsData.length > 0 ? statsData : fallbackStats)
        setImpactTimeline(timelineData.length > 0 ? timelineData : fallbackTimeline)
      } catch (error) {
        console.error('Error loading impact data:', error)
        setImpactStats(fallbackStats)
        setImpactTimeline(fallbackTimeline)
      } finally {
        setIsLoading(false)
      }
    }

    loadImpactData()
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Children celebrating success"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Impact</h1>
      </section>

      {/* Impact Stats Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Making a Difference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactStats.map((stat, index) => {
            // Map icons to components
            const getIcon = (iconName?: string) => {
              switch (iconName) {
                case 'users':
                  return <UsersIcon className="h-12 w-12 text-primary mb-4" />
                case 'heart-handshake':
                  return <HeartHandshakeIcon className="h-12 w-12 text-primary mb-4" />
                case 'book-open':
                  return <BookOpenIcon className="h-12 w-12 text-primary mb-4" />
                default:
                  return index === 0 ? <UsersIcon className="h-12 w-12 text-primary mb-4" /> :
                         index === 1 ? <HeartHandshakeIcon className="h-12 w-12 text-primary mb-4" /> :
                         <BookOpenIcon className="h-12 w-12 text-primary mb-4" />
              }
            }

            return (
              <Card key={stat.id} variant="glass" className="p-6 flex flex-col items-center text-center shadow-lg">
                {getIcon(stat.icon)}
                <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">{stat.value}</CardTitle>
                <CardContent className="p-0 text-lg text-gray-900">{stat.title}</CardContent>
                {stat.description && (
                  <p className="text-sm text-gray-600 mt-2">{stat.description}</p>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Our Journey Through the Years</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary hidden md:block"></div>
          {impactTimeline.map((item, index) => (
            <div
              key={index}
              className={`flex items-center w-full mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="w-full md:w-1/2 p-4">
                <Card
                  variant="glass"
                  className={`rounded-lg shadow-md p-6 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                    <span className="text-2xl font-bold text-adlaiBlue">{item.year}</span>
                    <h3 className="text-xl font-semibold text-gradient-primary">{item.title}</h3>
                  </div>
                  <p className="text-gray-900">{item.description}</p>
                </Card>
              </div>
              <div className="hidden md:block w-1/2 relative">
                
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
