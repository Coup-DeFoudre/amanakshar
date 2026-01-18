import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isPublished = searchParams.get('published') !== 'false'
    const isLive = searchParams.get('live')
    
    const events = await db.event.findMany({
      where: {
        ...(isPublished && { isPublished: true }),
        ...(isLive === 'true' && { isLive: true }),
      },
      orderBy: {
        eventDate: 'asc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
