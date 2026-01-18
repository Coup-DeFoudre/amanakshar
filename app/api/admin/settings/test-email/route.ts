import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await sendEmail(
      'Test Email - अमन अक्षर',
      '<p>यह एक टेस्ट ईमेल है। यदि आप इसे प्राप्त कर रहे हैं, तो ईमेल सेटअप सही तरीके से काम कर रहा है।</p>',
      'यह एक टेस्ट ईमेल है। यदि आप इसे प्राप्त कर रहे हैं, तो ईमेल सेटअप सही तरीके से काम कर रहा है।'
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to send test email',
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send test email',
      },
      { status: 500 }
    )
  }
}
