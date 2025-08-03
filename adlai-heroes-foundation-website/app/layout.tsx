import type React from "react"
import type { Metadata } from "next"
import { Roboto, Open_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "./components/header"
import { Footer } from "./components/footer"

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Adlai Heroes Foundation",
  description: "Supporting underprivileged children through education and empowerment.",
  generator: 'v0.dev',
  icons: {
    icon: 'https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg',
    apple: 'https://res.cloudinary.com/dcvuzffgj/image/upload/v1754225835/White_bg_logo_rmuevq.jpg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${openSans.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
