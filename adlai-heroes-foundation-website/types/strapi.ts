// Strapi Content Types for Adlai Heroes Foundation

export interface StrapiMediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width?: number
  height?: number
  size: number
  url: string
}

export interface StrapiMedia {
  id: number
  attributes: {
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: {
      thumbnail?: StrapiMediaFormat
      small?: StrapiMediaFormat
      medium?: StrapiMediaFormat
      large?: StrapiMediaFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    createdAt: string
    updatedAt: string
  }
}

export interface StrapiBaseEntity {
  id: number
  attributes: {
    createdAt: string
    updatedAt: string
    publishedAt?: string
  }
}

// Page Content Type
export interface StrapiPage extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    title: string
    slug: string
    content: string
    metaTitle?: string
    metaDescription?: string
    featuredImage?: {
      data?: StrapiMedia
    }
    isPublished: boolean
  }
}

// Program Content Type
export interface StrapiProgram extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    title: string
    slug: string
    description: string
    content: string
    shortDescription?: string
    featuredImage?: {
      data?: StrapiMedia
    }
    gallery?: {
      data?: StrapiMedia[]
    }
    category: 'education' | 'health' | 'empowerment' | 'community'
    status: 'active' | 'completed' | 'upcoming'
    beneficiaries?: number
    startDate?: string
    endDate?: string
    location?: string
    metaTitle?: string
    metaDescription?: string
    isPublished: boolean
  }
}

// Blog Post Content Type
export interface StrapiBlogPost extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    title: string
    slug: string
    content: string
    excerpt: string
    featuredImage?: {
      data?: StrapiMedia
    }
    author: string
    readTime?: number
    category?: string
    tags?: string[]
    metaTitle?: string
    metaDescription?: string
    isPublished: boolean
    isFeatured: boolean
  }
}

// Board Member Content Type
export interface StrapiBoardMember extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    name: string
    position: string
    bio: string
    profileImage?: {
      data?: StrapiMedia
    }
    email?: string
    linkedIn?: string
    twitter?: string
    order: number
    isActive: boolean
  }
}

// Testimonial Content Type
export interface StrapiTestimonial extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    quote: string
    author: string
    position?: string
    organization?: string
    location?: string
    image?: {
      data?: StrapiMedia
    }
    rating?: number
    isPublished: boolean
    isFeatured: boolean
  }
}

// Impact Stat Content Type
export interface StrapiImpactStat extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    title: string
    value: string
    description?: string
    icon?: string
    category: 'beneficiaries' | 'programs' | 'communities' | 'volunteers' | 'funds'
    order: number
    isActive: boolean
  }
}

// Hero Section Content Type
export interface StrapiHeroSection extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    title: string
    subtitle: string
    description?: string
    backgroundImage?: {
      data?: StrapiMedia
    }
    primaryButtonText?: string
    primaryButtonUrl?: string
    secondaryButtonText?: string
    secondaryButtonUrl?: string
    isActive: boolean
  }
}

// Global Settings Content Type
export interface StrapiGlobalSettings extends StrapiBaseEntity {
  attributes: StrapiBaseEntity['attributes'] & {
    siteName: string
    siteDescription: string
    logo?: {
      data?: StrapiMedia
    }
    favicon?: {
      data?: StrapiMedia
    }
    contactEmail: string
    contactPhone?: string
    address?: string
    socialMedia?: {
      facebook?: string
      twitter?: string
      instagram?: string
      linkedin?: string
      youtube?: string
    }
    donationUrl?: string
    footerText?: string
    metaTitle?: string
    metaDescription?: string
  }
}

// API Response Types
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiCollectionResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// API Error Type
export interface StrapiError {
  error: {
    status: number
    name: string
    message: string
    details?: any
  }
}

// Utility Types
export type StrapiEntityType = 
  | 'pages'
  | 'programs'
  | 'blog-posts'
  | 'board-members'
  | 'testimonials'
  | 'impact-stats'
  | 'hero-sections'
  | 'global-settings'

export type StrapiPopulate = string | string[] | {
  [key: string]: {
    populate?: StrapiPopulate
    fields?: string[]
    filters?: Record<string, any>
    sort?: string[]
  }
}

export interface StrapiQueryParams {
  populate?: StrapiPopulate
  fields?: string[]
  filters?: Record<string, any>
  sort?: string[]
  pagination?: {
    page?: number
    pageSize?: number
    start?: number
    limit?: number
  }
  publicationState?: 'live' | 'preview'
  locale?: string
}