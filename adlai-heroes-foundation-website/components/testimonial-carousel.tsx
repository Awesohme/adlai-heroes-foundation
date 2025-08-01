"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

interface Testimonial {
  quote: string
  author: string
  title?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoplayInterval?: number // in milliseconds, 0 for no autoplay
}

export function TestimonialCarousel({ testimonials, autoplayInterval = 5000 }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }, [testimonials.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (autoplayInterval > 0 && testimonials.length > 1) {
      const interval = setInterval(goToNext, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [goToNext, autoplayInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null // Or a message indicating no testimonials
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <Card className="p-8 shadow-lg bg-white min-h-[250px] flex flex-col justify-center items-center text-center">
        <QuoteIcon className="h-10 w-10 text-primary mx-auto mb-6" />
        <CardContent className="p-0">
          <p className="text-xl md:text-2xl italic text-gray-800 mb-6 leading-relaxed">
            &quot;{currentTestimonial.quote}&quot;
          </p>
          <p className="text-lg font-semibold text-gray-900">
            - {currentTestimonial.author}
            {currentTestimonial.title && <span className="text-gray-600">, {currentTestimonial.title}</span>}
          </p>
        </CardContent>
      </Card>

      {testimonials.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>
        </>
      )}

      {testimonials.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
