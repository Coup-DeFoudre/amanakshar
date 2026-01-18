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

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
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
      description,
      eventDate,
      eventTime,
      venue,
      venueAddress,
      city,
      state,
      isLive,
      isPublished,
      isPaid,
      price,
      imageUrl,
      imageData, // Base64 image data from upload
      ticketUrl,
    } = body

    // Get existing event to preserve image if no new one provided
    const existingEvent = await db.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Handle image upload
    let finalImageUrl: string | null | undefined = imageUrl

    if (imageData && imageData.startsWith('data:image/')) {
      // Parse and save the uploaded image
      const parsed = parseBase64Image(imageData)
      
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
        const filename = generateUniqueFilename(`${slug || existingEvent.slug}.${extension}`)
        const directory = getImageDirectory('event')
        finalImageUrl = await saveImageToPublic(buffer, directory, filename)
      }
    } else if (imageUrl === undefined) {
      // Keep existing image if no new imageUrl or imageData provided
      finalImageUrl = existingEvent.imageUrl
    }

    const event = await db.event.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        eventTime,
        venue,
        venueAddress,
        city,
        state,
        isLive: isLive || false,
        isPublished: isPublished || false,
        isPaid: isPaid || false,
        price: isPaid && price ? parseFloat(price) : null,
        imageUrl: finalImageUrl,
        ticketUrl,
      },
    })

    return NextResponse.json(event)
  } catch (error: unknown) {
    console.error('Error updating event:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting event:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete event'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
