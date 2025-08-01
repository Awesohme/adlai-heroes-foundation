import Image from "next/image"
import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"

// This is placeholder data. In a real app, you'd fetch this from a CMS or database.
const programDetails = {
  "education-for-all": {
    title: "Education for All",
    description:
      "Our flagship education program aims to break the cycle of poverty by ensuring every child has access to quality learning. We provide school fees, uniforms, books, and after-school tutoring.",
    longDescription:
      "The 'Education for All' program is designed to remove financial and logistical barriers to schooling for underprivileged children. We work closely with local schools and communities to identify children most in need, providing comprehensive support that includes tuition fees, school supplies, and uniforms. Beyond basic provisions, we organize supplementary classes and tutoring sessions to help students excel academically. Our goal is to foster a love for learning and equip children with the knowledge and skills necessary for a brighter future.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    impact: [
      "Over 800 children enrolled in schools annually.",
      "95% retention rate in our supported schools.",
      "Significant improvement in literacy and numeracy rates.",
    ],
  },
  "health-wellness": {
    title: "Health & Wellness",
    description:
      "This program focuses on improving the health outcomes of children through regular medical check-ups, vaccinations, and health education.",
    longDescription:
      "The 'Health & Wellness' program addresses the critical health needs of children in underserved communities. We organize regular medical camps, providing free check-ups, vaccinations, and essential medicines. Our team also conducts health awareness sessions on hygiene, nutrition, and disease prevention, empowering children and their families with knowledge to lead healthier lives. We believe that healthy children are better equipped to learn and thrive.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    impact: [
      "Reduced incidence of common childhood diseases.",
      "Increased awareness about hygiene and nutrition.",
      "Improved access to basic medical care for hundreds of children.",
    ],
  },
  "community-empowerment": {
    title: "Community Empowerment",
    description:
      "We work with communities to build sustainable infrastructure and foster self-reliance through various development projects.",
    longDescription:
      "The 'Community Empowerment' program is about building resilient and self-sufficient communities. We collaborate with local leaders to identify pressing needs and implement projects such as clean water initiatives, sanitation facilities, and community centers. We also facilitate skill-building workshops for adults, promoting economic independence and creating a supportive environment for children to grow up in. Our approach is holistic, aiming for long-term positive change.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    impact: [
      "Improved access to clean water and sanitation.",
      "Enhanced community infrastructure.",
      "Increased community participation in development initiatives.",
    ],
  },
  "digital-literacy": {
    title: "Digital Literacy Initiative",
    description:
      "Equipping children with fundamental computer skills and internet safety knowledge to prepare them for the digital age.",
    longDescription:
      "In today's rapidly evolving world, digital literacy is crucial. Our 'Digital Literacy Initiative' provides children with access to computers and internet, along with structured lessons on basic computer operations, coding fundamentals, and safe online practices. We aim to bridge the digital divide, ensuring that children from disadvantaged backgrounds are not left behind and are prepared for future educational and career opportunities in a technology-driven world.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    impact: [
      "Increased computer proficiency among participants.",
      "Enhanced critical thinking and problem-solving skills.",
      "Improved readiness for higher education and modern workforce.",
    ],
  },
}

interface ProgramPageProps {
  params: {
    slug: string
  }
}

export default function ProgramPage({ params }: ProgramPageProps) {
  const program = programDetails[params.slug as keyof typeof programDetails]

  if (!program) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src={program.images[0] || "/placeholder.svg"}
          alt={program.title}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">{program.title}</h1>
      </section>

      {/* Program Description */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">About This Program</h2>
        <p className="text-lg text-gray-900 leading-relaxed">{program.longDescription}</p>
      </section>

      {/* Program Gallery */}
      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary text-center mb-8">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {program.images.map((imgSrc, index) => (
            <Card variant="glass" key={index} className="shadow-lg overflow-hidden">
              <Image
                src={imgSrc || "/placeholder.svg"}
                alt={`${program.title} image ${index + 1}`}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Program Impact */}
      <Card variant="glass" className="max-w-4xl mx-auto text-center p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Our Impact</h2>
        <ul className="list-disc list-inside text-lg text-gray-900 space-y-3 text-left">
          {program.impact.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
