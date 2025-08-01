import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BanknoteIcon, QrCodeIcon } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Donation background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Support Our Cause</h1>
      </section>

      {/* Donation Information */}
      <section className="text-center max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Your Contribution Changes Lives</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          Every donation, no matter how small, directly impacts our ability to provide education, healthcare, and
          support to underprivileged children. Your generosity helps us build a brighter future for those who need it
          most.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
            <BanknoteIcon className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Bank Transfer</CardTitle>
            <CardContent className="p-0 text-gray-900 space-y-2">
              <p>
                <strong>Bank Name:</strong> [Your Bank Name]
              </p>
              <p>
                <strong>Account Name:</strong> Adlai Heroes Foundation
              </p>
              <p>
                <strong>Account Number:</strong> 0123456789 (Placeholder)
              </p>
              <p className="text-sm italic mt-4">Please use your name as the reference for bank transfers.</p>
            </CardContent>
          </Card>
          <Card variant="glass" className="p-6 shadow-lg flex flex-col items-center text-center">
            <QrCodeIcon className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-4">Scan to Donate</CardTitle>
            <CardContent className="p-0 text-gray-900 space-y-2">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="QR Code for Bank Transfer"
                width={200}
                height={200}
                className="mb-4 rounded-md mx-auto"
              />
              <p className="text-sm italic">Scan this QR code with your banking app to make a quick transfer.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* External Payment Gateway CTA */}
      <Card variant="glass" className="text-center p-10 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gradient-primary mb-6">Prefer Online Payments?</h2>
        <p className="text-lg text-gray-900 mb-8">You can also donate securely through our online payment partners.</p>
        <Button asChild className="bg-donatePink text-primary-foreground hover:bg-donatePink/90 px-8 py-3 text-lg">
          <Link href="https://your-external-payment-link.com" target="_blank" rel="noopener noreferrer">
            Donate Online
          </Link>
        </Button>
      </Card>
    </div>
  )
}
