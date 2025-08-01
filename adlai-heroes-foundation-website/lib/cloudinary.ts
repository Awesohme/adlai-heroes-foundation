// Cloudinary image optimization utilities
// Free tier: 25GB storage, 25GB bandwidth per month

interface CloudinaryTransformOptions {
  width?: number
  height?: number
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop'
  gravity?: 'center' | 'face' | 'auto'
  blur?: number
  sharpen?: boolean
}

export class CloudinaryImageOptimizer {
  private cloudName: string

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
  }

  /**
   * Generate optimized Cloudinary URL
   */
  getOptimizedUrl(
    publicId: string,
    options: CloudinaryTransformOptions = {}
  ): string {
    if (!this.cloudName) {
      console.warn('Cloudinary cloud name not configured')
      return publicId // Return original URL if not configured
    }

    const {
      width,
      height,
      quality = 'auto',
      format = 'auto',
      crop = 'fill',
      gravity = 'center',
      blur,
      sharpen
    } = options

    const transformations: string[] = []

    // Add width and height
    if (width || height) {
      const dimensions = [
        width && `w_${width}`,
        height && `h_${height}`,
        `c_${crop}`
      ].filter(Boolean).join(',')
      transformations.push(dimensions)
    }

    // Add quality and format for optimization
    transformations.push(`q_${quality}`)
    transformations.push(`f_${format}`)

    // Add gravity for smart cropping
    if (crop === 'fill' && gravity) {
      transformations.push(`g_${gravity}`)
    }

    // Add effects
    if (blur) {
      transformations.push(`e_blur:${blur}`)
    }
    if (sharpen) {
      transformations.push('e_sharpen')
    }

    const transformationString = transformations.join(',')
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformationString}/${publicId}`
  }

  /**
   * Get responsive image URLs for different screen sizes
   */
  getResponsiveUrls(publicId: string, options: CloudinaryTransformOptions = {}) {
    return {
      mobile: this.getOptimizedUrl(publicId, { ...options, width: 480 }),
      tablet: this.getOptimizedUrl(publicId, { ...options, width: 768 }),
      desktop: this.getOptimizedUrl(publicId, { ...options, width: 1200 }),
      large: this.getOptimizedUrl(publicId, { ...options, width: 1920 })
    }
  }

  /**
   * Get thumbnail URL
   */
  getThumbnail(publicId: string, size: number = 150): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'face'
    })
  }

  /**
   * Upload image to Cloudinary (for future CMS integration)
   */
  async uploadImage(file: File, folder?: string): Promise<{
    publicId: string
    url: string
    secureUrl: string
  }> {
    if (!this.cloudName) {
      throw new Error('Cloudinary not configured')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'unsigned_preset') // You'll need to set this up
    if (folder) {
      formData.append('folder', folder)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return {
      publicId: data.public_id,
      url: data.url,
      secureUrl: data.secure_url
    }
  }
}

// Export singleton instance
export const cloudinaryOptimizer = new CloudinaryImageOptimizer()

// Utility functions for easy use
export const getOptimizedImageUrl = (
  publicId: string,
  options?: CloudinaryTransformOptions
): string => {
  return cloudinaryOptimizer.getOptimizedUrl(publicId, options)
}

export const getResponsiveImageUrls = (
  publicId: string,
  options?: CloudinaryTransformOptions
) => {
  return cloudinaryOptimizer.getResponsiveUrls(publicId, options)
}

export const getThumbnailUrl = (publicId: string, size?: number): string => {
  return cloudinaryOptimizer.getThumbnail(publicId, size)
}

// Image optimization presets for common use cases
export const IMAGE_PRESETS = {
  hero: {
    width: 1920,
    height: 800,
    quality: 80,
    crop: 'fill' as const,
    gravity: 'center' as const
  },
  card: {
    width: 400,
    height: 250,
    quality: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'center' as const
  },
  profile: {
    width: 300,
    height: 300,
    quality: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'face' as const
  },
  thumbnail: {
    width: 150,
    height: 150,
    quality: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'face' as const
  },
  blog: {
    width: 800,
    height: 400,
    quality: 'auto' as const,
    crop: 'fill' as const,
    gravity: 'center' as const
  }
} as const

export default cloudinaryOptimizer