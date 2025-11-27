import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  console.log('=== Upload API route called ===')
  
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    console.log('File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })
    
    if (!file || file.size === 0) {
      console.error('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString('hex')
    const filename = `event-${timestamp}-${randomString}.jpg`

    console.log('Generated filename:', filename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer created, size:', buffer.length)

    // Upload to Supabase Storage
    console.log('Uploading to Supabase Storage bucket: event-images')
    
    const { data, error: uploadError } = await supabaseAdmin
      .storage
      .from('event-images')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log('Upload successful, data:', data)

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('event-images')
      .getPublicUrl(data.path)

    console.log('Public URL:', publicUrl)

    return NextResponse.json({ path: publicUrl })

  } catch (error) {
    console.error('❌ Error in upload route:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}
