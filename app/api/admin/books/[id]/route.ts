import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { 
  saveImageToPublic, 
  generateUniqueFilename, 
  getImageDirectory,
  parseBase64Image,
  validateImageBuffer,
  deleteImageFromPublic
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

    const book = await db.book.findUnique({
      where: { id },
      include: {
        poems: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: { poems: true },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Convert binary image to base64 URL if available
    let coverImageUrl: string | null = null
    if (book.coverImage && book.coverImageType) {
      coverImageUrl = `data:${book.coverImageType};base64,${book.coverImage.toString('base64')}`
    }

    return NextResponse.json({
      ...book,
      coverImage: undefined, // Don't send raw bytes
      coverImageUrl,
    })
  } catch (error: unknown) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book' },
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
      description,
      year,
      purchaseUrl,
      isFeatured,
      isPublished,
      coverImageUrl,
      coverImageData, // Base64 image data from upload
    } = body

    // Check if book exists
    const existingBook = await db.book.findUnique({
      where: { id },
    })

    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Check for duplicate slug (if slug is being changed)
    if (slug && slug !== existingBook.slug) {
      const slugExists = await db.book.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'इस स्लग के साथ एक पुस्तक पहले से मौजूद है' },
          { status: 400 }
        )
      }
    }

    // Handle image upload
    let savedImagePath: string | null = null
    let coverImageBuffer: Buffer | null = null
    let coverImageType: string | null = null

    if (coverImageData && coverImageData.startsWith('data:image/')) {
      // Parse and save the uploaded image
      const parsed = parseBase64Image(coverImageData)
      
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
        const filename = generateUniqueFilename(`${slug || existingBook.slug}.${extension}`)
        const directory = getImageDirectory('book')
        savedImagePath = await saveImageToPublic(buffer, directory, filename)
        
        // Store in database as binary for backup/portability
        coverImageBuffer = buffer
        coverImageType = mimeType
      }
    } else if (coverImageUrl) {
      // Use provided URL (could be existing or external)
      savedImagePath = coverImageUrl
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      title,
      slug,
      description,
      year: year ? parseInt(year) : null,
      purchaseUrl,
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
    }

    // Only update image fields if new image was uploaded
    if (coverImageBuffer !== null) {
      updateData.coverImage = coverImageBuffer
      updateData.coverImageType = coverImageType
    }

    const book = await db.book.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      ...book,
      coverImageUrl: savedImagePath,
    })
  } catch (error: unknown) {
    console.error('Error updating book:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update book'
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

    // Check if book exists
    const existingBook = await db.book.findUnique({
      where: { id },
    })

    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Remove book reference from poems first
    await db.poem.updateMany({
      where: { bookId: id },
      data: { bookId: null },
    })

    await db.book.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
