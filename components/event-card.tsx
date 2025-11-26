import Link from 'next/link'
import { Calendar, Clock, DollarSign, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { EventWithRegistrations } from '@/lib/types'

interface EventCardProps {
  event: EventWithRegistrations
}

export function EventCard({ event }: EventCardProps) {
  const isFull = event.available_seats <= 0

  return (
    <Card className="overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in">
      <div className="h-48 bg-gradient-to-br from-whisky-bourbon/30 via-whisky-gold/20 to-whisky-amber/30 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-whisky-darker to-transparent" />
      </div>

      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <p className="text-whisky-cream/70 text-sm line-clamp-2">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-whisky-cream/80">
          <Calendar className="h-4 w-4 text-whisky-gold" />
          <span className="text-sm">{formatDate(event.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-whisky-cream/80">
          <Clock className="h-4 w-4 text-whisky-gold" />
          <span className="text-sm">{event.start_time}</span>
        </div>

        <div className="flex items-center gap-2 text-whisky-cream/80">
          <DollarSign className="h-4 w-4 text-whisky-gold" />
          <span className="text-sm font-semibold">
            {formatCurrency(event.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-whisky-cream/80">
          <Users className="h-4 w-4 text-whisky-gold" />
          <span className="text-sm">
            {event.available_seats} of {event.max_seats} seats available
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/event/${event.id}`} className="w-full">
          <Button
            className="w-full"
            disabled={isFull}
            variant={isFull ? 'outline' : 'default'}
          >
            {isFull ? 'Event Full' : 'View Details & Register'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

