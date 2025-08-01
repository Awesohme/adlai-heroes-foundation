import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { UsersIcon, HeartHandshakeIcon, BookOpenIcon } from "lucide-react"

export default function ImpactPage() {
  const impactTimeline = [
    { year: 2018, description: "Foundation established, initial focus on primary education in one community." },
    { year: 2019, description: "Launched first healthcare outreach program, reaching 200+ children." },
    { year: 2020, description: "Expanded educational support to three new communities, providing school supplies." },
    { year: 2021, description: "Initiated vocational training workshops for older children and youth." },
    { year: 2022, description: "Partnered with local clinics to offer free medical check-ups and vaccinations." },
    { year: 2023, description: "Reached over 1,000 beneficiaries across 20 communities." },
    { year: 2024, description: "Launched digital literacy program, equipping children with essential tech skills." },
  ]

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Children celebrating success"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Impact</h1>
      </section>

      {/* Impact Stats Section (Re-used from Home, but can be customized) */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Making a Difference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-lg">
            <UsersIcon className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">20,000+</CardTitle>
            <CardContent className="p-0 text-lg text-gray-900">Beneficiaries</CardContent>
          </Card>
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-lg">
            <HeartHandshakeIcon className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">50+</CardTitle>
            <CardContent className="p-0 text-lg text-gray-900">Communities Reached</CardContent>
          </Card>
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-lg">
            <BookOpenIcon className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-5xl font-bold text-gradient-primary mb-2">10+</CardTitle>
            <CardContent className="p-0 text-lg text-gray-900">Active Programs</CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Our Journey Through the Years</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary hidden md:block"></div>
          {impactTimeline.map((item, index) => (
            <div
              key={index}
              className={`flex items-center w-full mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="w-full md:w-1/2 p-4">
                <Card
                  variant="glass"
                  className={`rounded-lg shadow-md p-6 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <h3 className="text-2xl font-bold text-gradient-primary mb-2">{item.year}</h3>
                  <p className="text-gray-900">{item.description}</p>
                </Card>
              </div>
              <div className="hidden md:block w-1/2 relative">
                
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
