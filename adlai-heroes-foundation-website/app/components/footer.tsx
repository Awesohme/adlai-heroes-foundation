import Link from "next/link"
import Image from "next/image"
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, PhoneIcon, MailIcon, MapPinIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-adlaiBlue to-adlaiRed text-white py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="space-y-4 md:col-span-1">
          <Image
            src="https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg"
            alt="Adlai Heroes Foundation Logo"
            width={150}
            height={60}
            className="h-16 w-auto mb-4"
          />
          <p className="text-sm leading-relaxed">
            We seek to create a platform where we can bridge the gap between the privileged and the underprivileged, the
            vulnerable and the strong, the haves and the haves not.
          </p>
          <div className="flex space-x-4 pt-2">
            <Link aria-label="Facebook" href="#" className="hover:text-gray-300 transition-colors">
              <FacebookIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="Twitter" href="#" className="hover:text-gray-300 transition-colors">
              <TwitterIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="Instagram" href="#" className="hover:text-gray-300 transition-colors">
              <InstagramIcon className="h-6 w-6" />
            </Link>
            <Link aria-label="LinkedIn" href="#" className="hover:text-gray-300 transition-colors">
              <LinkedinIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="space-y-4 md:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-white" />
            <span>+234 708 306 0892</span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="h-5 w-5 text-gray-900" /> {/* Changed to text-gray-900 for visibility */}
            <span>admin@adlaiheroesfoundation.com.ng</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPinIcon className="h-5 w-5 mt-1" />
            <span>Flat 1a, No. 28, Alhaji Isiakanda street, Ilasamaja, Lagos State</span>
          </div>
        </div>
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <nav className="grid grid-cols-2 gap-y-1 gap-x-2 text-sm">
            {" "}
            {/* Adjusted gap-x to 2 */}
            <Link className="hover:underline" href="/">
              Home
            </Link>
            <Link className="hover:underline" href="/about">
              About Adlai
            </Link>
            <Link className="hover:underline" href="/impact">
              Impact
            </Link>
            <Link className="hover:underline" href="/board">
              Board
            </Link>
            <Link className="hover:underline" href="/programs">
              Programs
            </Link>
            <Link className="hover:underline" href="/blog">
              Blog
            </Link>
            <Link className="hover:underline" href="/volunteer">
              Volunteer
            </Link>
            <Link className="hover:underline" href="/donate">
              Donate
            </Link>
            <Link className="hover:underline" href="/contact">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
      <div className="mt-10 pt-8 border-t border-white/20 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Adlai Heroes Foundation. All rights reserved.</p>
      </div>
    </footer>
  )
}
