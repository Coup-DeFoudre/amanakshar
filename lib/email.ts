import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { db } from './db'

interface EmailConfig {
  service: 'resend' | 'smtp'
  from: string
  to: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  resendApiKey?: string
}

async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          in: [
            'email_service',
            'email_from',
            'email_to',
            'smtp_host',
            'smtp_port',
            'smtp_user',
            'smtp_password',
            'resend_api_key',
          ],
        },
      },
    })

    const configMap = new Map(settings.map((s) => [s.key, s.value]))
    
    const service = configMap.get('email_service') as 'resend' | 'smtp' | undefined
    if (!service) return null

    return {
      service,
      from: configMap.get('email_from') || 'noreply@amanakshar.com',
      to: configMap.get('email_to') || '',
      smtpHost: configMap.get('smtp_host'),
      smtpPort: configMap.get('smtp_port') ? parseInt(configMap.get('smtp_port')!) : undefined,
      smtpUser: configMap.get('smtp_user'),
      smtpPassword: configMap.get('smtp_password'),
      resendApiKey: configMap.get('resend_api_key'),
    }
  } catch (error) {
    console.error('Error fetching email config:', error)
    return null
  }
}

export async function sendEmail(
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; error?: string }> {
  const config = await getEmailConfig()
  
  if (!config || !config.to) {
    return {
      success: false,
      error: 'Email configuration not found or incomplete',
    }
  }

  try {
    if (config.service === 'resend') {
      if (!config.resendApiKey) {
        return {
          success: false,
          error: 'Resend API key not configured',
        }
      }

      const resend = new Resend(config.resendApiKey)
      const result = await resend.emails.send({
        from: config.from,
        to: config.to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      })

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'Failed to send email',
        }
      }

      return { success: true }
    } else if (config.service === 'smtp') {
      if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
        return {
          success: false,
          error: 'SMTP configuration incomplete',
        }
      }

      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort || 587,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword,
        },
      })

      await transporter.sendMail({
        from: config.from,
        to: config.to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      })

      return { success: true }
    } else {
      return {
        success: false,
        error: 'Unknown email service',
      }
    }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email',
    }
  }
}

export async function sendEnquiryEmail(enquiry: {
  name: string
  email: string
  phone?: string
  eventType?: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const subject = `नया संपर्क: ${enquiry.eventType || 'सामान्य'}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #d4af37;">नया संपर्क प्राप्त हुआ</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>नाम:</strong> ${enquiry.name}</p>
        <p><strong>ईमेल:</strong> <a href="mailto:${enquiry.email}">${enquiry.email}</a></p>
        ${enquiry.phone ? `<p><strong>फ़ोन:</strong> ${enquiry.phone}</p>` : ''}
        ${enquiry.eventType ? `<p><strong>आयोजन प्रकार:</strong> ${enquiry.eventType}</p>` : ''}
        <p><strong>संदेश:</strong></p>
        <p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 3px;">${enquiry.message}</p>
      </div>
      <p style="color: #666; font-size: 12px;">यह ईमेल admin panel से भी देखा जा सकता है।</p>
    </body>
    </html>
  `

  return sendEmail(subject, html)
}
