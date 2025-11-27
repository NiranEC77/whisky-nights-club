'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
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
      <div className="container mx-auto px-4 py-6">
        {/* Centered Logo and Branding */}
        <div className="flex flex-col items-center mb-4">
          <Link href="/" className="flex flex-col items-center gap-3 group">
            <div className="relative h-20 w-20 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="Redhead Whiskey Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold">
              Redhead Whiskey
            </h1>
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              className="text-sm"
            >
              Home
            </Button>
          </Link>

          <Link href="/membership">
            <Button
              variant={pathname === '/membership' ? 'default' : 'ghost'}
              className="text-sm"
            >
              Membership
            </Button>
          </Link>

          {isAdmin && (
            <>
              <Link href="/admin">
                <Button
                  variant={pathname === '/admin' ? 'default' : 'ghost'}
                  className="text-sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant={pathname === '/admin/users' ? 'default' : 'ghost'}
                  className="text-sm"
                >
                  Users
                </Button>
              </Link>
              <Link href="/admin/memberships">
                <Button
                  variant={pathname === '/admin/memberships' ? 'default' : 'ghost'}
                  className="text-sm"
                >
                  Memberships
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-whisky-cream/70 hidden sm:inline">
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
              <Button variant="ghost" size="sm">
                Admin Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

