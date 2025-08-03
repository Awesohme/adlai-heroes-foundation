'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, UsersIcon, HeartHandshakeIcon, MapPinIcon, StarIcon, HeartIcon } from "lucide-react"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { supabaseApi, type Program, type ImpactStat, type Testimonial } from "@/lib/supabase"

// Fallback data when Supabase is not available
const fallbackHero = {
  title: "Empowering Futures, One Child at a Time",
  subtitle: "The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.",
  backgroundImage: "/placeholder.svg?height=800&width=1920"
}

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

export default function DynamicHomepage() {
  const [stats, setStats] = useState<ImpactStat[]>(fallbackStats)
  const [programs, setPrograms] = useState<Program[]>(fallbackPrograms)
  const [testimonials, setTestimonials] = useState(fallbackTestimonials)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        // Load data from Supabase
        const [statsData, programsData, testimonialsData] = await Promise.all([
          supabaseApi.getImpactStats(),
          supabaseApi.getPrograms(),
          supabaseApi.getTestimonials(true) // Only featured testimonials
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
      default:
        return UsersIcon
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src={fallbackHero.backgroundImage}
          alt={fallbackHero.title}
          fill
          className="absolute inset-0 z-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" aria-hidden="true"></div>
        <div className="relative z-20 text-white px-4 max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
            {fallbackHero.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            {fallbackHero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg shadow-lg"
            >
              <Link href="/donate">
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg bg-transparent shadow-lg"
            >
              <Link href="/volunteer">
                Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gradient-primary mb-4">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-gray-900 leading-relaxed">
                  To create a safe haven for children all around the world, make the world a better and safer place.
                </p>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Children learning in a group"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-xl object-cover w-full h-auto mt-6"
                />
                <Button asChild variant="link" className="text-primary text-lg px-0 mt-4">
                  <Link href="/about">Learn More About Us &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
            <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gradient-primary mb-4">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-gray-900 leading-relaxed">
                  To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers
                  we come across are being met.
                </p>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Children dreaming of future"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-xl object-cover w-full h-auto mt-6"
                />
                <Button asChild variant="link" className="text-primary text-lg px-0 mt-4">
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
          <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => {
              const IconComponent = getIconComponent(stat.icon || 'users')
              
              return (
                <Card
                  key={stat.id}
                  variant="glass"
                  className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 flex-1 min-w-[280px] max-w-[320px]"
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
      </section>

      {/* Recent Programs Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gradient-primary mb-12">Our Latest Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.slice(0, 3).map((program) => {
              return (
                <Card key={program.id} variant="glass" className="hover:shadow-xl transition-shadow duration-300">
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
    </>
  )
}