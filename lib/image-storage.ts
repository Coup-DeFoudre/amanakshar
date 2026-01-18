import { writeFile, mkdir, unlink, access } from 'fs/promises'
import { join, dirname } from 'path'

// Base directory for public images
const PUBLIC_DIR = process.cwd() + '/public'

type ImageType = 'poet' | 'event' | 'performance' | 'og-image' | 'book'

/**
 * Get the directory path for a specific image type
 */
export function getImageDirectory(type: ImageType): string {
  const directories: Record<ImageType, string> = {
    poet: 'images/poet',
    event: 'images/events',
    performance: 'images/performances',
    'og-image': 'images/og-images',
    book: 'images/books',
  }
  return directories[type]
}

/**
 * Get the full path for saving an image
 */
export function getImagePath(type: ImageType, filename: string): string {
  const directory = getImageDirectory(type)
  return `/${directory}/${filename}`
}

/**
 * Generate a unique filename for uploaded images
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = originalFilename.split('.').pop()?.toLowerCase() || 'jpg'
  return `${timestamp}-${random}.${ext}`
}

/**
 * Save an image buffer to the public directory
 * @returns The relative path to the saved image
 */
export async function saveImageToPublic(
  file: Buffer,
  directory: string,
  filename: string
): Promise<string> {
  const fullDir = join(PUBLIC_DIR, directory)
  const fullPath = join(fullDir, filename)
  const relativePath = `/${directory}/${filename}`

  try {
    // Create directory if it doesn't exist
    await mkdir(fullDir, { recursive: true })
    
    // Write file
    await writeFile(fullPath, file)
    
    return relativePath
  } catch (error) {
    console.error('Error saving image:', error)
    throw new Error('छवि सहेजने में त्रुटि हुई')
  }
}

/**
 * Delete an image from the public directory
 */
export async function deleteImageFromPublic(path: string): Promise<void> {
  if (!path || path.startsWith('http')) {
    // Don't try to delete external URLs
    return
  }

  const fullPath = join(PUBLIC_DIR, path.replace(/^\//, ''))

  try {
    // Check if file exists before trying to delete
    await access(fullPath)
    await unlink(fullPath)
  } catch (error) {
    // File doesn't exist or can't be deleted - log but don't throw
    console.warn('Could not delete image:', path, error)
  }
}

/**
 * Check if an image exists in the public directory
 */
export async function imageExists(path: string): Promise<boolean> {
  if (!path || path.startsWith('http')) {
    return false
  }

  const fullPath = join(PUBLIC_DIR, path.replace(/^\//, ''))

  try {
    await access(fullPath)
    return true
  } catch {
    return false
  }
}

/**
 * Parse base64 image data and extract buffer and mime type
 */
export function parseBase64Image(dataUrl: string): { buffer: Buffer; mimeType: string; extension: string } | null {
  const match = dataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/)
  
  if (!match) {
    return null
  }

  const mimeType = `image/${match[1]}`
  const extension = match[1] === 'jpeg' ? 'jpg' : match[1]
  const buffer = Buffer.from(match[2], 'base64')

  return { buffer, mimeType, extension }
}

/**
 * Validate image buffer size
 */
export function validateImageBuffer(buffer: Buffer, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (buffer.length > maxSizeBytes) {
    return {
      valid: false,
      error: `छवि का आकार ${maxSizeMB}MB से अधिक है`
    }
  }

  return { valid: true }
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    gif: 'image/gif',
  }

  return mimeTypes[ext || ''] || 'application/octet-stream'
}

/**
 * Validate MIME type for images
 */
export function isValidImageMimeType(mimeType: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
  ]
  return validTypes.includes(mimeType)
}
