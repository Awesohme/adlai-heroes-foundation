import useSWR from 'swr'
import { strapiAPI } from '@/lib/strapi'
import {
  StrapiPage,
  StrapiProgram,
  StrapiBlogPost,
  StrapiBoardMember,
  StrapiTestimonial,
  StrapiImpactStat,
  StrapiHeroSection,
  StrapiGlobalSettings,
  StrapiQueryParams,
  StrapiCollectionResponse,
  StrapiResponse,
} from '@/types/strapi'

// Configuration
const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
}

// Generic hook for Strapi collections
export function useStrapiCollection<T>(
  endpoint: string,
  params?: StrapiQueryParams,
  options?: {
    fallbackData?: StrapiCollectionResponse<T>
    refreshInterval?: number
    revalidateOnFocus?: boolean
  }
) {
  const key = params ? `${endpoint}?${JSON.stringify(params)}` : endpoint
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const response = await strapiAPI.findMany<T>(endpoint as any, params)
      return response
    },
    {
      ...SWR_CONFIG,
      ...options,
    }
  )

  return {
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  }
}

// Generic hook for single Strapi entity
export function useStrapiEntity<T>(
  endpoint: string,
  id: number | string,
  params?: StrapiQueryParams,
  options?: {
    fallbackData?: StrapiResponse<T>
    refreshInterval?: number
    revalidateOnFocus?: boolean
  }
) {
  const key = params ? `${endpoint}/${id}?${JSON.stringify(params)}` : `${endpoint}/${id}`
  
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const response = await strapiAPI.findOne<T>(endpoint as any, id, params)
      return response
    },
    {
      ...SWR_CONFIG,
      ...options,
    }
  )

  return {
    data: data?.data,
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  }
}

// Specific hooks for each content type

export function usePages(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiPage>('pages', {
    populate: ['featuredImage'],
    ...params,
  })
}

export function usePage(id: number | string, params?: StrapiQueryParams) {
  return useStrapiEntity<StrapiPage>('pages', id, {
    populate: ['featuredImage'],
    ...params,
  })
}

export function usePageBySlug(slug: string, params?: StrapiQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    `pages/slug/${slug}`,
    async () => {
      const page = await strapiAPI.getPageBySlug(slug, params)
      return page
    },
    SWR_CONFIG
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function usePrograms(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiProgram>('programs', {
    populate: ['featuredImage', 'gallery'],
    sort: ['createdAt:desc'],
    ...params,
  })
}

export function useProgram(id: number | string, params?: StrapiQueryParams) {
  return useStrapiEntity<StrapiProgram>('programs', id, {
    populate: ['featuredImage', 'gallery'],
    ...params,
  })
}

export function useProgramBySlug(slug: string, params?: StrapiQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    `programs/slug/${slug}`,
    async () => {
      const program = await strapiAPI.getProgramBySlug(slug, params)
      return program
    },
    SWR_CONFIG
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function useBlogPosts(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiBlogPost>('blog-posts', {
    populate: ['featuredImage'],
    sort: ['createdAt:desc'],
    ...params,
  })
}

export function useBlogPost(id: number | string, params?: StrapiQueryParams) {
  return useStrapiEntity<StrapiBlogPost>('blog-posts', id, {
    populate: ['featuredImage'],
    ...params,
  })
}

export function useBlogPostBySlug(slug: string, params?: StrapiQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    `blog-posts/slug/${slug}`,
    async () => {
      const post = await strapiAPI.getBlogPostBySlug(slug, params)
      return post
    },
    SWR_CONFIG
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function useBoardMembers(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiBoardMember>('board-members', {
    populate: ['profileImage'],
    sort: ['order:asc'],
    filters: { isActive: { $eq: true } },
    ...params,
  })
}

export function useTestimonials(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiTestimonial>('testimonials', {
    populate: ['image'],
    sort: ['createdAt:desc'],
    filters: { isPublished: { $eq: true } },
    ...params,
  })
}

export function useFeaturedTestimonials(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiTestimonial>('testimonials', {
    populate: ['image'],
    sort: ['createdAt:desc'],
    filters: { 
      isPublished: { $eq: true },
      isFeatured: { $eq: true }
    },
    ...params,
  })
}

export function useImpactStats(params?: StrapiQueryParams) {
  return useStrapiCollection<StrapiImpactStat>('impact-stats', {
    sort: ['order:asc'],
    filters: { isActive: { $eq: true } },
    ...params,
  })
}

export function useHeroSection(params?: StrapiQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    'hero-section',
    async () => {
      const response = await strapiAPI.getHeroSection(params)
      return response.data.length > 0 ? response.data[0] : null
    },
    SWR_CONFIG
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function useGlobalSettings(params?: StrapiQueryParams) {
  const { data, error, isLoading, mutate } = useSWR(
    'global-settings',
    async () => {
      const response = await strapiAPI.getGlobalSettings(params)
      return response.data
    },
    {
      ...SWR_CONFIG,
      refreshInterval: 10 * 60 * 1000, // 10 minutes for global settings
    }
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

// Utility hooks
export function useStrapiMedia() {
  return {
    getMediaUrl: strapiAPI.getMediaUrl.bind(strapiAPI),
    getOptimizedImageUrl: strapiAPI.getOptimizedImageUrl.bind(strapiAPI),
  }
}