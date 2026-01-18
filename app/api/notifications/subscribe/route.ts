import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, keys, userId } = body

    if (!endpoint || !keys) {
      return NextResponse.json(
        { error: 'Endpoint and keys are required' },
        { status: 400 }
      )
    }

    // Check if subscription already exists
    const existing = await db.notificationSubscription.findUnique({
      where: { endpoint },
    })

    if (existing) {
      // Update existing subscription
      await db.notificationSubscription.update({
        where: { endpoint },
        data: {
          keys: keys as any,
          userId: userId || null,
        },
      })
    } else {
      // Create new subscription
      await db.notificationSubscription.create({
        data: {
          endpoint,
          keys: keys as any,
          userId: userId || null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error subscribing to notifications:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
