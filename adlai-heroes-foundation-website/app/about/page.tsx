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
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">About Us</h1>
      </section>

      {/* Mission, Vision, History */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card variant="glass" className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Origin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 leading-relaxed">
              Adlai is a Hebrew word, it means ornament. Adlai Heroes Foundation is a child and teenager focused non-governmental organization set up for the sole purpose of putting smiles on the faces of underprivileged children, and as well creating a safe haven for the vulnerable children. <br>
            </p>
          </CardContent>
        </Card>
        <Card variant="glass" className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 leading-relaxed">
              To see that the basic, mental, financial and emotional needs of the vulnerable children and teenagers we come across are being met.
            </p>
          </CardContent>
        </Card>
        <Card variant="glass" className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Our Mision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900 leading-relaxed">
              To create a safe haven for children all around the world, make the world a better and safer place.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Team Overview */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Meet Our Dedicated Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-md">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Team Member 1"
              width={150}
              height={150}
              className="rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">Mibi Ojewale</h3>
            <p className="text-primary">Founder</p>
            <p className="text-sm text-gray-900 mt-2">Passionate about child welfare and community development.</p>
          </Card>
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-md">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Team Member 2"
              width={150}
              height={150}
              className="rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">Oyekan Adeola </h3>
            <p className="text-primary">Programs Director</p>
            <p className="text-sm text-gray-900 mt-2">Oversees all educational and healthcare initiatives.</p>
          </Card>
          <Card variant="glass" className="p-6 flex flex-col items-center text-center shadow-md">
            <Image
              src="/placeholder.svg?height=150&width=150"
              alt="Team Member 3"
              width={150}
              height={150}
              className="rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900">Lauretta Enang</h3>
            <p className="text-primary">Volunteer Coordinator</p>
            <p className="text-sm text-gray-900 mt-2">Manages our network of dedicated volunteers.</p>
          </Card>
        </div>
        <div className="mt-12">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg">
            <Link href="/board">View All Team Members</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
