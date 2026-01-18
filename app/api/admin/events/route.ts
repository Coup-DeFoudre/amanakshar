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

    // Handle image upload
    let finalImageUrl: string | null = null

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
        const filename = generateUniqueFilename(`${slug}.${extension}`)
        const directory = getImageDirectory('event')
        finalImageUrl = await saveImageToPublic(buffer, directory, filename)
      }
    } else if (imageUrl) {
      // Use provided URL
      finalImageUrl = imageUrl
    }

    const event = await db.event.create({
      data: {
        title,
        slug,
        description,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
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
    console.error('Error creating event:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
