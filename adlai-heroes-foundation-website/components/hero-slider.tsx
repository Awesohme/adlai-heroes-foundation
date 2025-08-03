"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { type HeroSlide } from "@/lib/supabase"

interface HeroSliderProps {
  slides: HeroSlide[]
  autoplayInterval?: number // in milliseconds, 0 for no autoplay
  height?: string
}

export function HeroSlider({ slides, autoplayInterval = 6000, height = "h-[600px] md:h-[700px] lg:h-[800px]" }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }, [slides.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (autoplayInterval > 0 && slides.length > 1) {
      const interval = setInterval(goToNext, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [goToNext, autoplayInterval, slides.length])

  if (slides.length === 0) {
    return null
  }

  const currentSlide = slides[currentIndex]

  return (
    <section className={`relative ${height} flex items-center justify-center text-center overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={currentSlide.image_url}
        alt={currentSlide.title}
        fill
        className="absolute inset-0 z-0 object-cover transition-opacity duration-1000"
        priority={currentIndex === 0}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" aria-hidden="true"></div>
      
      {/* Content */}
      <div className="relative z-20 text-white px-4 max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
          {currentSlide.title}
        </h1>
        {currentSlide.subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            {currentSlide.subtitle}
          </p>
        )}
        {(currentSlide.button_text && currentSlide.button_link) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg shadow-lg"
            >
              <Link href={currentSlide.button_link}>
                {currentSlide.button_text}
              </Link>
            </Button>
            {currentSlide.button_text_2 && currentSlide.button_link_2 && (
              <Button
                asChild
                variant="outline"
                className="bg-white/20 text-white border-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg shadow-lg backdrop-blur-sm"
              >
                <Link href={currentSlide.button_link_2}>
                  {currentSlide.button_text_2}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Navigation - Only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none h-12 w-12"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white border-none h-12 w-12"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}