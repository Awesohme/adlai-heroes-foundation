// Cloudinary configuration and upload utilities

// Server-side cloudinary import only
let cloudinary: any = null
if (typeof window === 'undefined') {
  // Only import on server-side
  try {
    const { v2 } = require('cloudinary')
    cloudinary = v2
    
    // Configure Cloudinary (server-side only)
    if (process.env.CLOUDINARY_URL) {
      // Parse the CLOUDINARY_URL if provided
      const url = new URL(process.env.CLOUDINARY_URL)
      cloudinary.config({
        cloud_name: url.hostname,
        api_key: url.username,
        api_secret: url.password,
        secure: true
      })
    } else {
      // Fallback to individual environment variables
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      })
    }
  } catch (error) {
    console.warn('Cloudinary not available on server-side:', error)
  }
}

// Client-side upload function using unsigned upload with smart preset fallback
export const uploadToCloudinary = async (file: File, folder = 'adlai-heroes') => {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided')
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured')
  }

  // Smart preset fallback - try multiple presets
  const presets = ['adlai_preset', 'ml_default', 'default']
  
  for (const preset of presets) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', preset)
      if (folder) {
        formData.append('folder', folder)
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.warn(`Upload failed with preset ${preset}:`, errorText)
        continue // Try next preset
      }

      const data = await response.json()
      console.log(`Upload successful with preset: ${preset}`)
      
      return {
        url: data.secure_url,
        public_id: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        resource_type: data.resource_type,
      }
    } catch (error) {
      console.warn(`Error with preset ${preset}:`, error)
      continue // Try next preset
    }
  }
  
  throw new Error('Upload failed with all available presets. Please try using the URL input field instead.')
}

// Server-side upload function (for API routes)
export const serverUploadToCloudinary = async (file: Buffer | string, options: {
  folder?: string
  public_id?: string
  transformation?: any
} = {}) => {
  if (!cloudinary) {
    throw new Error('Cloudinary not available on server-side')
  }
  
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'adlai-heroes',
      public_id: options.public_id,
      transformation: options.transformation,
      resource_type: 'auto'
    })

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    }
  } catch (error) {
    console.error('Server Cloudinary upload error:', error)
    throw error
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
  if (!cloudinary) {
    throw new Error('Cloudinary not available on server-side')
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: 'auto' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop'
} = {}) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options

  let transformation = `c_${crop},q_${quality},f_${format}`
  
  if (width) transformation += `,w_${width}`
  if (height) transformation += `,h_${height}`

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
           (process.env.CLOUDINARY_URL || 
            (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)))
}

export default cloudinary