import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon, PhoneIcon, MailIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Contact Bar */}
      <div className="bg-gray-100 text-gray-700 text-sm py-2 hidden md:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="tel:+2347083060892" className="flex items-center gap-1 hover:text-primary transition-colors">
              <PhoneIcon className="h-4 w-4" />
              <span>+234 708 306 0892</span>
            </Link>
            <Link
              href="mailto:info@adlaiheroesfoundation.com.ng"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <MailIcon className="h-4 w-4" />
              <span>info@adlaiheroesfoundation.com.ng</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link aria-label="Facebook" href="#" className="hover:text-primary transition-colors">
              <FacebookIcon className="h-4 w-4" />
            </Link>
            <Link aria-label="Twitter" href="#" className="hover:text-primary transition-colors">
              <TwitterIcon className="h-4 w-4" />
            </Link>
            <Link aria-label="Instagram" href="#" className="hover:text-primary transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link aria-label="LinkedIn" href="#" className="hover:text-primary transition-colors">
              <LinkedinIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Image
            src="https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg"
            alt="Adlai Heroes Foundation Logo"
            width={100}
            height={40}
            className="h-10 w-auto"
          />
          <span className="sr-only">Adlai Heroes Foundation</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="hover:text-primary transition-colors" href="/">
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:text-primary transition-colors">
                About Us
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/about">About Adlai</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/impact">Impact</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/board">Board</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link className="hover:text-primary transition-colors" href="/programs">
            Programs
          </Link>
          <Link className="hover:text-primary transition-colors" href="/blog">
            Blog
          </Link>
          <Link className="hover:text-primary transition-colors" href="/volunteer">
            Volunteer
          </Link>
          <Link className="hover:text-primary transition-colors" href="/contact">
            Contact Us
          </Link>
          <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg">
            <Link href="/donate">Donate</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="md:hidden bg-transparent"
              size="icon"
              variant="outline"
              aria-label="Toggle navigation menu"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-4 p-4">
              <Link className="font-medium hover:text-primary transition-colors" href="/">
                Home
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/about">
                About Adlai
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/impact">
                Impact
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/board">
                Board
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/programs">
                Programs
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/blog">
                Blog
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/volunteer">
                Volunteer
              </Link>
              <Link className="font-medium hover:text-primary transition-colors" href="/contact">
                Contact Us
              </Link>
              <Button asChild className="bg-adlaiPink text-white hover:bg-adlaiPink/90 shadow-lg">
                <Link href="/donate">Donate</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
