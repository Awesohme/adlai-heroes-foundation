'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { supabaseApi, type Program } from "@/lib/supabase"

// Fallback programs data
const fallbackPrograms: Program[] = [
  {
    id: 1,
    title: "Pad Up Initiative",
    slug: "pad-up-initiative",
    description: "Providing menstrual hygiene products to young girls in underserved communities",
    content: "Our Pad Up Initiative ensures that girls do not miss school due to lack of menstrual hygiene products.",
    category: "health",
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Teen Fever Program",
    slug: "teen-fever-program",
    description: "Empowering teenagers with life skills and career guidance",
    content: "Teen Fever is our flagship youth empowerment program that provides mentorship and career guidance.",
    category: "empowerment",
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Community Outreach",
    slug: "community-outreach",
    description: "Building stronger communities through direct engagement",
    content: "Our community outreach programs focus on identifying local needs and providing sustainable solutions.",
    category: "community",
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const programsPerPage = 6

  useEffect(() => {
    async function loadPrograms() {
      try {
        const programsData = await supabaseApi.getPrograms()
        if (programsData.length > 0) {
          setPrograms(programsData.filter(p => p.published))
        }
      } catch (error) {
        console.error('Error loading programs:', error)
        // Keep fallback data on error
      } finally {
        setIsLoading(false)
      }
    }

    loadPrograms()
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(programs.length / programsPerPage)
  const startIndex = (currentPage - 1) * programsPerPage
  const endIndex = startIndex + programsPerPage
  const currentPrograms = programs.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-12 md:p-16 text-center shadow-2xl mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/headers/programs-bg.jpg"
            alt="Programs background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-red-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Our Programs</h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Explore our impactful initiatives creating positive change in communities
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Programs Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Explore Our Initiatives</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {currentPrograms.map((program) => {
            // Map categories to brand colors
            const getCategoryColor = (category: string) => {
              const colorMap: { [key: string]: string } = {
                'health': 'adlaiBlue',
                'empowerment': 'adlaiGreen', 
                'community': 'adlaiPink',
                'education': 'adlaiOrange'
              }
              return colorMap[category] || 'adlaiBlue'
            }
            
            const categoryColor = getCategoryColor(program.category)
            
            return (
              <Card
                variant="glass"
                key={program.slug}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-[320px] flex-shrink-0 border-t-4"
                style={{ borderTopColor: `var(--${categoryColor})` }}
              >
                <div className={`h-2 bg-${categoryColor}`}></div>
                <Image
                  src={program.featured_image || "/placeholder.svg?height=250&width=400"}
                  alt={program.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-[250px]"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gradient-primary">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4">{program.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm bg-${categoryColor}/10 text-${categoryColor} px-2 py-1 rounded-full capitalize font-medium`}>
                      {program.category}
                    </span>
                    <Link href={`/programs/${program.slug}`} className="text-primary hover:underline font-medium hover:rotate-12 transition-all duration-300 transform hover:scale-105">
                      Learn More &rarr;
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
