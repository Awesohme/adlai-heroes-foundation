import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgramsPage() {
  const programs = [
    {
      slug: "education-for-all",
      title: "Education for All",
      description: "Providing access to quality education and learning resources for children in underserved areas.",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      slug: "health-wellness",
      title: "Health & Wellness",
      description: "Ensuring children have access to essential healthcare services and nutritional support.",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      slug: "community-empowerment",
      title: "Community Empowerment",
      description: "Building stronger communities through sustainable development projects and support systems.",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      slug: "digital-literacy",
      title: "Digital Literacy Initiative",
      description: "Equipping children with fundamental computer skills and internet safety knowledge.",
      image: "/placeholder.svg?height=250&width=400",
    },
  ]

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card
              variant="glass"
              key={program.slug}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={program.image || "/placeholder.svg"}
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
                <Link href={`/programs/${program.slug}`} className="text-primary hover:underline font-medium">
                  Learn More &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
