import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getEventById } from '@/lib/actions/events'
import { updatePaymentStatus, deleteRegistration } from '@/lib/actions/registrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Mail, Phone, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ManageEventPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  async function handleMarkPaid(formData: FormData) {
    'use server'
    const registrationId = formData.get('registration_id') as string
    await updatePaymentStatus(registrationId, 'paid')
  }

  async function handleMarkPending(formData: FormData) {
    'use server'
    const registrationId = formData.get('registration_id') as string
    await updatePaymentStatus(registrationId, 'pending')
  }

  async function handleDeleteRegistration(formData: FormData) {
    'use server'
    const registrationId = formData.get('registration_id') as string
    await deleteRegistration(registrationId)
  }

  const registrations = event.registrations || []
  const paidCount = registrations.filter(r => r.payment_status === 'paid').length
  const pendingCount = registrations.filter(r => r.payment_status === 'pending').length

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
                {event.title}
              </h1>
              <div className="flex items-center gap-4 text-whisky-cream/70">
                <span>{formatDate(event.date)}</span>
                <span>•</span>
                <span>{event.start_time}</span>
                <span>•</span>
                <span>{formatCurrency(event.price)} per person</span>
              </div>
            </div>
            <Link href={`/admin/events/${event.id}/edit`}>
              <Button variant="outline">Edit Event</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-whisky-gold">
                {registrations.length} / {event.max_seats}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{paidCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-whisky-gold">
                {formatCurrency(paidCount * event.price)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendee List</CardTitle>
            <CardDescription>
              Manage registrations and payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length > 0 ? (
              <div className="space-y-4">
                {registrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-whisky-gold/20"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-whisky-gold mb-1">
                        {registration.full_name}
                        <span className="ml-2 text-xs font-normal text-whisky-cream/60">
                          ({registration.ticket_count} {registration.ticket_count === 1 ? 'ticket' : 'tickets'})
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-whisky-cream/70">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {registration.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {registration.phone}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {registration.payment_status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <Clock className="h-3 w-3" />
                            Pending Payment
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {registration.payment_status === 'pending' ? (
                        <form action={handleMarkPaid}>
                          <input type="hidden" name="registration_id" value={registration.id} />
                          <Button type="submit" size="sm" variant="default">
                            Mark Paid
                          </Button>
                        </form>
                      ) : (
                        <form action={handleMarkPending}>
                          <input type="hidden" name="registration_id" value={registration.id} />
                          <Button type="submit" size="sm" variant="outline">
                            Mark Pending
                          </Button>
                        </form>
                      )}
                      <form action={handleDeleteRegistration}>
                        <input type="hidden" name="registration_id" value={registration.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-whisky-cream/60">
                  No registrations yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

