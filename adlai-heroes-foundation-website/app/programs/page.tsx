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
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Programs background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Programs</h1>
      </section>

      {/* Programs Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Explore Our Initiatives</h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {currentPrograms.map((program) => (
            <Card
              variant="glass"
              key={program.slug}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-[320px] flex-shrink-0"
            >
              <Image
                src={program.featured_image || "/placeholder.svg?height=250&width=400"}
                alt={program.title}
                width={400}
                height={250}
                className="rounded-t-lg object-cover w-full h-[250px]"
              />
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gradient-primary">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 mb-4">{program.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                    {program.category}
                  </span>
                  <Link href={`/programs/${program.slug}`} className="text-primary hover:underline font-medium">
                    Learn More &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
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
