'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PlusIcon, EditIcon, TrashIcon, GlobeIcon, SettingsIcon } from "lucide-react"
import { type Program, type ImpactStat, type Testimonial, type BlogPost, type BoardMember, type ContentSection, type Page } from "@/lib/supabase"

interface AdminTabsProps {
  programs: Program[]
  stats: ImpactStat[]
  testimonials: Testimonial[]
  blogPosts: BlogPost[]
  boardMembers: BoardMember[]
  contentSections: ContentSection[]
  pages: Page[]
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
  onEdit,
  onAdd,
  onDelete
}: AdminTabsProps) {
  return (
    <Tabs defaultValue="programs" className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="programs">Programs</TabsTrigger>
        <TabsTrigger value="stats">Impact Stats</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        <TabsTrigger value="board">Board Members</TabsTrigger>
        <TabsTrigger value="content">Page Content</TabsTrigger>
        <TabsTrigger value="pages">Page Settings</TabsTrigger>
      </TabsList>

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