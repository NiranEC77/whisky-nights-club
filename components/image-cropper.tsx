'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  open: boolean
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, open }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    const image = new Image()
    image.src = imageSrc

    await new Promise((resolve) => {
      image.onload = resolve
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // Set canvas size to cropped area
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    // Draw the cropped image
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    // Convert to blob with explicit JPEG type
    canvas.toBlob((blob) => {
      if (blob) {
        console.log('Cropped blob created:', blob.size, 'bytes, type:', blob.type)
        onCropComplete(blob)
      } else {
        console.error('Failed to create blob from canvas')
      }
    }, 'image/jpeg', 0.9)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop Your Image</DialogTitle>
        </DialogHeader>

        <div className="relative h-96 bg-whisky-darker rounded-lg">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={2 / 1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ZoomOut className="h-4 w-4 text-whisky-gold" />
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="h-4 w-4 text-whisky-gold" />
          </div>
          <p className="text-sm text-whisky-cream/60 text-center">
            Drag to reposition • Scroll or use slider to zoom
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={createCroppedImage}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

