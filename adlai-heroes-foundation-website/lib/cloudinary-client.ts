// Cloudinary configuration and upload utilities
import { v2 as cloudinary } from 'cloudinary'

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

// Client-side upload function using unsigned upload
export const uploadToCloudinary = async (file: File, folder = 'adlai-heroes') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'adlai_preset')
  formData.append('folder', folder)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      resource_type: data.resource_type,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Server-side upload function (for API routes)
export const serverUploadToCloudinary = async (file: Buffer | string, options: {
  folder?: string
  public_id?: string
  transformation?: any
} = {}) => {
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