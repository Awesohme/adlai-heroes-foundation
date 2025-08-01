import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function BoardPage() {
  const boardMembers = [
    {
      name: "Adlai Johnson",
      title: "Founder & Chairman",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Dr. Aisha Bello",
      title: "Vice Chairman",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Mr. Emeka Okoro",
      title: "Secretary",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Mrs. Funke Adebayo",
      title: "Treasurer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Chief Bayo Olaniyan",
      title: "Board Member",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Barr. Ngozi Eze",
      title: "Legal Advisor",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Board members in a meeting"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Board</h1>
      </section>

      {/* Board Members Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Meet Our Esteemed Board Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {boardMembers.map((member, index) => (
            <Card variant="glass" key={index} className="p-6 flex flex-col items-center text-center shadow-lg">
              <Image
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                width={200}
                height={200}
                className="rounded-full object-cover mb-4 h-40 w-40"
              />
              <CardTitle className="text-xl font-semibold text-gray-900">{member.name}</CardTitle>
              <CardContent className="p-0 text-primary">{member.title}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
