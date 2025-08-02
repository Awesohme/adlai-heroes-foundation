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
  created_at: string
  updated_at: string
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
  }
}