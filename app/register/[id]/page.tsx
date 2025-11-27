import { notFound, redirect } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { createRegistration } from '@/lib/actions/registrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function RegisterPage({ 
  params,
  searchParams 
}: { 
  params: { id: string }
  searchParams: { error?: string }
}) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  if (event.available_seats <= 0) {
    redirect(`/event/${event.id}`)
  }

  async function handleRegistration(formData: FormData) {
    'use server'
    
    const result = await createRegistration(formData)
    
    if (result.error) {
      console.error('Registration error:', result.error)
      // Redirect back with error message
      redirect(`/register/${params.id}?error=${encodeURIComponent(result.error)}`)
    }
    
    if (result.data) {
      redirect(`/success/${params.id}?registration=${result.data.id}`)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
            Event Registration
          </h1>
          <p className="text-whisky-cream/70">
            {event.title}
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">
              <strong>Error:</strong> {searchParams.error}
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Please provide your details to complete the registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleRegistration} className="space-y-6" id="registration-form">
              <input type="hidden" name="event_id" value={event.id} />

              <div className="space-y-2">
                <Label htmlFor="ticket_count">How many people registering? *</Label>
                <Select name="ticket_count" defaultValue="1" required>
                  <SelectTrigger id="ticket_count">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">one is fun - {formatCurrency(event.price)}</SelectItem>
                    <SelectItem value="2" disabled={event.available_seats < 2}>
                      two is charm - {formatCurrency(event.price * 2)}
                      {event.available_seats < 2 && ' (Not enough seats)'}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-whisky-cream/60">
                  {event.available_seats} seat(s) available
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Smith"
                  required
                  minLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                  minLength={10}
                />
              </div>

              <div className="border-t border-whisky-gold/20 pt-6 space-y-3">
                <h3 className="font-semibold text-lg">Event Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Event</span>
                    <span>{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Date</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Time</span>
                    <span>{event.start_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Price per Ticket</span>
                    <span>{formatCurrency(event.price)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-whisky-gold/20">
                    <span>Total</span>
                    <span className="text-whisky-gold" id="total-amount">
                      {formatCurrency(event.price)}
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Complete Registration
              </Button>

              <p className="text-xs text-center text-whisky-cream/60">
                By registering, you agree to receive payment instructions.
                Your spot will be reserved upon payment confirmation.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
