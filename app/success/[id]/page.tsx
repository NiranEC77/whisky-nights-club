import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { getRegistrationById } from '@/lib/actions/registrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/copy-button'
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

  // Get registration details to show correct ticket count and total
  const registration = searchParams.registration ? await getRegistrationById(searchParams.registration) : null
  const ticketCount = registration?.ticket_count || 1
  const totalAmount = event.price * ticketCount

  const zelleEmail = process.env.NEXT_PUBLIC_ZELLE_EMAIL || 'payments@whiskyclub.com'
  const zellePhone = process.env.NEXT_PUBLIC_ZELLE_PHONE || ''
  const memo = `EVENT-${params.id.slice(0, 8).toUpperCase()}-${searchParams.registration?.slice(0, 8).toUpperCase()}`

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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
            <CardDescription>
              Please complete your payment via Zelle to confirm your registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-whisky-darker/80 rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-whisky-cream/60">Amount to Pay</p>
                <p className="text-3xl font-bold text-whisky-gold">
                  {formatCurrency(totalAmount)}
                </p>
                {ticketCount > 1 && (
                  <p className="text-xs text-whisky-cream/60">
                    {ticketCount} tickets × {formatCurrency(event.price)} each
                  </p>
                )}
              </div>

              <div className="border-t border-whisky-gold/20 pt-4 space-y-3">
                {zelleEmail && (
                  <div className="space-y-1">
                    <p className="text-sm text-whisky-cream/60">Zelle Email</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                        {zelleEmail}
                      </code>
                      <CopyButton text={zelleEmail} />
                    </div>
                  </div>
                )}

                {zellePhone && (
                  <div className="space-y-1">
                    <p className="text-sm text-whisky-cream/60">Zelle Phone</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                        {zellePhone}
                      </code>
                      <CopyButton text={zellePhone} />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm text-whisky-cream/60">Memo / Note (Required)</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                      {memo}
                    </code>
                    <CopyButton text={memo} />
                  </div>
                  <p className="text-xs text-whisky-cream/60 mt-2">
                    ⚠️ Please include this memo in your Zelle payment to help us identify your registration
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-whisky-cream/70">
              <p className="flex items-start gap-2">
                <span className="text-whisky-gold mt-1">1.</span>
                <span>Open your Zelle app or your banking app with Zelle integration</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-whisky-gold mt-1">2.</span>
                <span>Send {formatCurrency(totalAmount)} to the email/phone above</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-whisky-gold mt-1">3.</span>
                <span>Include the memo exactly as shown above</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-whisky-gold mt-1">4.</span>
                <span>You'll receive a confirmation email within 24 hours of payment</span>
              </p>
            </div>

            <div className="bg-whisky-gold/10 border border-whisky-gold/30 rounded-lg p-4">
              <p className="text-sm text-whisky-cream/80">
                <strong>Important:</strong> Your registration is pending until payment is confirmed.
                If you have any questions, please contact us at {zelleEmail}
              </p>
            </div>
          </CardContent>
        </Card>

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

