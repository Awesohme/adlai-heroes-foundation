import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HomeIcon, SearchIcon, MailIcon, HeartIcon } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-adlaiBlue/5 via-white to-adlaiPink/5 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-adlaiBlue via-adlaiPink to-adlaiOrange bg-clip-text mb-4">
            404
          </div>
          <div className="flex justify-center items-center gap-4 mb-6">
            <HeartIcon className="h-8 w-8 text-adlaiPink animate-pulse" />
            <SearchIcon className="h-10 w-10 text-adlaiBlue" />
            <HeartIcon className="h-6 w-6 text-adlaiGreen animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <Card className="mb-8 border-l-4 border-adlaiBlue shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We couldn't find the page you're looking for. It might have been moved, deleted, 
              or you may have entered the wrong URL. But don't worry – there are many ways 
              to find what you need!
            </p>
            
            {/* Helpful Suggestions */}
            <div className="text-left bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Here's what you can do:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-adlaiBlue rounded-full"></span>
                  Check the URL for any typos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-adlaiGreen rounded-full"></span>
                  Go back to our homepage and start fresh
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-adlaiPink rounded-full"></span>
                  Explore our programs and initiatives
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-adlaiOrange rounded-full"></span>
                  Contact us if you need specific help
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-adlaiBlue text-white hover:bg-adlaiBlue/90 shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
                <Link href="/" className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5" />
                  Back to Homepage
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
                <Link href="/programs" className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  Browse Programs
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
                <Link href="/contact" className="flex items-center gap-2">
                  <MailIcon className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Links */}
        <Card className="border-l-4 border-adlaiPink">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link 
                href="/about" 
                className="text-adlaiBlue hover:text-adlaiBlue/80 hover:underline transition-colors"
              >
                About Us
              </Link>
              <Link 
                href="/programs" 
                className="text-adlaiGreen hover:text-adlaiGreen/80 hover:underline transition-colors"
              >
                Our Programs
              </Link>
              <Link 
                href="/donate" 
                className="text-adlaiPink hover:text-adlaiPink/80 hover:underline transition-colors"
              >
                Donate
              </Link>
              <Link 
                href="/volunteer" 
                className="text-adlaiOrange hover:text-adlaiOrange/80 hover:underline transition-colors"
              >
                Volunteer
              </Link>
              <Link 
                href="/blog" 
                className="text-adlaiBlue hover:text-adlaiBlue/80 hover:underline transition-colors"
              >
                Blog
              </Link>
              <Link 
                href="/board" 
                className="text-adlaiGreen hover:text-adlaiGreen/80 hover:underline transition-colors"
              >
                Board Members
              </Link>
              <Link 
                href="/impact" 
                className="text-adlaiPink hover:text-adlaiPink/80 hover:underline transition-colors"
              >
                Our Impact
              </Link>
              <Link 
                href="/team" 
                className="text-adlaiOrange hover:text-adlaiOrange/80 hover:underline transition-colors"
              >
                Our Team
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <p className="mt-6 text-gray-600 text-sm">
          Need immediate help? Email us at{" "}
          <a 
            href="mailto:admin@adlaiheroesfoundation.com.ng" 
            className="text-adlaiBlue hover:underline"
          >
            admin@adlaiheroesfoundation.com.ng
          </a>
        </p>
      </div>
    </div>
  )
}