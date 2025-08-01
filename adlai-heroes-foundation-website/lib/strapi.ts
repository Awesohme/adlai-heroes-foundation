import {
  StrapiResponse,
  StrapiCollectionResponse,
  StrapiError,
  StrapiEntityType,
  StrapiQueryParams,
  StrapiPage,
  StrapiProgram,
  StrapiBlogPost,
  StrapiBoardMember,
  StrapiTestimonial,
  StrapiImpactStat,
  StrapiHeroSection,
  StrapiGlobalSettings,
} from '@/types/strapi'

// Environment variables with fallbacks
const STRAPI_API_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

// Cache duration constants
const CACHE_REVALIDATE_TIME = 300 // 5 minutes
const ISR_REVALIDATE_TIME = 3600 // 1 hour

class StrapiAPI {
  private baseURL: string
  private token: string

  constructor() {
    this.baseURL = STRAPI_API_URL
    this.token = STRAPI_API_TOKEN
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}/api/${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    // Add caching for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      config.next = {
        revalidate: CACHE_REVALIDATE_TIME,
        tags: [endpoint.split('?')[0]], // Use endpoint as cache tag
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData: StrapiError = await response.json()
        throw new Error(`Strapi API Error: ${errorData.error.message}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Strapi API request failed:', error)
      throw error
    }
  }

  private buildQueryString(params?: StrapiQueryParams): string {
    if (!params) return ''

    const searchParams = new URLSearchParams()

    // Handle populate
    if (params.populate) {
      if (typeof params.populate === 'string') {
        searchParams.append('populate', params.populate)
      } else if (Array.isArray(params.populate)) {
        params.populate.forEach(item => searchParams.append('populate', item))
      } else {
        // Handle complex populate object
        Object.entries(params.populate).forEach(([key, value]) => {
          searchParams.append(`populate[${key}]`, JSON.stringify(value))
        })
      }
    }

    // Handle fields
    if (params.fields) {
      params.fields.forEach(field => searchParams.append('fields', field))
    }

    // Handle filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.append(`filters[${key}]`, String(value))
      })
    }

    // Handle sort
    if (params.sort) {
      params.sort.forEach(sortItem => searchParams.append('sort', sortItem))
    }

    // Handle pagination
    if (params.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(`pagination[${key}]`, String(value))
        }
      })
    }

    // Handle publication state
    if (params.publicationState) {
      searchParams.append('publicationState', params.publicationState)
    }

    // Handle locale
    if (params.locale) {
      searchParams.append('locale', params.locale)
    }

    return searchParams.toString()
  }

  // Generic methods
  async findMany<T>(
    entityType: StrapiEntityType,
    params?: StrapiQueryParams
  ): Promise<StrapiCollectionResponse<T>> {
    const queryString = this.buildQueryString(params)
    const endpoint = queryString ? `${entityType}?${queryString}` : entityType
    return this.request<StrapiCollectionResponse<T>>(endpoint)
  }

  async findOne<T>(
    entityType: StrapiEntityType,
    id: number | string,
    params?: StrapiQueryParams
  ): Promise<StrapiResponse<T>> {
    const queryString = this.buildQueryString(params)
    const endpoint = queryString ? `${entityType}/${id}?${queryString}` : `${entityType}/${id}`
    return this.request<StrapiResponse<T>>(endpoint)
  }

  async findBySlug<T>(
    entityType: StrapiEntityType,
    slug: string,
    params?: StrapiQueryParams
  ): Promise<T | null> {
    const filterParams: StrapiQueryParams = {
      ...params,
      filters: {
        ...params?.filters,
        slug: { $eq: slug },
      },
    }

    const response = await this.findMany<T>(entityType, filterParams)
    return response.data.length > 0 ? response.data[0] : null
  }

  // Specific entity methods
  async getPages(params?: StrapiQueryParams) {
    return this.findMany<StrapiPage>('pages', {
      populate: ['featuredImage'],
      ...params,
    })
  }

  async getPage(id: number | string, params?: StrapiQueryParams) {
    return this.findOne<StrapiPage>('pages', id, {
      populate: ['featuredImage'],
      ...params,
    })
  }

  async getPageBySlug(slug: string, params?: StrapiQueryParams) {
    return this.findBySlug<StrapiPage>('pages', slug, {
      populate: ['featuredImage'],
      ...params,
    })
  }

  async getPrograms(params?: StrapiQueryParams) {
    return this.findMany<StrapiProgram>('programs', {
      populate: ['featuredImage', 'gallery'],
      sort: ['createdAt:desc'],
      ...params,
    })
  }

  async getProgram(id: number | string, params?: StrapiQueryParams) {
    return this.findOne<StrapiProgram>('programs', id, {
      populate: ['featuredImage', 'gallery'],
      ...params,
    })
  }

  async getProgramBySlug(slug: string, params?: StrapiQueryParams) {
    return this.findBySlug<StrapiProgram>('programs', slug, {
      populate: ['featuredImage', 'gallery'],
      ...params,
    })
  }

  async getBlogPosts(params?: StrapiQueryParams) {
    return this.findMany<StrapiBlogPost>('blog-posts', {
      populate: ['featuredImage'],
      sort: ['createdAt:desc'],
      ...params,
    })
  }

  async getBlogPost(id: number | string, params?: StrapiQueryParams) {
    return this.findOne<StrapiBlogPost>('blog-posts', id, {
      populate: ['featuredImage'],
      ...params,
    })
  }

  async getBlogPostBySlug(slug: string, params?: StrapiQueryParams) {
    return this.findBySlug<StrapiBlogPost>('blog-posts', slug, {
      populate: ['featuredImage'],
      ...params,
    })
  }

  async getBoardMembers(params?: StrapiQueryParams) {
    return this.findMany<StrapiBoardMember>('board-members', {
      populate: ['profileImage'],
      sort: ['order:asc'],
      filters: { isActive: { $eq: true } },
      ...params,
    })
  }

  async getTestimonials(params?: StrapiQueryParams) {
    return this.findMany<StrapiTestimonial>('testimonials', {
      populate: ['image'],
      sort: ['createdAt:desc'],
      filters: { isPublished: { $eq: true } },
      ...params,
    })
  }

  async getFeaturedTestimonials(params?: StrapiQueryParams) {
    return this.findMany<StrapiTestimonial>('testimonials', {
      populate: ['image'],
      sort: ['createdAt:desc'],
      filters: { 
        isPublished: { $eq: true },
        isFeatured: { $eq: true }
      },
      ...params,
    })
  }

  async getImpactStats(params?: StrapiQueryParams) {
    return this.findMany<StrapiImpactStat>('impact-stats', {
      sort: ['order:asc'],
      filters: { isActive: { $eq: true } },
      ...params,
    })
  }

  async getHeroSection(params?: StrapiQueryParams) {
    return this.findMany<StrapiHeroSection>('hero-sections', {
      populate: ['backgroundImage'],
      filters: { isActive: { $eq: true } },
      pagination: { limit: 1 },
      ...params,
    })
  }

  async getGlobalSettings(params?: StrapiQueryParams) {
    return this.findOne<StrapiGlobalSettings>('global-settings', 1, {
      populate: ['logo', 'favicon'],
      ...params,
    })
  }

  // Utility methods
  getMediaUrl(media?: { data?: { attributes?: { url?: string } } }): string {
    if (!media?.data?.attributes?.url) return ''
    
    const url = media.data.attributes.url
    // If URL is relative, prepend Strapi base URL
    return url.startsWith('http') ? url : `${this.baseURL}${url}`
  }

  getOptimizedImageUrl(
    media?: { data?: { attributes?: any } },
    format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
  ): string {
    if (!media?.data?.attributes) return ''

    const attributes = media.data.attributes
    const formatUrl = attributes.formats?.[format]?.url
    const originalUrl = attributes.url

    const url = formatUrl || originalUrl
    if (!url) return ''

    return url.startsWith('http') ? url : `${this.baseURL}${url}`
  }

  // Cache invalidation
  async revalidateTag(tag: string) {
    if (typeof window === 'undefined') {
      // Server-side cache revalidation
      const { revalidateTag } = await import('next/cache')
      revalidateTag(tag)
    }
  }

  async revalidatePath(path: string) {
    if (typeof window === 'undefined') {
      // Server-side cache revalidation
      const { revalidatePath } = await import('next/cache')
      revalidatePath(path)
    }
  }
}

// Export singleton instance
export const strapiAPI = new StrapiAPI()

// Export utility functions
export const getStrapiMediaUrl = (media?: { data?: { attributes?: { url?: string } } }): string => {
  return strapiAPI.getMediaUrl(media)
}

export const getStrapiOptimizedImageUrl = (
  media?: { data?: { attributes?: any } },
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string => {
  return strapiAPI.getOptimizedImageUrl(media, format)
}

// Default export
export default strapiAPI