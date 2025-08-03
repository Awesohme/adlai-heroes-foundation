"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Partner } from "@/lib/supabase"

interface PartnersCarouselProps {
  partners: Partner[]
  autoplayInterval?: number // in milliseconds, 0 for no autoplay
  slidesToShow?: number // number of partners to show at once
}

export function PartnersCarousel({ 
  partners, 
  autoplayInterval = 4000, 
  slidesToShow = 4 
}: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex + slidesToShow >= partners.length ? 0 : prevIndex + 1
    )
  }, [partners.length, slidesToShow])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, partners.length - slidesToShow) : prevIndex - 1
    )
  }, [partners.length, slidesToShow])

  useEffect(() => {
    if (autoplayInterval > 0 && partners.length > slidesToShow) {
      const interval = setInterval(goToNext, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [goToNext, autoplayInterval, partners.length, slidesToShow])

  if (partners.length === 0) {
    return null
  }

  const visiblePartners = partners.slice(currentIndex, currentIndex + slidesToShow)
  
  // If we don't have enough partners to fill the slide, fill from the beginning
  if (visiblePartners.length < slidesToShow && partners.length > slidesToShow) {
    const remaining = slidesToShow - visiblePartners.length
    visiblePartners.push(...partners.slice(0, remaining))
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're proud to work alongside these amazing organizations to create lasting impact in our communities.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Partners Grid */}
          <div className="flex justify-center items-center gap-8 min-h-[120px]">
            {visiblePartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28 relative group"
              >
                {partner.website_url ? (
                  <Link
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full">
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation - Only show if more partners than visible */}
          {partners.length > slidesToShow && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-md hover:shadow-lg border h-10 w-10"
                aria-label="Previous partners"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-md hover:shadow-lg border h-10 w-10"
                aria-label="Next partners"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Dots indicator - Only show if more partners than visible */}
        {partners.length > slidesToShow && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(partners.length / slidesToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * slidesToShow)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / slidesToShow) === index
                    ? 'bg-primary scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to partners group ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}