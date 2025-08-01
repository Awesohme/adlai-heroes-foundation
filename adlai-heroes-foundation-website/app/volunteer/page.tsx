import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function VolunteerPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Volunteers helping children"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Become a Volunteer</h1>
      </section>

      {/* Volunteer Information */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">
          Make a Real Difference in a Child's Life
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Volunteering with Adlai Heroes Foundation is a rewarding experience that allows you to directly contribute to
          the well-being and future of underprivileged children. Your time and skills can help us expand our reach and
          deepen our impact.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card variant="glass" className="p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-gradient-primary flex items-center gap-2 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-primary" />
              Who We Need
            </h3>
            <ul className="list-disc list-inside text-gray-900 space-y-2">
              <li>Educators and Tutors</li>
              <li>Healthcare Professionals</li>
              <li>Mentors and Role Models</li>
              <li>Event Organizers</li>
              <li>Administrative Support</li>
              <li>Community Outreach Specialists</li>
            </ul>
          </Card>
          <Card variant="glass" className="p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-gradient-primary flex items-center gap-2 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-primary" />
              What You'll Do
            </h3>
            <ul className="list-disc list-inside text-gray-900 space-y-2">
              <li>Assist with educational programs and homework support.</li>
              <li>Participate in health awareness campaigns and screenings.</li>
              <li>Organize and supervise recreational activities.</li>
              <li>Help with fundraising events and administrative tasks.</li>
              <li>Provide mentorship and guidance to children.</li>
            </ul>
          </Card>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mt-8">
          No matter your background or experience, there's a place for you in our team. We provide training and support
          to ensure you have a fulfilling volunteering experience.
        </p>
      </section>

      {/* Call to Action */}
      <Card variant="glass" className="text-center p-10 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient-primary mb-6">Ready to Make a Difference?</h2>
        <p className="text-lg text-gray-900 mb-8">
          Fill out our volunteer application form to get started. We look forward to welcoming you!
        </p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg">
          <Link href="https://forms.gle/your-google-form-link" target="_blank" rel="noopener noreferrer">
            Apply to Volunteer
          </Link>
        </Button>
      </Card>
    </div>
  )
}
