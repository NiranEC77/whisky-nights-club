'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageCropper } from '@/components/image-cropper'
import { X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadClientProps {
  name: string
  label: string
  defaultValue?: string
}

export function ImageUploadClient({ name, label, defaultValue }: ImageUploadClientProps) {
  const [preview, setPreview] = useState<string>(defaultValue || '')
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync preview with parent form
  useEffect(() => {
    const hiddenInput = document.getElementById(`${name}`) as HTMLInputElement
    if (hiddenInput) {
      hiddenInput.value = preview || ''
      console.log(`Updated hidden input ${name} to:`, preview || '(empty)')
    }
  }, [preview, name])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or WebP images.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    // Show preview and open cropper
    const reader = new FileReader()
    reader.onloadend = () => {
      setTempImage(reader.result as string)
      setShowCropper(true)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false)
    setIsUploading(true)
    setError(null)

    try {
      const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-event-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        setError(errorMessage)
        setTempImage(null)
        return
      }

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        setTempImage(null)
      } else if (result.path) {
        setPreview(result.path)
        setTempImage(null)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setTempImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setTempImage(null)
    const fileInput = document.getElementById(`${name}-file`) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const clearImage = () => {
    setPreview('')
    setError(null)
    const fileInput = document.getElementById(`${name}-file`) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`${name}-file`}>{label}</Label>
      
      {/* Hidden input to store the uploaded path - simple and clean */}
      <input 
        type="hidden" 
        id={name} 
        name={name} 
        defaultValue={preview || defaultValue || ''} 
        key={preview} // Force re-render when preview changes
      />
      
      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-whisky-gold/30">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`${name}-file`}
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-whisky-gold/30 border-dashed rounded-lg cursor-pointer bg-whisky-darker/50 hover:bg-whisky-darker/70 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-whisky-gold/60" />
              <p className="mb-2 text-sm text-whisky-cream/70">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-whisky-cream/50">
                PNG, JPG or WebP (MAX. 5MB)
              </p>
            </div>
            <Input
              id={`${name}-file`}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>
      )}

      {isUploading && (
        <p className="text-sm text-whisky-gold animate-pulse">Uploading image...</p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <p className="text-xs text-whisky-cream/60">
        Optional: Upload a featured image for this event. You&apos;ll be able to crop it before uploading.
      </p>

      {tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          open={showCropper}
        />
      )}
    </div>
  )
}

