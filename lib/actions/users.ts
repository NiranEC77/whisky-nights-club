'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function createAdminUser(formData: FormData) {
  const supabase = await createClient()

  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  // Create new user with service client
  const serviceClient = createServiceClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as 'admin' | 'member'

  // Create auth user
  const { data: newUser, error: signUpError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: role,
    }
  })

  if (signUpError) {
    console.error('Error creating user:', signUpError)
    return { error: signUpError.message }
  }

  // Update profile role (should be created by trigger, but let's ensure it)
  if (newUser.user) {
    const { error: updateError } = await serviceClient
      .from('profiles')
      .update({ role, full_name: fullName })
      .eq('id', newUser.user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
    }
  }

  revalidatePath('/admin/users')
  return { data: newUser }
}

export async function getAllUsers() {
  const supabase = await createClient()

  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return { error: error.message }
  }

  return { data }
}

export async function updateUserRole(userId: string, role: 'admin' | 'member') {
  const supabase = await createClient()

  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' }
  }

  // Prevent changing own role
  if (userId === user.id) {
    return { error: 'Cannot change your own role' }
  }

  const serviceClient = createServiceClient()

  const { data, error } = await serviceClient
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user role:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { data }
}

