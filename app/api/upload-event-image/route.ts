import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { existsSync } from 'fs'

// Use dynamic runtime for file operations
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('=== Upload API route called ===')
  console.log('Environment:', process.env.NODE_ENV)
  
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

    // Validate file type (lenient for cropped images)
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

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString('hex')
    const filename = `event-${timestamp}-${randomString}.jpg`

    console.log('Generated filename:', filename)

    // Ensure events directory exists
    const eventsDir = join(process.cwd(), 'public', 'images', 'events')
    console.log('Events directory path:', eventsDir)
    
    if (!existsSync(eventsDir)) {
      console.log('Creating events directory...')
      await mkdir(eventsDir, { recursive: true })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer created, size:', buffer.length)

    // Write file
    const publicPath = join(eventsDir, filename)
    console.log('Writing to:', publicPath)
    
    await writeFile(publicPath, buffer)
    console.log('✅ File written successfully!')

    // Return path for database
    const dbPath = `/images/events/${filename}`
    console.log('Returning path:', dbPath)
    
    return NextResponse.json({ path: dbPath })

  } catch (error) {
    console.error('❌ Error in upload route:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
