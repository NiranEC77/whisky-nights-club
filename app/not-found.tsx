import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DramGlass } from '@/components/icons/dram-glass'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <DramGlass className="h-20 w-20 text-whisky-gold/40 mx-auto mb-6" />
        <h1 className="text-6xl font-serif font-bold text-gradient-gold mb-4">
          404
        </h1>
        <h2 className="text-2xl font-serif font-semibold text-whisky-gold mb-4">
          Page Not Found
        </h2>
        <p className="text-whisky-cream/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg">
            Return to Events
          </Button>
        </Link>
      </div>
    </div>
  )
}

