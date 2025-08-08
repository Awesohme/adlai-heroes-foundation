'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { PlusIcon, EditIcon, TrashIcon, UsersIcon, BookOpenIcon, MessageSquareIcon, BarChartIcon, SettingsIcon, GlobeIcon } from "lucide-react"
import { supabaseApi, type Program, type ImpactStat, type Testimonial, type BlogPost, type BoardMember, type ContentSection, type Page, type HeroSlide, type Partner, type ImpactTimeline } from "@/lib/supabase"
import { adminApi } from "@/lib/admin-api"
import { toast } from "sonner"
import ProgramForm from "./components/program-form"
import TestimonialForm from "./components/testimonial-form"
import ImpactStatForm from "./components/impact-stat-form"
import BlogPostForm from "./components/blog-post-form"
import BoardMemberForm from "./components/board-member-form"
import ContentSectionForm from "./components/content-section-form"
import PageForm from "./components/page-form"
import HeroSlideForm from "./components/hero-slide-form"
import PartnerForm from "./components/partner-form"
import { ImpactTimelineForm } from "./components/impact-timeline-form"
import AdminTabs from "./components/admin-tabs"

export default function AdminDashboard() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [stats, setStats] = useState<ImpactStat[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [timeline, setTimeline] = useState<ImpactTimeline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    try {
      setIsLoading(true)
      console.log('🔍 Loading admin data...')
      
      const [programsData, statsData, testimonialsData, blogData, boardData, sectionsData, pagesData, heroSlidesData, partnersData, timelineData] = await Promise.all([
        supabaseApi.getPrograms(false).catch(err => {
          console.error('❌ Programs error:', err)
          return []
        }),
        supabaseApi.getImpactStats().catch(err => {
          console.error('❌ Impact Stats error:', err)
          return []
        }),
        supabaseApi.getTestimonials().catch(err => {
          console.error('❌ Testimonials error:', err)
          return []
        }),
        supabaseApi.getBlogPosts(false).catch(err => {
          console.error('❌ Blog Posts error:', err)
          return []
        }),
        supabaseApi.getBoardMembers().catch(err => {
          console.error('❌ Board Members error:', err)
          return []
        }),
        supabaseApi.getContentSections().catch(err => {
          console.error('❌ Content Sections error:', err)
          return []
        }),
        supabaseApi.getPages(false).catch(err => {
          console.error('❌ Pages error:', err)
          return []
        }),
        supabaseApi.getHeroSlides().catch(err => {
          console.error('❌ Hero Slides error:', err)
          return []
        }),
        supabaseApi.getPartners().catch(err => {
          console.error('❌ Partners error:', err)
          return []
        }),
        supabaseApi.getImpactTimeline().catch(err => {
          console.error('❌ Impact Timeline error:', err)
          return []
        })
      ])

      console.log('📊 Data loaded:', {
        programs: programsData.length,
        stats: statsData.length,
        testimonials: testimonialsData.length,
        blogPosts: blogData.length,
        boardMembers: boardData.length,
        contentSections: sectionsData.length,
        pages: pagesData.length,
        heroSlides: heroSlidesData.length,
        partners: partnersData.length,
        timeline: timelineData.length
      })

      setPrograms(programsData)
      setStats(statsData)
      setTestimonials(testimonialsData)
      setBlogPosts(blogData)
      setBoardMembers(boardData)
      setContentSections(sectionsData)
      setPages(pagesData)
      setHeroSlides(heroSlidesData)
      setPartners(partnersData)
      setTimeline(timelineData)
    } catch (error) {
      console.error('💥 Critical error loading admin data:', error)
      // Show a user-friendly message
      alert(`Admin data loading failed: ${error}. Check console for details.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item)
    setEditingType(type)
    setShowForm(true)
  }

  const handleAdd = (type: string) => {
    setEditingItem(null)
    setEditingType(type)
    setShowForm(true)
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingItem(null)
    setEditingType('')
    loadAllData()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
    setEditingType('')
  }

  const handleDelete = async (id: number, type: string) => {
    try {
      toast.loading(`Deleting ${type}...`)
      
      switch (type) {
        case 'program':
          await supabaseApi.deleteProgram(id)
          toast.success('Program Deleted Successfully!', {
            description: 'The program has been permanently removed.',
            duration: 3000
          })
          break
        case 'testimonial':
          await supabaseApi.deleteTestimonial(id)
          toast.success('Testimonial Deleted Successfully!', {
            description: 'The testimonial has been permanently removed.',
            duration: 3000
          })
          break
        case 'stat':
          await adminApi.deleteImpactStat(id)
          toast.success('Impact Statistic Deleted Successfully!', {
            description: 'The statistic has been permanently removed.',
            duration: 3000
          })
          break
        case 'blog':
          await supabaseApi.deleteBlogPost(id)
          toast.success('Blog Post Deleted Successfully!', {
            description: 'The blog post has been permanently removed.',
            duration: 3000
          })
          break
        case 'board':
          await supabaseApi.deleteBoardMember(id)
          toast.success('Board Member Deleted Successfully!', {
            description: 'The board member has been permanently removed.',
            duration: 3000
          })
          break
        case 'section':
          await supabaseApi.deleteContentSection(id)
          toast.success('Content Section Deleted Successfully!', {
            description: 'The content section has been permanently removed.',
            duration: 3000
          })
          break
        case 'hero-slide':
          await adminApi.deleteHeroSlide(id)
          toast.success('Hero Slide Deleted Successfully!', {
            description: 'The hero slide has been permanently removed.',
            duration: 3000
          })
          break
        case 'partner':
          await adminApi.deletePartner(id)
          toast.success('Partner Deleted Successfully!', {
            description: 'The partner has been permanently removed.',
            duration: 3000
          })
          break
        case 'timeline':
          await supabaseApi.deleteImpactTimeline(id)
          toast.success('Timeline Item Deleted Successfully!', {
            description: 'The timeline item has been permanently removed.',
            duration: 3000
          })
          break
      }
      loadAllData()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error(`Failed to Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`, {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        duration: 6000
      })
    }
  }

  const renderForm = () => {
    switch (editingType) {
      case 'program':
        return <ProgramForm program={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'testimonial':
        return <TestimonialForm testimonial={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'stat':
        return <ImpactStatForm stat={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'blog':
        return <BlogPostForm post={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'board':
        return <BoardMemberForm member={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'section':
        return <ContentSectionForm section={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'page':
        return <PageForm page={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'hero-slide':
        return <HeroSlideForm slide={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'partner':
        return <PartnerForm partner={editingItem} onSave={handleSave} onCancel={handleCancel} />
      case 'timeline':
        return <ImpactTimelineForm timeline={editingItem} onSubmit={async (data) => {
          try {
            if (editingItem) {
              await supabaseApi.updateImpactTimeline(editingItem.id, data)
            } else {
              await supabaseApi.createImpactTimeline(data)
            }
            handleSave()
          } catch (error) {
            console.error('Timeline submission error:', error)
            throw error
          }
        }} onCancel={handleCancel} />
      default:
        return null
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
        <AdminTabs
          programs={programs}
          stats={stats}
          testimonials={testimonials}
          blogPosts={blogPosts}
          boardMembers={boardMembers}
          contentSections={contentSections}
          pages={pages}
          heroSlides={heroSlides}
          partners={partners}
          timeline={timeline}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />

        {/* Edit Form Dialog */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl">
              {renderForm()}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2" 
              variant="outline"
              onClick={() => window.open('/', '_blank')}
            >
              <GlobeIcon className="h-6 w-6" />
              <span>View Website</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2" 
              variant="outline"
              onClick={() => handleAdd('section')}
            >
              <PlusIcon className="h-6 w-6" />
              <span>Add Content Section</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <SettingsIcon className="h-6 w-6" />
              <span>Refresh Data</span>
            </Button>
            <Button 
              className="h-auto p-4 flex flex-col items-center gap-2" 
              variant="outline"
              onClick={() => alert('Coming soon: User management functionality')}
            >
              <UsersIcon className="h-6 w-6" />
              <span>User Management</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}