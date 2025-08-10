"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabaseApi } from "@/lib/supabase"

export default function BlogPage() {
  const [allBlogPosts, setAllBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const posts = await supabaseApi.getBlogPosts(true) // Only published posts
        setAllBlogPosts(posts)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-12 md:p-16 text-center shadow-2xl mb-16">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
              <span className="text-3xl">📰</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Our Latest News</h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Stay updated with our latest stories, achievements, and community impact
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Blog Posts Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Updates from the Foundation</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : currentPosts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {currentPosts.map((post) => (
              <Card variant="glass" key={post.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 w-[320px] flex-shrink-0">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="rounded-t-lg object-cover w-full h-[200px]"
                />
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gradient-primary">{post.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="text-primary hover:underline font-medium hover:rotate-12 transition-all duration-300 transform hover:scale-105">
                    Read More &rarr;
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No blog posts available at this time.</p>
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
