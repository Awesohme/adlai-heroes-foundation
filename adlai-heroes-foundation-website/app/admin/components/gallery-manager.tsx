'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  X, 
  Star, 
  StarIcon, 
  MoveUpIcon, 
  MoveDownIcon,
  ImageIcon,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/cloudinary-client"

interface GalleryImage {
  url: string
  publicId?: string
  isUploading?: boolean
}

interface GalleryManagerProps {
  images: string[]
  featuredImage?: string
  onImagesChange: (images: string[]) => void
  onFeaturedImageChange: (url: string) => void
  label?: string
  maxImages?: number
  folder?: string
}

export default function GalleryManager({
  images = [],
  featuredImage = '',
  onImagesChange,
  onFeaturedImageChange,
  label = "Gallery Images",
  maxImages = 5,
  folder = 'programs/'
}: GalleryManagerProps) {
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList) => {
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast.error(`Gallery Limit Exceeded`, {
        description: `You can only have a maximum of ${maxImages} images. Current: ${images.length}`,
        duration: 4000
      })
      return
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid File Type', {
          description: `${file.name} is not a valid image file`,
          duration: 4000
        })
        continue
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File Too Large', {
          description: `${file.name} is larger than 5MB`,
          duration: 4000
        })
        continue
      }

      const tempIndex = images.length + i
      setUploadingImages(prev => ({ ...prev, [tempIndex]: true }))

      try {
        toast.loading(`Uploading ${file.name}...`)
        
        const result = await uploadToCloudinary(file, folder)
        
        // Add the new image URL
        const newImages = [...images, result.url]
        onImagesChange(newImages)
        
        // Set as featured image if it's the first image and no featured image exists
        if (!featuredImage && newImages.length === 1) {
          onFeaturedImageChange(result.url)
        }

        toast.success('Image Uploaded Successfully!', {
          description: `${file.name} has been added to the gallery`,
          duration: 3000
        })
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Upload Failed', {
          description: `Failed to upload ${file.name}. Please try again.`,
          duration: 4000
        })
      } finally {
        setUploadingImages(prev => {
          const newState = { ...prev }
          delete newState[tempIndex]
          return newState
        })
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)

    // If the removed image was the featured image, set a new one
    if (featuredImage === imageToRemove) {
      if (newImages.length > 0) {
        onFeaturedImageChange(newImages[0])
      } else {
        onFeaturedImageChange('')
      }
    }

    toast.success('Image Removed', {
      description: 'Image has been removed from the gallery',
      duration: 2000
    })
  }

  const handleSetFeatured = (imageUrl: string) => {
    onFeaturedImageChange(imageUrl)
    toast.success('Featured Image Updated', {
      description: 'This image will now be displayed as the featured image',
      duration: 2000
    })
  }

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return

    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)

    toast.success('Image Reordered', {
      description: 'Gallery order has been updated',
      duration: 2000
    })
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Badge variant="secondary">
          {images.length} / {maxImages} images
        </Badge>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        {images.length < maxImages ? (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB • Maximum {maxImages} images
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              className="mx-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Gallery is full</p>
            <p className="text-xs text-gray-500">
              Remove an image to add more
            </p>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={`${imageUrl}-${index}`} className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex gap-2">
                      {/* Set as Featured */}
                      <Button
                        type="button"
                        size="sm"
                        variant={featuredImage === imageUrl ? "default" : "secondary"}
                        onClick={() => handleSetFeatured(imageUrl)}
                        className="h-8 w-8 p-0"
                      >
                        {featuredImage === imageUrl ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarIcon className="w-4 h-4" />
                        )}
                      </Button>

                      {/* Move Up */}
                      {index > 0 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveImage(index, index - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <MoveUpIcon className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Move Down */}
                      {index < images.length - 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveImage(index, index + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <MoveDownIcon className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Remove */}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {featuredImage === imageUrl && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}

                  {/* Position Badge */}
                  <Badge variant="secondary" className="absolute top-2 right-2">
                    {index + 1}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Uploading Placeholders */}
          {Object.keys(uploadingImages).map((tempIndex) => (
            <Card key={`uploading-${tempIndex}`} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="text-sm text-gray-500">
        <p>• Click the star icon to set an image as featured</p>
        <p>• Use the arrow buttons to reorder images</p>
        <p>• Featured image will be used in program listings and homepage</p>
      </div>
    </div>
  )
}