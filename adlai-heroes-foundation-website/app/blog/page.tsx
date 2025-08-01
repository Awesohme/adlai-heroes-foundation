"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function BlogPage() {
  const allBlogPosts = [
    {
      id: "1",
      title: "Empowering Futures: Our Latest Educational Initiative",
      date: "July 25, 2024",
      excerpt: "Discover how our new program is bringing quality education to remote communities...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Health Outreach: A Day of Free Medical Check-ups",
      date: "July 18, 2024",
      excerpt: "Recap of our recent health camp, providing vital services to hundreds of children...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Volunteer Spotlight: Meet Our Heroes",
      date: "July 10, 2024",
      excerpt: "An interview with one of our dedicated volunteers and their inspiring journey...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Community Development: Building a Brighter Tomorrow",
      date: "June 30, 2024",
      excerpt: "Learn about our sustainable projects aimed at improving living conditions...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "5",
      title: "The Power of Play: Our New Recreational Program",
      date: "June 20, 2024",
      excerpt: "Introducing our initiative to provide safe and engaging play spaces for children...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "6",
      title: "Digital Inclusion: Bridging the Tech Gap",
      date: "June 15, 2024",
      excerpt: "How our digital literacy program is preparing children for the future...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "7",
      title: "Nutrition for Growth: Healthy Meals Initiative",
      date: "June 05, 2024",
      excerpt: "Ensuring children receive nutritious meals for their healthy development...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "8",
      title: "Success Stories: From Beneficiary to Leader",
      date: "May 28, 2024",
      excerpt: "Read inspiring stories of children who have thrived with our support...",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const POSTS_PER_PAGE = 6
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(allBlogPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = allBlogPosts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Blog background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Latest News</h1>
      </section>

      {/* Blog Posts Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Updates from the Foundation</h2>
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Card variant="glass" key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-[200px]"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gradient-primary">{post.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="text-primary hover:underline font-medium">
                    Read More &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No blog posts found.</p>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className="px-4 py-2"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
