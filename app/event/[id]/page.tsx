import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { Calendar, Clock, DollarSign, Users, MapPin } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  const isFull = event.available_seats <= 0

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Hero Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8 shadow-gold">
          {event.featured_image ? (
            <>
              <Image
                src={event.featured_image}
                alt={event.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-whisky-darker via-whisky-dark/50 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-whisky-bourbon/40 via-whisky-gold/30 to-whisky-amber/40" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1920')] bg-cover bg-center opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-whisky-darker via-transparent to-transparent" />
            </>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gradient-gold mb-4 drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-whisky-cream/80 text-lg leading-relaxed">
                  {event.description || 'Join us for an unforgettable evening of whisky tasting and appreciation.'}
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-whisky-gold mt-1" />
                    <div>
                      <p className="text-sm text-whisky-cream/60">Date</p>
                      <p className="font-semibold">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-whisky-gold mt-1" />
                    <div>
                      <p className="text-sm text-whisky-cream/60">Time</p>
                      <p className="font-semibold">{event.start_time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-whisky-gold mt-1" />
                    <div>
                      <p className="text-sm text-whisky-cream/60">Price</p>
                      <p className="font-semibold">{formatCurrency(event.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-whisky-gold mt-1" />
                    <div>
                      <p className="text-sm text-whisky-cream/60">Availability</p>
                      <p className="font-semibold">
                        {event.available_seats} of {event.max_seats} seats available
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-whisky-cream/80">
                  <li className="flex items-start gap-2">
                    <span className="text-whisky-gold mt-1">•</span>
                    <span>Tasting of 4-6 premium whiskies from around the world</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-whisky-gold mt-1">•</span>
                    <span>Expert guidance on tasting notes and whisky history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-whisky-gold mt-1">•</span>
                    <span>Light refreshments and palate cleansers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-whisky-gold mt-1">•</span>
                    <span>Opportunity to meet fellow whisky enthusiasts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
                <CardDescription>
                  {isFull ? 'This event is currently full' : 'Secure your spot today'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-whisky-cream/60">Price per person</span>
                    <span className="font-semibold">{formatCurrency(event.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-whisky-cream/60">Seats remaining</span>
                    <span className="font-semibold text-whisky-gold">{event.available_seats}</span>
                  </div>
                </div>

                {isFull ? (
                  <Button className="w-full" disabled>
                    Event Full
                  </Button>
                ) : (
                  <Link href={`/register/${event.id}`}>
                    <Button className="w-full">
                      Register Now
                    </Button>
                  </Link>
                )}

                <p className="text-xs text-whisky-cream/60 text-center">
                  Payment instructions will be provided after registration
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

