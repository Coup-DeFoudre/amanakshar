import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { db } from '@/lib/db'

export default async function AdminSettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch current settings
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

  // Convert to plain object for serialization (Maps cannot be passed to client components)
  const settingsObject = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-3xl text-text-primary">
          सेटिंग्स
        </h1>
        <p className="font-ui text-text-secondary text-sm mt-2">
          ईमेल सेवा और अन्य विन्यास
        </p>
      </header>
      
      <SettingsForm initialSettings={settingsObject} />
    </div>
  )
}
