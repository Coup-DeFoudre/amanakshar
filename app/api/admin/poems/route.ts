import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

    const poems = await db.poem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    })

    return NextResponse.json(poems)
  } catch (error: unknown) {
    console.error('Error fetching poems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poems' },
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
      text,
      poetName,
      writtenDate,
      firstPerformanceYear,
      firstPerformancePlace,
      youtubeUrl,
      isFeatured,
      isPublished,
      bhavIds,
    } = body

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title)

    // Check for duplicate slug
    const existingPoem = await db.poem.findUnique({
      where: { slug: finalSlug },
    })

    if (existingPoem) {
      return NextResponse.json(
        { error: 'इस स्लग के साथ एक कविता पहले से मौजूद है' },
        { status: 400 }
      )
    }

    const poem = await db.poem.create({
      data: {
        title,
        slug: finalSlug,
        text,
        poetName: poetName || 'अमन अक्षर',
        writtenDate: writtenDate ? new Date(writtenDate) : null,
        firstPerformanceYear: firstPerformanceYear ? parseInt(firstPerformanceYear) : null,
        firstPerformancePlace,
        youtubeUrl,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        bhavs: bhavIds && bhavIds.length > 0 ? {
          create: bhavIds.map((bhavId: string) => ({
            bhav: { connect: { id: bhavId } },
          })),
        } : undefined,
      },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
      },
    })

    return NextResponse.json(poem)
  } catch (error: unknown) {
    console.error('Error creating poem:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create poem'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
