'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Wine, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  user?: {
    email: string
    role: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isAdmin = user?.role === 'admin'

  return (
    <header className="border-b border-whisky-gold/20 bg-whisky-darker/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Wine className="h-8 w-8 text-whisky-gold group-hover:scale-110 transition-transform" />
          <h1 className="text-2xl font-serif font-bold text-gradient-gold">
            Redhead WHISKY
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              className="text-sm"
            >
              Events
            </Button>
          </Link>

          {isAdmin && (
            <>
              <Link href="/admin">
                <Button
                  variant={pathname.startsWith('/admin') ? 'default' : 'ghost'}
                  className="text-sm"
                >
                  Admin Dashboard
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-whisky-cream/70">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

