import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEnquiryEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

const rateLimiter = rateLimit({
  uniqueTokenPerInterval: 500,
  interval: 60000, // 1 minute
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitResult = rateLimiter.check(5, ip) // 5 requests per minute
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, phone, eventType, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to database
    const enquiry = await db.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        eventType: eventType || null,
        message,
        isRead: false,
        status: 'pending',
      },
    })

    // Send email (don't fail if email fails)
    const emailResult = await sendEnquiryEmail({
      name,
      email,
      phone,
      eventType,
      message,
    })

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      // Continue anyway - enquiry is saved in database
    }

    return NextResponse.json({
      success: true,
      id: enquiry.id,
      message: 'Enquiry submitted successfully',
    })
  } catch (error: any) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    )
  }
}
