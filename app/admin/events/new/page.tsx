import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { createEvent } from '@/lib/actions/events'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewEventPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  async function handleCreateEvent(formData: FormData) {
    'use server'
    
    const result = await createEvent(formData)
    
    if (result.error) {
      console.error(result.error)
      return
    }
    
    redirect('/admin')
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
            Create New Event
          </h1>
          <p className="text-whisky-cream/70">
            Set up a new whisky tasting event
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleCreateEvent} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Highland Single Malt Tasting"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what attendees can expect from this event..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image</Label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  placeholder="/images/events/my-event.jpg"
                />
                <p className="text-xs text-whisky-cream/60">
                  Optional: Path to event image (e.g., /images/events/bottle.jpg). Upload images to public/images/events/
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
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
                    placeholder="75"
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
                    placeholder="20"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Link href="/admin" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

