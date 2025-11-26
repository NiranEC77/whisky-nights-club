'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRegistration(formData: FormData) {
  const supabase = await createClient()

  const eventId = formData.get('event_id') as string
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  // Check if event is full
  const { data: event } = await supabase
    .from('events')
    .select('id, max_seats, registrations(id)')
    .eq('id', eventId)
    .single()

  if (!event) {
    return { error: 'Event not found' }
  }

  const registeredCount = event.registrations?.length || 0
  if (registeredCount >= event.max_seats) {
    return { error: 'Event is full' }
  }

  // Check if email already registered for this event
  const { data: existingReg } = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('email', email)
    .single()

  if (existingReg) {
    return { error: 'You have already registered for this event' }
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: eventId,
      full_name: fullName,
      email,
      phone,
      payment_status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating registration:', error)
    return { error: error.message }
  }

  revalidatePath(`/event/${eventId}`)
  revalidatePath('/')
  return { data }
}

export async function updatePaymentStatus(registrationId: string, status: 'pending' | 'paid') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  const { data, error } = await supabase
    .from('registrations')
    .update({ payment_status: status })
    .eq('id', registrationId)
    .select()
    .single()

  if (error) {
    console.error('Error updating payment status:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { data }
}

export async function deleteRegistration(registrationId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('id', registrationId)

  if (error) {
    console.error('Error deleting registration:', error)
    return { error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getRegistrationsByEvent(eventId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
    return { error: error.message }
  }

  return { data }
}

