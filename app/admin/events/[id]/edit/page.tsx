import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getEventById, updateEvent } from '@/lib/actions/events'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const event = await getEventById(params.id)

  if (!event) {
    notFound()
  }

  async function handleUpdateEvent(formData: FormData) {
    'use server'
    
    const result = await updateEvent(params.id, formData)
    
    if (result.error) {
      console.error(result.error)
      return
    }
    
    redirect(`/admin/events/${params.id}`)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
            Edit Event
          </h1>
          <p className="text-whisky-cream/70">
            Update event information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Modify the event information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleUpdateEvent} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={event.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={event.description || ''}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={event.date}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time (HH:MM) *</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="text"
                    placeholder="19:00"
                    pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                    title="Please enter time in HH:MM format (e.g., 19:00)"
                    defaultValue={event.start_time}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Person ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    defaultValue={event.price}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_seats">Maximum Seats *</Label>
                  <Input
                    id="max_seats"
                    name="max_seats"
                    type="number"
                    min="1"
                    defaultValue={event.max_seats}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Link href={`/admin/events/${params.id}`} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Update Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

