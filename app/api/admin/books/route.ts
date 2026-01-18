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

    const books = await db.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { poems: true },
        },
      },
    })

    return NextResponse.json(books)
  } catch (error: unknown) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
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
      description,
      year,
      purchaseUrl,
      isFeatured,
      isPublished,
      coverImageUrl,
      coverImageData, // Base64 image data from upload
    } = body

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title)

    // Check for duplicate slug
    const existingBook = await db.book.findUnique({
      where: { slug: finalSlug },
    })

    if (existingBook) {
      return NextResponse.json(
        { error: 'इस स्लग के साथ एक पुस्तक पहले से मौजूद है' },
        { status: 400 }
      )
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
        const filename = generateUniqueFilename(`${finalSlug}.${extension}`)
        const directory = getImageDirectory('book')
        savedImagePath = await saveImageToPublic(buffer, directory, filename)
        
        // Also store in database as binary for backup/portability
        coverImageBuffer = buffer
        coverImageType = mimeType
      }
    } else if (coverImageUrl) {
      // Use provided URL
      savedImagePath = coverImageUrl
    }

    const book = await db.book.create({
      data: {
        title,
        slug: finalSlug,
        description,
        year: year ? parseInt(year) : null,
        purchaseUrl: purchaseUrl || null, // Store purchaseUrl from request body only
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        // Store binary image data
        coverImage: coverImageBuffer,
        coverImageType: coverImageType,
      },
    })

    // Return book with the image URL for frontend use
    return NextResponse.json({
      ...book,
      coverImageUrl: savedImagePath,
    })
  } catch (error: unknown) {
    console.error('Error creating book:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create book'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
