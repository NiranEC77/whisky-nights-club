import { GlassWater } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <GlassWater className="h-16 w-16 text-whisky-gold mx-auto mb-4 animate-pulse" />
        <p className="text-whisky-cream/70 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

