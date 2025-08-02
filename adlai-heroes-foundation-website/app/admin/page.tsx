'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, BookOpenIcon, MessageSquareIcon, BarChartIcon } from "lucide-react"
import { supabaseApi, type Program, type ImpactStat, type Testimonial, type BlogPost, type BoardMember } from "@/lib/supabase"

export default function AdminDashboard() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [stats, setStats] = useState<ImpactStat[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    try {
      setIsLoading(true)
      const [programsData, statsData, testimonialsData, blogData, boardData] = await Promise.all([
        supabaseApi.getPrograms(false), // Include unpublished
        supabaseApi.getImpactStats(),
        supabaseApi.getTestimonials(),
        supabaseApi.getBlogPosts(false), // Include unpublished
        supabaseApi.getBoardMembers()
      ])

      setPrograms(programsData)
      setStats(statsData)
      setTestimonials(testimonialsData)
      setBlogPosts(blogData)
      setBoardMembers(boardData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your Adlai Heroes Foundation website content</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChartIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Impact Stats</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquareIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Testimonials</p>
                  <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Board Members</p>
                  <p className="text-2xl font-bold text-gray-900">{boardMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="stats">Impact Stats</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="board">Board Members</TabsTrigger>
          </TabsList>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Programs Management</CardTitle>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{program.title}</h3>
                          <Badge variant={program.published ? "default" : "secondary"}>
                            {program.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {program.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1 line-clamp-2">{program.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Created: {new Date(program.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Impact Statistics</CardTitle>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Statistic
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{stat.title}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Order: {stat.order_index}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Testimonials</CardTitle>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <Badge variant={testimonial.featured ? "default" : "secondary"}>
                            {testimonial.featured ? "Featured" : "Regular"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-3">"{testimonial.content}"</p>
                        <p className="text-sm text-gray-500">
                          {testimonial.location} • {new Date(testimonial.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Posts</CardTitle>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Post
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1 line-clamp-2">{post.excerpt}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Board Members Tab */}
          <TabsContent value="board">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Board Members</CardTitle>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boardMembers.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary mb-2">{member.position}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                      <p className="text-xs text-gray-500 mt-2">Order: {member.order_index}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <BookOpenIcon className="h-6 w-6" />
              <span>View Website</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <BarChartIcon className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
            <Button className="h-auto p-4 flex flex-col items-center gap-2" variant="outline">
              <UsersIcon className="h-6 w-6" />
              <span>User Management</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}