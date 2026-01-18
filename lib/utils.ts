import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatHindiDate(date: Date): string {
  return date.toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0900-\u097F\w\s-]/g, '') // Keep Devanagari and alphanumeric
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Get or create browser UUID from localStorage
 * This is used to track anonymous users for likes
 */
export function getBrowserUuid(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  
  const STORAGE_KEY = 'amanakshar_browser_uuid'
  let uuid = localStorage.getItem(STORAGE_KEY)
  
  if (!uuid) {
    // Generate a new UUID
    uuid = 'browser_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem(STORAGE_KEY, uuid)
  }
  
  return uuid
}

// ===== IMAGE UTILITIES =====

export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate image file for upload
 * Returns validation result with Hindi error messages
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): ImageValidationResult {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'केवल JPEG, PNG, WebP, या SVG फाइलें स्वीकार्य हैं'
    }
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `फाइल का आकार ${maxSizeMB}MB से कम होना चाहिए`
    }
  }

  return { valid: true }
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot get image dimensions on server'))
      return
    }

    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('छवि लोड करने में त्रुटि'))
    }

    img.src = url
  })
}

/**
 * Generate a tiny blur placeholder for loading states
 * Uses canvas to create a small blurred version
 */
export function generateImagePlaceholder(width: number, height: number): string {
  if (typeof document === 'undefined') {
    // Return a simple gray placeholder for SSR
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%231a1a1a' width='100%25' height='100%25'/%3E%3C/svg%3E`
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Create tiny canvas for blur effect
  canvas.width = 10
  canvas.height = Math.round((height / width) * 10)
  
  if (ctx) {
    // Fill with dark gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1a1a1a')
    gradient.addColorStop(1, '#0f0f0f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  return canvas.toDataURL('image/jpeg', 0.5)
}

/**
 * Optimize image for upload by resizing if too large
 * Maintains aspect ratio and compresses
 */
export async function optimizeImageForUpload(
  file: File, 
  maxWidth: number = 1920, 
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot optimize image on server'))
      return
    }

    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      
      let { naturalWidth: width, naturalHeight: height } = img
      
      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('छवि लोड करने में त्रुटि'))
    }

    img.src = url
  })
}

/**
 * Get image URL with fallback support
 * Handles null/undefined paths and returns appropriate fallback
 */
export function getImageUrl(
  path: string | null | undefined, 
  fallback: string = '/images/placeholders/poet.svg'
): string {
  if (!path) {
    return fallback
  }
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it's a data URL, return as-is
  if (path.startsWith('data:')) {
    return path
  }
  
  // Ensure path starts with /
  return path.startsWith('/') ? path : `/${path}`
}

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  sizeFormatted: string
}

/**
 * Extract metadata from an image file
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  const dimensions = await getImageDimensions(file)
  
  // Format size for display
  const sizeKB = file.size / 1024
  const sizeMB = sizeKB / 1024
  const sizeFormatted = sizeMB >= 1 
    ? `${sizeMB.toFixed(2)} MB` 
    : `${sizeKB.toFixed(0)} KB`
  
  // Extract format from MIME type
  const format = file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'
  
  return {
    ...dimensions,
    format,
    size: file.size,
    sizeFormatted,
  }
}

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(
  videoIdOrUrl: string, 
  quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'
): string | null {
  // Extract video ID if URL is provided
  const videoId = videoIdOrUrl.includes('youtube') || videoIdOrUrl.includes('youtu.be')
    ? extractYouTubeId(videoIdOrUrl)
    : videoIdOrUrl

  if (!videoId) return null

  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}