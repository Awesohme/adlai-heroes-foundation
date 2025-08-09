// Admin API client for secure server-side operations
import type { ImpactStat, Program, BlogPost, Testimonial, BoardMember, ContentSection, Page, HeroSlide, Partner, TeamMember, ImpactTimeline, SiteSettings } from './supabase'

class AdminApiClient {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Impact Stats
  async createImpactStat(data: Omit<ImpactStat, 'id' | 'created_at'>): Promise<ImpactStat> {
    return this.request<ImpactStat>('/api/admin/impact-stats', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateImpactStat(id: number, data: Partial<Omit<ImpactStat, 'id' | 'created_at'>>): Promise<ImpactStat> {
    return this.request<ImpactStat>(`/api/admin/impact-stats/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteImpactStat(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/impact-stats/${id}`, {
      method: 'DELETE',
    })
  }

  // Programs
  async createProgram(data: Omit<Program, 'id' | 'created_at' | 'updated_at'>): Promise<Program> {
    return this.request<Program>('/api/admin/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProgram(id: number, data: Partial<Omit<Program, 'id' | 'created_at' | 'updated_at'>>): Promise<Program> {
    return this.request<Program>(`/api/admin/programs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteProgram(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/programs/${id}`, {
      method: 'DELETE',
    })
  }

  // Blog Posts
  async createBlogPost(data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    return this.request<BlogPost>('/api/admin/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBlogPost(id: number, data: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/admin/blog-posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteBlogPost(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/blog-posts/${id}`, {
      method: 'DELETE',
    })
  }

  // Testimonials
  async createTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
    return this.request<Testimonial>('/api/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTestimonial(id: number, data: Partial<Omit<Testimonial, 'id' | 'created_at'>>): Promise<Testimonial> {
    return this.request<Testimonial>(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTestimonial(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
    })
  }

  // Board Members
  async createBoardMember(data: Omit<BoardMember, 'id' | 'created_at'>): Promise<BoardMember> {
    return this.request<BoardMember>('/api/admin/board-members', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBoardMember(id: number, data: Partial<Omit<BoardMember, 'id' | 'created_at'>>): Promise<BoardMember> {
    return this.request<BoardMember>(`/api/admin/board-members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteBoardMember(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/board-members/${id}`, {
      method: 'DELETE',
    })
  }

  // Content Sections
  async createContentSection(data: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>): Promise<ContentSection> {
    return this.request<ContentSection>('/api/admin/content-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateContentSection(id: number, data: Partial<Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>>): Promise<ContentSection> {
    return this.request<ContentSection>(`/api/admin/content-sections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteContentSection(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/content-sections/${id}`, {
      method: 'DELETE',
    })
  }

  // Pages
  async updatePage(id: number, data: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>): Promise<Page> {
    return this.request<Page>(`/api/admin/pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Hero Slides
  async createHeroSlide(data: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HeroSlide> {
    return this.request<HeroSlide>('/api/admin/hero-slides', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateHeroSlide(id: number, data: Partial<Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>>): Promise<HeroSlide> {
    return this.request<HeroSlide>(`/api/admin/hero-slides/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteHeroSlide(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/hero-slides/${id}`, {
      method: 'DELETE',
    })
  }

  // Partners
  async createPartner(data: Omit<Partner, 'id' | 'created_at'>): Promise<Partner> {
    return this.request<Partner>('/api/admin/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePartner(id: number, data: Partial<Omit<Partner, 'id' | 'created_at'>>): Promise<Partner> {
    return this.request<Partner>(`/api/admin/partners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deletePartner(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/partners/${id}`, {
      method: 'DELETE',
    })
  }

  // Team Members
  async createTeamMember(data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    return this.request<TeamMember>('/api/admin/team-members', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTeamMember(id: number, data: Partial<Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>>): Promise<TeamMember> {
    return this.request<TeamMember>(`/api/admin/team-members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteTeamMember(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/team-members/${id}`, {
      method: 'DELETE',
    })
  }

  // Impact Timeline
  async createImpactTimeline(data: Omit<ImpactTimeline, 'id' | 'created_at' | 'updated_at'>): Promise<ImpactTimeline> {
    return this.request<ImpactTimeline>('/api/admin/impact-timeline', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateImpactTimeline(id: number, data: Partial<Omit<ImpactTimeline, 'id' | 'created_at' | 'updated_at'>>): Promise<ImpactTimeline> {
    return this.request<ImpactTimeline>(`/api/admin/impact-timeline/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteImpactTimeline(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/impact-timeline/${id}`, {
      method: 'DELETE',
    })
  }

  // Site Settings
  async getSiteSettings(category?: string): Promise<SiteSettings[]> {
    const url = category 
      ? `/api/admin/site-settings?category=${encodeURIComponent(category)}`
      : '/api/admin/site-settings'
    return this.request<SiteSettings[]>(url)
  }

  async updateSiteSettings(updates: Array<{setting_key: string, setting_value: string}>): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/admin/site-settings', {
      method: 'POST',
      body: JSON.stringify(updates),
    })
  }

  async getSiteSettingByKey(settingKey: string): Promise<SiteSettings> {
    return this.request<SiteSettings>(`/api/admin/site-settings/${settingKey}`)
  }

  async updateSiteSetting(settingKey: string, settingValue: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/admin/site-settings/${settingKey}`, {
      method: 'PUT',
      body: JSON.stringify({ setting_value: settingValue }),
    })
  }
}

export const adminApi = new AdminApiClient()