'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { sendRegistrationEmail, sendPaymentConfirmation } from '@/lib/email'
import { getActiveMembershipByEmail, incrementMembershipEvent, markFriendUsed } from './memberships'
import { PaymentMethod } from '@/lib/types'

export async function createRegistration(formData: FormData) {
  // Use service client for public registration (no auth needed)
  const supabase = createServiceClient()

  const eventId = formData.get('event_id') as string
  const fullName = formData.get('full_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const ticketCount = parseInt(formData.get('ticket_count') as string) || 1
  const paymentMethod = (formData.get('payment_method') as PaymentMethod) || 'stripe'
  const paymentCode = formData.get('payment_code') as string | null
  const broughtFriend = formData.get('brought_friend') === 'true'

  // Validate ticket count
  if (ticketCount < 1 || ticketCount > 2) {
    return { error: 'Ticket count must be 1 or 2' }
  }

  // Validate payment method
  if (!['stripe', 'paypal'].includes(paymentMethod)) {
    return { error: 'Invalid payment method. Only Stripe and PayPal are supported.' }
  }

  // Check if payment code is valid (for testing)
  const isTestPayment = paymentCode === 'CHEAT'

  // Check for active membership
  const activeMembership = await getActiveMembershipByEmail(email)
  const isFreeWithMembership = activeMembership !== null
  const membershipId = activeMembership?.id || null

  // Check if user can bring a friend
  const canBringFriend = activeMembership && !activeMembership.friend_used
  if (broughtFriend && !canBringFriend) {
    return { error: 'You have already used your friend benefit or do not have an active membership' }
  }

  // Get event details (need full info for email)
  const { data: event } = await supabase
    .from('events')
    .select('id, title, date, start_time, price, max_seats, registrations(id, ticket_count)')
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
      payment_status: isFreeWithMembership || isTestPayment ? 'paid' : 'pending',
      payment_method: paymentMethod,
      membership_id: membershipId,
      is_free_with_membership: isFreeWithMembership,
      brought_friend: broughtFriend,
      payment_code: paymentCode,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating registration:', error)
    return { error: error.message }
  }

  // If using membership, increment events_used counter
  if (isFreeWithMembership && membershipId) {
    const result = await incrementMembershipEvent(membershipId)
    if (result.error) {
      console.error('Error updating membership:', result.error)
      // Don't fail the registration, but log the error
    }
  }

  // If bringing a friend, mark friend as used
  if (broughtFriend && membershipId) {
    const result = await markFriendUsed(membershipId)
    if (result.error) {
      console.error('Error marking friend as used:', result.error)
      // Don't fail the registration, but log the error
    }
  }

  // Send confirmation email
  console.log('=== Attempting to send registration confirmation email ===')
  console.log('Recipient:', email)
  console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY)
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET')

  const emailResult = await sendRegistrationEmail({
    to: email,
    eventTitle: event.title,
    eventDate: event.date,
    eventTime: event.start_time,
    eventPrice: event.price,
    ticketCount,
    attendeeName: fullName,
    paymentMethod,
    isFreeWithMembership,
    registrationId: data.id,
  })

  if (emailResult.error) {
    console.error('❌ Failed to send confirmation email:', emailResult.error)
    // Don't fail the registration if email fails
  } else {
    console.log('✅ Confirmation email sent successfully, Message ID:', emailResult.messageId)
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

  // Get registration with event details for email
  const { data: registration, error: fetchError } = await supabase
    .from('registrations')
    .select('*, events(title, date, start_time)')
    .eq('id', registrationId)
    .single()

  if (fetchError || !registration) {
    console.error('Error fetching registration:', fetchError)
    return { error: 'Registration not found' }
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

  // Send payment confirmation email when marked as paid
  if (status === 'paid' && registration.events) {
    console.log('Sending payment confirmation email to:', registration.email)
    const emailResult = await sendPaymentConfirmation({
      to: registration.email,
      attendeeName: registration.full_name,
      eventTitle: registration.events.title,
      eventDate: registration.events.date,
      eventTime: registration.events.start_time,
    })

    if (emailResult.error) {
      console.error('Failed to send payment confirmation:', emailResult.error)
      // Don't fail the update if email fails
    } else {
      console.log('Payment confirmation email sent successfully')
    }
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
