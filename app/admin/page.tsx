import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getEvents } from '@/lib/actions/events'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, Users, DollarSign } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const events = await getEvents()

  const totalRevenue = events.reduce((sum, event) => {
    const paidRegistrations = event.registrations?.filter(r => r.payment_status === 'paid').length || 0
    return sum + (paidRegistrations * event.price)
  }, 0)

  const totalRegistrations = events.reduce((sum, event) => sum + (event.registered_count || 0), 0)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-whisky-cream/70">
              Manage your events and registrations
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/users">
              <Button size="lg" variant="outline" className="gap-2">
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/events/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-whisky-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-whisky-gold">{events.length}</div>
              <p className="text-xs text-whisky-cream/60 mt-1">
                Upcoming events scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-whisky-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-whisky-gold">{totalRegistrations}</div>
              <p className="text-xs text-whisky-cream/60 mt-1">
                Across all events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-whisky-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-whisky-gold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-whisky-cream/60 mt-1">
                From confirmed payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>
              View and manage your upcoming events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => {
                  const paidCount = event.registrations?.filter(r => r.payment_status === 'paid').length || 0
                  const pendingCount = event.registrations?.filter(r => r.payment_status === 'pending').length || 0
                  
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-whisky-gold/20 hover:border-whisky-gold/40 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-whisky-gold mb-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-whisky-cream/70">
                          <span>{formatDate(event.date)}</span>
                          <span>•</span>
                          <span>{event.start_time}</span>
                          <span>•</span>
                          <span>{formatCurrency(event.price)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-whisky-cream/60 mt-2">
                          <span>
                            {event.registered_count} / {event.max_seats} registered
                          </span>
                          <span>•</span>
                          <span className="text-green-500">{paidCount} paid</span>
                          <span>•</span>
                          <span className="text-yellow-500">{pendingCount} pending</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/admin/events/${event.id}`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-whisky-gold/40 mx-auto mb-4" />
                <p className="text-whisky-cream/60 mb-4">
                  No events yet. Create your first event to get started.
                </p>
                <Link href="/admin/events/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

