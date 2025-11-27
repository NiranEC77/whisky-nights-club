'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { Membership } from '@/lib/types'

/**
 * Create a new membership purchase
 */
export async function createMembership(formData: FormData) {
    const supabase = createServiceClient()

    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const paymentMethod = formData.get('payment_method') as string
    const paymentCode = formData.get('payment_code') as string | null

    // Validate payment method
    if (!['stripe', 'paypal'].includes(paymentMethod)) {
        return { error: 'Invalid payment method. Only Stripe and PayPal are supported.' }
    }

    // Check if user already has ANY membership (active or expired)
    const { data: existingMemberships } = await supabase
        .from('memberships')
        .select('*')
        .eq('email', email)
        .limit(1)

    if (existingMemberships && existingMemberships.length > 0) {
        const existing = existingMemberships[0]
        const isExpired = new Date(existing.end_date) < new Date()

        if (isExpired) {
            return {
                error: `You already purchased a membership that expired on ${new Date(existing.end_date).toLocaleDateString()}. Please contact support to renew your membership.`
            }
        } else {
            return {
                error: `You already have an active membership that expires on ${new Date(existing.end_date).toLocaleDateString()}. You cannot purchase another membership.`
            }
        }
    }

    // Check if payment code is valid (for testing)
    const isTestPayment = paymentCode === 'CHEAT'

    // Calculate membership dates (current calendar year)
    const now = new Date()
    const startDate = new Date(now.getFullYear(), 0, 1) // January 1st of current year
    const endDate = new Date(now.getFullYear(), 11, 31) // December 31st of current year

    const { data, error } = await supabase
        .from('memberships')
        .insert({
            email,
            full_name: fullName,
            phone,
            payment_method: paymentMethod,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            events_used: 0,
            friend_used: false,
            payment_status: isTestPayment ? 'paid' : 'pending',
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating membership:', error)
        return { error: error.message }
    }

    revalidatePath('/membership')
    return { data }
}

/**
 * Get active membership by email
 */
export async function getActiveMembershipByEmail(email: string): Promise<Membership | null> {
    const supabase = createServiceClient()

    const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('email', email)
        .eq('payment_status', 'paid')
        .gte('end_date', new Date().toISOString().split('T')[0])
        .lt('events_used', 1)
        .order('end_date', { ascending: false })
        .limit(1)
        .single()

    if (error || !data) {
        return null
    }

    return data
}

/**
 * Get membership by ID
 */
export async function getMembershipById(id: string): Promise<Membership | null> {
    const supabase = createServiceClient()

    const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching membership:', error)
        return null
    }

    return data
}

/**
 * Increment membership events used counter
 */
export async function incrementMembershipEvent(membershipId: string) {
    const supabase = createServiceClient()

    // Get current membership
    const { data: membership, error: fetchError } = await supabase
        .from('memberships')
        .select('events_used')
        .eq('id', membershipId)
        .single()

    if (fetchError || !membership) {
        return { error: 'Membership not found' }
    }

    // Increment events_used
    const { error } = await supabase
        .from('memberships')
        .update({ events_used: membership.events_used + 1 })
        .eq('id', membershipId)

    if (error) {
        console.error('Error updating membership:', error)
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Update membership payment status (admin only)
 */
export async function updateMembershipPaymentStatus(
    membershipId: string,
    status: 'pending' | 'paid'
) {
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
        .from('memberships')
        .update({ payment_status: status })
        .eq('id', membershipId)
        .select()
        .single()

    if (error) {
        console.error('Error updating membership payment status:', error)
        return { error: error.message }
    }

    // TODO: Send membership confirmation email when marked as paid

    revalidatePath('/admin/memberships')
    return { data }
}

/**
 * Get all memberships (admin only)
 */
export async function getAllMemberships() {
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
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching memberships:', error)
        return { error: error.message }
    }

    return { data }
}

/**
 * Delete membership (admin only)
 */
export async function deleteMembership(membershipId: string) {
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
        .from('memberships')
        .delete()
        .eq('id', membershipId)

    if (error) {
        console.error('Error deleting membership:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/memberships')
    return { success: true }
}

/**
 * Mark friend as used for a membership
 */
export async function markFriendUsed(membershipId: string) {
    const supabase = createServiceClient()

    const { error } = await supabase
        .from('memberships')
        .update({ friend_used: true })
        .eq('id', membershipId)

    if (error) {
        console.error('Error marking friend as used:', error)
        return { error: error.message }
    }

    return { success: true }
}
