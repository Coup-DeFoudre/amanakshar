import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import webpush from 'web-push'

// VAPID keys - should be in environment variables
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ''
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@amanakshar.com'

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, body: message } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    // Get all subscriptions
    const subscriptions = await db.notificationSubscription.findMany()

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscriptions found',
        recipientCount: 0,
      })
    }

    // Send notifications
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
    })

    let successCount = 0
    let failCount = 0

    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys as any,
          },
          payload
        )
        successCount++
      } catch (error: any) {
        console.error('Error sending notification:', error)
        failCount++
        
        // If subscription is invalid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await db.notificationSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    })

    await Promise.all(sendPromises)

    // Log the notification
    await db.notificationLog.create({
      data: {
        title,
        body: message,
        recipientCount: successCount,
      },
    })

    return NextResponse.json({
      success: true,
      recipientCount: successCount,
      failedCount: failCount,
    })
  } catch (error: any) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send notifications' },
      { status: 500 }
    )
  }
}
