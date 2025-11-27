import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function uploadEventImage(file: Blob, filename: string): Promise<{ path?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from('event-images')
      .upload(filename, file, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return { error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('event-images')
      .getPublicUrl(data.path)

    return { path: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Failed to upload image' }
  }
}

