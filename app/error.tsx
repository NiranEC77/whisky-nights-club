'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DramGlass } from '@/components/icons/dram-glass'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <DramGlass className="h-20 w-20 text-whisky-gold/40 mx-auto mb-6" />
        <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-4">
          Something went wrong
        </h1>
        <p className="text-whisky-cream/70 mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} size="lg">
            Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}

