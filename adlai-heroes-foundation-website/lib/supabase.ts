import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Program {
  id: number
  title: string
  slug: string
  description?: string
  content?: string
  featured_image?: string
  category: 'education' | 'health' | 'empowerment' | 'community'
  published: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  featured_image?: string
  author?: string
  published: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  created_at: string
  updated_at: string
}

export interface HomepageContent {
  id: number
  section_key: string
  title?: string
  subtitle?: string
  content?: string
  image_url?: string
  button_text?: string
  button_link?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Page {
  id: number
  page_key: string
  title: string
  slug: string
  content?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface ContentSection {
  id: number
  section_key: string
  page_key?: string
  title?: string
  subtitle?: string
  content?: string
  image_url?: string
  button_text?: string
  button_link?: string
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface FooterContent {
  id: number
  section_key: string
  title?: string
  content?: string
  links: Array<{label: string, href: string, text?: string}>
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface NavigationMenu {
  id: number
  label: string
  href: string
  order_index: number
  parent_id?: number
  active: boolean
  created_at: string
}

export interface BoardMember {
  id: number
  name: string
  position?: string
  bio?: string
  image?: string
  order_index: number
  created_at: string
}

export interface Testimonial {
  id: number
  name: string
  content: string
  image?: string
  location?: string
  featured: boolean
  created_at: string
}

export interface ImpactStat {
  id: number
  title: string
  value: string
  description?: string
  icon?: string
  order_index: number
  created_at: string
}

// Helper functions for data fetching
export const supabaseApi = {
  // Programs
  async getPrograms(published = true) {
    const query = supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (published) {
      query.eq('published', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Program[]
  },

  async getProgram(slug: string) {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) throw error
    return data as Program
  },

  // Blog posts
  async getBlogPosts(published = true) {
    const query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (published) {
      query.eq('published', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as BlogPost[]
  },

  async getBlogPost(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  // Board members
  async getBoardMembers() {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data as BoardMember[]
  },

  // Testimonials
  async getTestimonials(featured?: boolean) {
    const query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (featured !== undefined) {
      query.eq('featured', featured)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Testimonial[]
  },

  // Impact stats
  async getImpactStats() {
    const { data, error } = await supabase
      .from('impact_stats')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data as ImpactStat[]
  },

  // Homepage content
  async getHomepageContent(sectionKey?: string) {
    const query = supabase
      .from('homepage_content')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })
    
    if (sectionKey) {
      query.eq('section_key', sectionKey)
    }
    
    const { data, error } = await query
    if (error) throw error
    return sectionKey ? (data as HomepageContent[])[0] || null : data as HomepageContent[]
  },

  // Image upload to Supabase Storage
  async uploadImage(file: File, bucket = 'images', folder = '') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return { path: data.path, url: publicUrl }
  },

  // Delete image from Supabase Storage
  async deleteImage(path: string, bucket = 'images') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
    return true
  },

  // CRUD operations for all entities
  async createProgram(data: Omit<Program, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('programs')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as Program
  },

  async updateProgram(id: number, data: Partial<Omit<Program, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('programs')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!result || result.length === 0) {
      throw new Error(`Program with id ${id} not found`)
    }
    return result[0] as Program
  },

  async deleteProgram(id: number) {
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async createBlogPost(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as BlogPost
  },

  async updateBlogPost(id: number, data: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!result || result.length === 0) {
      throw new Error(`Blog post with id ${id} not found`)
    }
    return result[0] as BlogPost
  },

  async deleteBlogPost(id: number) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async createTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('testimonials')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as Testimonial
  },

  async updateTestimonial(id: number, data: Partial<Omit<Testimonial, 'id' | 'created_at'>>) {
    const { data: result, error } = await supabase
      .from('testimonials')
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!result || result.length === 0) {
      throw new Error(`Testimonial with id ${id} not found`)
    }
    return result[0] as Testimonial
  },

  async deleteTestimonial(id: number) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async createImpactStat(data: Omit<ImpactStat, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('impact_stats')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as ImpactStat
  },

  async updateImpactStat(id: number, data: Partial<Omit<ImpactStat, 'id' | 'created_at'>>) {
    const { data: result, error } = await supabase
      .from('impact_stats')
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!result || result.length === 0) {
      throw new Error(`Impact stat with id ${id} not found`)
    }
    return result[0] as ImpactStat
  },

  async deleteImpactStat(id: number) {
    const { error } = await supabase
      .from('impact_stats')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async createBoardMember(data: Omit<BoardMember, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('board_members')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as BoardMember
  },

  async updateBoardMember(id: number, data: Partial<Omit<BoardMember, 'id' | 'created_at'>>) {
    const { data: result, error } = await supabase
      .from('board_members')
      .update(data)
      .eq('id', id)
      .select()
    
    if (error) throw error
    if (!result || result.length === 0) {
      throw new Error(`Board member with id ${id} not found`)
    }
    return result[0] as BoardMember
  },

  async deleteBoardMember(id: number) {
    const { error } = await supabase
      .from('board_members')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  async updateHomepageContent(id: number, data: Partial<Omit<HomepageContent, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('homepage_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as HomepageContent
  },

  // Pages CRUD
  async getPages(published = true) {
    const query = supabase
      .from('pages')
      .select('*')
      .order('page_key', { ascending: true })
    
    if (published) {
      query.eq('published', true)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Page[]
  },

  async getPage(pageKey: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('page_key', pageKey)
      .single()
    
    if (error) throw error
    return data as Page
  },

  async updatePage(id: number, data: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('pages')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as Page
  },

  // Content Sections CRUD
  async getContentSections(pageKey?: string) {
    const query = supabase
      .from('content_sections')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })
    
    if (pageKey) {
      query.eq('page_key', pageKey)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as ContentSection[]
  },

  async getContentSection(sectionKey: string) {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', sectionKey)
      .single()
    
    if (error) throw error
    return data as ContentSection
  },

  async updateContentSection(id: number, data: Partial<Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('content_sections')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as ContentSection
  },

  async createContentSection(data: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase
      .from('content_sections')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as ContentSection
  },

  async deleteContentSection(id: number) {
    const { error } = await supabase
      .from('content_sections')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Footer Content CRUD
  async getFooterContent() {
    const { data, error } = await supabase
      .from('footer_content')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data as FooterContent[]
  },

  async updateFooterContent(id: number, data: Partial<Omit<FooterContent, 'id' | 'created_at' | 'updated_at'>>) {
    const { data: result, error } = await supabase
      .from('footer_content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as FooterContent
  },

  // Navigation Menu CRUD
  async getNavigationMenu() {
    const { data, error } = await supabase
      .from('navigation_menu')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data as NavigationMenu[]
  },

  async updateNavigationMenu(id: number, data: Partial<Omit<NavigationMenu, 'id' | 'created_at'>>) {
    const { data: result, error } = await supabase
      .from('navigation_menu')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return result as NavigationMenu
  },

  async createNavigationMenu(data: Omit<NavigationMenu, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('navigation_menu')
      .insert([data])
      .select()
      .single()
    
    if (error) throw error
    return result as NavigationMenu
  },

  async deleteNavigationMenu(id: number) {
    const { error } = await supabase
      .from('navigation_menu')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}