import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file || file.size === 0) {
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
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create safe filename - always use .jpg for cropped images
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString('hex')
    const filename = `event-${timestamp}-${randomString}.jpg`

    // Save to public/images/events
    const publicPath = join(process.cwd(), 'public', 'images', 'events', filename)
    
    console.log('Attempting to write file to:', publicPath)
    await writeFile(publicPath, buffer)
    console.log('File written successfully:', filename)

    // Return path for database
    const dbPath = `/images/events/${filename}`
    return NextResponse.json({ path: dbPath })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    )
  }
}

