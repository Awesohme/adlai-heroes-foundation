'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, UsersIcon, HeartHandshakeIcon } from "lucide-react"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { 
  useHeroSection, 
  useImpactStats, 
  usePrograms, 
  useFeaturedTestimonials, 
  useStrapiMedia 
} from "@/hooks/use-strapi"
import { getStrapiMediaUrl, getStrapiOptimizedImageUrl } from "@/lib/strapi"

// Fallback data when Strapi is not available
const fallbackHero = {
  title: "Empowering Futures, One Child at a Time",
  subtitle: "The Adlai Heroes Foundation is dedicated to supporting underprivileged children through education, healthcare, and community development.",
  backgroundImage: "/placeholder.svg?height=800&width=1920",
  primaryButtonText: "Donate Now",
  primaryButtonUrl: "/donate",
  secondaryButtonText: "Become a Volunteer",
  secondaryButtonUrl: "/volunteer"
}

const fallbackStats = [
  {
    id: 1,
    title: "Beneficiaries",
    value: "20,000+",
    icon: "users",
    category: "beneficiaries" as const
  },
  {
    id: 2,
    title: "Communities Reached", 
    value: "30+",
    icon: "heart-handshake",
    category: "communities" as const
  },
  {
    id: 3,
    title: "Active Programs",
    value: "9+", 
    icon: "book-open",
    category: "programs" as const
  }
]

const fallbackPrograms = [
  {
    id: 1,
    title: "Back to School",
    description: "Providing access to quality education and learning resources for children in underserved areas.",
    slug: "education-for-all",
    featuredImage: "/placeholder.svg?height=250&width=400"
  },
  {
    id: 2,
    title: "Pad Up",
    description: "The Pad Up campaign is a pad drive setup for teenage girls living in slums and low-income communities in Nigeria.",
    slug: "health-wellness", 
    featuredImage: "/placeholder.svg?height=250&width=400"
  },
  {
    id: 3,
    title: "Mentorship (W.A.Y)",
    description: "During Mentorship programs, we organise talks and seminars for teenagers. These classes of humans are in a stage that can be tagged as JUVENILES.",
    slug: "community-empowerment",
    featuredImage: "/placeholder.svg?height=250&width=400"
  }
]

const fallbackTestimonials = [
  {
    quote: "The Adlai Heroes Foundation has transformed countless lives in our community. Their dedication to education and healthcare has given our children a real chance at a brighter future. We are incredibly grateful for their unwavering support.",
    author: "Community Leader",
    title: "Lagos State",
  },
  {
    quote: "Volunteering with Adlai Heroes Foundation has been one of the most rewarding experiences of my life. Seeing the smiles on the children's faces makes every effort worthwhile. They truly are heroes!",
    author: "Aisha M.",
    title: "Volunteer",
  },
  {
    quote: "Thanks to Adlai Heroes Foundation, my children are now attending school regularly and have access to medical care. This foundation is a blessing to families like ours.",
    author: "Mrs. Okoro",
    title: "Beneficiary Parent",
  },
]

export default function DynamicHomepage() {
  const { data: heroData, isLoading: heroLoading } = useHeroSection()
  const { data: statsData, isLoading: statsLoading } = useImpactStats()
  const { data: programsData, isLoading: programsLoading } = usePrograms({ 
    pagination: { limit: 3 }
  })
  const { data: testimonialsData, isLoading: testimonialsLoading } = useFeaturedTestimonials({ 
    pagination: { limit: 3 }
  })
  const { getMediaUrl, getOptimizedImageUrl } = useStrapiMedia()

  // Use Strapi data if available, otherwise fallback
  const hero = heroData || fallbackHero
  const stats = statsData.length > 0 ? statsData : fallbackStats
  const programs = programsData.length > 0 ? programsData : fallbackPrograms
  const testimonials = testimonialsData.length > 0 
    ? testimonialsData.map(t => ({
        quote: t.attributes.quote,
        author: t.attributes.author,
        title: t.attributes.position || t.attributes.location || "",
      }))
    : fallbackTestimonials

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'users':
        return UsersIcon
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
          src={heroData ? getStrapiOptimizedImageUrl(heroData.attributes.backgroundImage, 'large') || fallbackHero.backgroundImage : fallbackHero.backgroundImage}
          alt={heroData?.attributes.title || fallbackHero.title}
          fill
          className="absolute inset-0 z-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" aria-hidden="true"></div>
        <div className="relative z-20 text-white px-4 max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">
            {heroData?.attributes.title || fallbackHero.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            {heroData?.attributes.subtitle || fallbackHero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg shadow-lg"
            >
              <Link href={heroData?.attributes.primaryButtonUrl || fallbackHero.primaryButtonUrl}>
                {heroData?.attributes.primaryButtonText || fallbackHero.primaryButtonText}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg bg-transparent shadow-lg"
            >
              <Link href={heroData?.attributes.secondaryButtonUrl || fallbackHero.secondaryButtonUrl}>
                {heroData?.attributes.secondaryButtonText || fallbackHero.secondaryButtonText}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat) => {
              const IconComponent = getIconComponent(
                (stat as any).attributes?.icon || (stat as any).icon || 'users'
              )
              const title = (stat as any).attributes?.title || (stat as any).title
              const value = (stat as any).attributes?.value || (stat as any).value
              
              return (
                <Card
                  key={(stat as any).id}
                  variant="glass"
                  className="p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <IconComponent className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">{value}</CardTitle>
                  <CardContent className="p-0 text-lg text-gray-900">{title}</CardContent>
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
              const isStrapi = 'attributes' in program
              const title = isStrapi ? program.attributes.title : program.title
              const description = isStrapi ? program.attributes.shortDescription || program.attributes.description : program.description
              const slug = isStrapi ? program.attributes.slug : program.slug
              const imageUrl = isStrapi 
                ? getStrapiOptimizedImageUrl(program.attributes.featuredImage, 'medium') || "/placeholder.svg?height=250&width=400"
                : program.featuredImage
              
              return (
                <Card key={program.id} variant="glass" className="hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={400}
                    height={250}
                    className="rounded-t-lg object-cover w-full h-[250px]"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gradient-primary">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 mb-4 line-clamp-3">
                      {description}
                    </p>
                    <Button asChild variant="link" className="text-primary px-0">
                      <Link href={`/programs/${slug}`}>Read More &rarr;</Link>
                    </Button>
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