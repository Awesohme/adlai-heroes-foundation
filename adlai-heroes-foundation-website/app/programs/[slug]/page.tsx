'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, CalendarIcon, TagIcon } from "lucide-react"
import { supabaseApi, type Program } from "@/lib/supabase"

// Fallback images for gallery demonstration
const fallbackImages = [
  "https://res.cloudinary.com/dcvuzffgj/image/upload/v1754226708/Adlai_heroes_nq7ugl.jpg",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop"
]

interface ProgramPageProps {
  params: {
    slug: string
  }
}

export default function ProgramPage({ params }: ProgramPageProps) {
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>(fallbackImages)

  useEffect(() => {
    async function fetchProgram() {
      try {
        const programData = await supabaseApi.getProgram(params.slug)
        setProgram(programData)
        // Use real gallery images if available
        if (programData?.gallery_images && programData.gallery_images.length > 0) {
          setGalleryImages(programData.gallery_images)
        } else if (programData?.featured_image) {
          setGalleryImages([programData.featured_image])
        }
      } catch (error) {
        console.error('Error fetching program:', error)
        setProgram(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProgram()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!program) {
    notFound()
  }

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src={program.featured_image || galleryImages[0]}
          alt={program.title}
          fill
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <div className="relative z-20 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg mb-4">{program.title}</h1>
          <Badge className={`bg-${categoryColor} text-white px-4 py-2 text-lg capitalize`}>
            {program.category}
          </Badge>
        </div>
      </section>

      {/* Program Meta Information */}
      <section className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Published {new Date(program.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            <span className="capitalize">{program.category} Program</span>
          </div>
        </div>
      </section>

      {/* Program Description - Blog Post Style */}
      <article className="max-w-4xl mx-auto mb-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8 text-center">About This Program</h2>
          
          {/* Short Description */}
          {program.description && (
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4" style={{ borderColor: `var(--${categoryColor})` }}>
              <p className="text-xl text-gray-800 leading-relaxed font-medium italic">
                {program.description}
              </p>
            </div>
          )}

          {/* Full Content */}
          {program.content && (
            <div className="text-lg text-gray-900 leading-relaxed space-y-6">
              {program.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          )}

          {/* Fallback content if no content exists */}
          {!program.content && (
            <div className="text-lg text-gray-900 leading-relaxed">
              <p className="mb-6">
                The {program.title} is one of our key initiatives at Adlai Heroes Foundation, designed to make a meaningful impact in the lives of children and communities we serve.
              </p>
              <p className="mb-6">
                Through this program, we work directly with local communities to identify needs, develop sustainable solutions, and implement projects that create lasting positive change.
              </p>
              <p>
                Our approach is collaborative, evidence-based, and focused on empowering communities to build a better future for their children.
              </p>
            </div>
          )}
        </div>
      </article>

      {/* Interactive Gallery with Carousel */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary text-center mb-8">Program Gallery</h2>
        
        {/* Main Carousel Image */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src={galleryImages[currentImageIndex]}
              alt={`${program.title} gallery image ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
            
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white z-10"
              onClick={prevImage}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white z-10"
              onClick={nextImage}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>

            {/* Zoom Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
                >
                  <ZoomInIcon className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] p-2">
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={galleryImages[currentImageIndex]}
                    alt={`${program.title} gallery image ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-4 overflow-x-auto pb-4">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? `border-${categoryColor} opacity-100` 
                    : 'border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${program.title} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto text-center">
        <Card className={`p-8 bg-gradient-to-r from-${categoryColor}/10 to-${categoryColor}/5 border-${categoryColor}/20`}>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Get Involved</h3>
            <p className="text-lg text-gray-700">
              Want to support the {program.title}? Your contribution can make a real difference in the lives of children and communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className={`bg-${categoryColor} text-white hover:bg-${categoryColor}/90`}>
                <a href="/donate">Donate Now</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/contact">Learn More</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
