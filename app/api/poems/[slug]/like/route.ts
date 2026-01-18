import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

interface RouteParams {
  params: Promise<{ slug: string }>
}

const rateLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000, // 1 minute
})

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    const browserUuid = request.headers.get('x-browser-uuid')
    
    if (!browserUuid) {
      return NextResponse.json({
        isLiked: false,
        likeCount: 0,
      })
    }

    // Get poem by slug
    const poem = await db.poem.findUnique({
      where: { slug },
      include: {
        likes: true,
      },
    })

    if (!poem) {
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      )
    }

    // Check if current browser has liked
    const isLiked = poem.likes.some(like => like.browserUuid === browserUuid)
    const likeCount = poem.likes.length

    return NextResponse.json({
      isLiked,
      likeCount,
    })
  } catch (error: any) {
    console.error('Error fetching like status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch like status' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params
    
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitResult = rateLimiter.check(10, ip) // 10 likes per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { browserUuid } = body

    if (!browserUuid) {
      return NextResponse.json(
        { error: 'Browser UUID is required' },
        { status: 400 }
      )
    }

    // Get poem by slug
    const poem = await db.poem.findUnique({
      where: { slug },
    })

    if (!poem) {
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      )
    }

    // Check if like already exists
    const existingLike = await db.like.findUnique({
      where: {
        poemId_browserUuid: {
          poemId: poem.id,
          browserUuid,
        },
      },
    })

    let isLiked: boolean
    let likeCount: number

    if (existingLike) {
      // Unlike - delete the like
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      })
      isLiked = false
    } else {
      // Like - create new like
      await db.like.create({
        data: {
          poemId: poem.id,
          browserUuid,
        },
      })
      isLiked = true
    }

    // Get updated like count
    likeCount = await db.like.count({
      where: { poemId: poem.id },
    })

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    })
  } catch (error: any) {
    console.error('Error toggling like:', error)
    
    // Handle unique constraint violation (shouldn't happen but just in case)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Like already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
