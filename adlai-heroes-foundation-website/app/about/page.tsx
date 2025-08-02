import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Children learning together"
          fill
          className="absolute inset-0 z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">About Us</h1>
      </section>

      {/* Mission, Vision, History */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To create a safe haven for children all around the world, make the world a better and safer place.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers we come across are being met.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary mb-4">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Founded with a passion for empowering the next generation, we work tirelessly to provide education, healthcare, and opportunity to those who need it most.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-secondary p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-primary mb-4">Join Our Mission</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Together, we can make a lasting impact on the lives of children and communities across Nigeria.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/donate">Donate Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/volunteer">Become a Volunteer</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}