'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function createRegistration(formData: FormData) {
  // Use service client for public registration (no auth needed)
  const supabase = createServiceClient()

  const eventId = formData.get('event_id') as string
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const ticketCount = parseInt(formData.get('ticket_count') as string) || 1

  // Validate ticket count
  if (ticketCount < 1 || ticketCount > 2) {
    return { error: 'Ticket count must be 1 or 2' }
  }

  // Check if event is full
  const { data: event } = await supabase
    .from('events')
    .select('id, max_seats, registrations(id, ticket_count)')
    .eq('id', eventId)
    .single()

  if (!event) {
    return { error: 'Event not found' }
  }

  // Calculate total tickets registered
  const totalTicketsRegistered = event.registrations?.reduce((sum, reg) => sum + (reg.ticket_count || 1), 0) || 0
  const availableSeats = event.max_seats - totalTicketsRegistered
  
  if (availableSeats < ticketCount) {
    return { error: `Not enough seats available. Only ${availableSeats} seat(s) remaining.` }
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
      ticket_count: ticketCount,
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

export async function getRegistrationById(id: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching registration:', error)
    return null
  }

  return data
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
