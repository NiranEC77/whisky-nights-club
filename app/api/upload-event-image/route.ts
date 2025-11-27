import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// Use dynamic runtime for file operations
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('Upload API route called')
  
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    console.log('File received:', file?.name, file?.size, file?.type)
    
    if (!file || file.size === 0) {
      console.error('No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type (more lenient for cropped images)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/octet-stream']
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload JPG, PNG, or WebP images.` },
        { status: 400 }
      )
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

    // Try file system approach for local development
    if (process.env.NODE_ENV === 'development') {
      try {
        const { writeFile } = await import('fs/promises')
        const { join } = await import('path')
        
        // Generate unique filename
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const timestamp = Date.now()
        const randomString = randomBytes(8).toString('hex')
        const filename = `event-${timestamp}-${randomString}.jpg`

        const publicPath = join(process.cwd(), 'public', 'images', 'events', filename)
        
        console.log('Writing to:', publicPath)
        await writeFile(publicPath, buffer)
        console.log('File written successfully')

        const dbPath = `/images/events/${filename}`
        return NextResponse.json({ path: dbPath })
      } catch (fsError) {
        console.error('File system write failed:', fsError)
        // Fall through to return error
      }
    }

    // For production or if file system fails, we'll need Supabase Storage
    console.error('File upload not configured for production. Use Supabase Storage.')
    return NextResponse.json(
      { error: 'Image upload is only available in development mode. Please contact administrator.' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Error in upload route:', error)
    return NextResponse.json(
      { error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
