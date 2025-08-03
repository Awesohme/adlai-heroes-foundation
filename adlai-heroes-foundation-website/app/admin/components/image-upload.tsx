'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { UploadIcon, XIcon, ImageIcon } from "lucide-react"
import { supabaseApi } from "@/lib/supabase"
import Image from "next/image"

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (url: string) => void
  label?: string
  accept?: string
  folder?: string
  className?: string
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageChange, 
  label = "Image", 
  accept = "image/*",
  folder = "",
  className = "" 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // File upload now enabled with Cloudinary adlai_preset
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)
    
    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload to Cloudinary (unsigned upload)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'unsigned_preset') // Using a more common preset name
      formData.append('folder', folder || 'adlai-heroes')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcvuzffgj/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      const url = data.secure_url
      onImageChange(url)
      
      // Clean up object URL
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setPreviewUrl(null)
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlInput = (url: string) => {
    setPreviewUrl(url)
    onImageChange(url)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {/* Current Image Preview */}
      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}>
        <CardContent 
          className="p-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-600" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload an image'}
              </h3>
              <p className="text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Choose File
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* URL Input Alternative */}
      <div className="space-y-2">
        <Label htmlFor="image-url" className="text-sm">Or enter image URL:</Label>
        <Input
          id="image-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={previewUrl || ''}
          onChange={(e) => handleUrlInput(e.target.value)}
        />
      </div>
    </div>
  )
}