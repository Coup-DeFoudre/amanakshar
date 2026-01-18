import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

    const poem = await db.poem.findUnique({
      where: { id },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
        book: true,
        _count: {
          select: { likes: true },
        },
      },
    })

    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
    }

    return NextResponse.json(poem)
  } catch (error: unknown) {
    console.error('Error fetching poem:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poem' },
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

    // Check if poem exists
    const existingPoem = await db.poem.findUnique({
      where: { id },
    })

    if (!existingPoem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
    }

    // Check for duplicate slug (if slug is being changed)
    if (slug && slug !== existingPoem.slug) {
      const slugExists = await db.poem.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'इस स्लग के साथ एक कविता पहले से मौजूद है' },
          { status: 400 }
        )
      }
    }

    // Update bhavs - delete existing and create new
    if (bhavIds !== undefined) {
      await db.poemBhav.deleteMany({
        where: { poemId: id },
      })
    }

    const poem = await db.poem.update({
      where: { id },
      data: {
        title,
        slug,
        text,
        poetName,
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
    console.error('Error updating poem:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update poem'
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

    // Check if poem exists
    const existingPoem = await db.poem.findUnique({
      where: { id },
    })

    if (!existingPoem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 })
    }

    await db.poem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting poem:', error)
    return NextResponse.json(
      { error: 'Failed to delete poem' },
      { status: 500 }
    )
  }
}
