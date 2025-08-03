'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, UsersIcon, HeartHandshakeIcon, MapPinIcon, StarIcon, HeartIcon, TrendingUpIcon, HomeIcon, TargetIcon, AwardIcon } from "lucide-react"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { HeroSlider } from "@/components/hero-slider"
import { PartnersCarousel } from "@/components/partners-carousel"
import { supabaseApi, type Program, type ImpactStat, type Testimonial, type HeroSlide, type Partner } from "@/lib/supabase"

// Fallback data when Supabase is not available
const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Empowering Futures, One Child at a Time",
    subtitle: "The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.",
    image_url: "https://res.cloudinary.com/dcvuzffgj/image/upload/v1754226708/Adlai_heroes_nq7ugl.jpg",
    button_text: "Donate Now",
    button_link: "/donate",
    button_text_2: "Learn More",
    button_link_2: "/about",
    order_index: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const fallbackStats: ImpactStat[] = [
  {
    id: 1,
    title: "Girls Supported",
    value: "2,500+",
    description: "Young girls provided with menstrual hygiene products",
    icon: "users",
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Communities Reached", 
    value: "15",
    description: "Underserved communities across Nigeria",
    icon: "map-pin",
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Teens Empowered",
    value: "1,200+",
    description: "Teenagers trained through our programs",
    icon: "star",
    order_index: 3,
    created_at: new Date().toISOString()
  }
]

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

const fallbackTestimonials = [
  {
    quote: "The Pad Up Initiative changed my life. I no longer miss school during my period, and I feel more confident about my health.",
    author: "Aisha Mohammed",
    title: "Lagos, Nigeria",
  },
  {
    quote: "Teen Fever helped me discover my passion for technology. Now I am studying computer science in university.",
    author: "Ibrahim Adamu",
    title: "Abuja, Nigeria",
  },
  {
    quote: "Through the community outreach program, our village now has access to clean water. Thank you Adlai Heroes Foundation!",
    author: "Fatima Yusuf",
    title: "Kano, Nigeria",
  },
]

// Fallback partners data for testing
const fallbackPartners: Partner[] = [
  {
    id: 1,
    name: "Sample Partner 1",
    logo_url: "https://via.placeholder.com/200x100/1f2937/ffffff?text=Partner+1",
    website_url: "https://example.com",
    order_index: 1,
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Sample Partner 2", 
    logo_url: "https://via.placeholder.com/200x100/3b82f6/ffffff?text=Partner+2",
    website_url: "https://example.com",
    order_index: 2,
    active: true,
    created_at: new Date().toISOString()
  }
]

export default function DynamicHomepage() {
  const [stats, setStats] = useState<ImpactStat[]>(fallbackStats)
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(fallbackHeroSlides)
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load data from Supabase
        const [statsData, programsData, testimonialsData, heroSlidesData, partnersData] = await Promise.all([
          supabaseApi.getImpactStats(),
          supabaseApi.getPrograms(),
          supabaseApi.getTestimonials(true), // Only featured testimonials
          supabaseApi.getHeroSlides(),
          supabaseApi.getPartners()
        ])

        // Use Supabase data if available, otherwise keep fallback
        if (statsData.length > 0) setStats(statsData)
        if (programsData.length > 0) setPrograms(programsData.slice(0, 3)) // Limit to 3
        if (testimonialsData.length > 0) {
          setTestimonials(testimonialsData.map(t => ({
            quote: t.content,
            author: t.name,
            title: t.location || "Community Member",
          })))
        }
        if (heroSlidesData.length > 0) setHeroSlides(heroSlidesData)
        if (partnersData.length > 0) setPartners(partnersData)
      } catch (error) {
        console.error('Error loading data from Supabase:', error)
        // Keep fallback data on error
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'users':
        return UsersIcon
      case 'map-pin':
        return MapPinIcon
      case 'star':
        return StarIcon
      case 'heart':
        return HeartIcon
      case 'heart-handshake':
        return HeartHandshakeIcon
      case 'book-open':
        return BookOpenIcon
      case 'trending-up':
        return TrendingUpIcon
      case 'home':
        return HomeIcon
      case 'target':
        return TargetIcon
      case 'award':
        return AwardIcon
      default:
        return UsersIcon
    }
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSlider slides={heroSlides} />

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
              <CardHeader>
                <TargetIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-gradient-primary mb-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-gray-900 leading-relaxed mb-6">
                  To create a safe haven for children all around the world, make the world a better and safer place.
                </p>
                <Button asChild variant="link" className="text-primary text-lg px-0">
                  <Link href="/about">Learn More About Us &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
            <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
              <CardHeader>
                <StarIcon className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-gradient-primary mb-4">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-gray-900 leading-relaxed mb-6">
                  To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers
                  we come across are being met.
                </p>
                <Button asChild variant="link" className="text-primary text-lg px-0">
                  <Link href="/about">Learn More About Us &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-gradient-primary">Our Impact in Numbers</h2>
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat) => {
              const IconComponent = getIconComponent(stat.icon || 'users')
              
              return (
                <Card
                  key={stat.id}
                  variant="glass"
                  className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 w-[280px] flex-shrink-0"
                >
                  <IconComponent className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">{stat.value}</CardTitle>
                  <CardContent className="p-0 text-lg text-gray-900">{stat.title}</CardContent>
                  {stat.description && (
                    <p className="text-sm text-gray-600 mt-2">{stat.description}</p>
                  )}
                </Card>
              )
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Programs Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gradient-primary mb-12">Our Latest Initiatives</h2>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {programs.slice(0, 3).map((program) => {
              return (
                <Card key={program.id} variant="glass" className="hover:shadow-xl transition-shadow duration-300 w-[320px] flex-shrink-0">
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
                    <p className="text-gray-900 mb-4 line-clamp-3">
                      {program.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                        {program.category}
                      </span>
                      <Button asChild variant="link" className="text-primary px-0">
                        <Link href={`/programs/${program.slug}`}>Read More &rarr;</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-gradient-primary mb-12">What Our Community Says</h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Partners Section */}
      {partners.length > 0 && (
        <PartnersCarousel partners={partners} />
      )}
    </>
  )
}