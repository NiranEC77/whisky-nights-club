import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { getCurrentUser } from '@/lib/actions/auth'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Redhead Whiskey - Bringing People Together',
  description: 'Bringing people together through good drinks, delicious food, engaging company and great conversation. It\'s about the togetherness.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Redhead Whiskey - Bringing People Together',
    description: 'Join our whiskey club for curated tasting experiences. It\'s about the togetherness.',
    images: ['/images/featured_image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redhead Whiskey - Bringing People Together',
    description: 'Join our whiskey club for curated tasting experiences. It\'s about the togetherness.',
    images: ['/images/featured_image.jpg'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-whisky-dark">
        <Header user={user} />
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

