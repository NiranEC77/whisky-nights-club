'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Event, EventWithRegistrations } from '@/lib/types'

export async function getEvents(): Promise<EventWithRegistrations[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      registrations (
        id,
        ticket_count,
        payment_status
      )
    `)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return events.map((event) => {
    const totalTickets = event.registrations?.reduce((sum: number, reg: any) => sum + (reg.ticket_count || 1), 0) || 0
    return {
      ...event,
      registered_count: event.registrations?.length || 0,
      available_seats: event.max_seats - totalTickets,
    }
  })
}

export async function getEventById(id: string): Promise<EventWithRegistrations | null> {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      registrations (
        id,
        full_name,
        email,
        phone,
        ticket_count,
        payment_status,
        created_at
      ),
      creator:profiles!created_by (
        id,
        full_name,
        email
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return null
  }

  const totalTickets = event.registrations?.reduce((sum: number, reg: any) => sum + (reg.ticket_count || 1), 0) || 0

  return {
    ...event,
    registered_count: event.registrations?.length || 0,
    available_seats: event.max_seats - totalTickets,
  }
}

export async function createEvent(formData: FormData) {
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

  const featuredImage = formData.get('featured_image') as string
  
  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    start_time: formData.get('start_time') as string,
    price: parseInt(formData.get('price') as string),
    max_seats: parseInt(formData.get('max_seats') as string),
    featured_image: featuredImage || null,
    created_by: user.id,
  }

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { data }
}

export async function updateEvent(id: string, formData: FormData) {
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

  const featuredImage = formData.get('featured_image') as string
  
  const eventData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    date: formData.get('date') as string,
    start_time: formData.get('start_time') as string,
    price: parseInt(formData.get('price') as string),
    max_seats: parseInt(formData.get('max_seats') as string),
    featured_image: featuredImage || null,
  }

  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/event/${id}`)
  return { data }
}

export async function deleteEvent(id: string) {
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
    .from('events')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting event:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

