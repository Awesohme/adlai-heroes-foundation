"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PhoneIcon, MailIcon, MapPinIcon, FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { BalloonLoader } from "@/components/balloon-loader"
import { Card } from "@/components/ui/card"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("Sending...")
    await new Promise((resolve) => setTimeout(resolve, 2500))
    console.log("Form submitted:", formData)
    setStatus("Message sent successfully!")
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Contact us background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Contact Us</h1>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <Card variant="glass" className="p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gradient-primary mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-lg text-gray-900">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 p-3 border rounded-md w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-lg text-gray-900">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 p-3 border rounded-md w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-lg text-gray-900">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-2 p-3 border rounded-md w-full"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <BalloonLoader size={16} colors={["#FFFFFF", "#F5F5F5", "#E03A5F"]} />
                  <span>Sending...</span>
                </div>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
            {status && !isSubmitting && (
              <p className={`mt-4 text-center ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {status}
              </p>
            )}
          </form>
        </Card>

        {/* Contact Details */}
        <Card variant="glass" className="p-8 rounded-lg shadow-lg flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gradient-primary mb-6">Our Contact Details</h2>
          <div className="space-y-6 text-lg text-gray-900">
            <div className="flex items-center gap-4">
              <PhoneIcon className="h-7 w-7 text-primary" />
              <span>+234 708 306 0892</span>
            </div>
            <div className="flex items-center gap-4">
              <MailIcon className="h-7 w-7 text-primary" />
              <span>admin@adlaiheroesfoundation.com.ng</span>
            </div>
            <div className="flex items-start gap-4">
              <MapPinIcon className="h-7 w-7 text-primary mt-1" />
              <span>Flat 1a, No. 28, Alhaji Isiakanda street, Ilasamaja, Lagos State</span>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gradient-primary mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <Link aria-label="Facebook" href="#" className="text-gray-900 hover:text-primary transition-colors">
                <FacebookIcon className="h-8 w-8" />
              </Link>
              <Link aria-label="Twitter" href="#" className="text-gray-900 hover:text-primary transition-colors">
                <TwitterIcon className="h-8 w-8" />
              </Link>
              <Link aria-label="Instagram" href="#" className="text-gray-900 hover:text-primary transition-colors">
                <InstagramIcon className="h-8 w-8" />
              </Link>
              <Link aria-label="LinkedIn" href="#" className="text-gray-900 hover:text-primary transition-colors">
                <LinkedinIcon className="h-8 w-8" />
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
