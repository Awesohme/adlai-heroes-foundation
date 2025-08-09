'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PlusIcon, EditIcon, TrashIcon, GlobeIcon, SettingsIcon } from "lucide-react"
import { type Program, type ImpactStat, type Testimonial, type BlogPost, type BoardMember, type ContentSection, type Page, type HeroSlide, type Partner, type ImpactTimeline } from "@/lib/supabase"

interface AdminTabsProps {
  programs: Program[]
  stats: ImpactStat[]
  testimonials: Testimonial[]
  blogPosts: BlogPost[]
  boardMembers: BoardMember[]
  contentSections: ContentSection[]
  pages: Page[]
  heroSlides: HeroSlide[]
  partners: Partner[]
  timeline: ImpactTimeline[]
  onEdit: (item: any, type: string) => void
  onAdd: (type: string) => void
  onDelete: (id: number, type: string) => void
}

export default function AdminTabs({
  programs,
  stats,
  testimonials,
  blogPosts,
  boardMembers,
  contentSections,
  pages,
  heroSlides,
  partners,
  timeline,
  onEdit,
  onAdd,
  onDelete
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('programs')

  // Load saved tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('admin-active-tab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  // Save tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    localStorage.setItem('admin-active-tab', value)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-10">
        <TabsTrigger value="hero-slides">Hero Slides</TabsTrigger>
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="stats">Impact Stats</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        <TabsTrigger value="board">Board Members</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
        <TabsTrigger value="content">Page Content</TabsTrigger>
        <TabsTrigger value="pages">Page Settings</TabsTrigger>
      </TabsList>

      {/* Hero Slides Tab */}
      <TabsContent value="hero-slides">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hero Slides Management</CardTitle>
            <Button onClick={() => onAdd('hero-slide')} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Hero Slide
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heroSlides.map((slide) => (
                <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{slide.title}</h3>
                      {!slide.active && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Order: {slide.order_index}</span>
                      <span>Created: {new Date(slide.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEdit(slide, 'hero-slide')}
                      size="sm"
                      variant="outline"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{slide.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(slide.id, 'hero-slide')}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {heroSlides.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hero slides found. Create your first hero slide to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Programs Tab */}
      <TabsContent value="programs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Programs Management</CardTitle>
            <Button onClick={() => onAdd('program')}>
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
                    <Button variant="outline" size="sm" onClick={() => onEdit(program, 'program')}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Program</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{program.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(program.id, 'program')}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            <Button onClick={() => onAdd('stat')}>
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
                      <Button variant="outline" size="sm" onClick={() => onEdit(stat, 'stat')}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Statistic</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{stat.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(stat.id, 'stat')}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

      {/* Impact Timeline Tab */}
      <TabsContent value="timeline">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Impact Timeline</CardTitle>
            <Button onClick={() => onAdd('timeline')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Timeline Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-adlaiBlue">{item.year}</span>
                      <h3 className="font-semibold">{item.title}</h3>
                      {!item.active && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Order: {item.order_index}</span>
                      <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item, 'timeline')}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Timeline Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.title}" from {item.year}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(item.id, 'timeline')}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No timeline items found. Create your first timeline item to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Testimonials Tab */}
      <TabsContent value="testimonials">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Testimonials</CardTitle>
            <Button onClick={() => onAdd('testimonial')}>
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
                    <Button variant="outline" size="sm" onClick={() => onEdit(testimonial, 'testimonial')}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the testimonial from "{testimonial.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(testimonial.id, 'testimonial')}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            <Button onClick={() => onAdd('blog')}>
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
                    <Button variant="outline" size="sm" onClick={() => onEdit(post, 'blog')}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(post.id, 'blog')}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
            <Button onClick={() => onAdd('board')}>
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
                      <Button variant="outline" size="sm" onClick={() => onEdit(member, 'board')}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Board Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove "{member.name}" from the board? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(member.id, 'board')}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

      {/* Partners Tab */}
      <TabsContent value="partners">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Partners Management</CardTitle>
            <Button onClick={() => onAdd('partner')} size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div key={partner.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{partner.name}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(partner, 'partner')}>
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{partner.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(partner.id, 'partner')}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {!partner.active && <Badge variant="secondary">Inactive</Badge>}
                    <span className="text-xs text-gray-500">Order: {partner.order_index}</span>
                  </div>
                  {partner.website_url && (
                    <a 
                      href={partner.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {partner.website_url}
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(partner.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No partners found. Add your first partner to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Page Content Tab */}
      <TabsContent value="content">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Page Content Sections</CardTitle>
            <Button onClick={() => onAdd('section')}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Content Section
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentSections.map((section) => (
                <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{section.title || section.section_key}</h3>
                      <Badge variant="outline" className="capitalize">
                        {section.page_key}
                      </Badge>
                      <Badge variant={section.active ? "default" : "secondary"}>
                        {section.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{section.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Order: {section.order_index} • Updated: {new Date(section.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(section, 'section')}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Content Section</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{section.title || section.section_key}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(section.id, 'section')}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Page Settings Tab */}
      <TabsContent value="pages">
        <Card>
          <CardHeader>
            <CardTitle>Page SEO & Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{page.title}</h3>
                      <Badge variant="outline">/{page.slug}</Badge>
                      <Badge variant={page.published ? "default" : "secondary"}>
                        {page.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{page.meta_description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Page Key: {page.page_key} • Updated: {new Date(page.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(page, 'page')}>
                      <SettingsIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}