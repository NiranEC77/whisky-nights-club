'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'

export async function uploadEventImage(formData: FormData): Promise<{ path?: string; error?: string }> {
  try {
    const file = formData.get('image') as File
    
    if (!file || file.size === 0) {
      return { error: 'No file provided' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Please upload JPG, PNG, or WebP images.' }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { error: 'File too large. Maximum size is 5MB.' }
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create safe filename
    const timestamp = Date.now()
    const randomString = randomBytes(8).toString('hex')
    const extension = file.name.split('.').pop()
    const filename = `event-${timestamp}-${randomString}.${extension}`

    // Save to public/images/events
    const publicPath = join(process.cwd(), 'public', 'images', 'events', filename)
    await writeFile(publicPath, buffer)

    // Return path for database
    const dbPath = `/images/events/${filename}`
    return { path: dbPath }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { error: 'Failed to upload image. Please try again.' }
  }
}

