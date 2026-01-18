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

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const performance = await db.performance.findUnique({
      where: { id },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
      },
    })

    if (!performance) {
      return NextResponse.json({ error: 'Performance not found' }, { status: 404 })
    }

    return NextResponse.json(performance)
  } catch (error: unknown) {
    console.error('Error fetching performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    // Check if performance exists
    const existingPerformance = await db.performance.findUnique({
      where: { id },
    })

    if (!existingPerformance) {
      return NextResponse.json({ error: 'Performance not found' }, { status: 404 })
    }

    // Check for duplicate slug (if slug is being changed)
    if (slug && slug !== existingPerformance.slug) {
      const slugExists = await db.performance.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'इस स्लग के साथ एक प्रस्तुति पहले से मौजूद है' },
          { status: 400 }
        )
      }
    }

    // Handle thumbnail upload
    let finalThumbnailUrl: string | null | undefined = thumbnailUrl

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
        const filename = generateUniqueFilename(`${slug || existingPerformance.slug}.${extension}`)
        const directory = getImageDirectory('performance')
        finalThumbnailUrl = await saveImageToPublic(buffer, directory, filename)
      }
    } else if (thumbnailUrl === undefined) {
      // Keep existing thumbnail if no new thumbnailUrl or thumbnailData provided
      // Access existing thumbnailUrl if it exists in the model
      finalThumbnailUrl = (existingPerformance as Record<string, unknown>).thumbnailUrl as string | null | undefined
    }

    // Update bhavs - delete existing and create new
    if (bhavIds !== undefined) {
      await db.performanceBhav.deleteMany({
        where: { performanceId: id },
      })
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      title,
      slug,
      context,
      youtubeUrl,
      type,
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
      bhavs: bhavIds && bhavIds.length > 0 ? {
        create: bhavIds.map((bhavId: string) => ({
          bhav: { connect: { id: bhavId } },
        })),
      } : undefined,
    }

    // Only set thumbnailUrl if we have a value
    if (finalThumbnailUrl !== undefined) {
      updateData.thumbnailUrl = finalThumbnailUrl
    }

    const performance = await db.performance.update({
      where: { id },
      data: updateData as Parameters<typeof db.performance.update>[0]['data'],
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
    console.error('Error updating performance:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update performance'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if performance exists
    const existingPerformance = await db.performance.findUnique({
      where: { id },
    })

    if (!existingPerformance) {
      return NextResponse.json({ error: 'Performance not found' }, { status: 404 })
    }

    await db.performance.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting performance:', error)
    return NextResponse.json(
      { error: 'Failed to delete performance' },
      { status: 500 }
    )
  }
}
