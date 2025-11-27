import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { getRegistrationById } from '@/lib/actions/registrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentInstructions } from '@/components/payment-instructions'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { registration?: string }
}) {
  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  // Get registration details to show correct ticket count, payment method, and membership status
  const registration = searchParams.registration ? await getRegistrationById(searchParams.registration) : null
  const ticketCount = registration?.ticket_count || 1
  const totalAmount = event.price * ticketCount
  const paymentMethod = registration?.payment_method || 'zelle'
  const isFreeWithMembership = registration?.is_free_with_membership || false
  const memo = `EVENT-${searchParams.registration?.slice(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-whisky-gold mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
            Registration Successful!
          </h1>
          <p className="text-whisky-cream/70">
            {ticketCount === 1 ? 'Your spot has' : `${ticketCount} spots have`} been reserved for {event.title}
          </p>
        </div>

        {isFreeWithMembership ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-green-400">✅ Membership Benefit Applied</CardTitle>
              <CardDescription>
                This event is FREE as part of your yearly membership!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-300 mb-2">You&apos;re All Set! 🎉</h3>
                <p className="text-whisky-cream/80">
                  No payment required. Your registration is confirmed and you&apos;re ready to go!
                </p>
                <div className="mt-4 pt-4 border-t border-green-500/30 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Event</span>
                    <span className="text-whisky-cream">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Date</span>
                    <span className="text-whisky-cream">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Time</span>
                    <span className="text-whisky-cream">{event.start_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-whisky-cream/60">Tickets</span>
                    <span className="text-whisky-cream">{ticketCount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-whisky-cream/60">Price</span>
                    <span className="text-green-400">FREE with Membership</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-whisky-cream/70">
                We&apos;re looking forward to seeing you there! A confirmation email has been sent to your inbox.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Instructions</CardTitle>
              <CardDescription>
                Please complete your payment to confirm your registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PaymentInstructions
                paymentMethod={paymentMethod}
                amount={totalAmount}
                memo={memo}
              />

              <div className="bg-whisky-gold/10 border border-whisky-gold/30 rounded-lg p-4">
                <p className="text-sm text-whisky-cream/80">
                  <strong>Looking forward to tasting together!</strong> Your registration is pending until payment is confirmed.
                  You&apos;ll receive a confirmation email within 24 hours of payment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Events
            </Button>
          </Link>
          <Link href={`/event/${event.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              View Event Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
