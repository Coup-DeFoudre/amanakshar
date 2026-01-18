import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  saveImageToPublic, 
  generateUniqueFilename, 
  getImageDirectory,
  parseBase64Image,
  validateImageBuffer
} from '@/lib/image-storage'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, '') // Keep Hindi characters
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
}

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const performances = await db.performance.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
      },
    })

    return NextResponse.json(performances)
  } catch (error: unknown) {
    console.error('Error fetching performances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performances' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      context,
      youtubeUrl,
      type,
      isFeatured,
      isPublished,
      bhavIds,
      thumbnailUrl,
      thumbnailData, // Base64 image data from upload
    } = body

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title)

    // Check for duplicate slug
    const existingPerformance = await db.performance.findUnique({
      where: { slug: finalSlug },
    })

    if (existingPerformance) {
      return NextResponse.json(
        { error: 'इस स्लग के साथ एक प्रस्तुति पहले से मौजूद है' },
        { status: 400 }
      )
    }

    // Handle thumbnail upload
    let finalThumbnailUrl: string | null = null

    if (thumbnailData && thumbnailData.startsWith('data:image/')) {
      // Parse and save the uploaded thumbnail
      const parsed = parseBase64Image(thumbnailData)
      
      if (parsed) {
        const { buffer, mimeType, extension } = parsed
        
        // Validate file size
        const validation = validateImageBuffer(buffer, 5)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          )
        }

        // Save to public directory
        const filename = generateUniqueFilename(`${finalSlug}.${extension}`)
        const directory = getImageDirectory('performance')
        finalThumbnailUrl = await saveImageToPublic(buffer, directory, filename)
      }
    } else if (thumbnailUrl) {
      // Use provided URL (could be YouTube thumbnail or external URL)
      finalThumbnailUrl = thumbnailUrl
    }

    // Build performance data - note: thumbnailUrl field must exist in schema
    const performanceData: Record<string, unknown> = {
      title,
      slug: finalSlug,
      context,
      youtubeUrl,
      type: type || 'कवि-सम्मेलन',
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
      bhavs: bhavIds && bhavIds.length > 0 ? {
        create: bhavIds.map((bhavId: string) => ({
          bhav: { connect: { id: bhavId } },
        })),
      } : undefined,
    }

    // Only set thumbnailUrl if the field exists in the schema
    // Note: This will throw if thumbnailUrl field doesn't exist in Performance model
    if (finalThumbnailUrl) {
      performanceData.thumbnailUrl = finalThumbnailUrl
    }

    const performance = await db.performance.create({
      data: performanceData as Parameters<typeof db.performance.create>[0]['data'],
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
      },
    })

    return NextResponse.json(performance)
  } catch (error: unknown) {
    console.error('Error creating performance:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create performance'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
