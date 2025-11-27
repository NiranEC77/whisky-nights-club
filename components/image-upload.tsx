'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  name: string
  label: string
  defaultValue?: string
  onChange?: (path: string) => void
}

export function ImageUpload({ name, label, defaultValue, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-event-image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        setPreview(defaultValue || null)
      } else if (result.path) {
        // Store the path in a hidden input
        const hiddenInput = document.getElementById(`${name}-path`) as HTMLInputElement
        if (hiddenInput) {
          hiddenInput.value = result.path
        }
        onChange?.(result.path)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
      setPreview(defaultValue || null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    setError(null)
    const hiddenInput = document.getElementById(`${name}-path`) as HTMLInputElement
    if (hiddenInput) {
      hiddenInput.value = ''
    }
    const fileInput = document.getElementById(name) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    onChange?.('')
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      
      {/* Hidden input to store the uploaded path */}
      <input type="hidden" id={`${name}-path`} name={name} defaultValue={defaultValue || ''} />
      
      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-whisky-gold/30">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
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
            htmlFor={name}
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
              id={name}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
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
        Optional: Upload a featured image for this event (bottle photo, tasting room, etc.)
      </p>
    </div>
  )
}

