import { notFound, redirect } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { createRegistration } from '@/lib/actions/registrations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegistrationFormClient } from '@/components/registration-form-client'

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
            <RegistrationFormClient event={event} onSubmit={handleRegistration} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
