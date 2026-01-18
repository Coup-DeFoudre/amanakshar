import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { TextButton } from '@/components/ui/TextButton'
import { format } from 'date-fns'
import { AdminEventsView } from '@/components/admin/AdminEventsView'

export default async function AdminEventsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const events = await db.event.findMany({
    orderBy: {
      eventDate: 'desc',
    },
  })
  
  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-text-primary">
            आयोजन
          </h1>
          <p className="font-ui text-text-secondary text-sm mt-1">
            लाइव शो और कार्यक्रम प्रबंधित करें
          </p>
        </div>
        <Link href="/admin/events/new">
          <TextButton icon="+">
            नया आयोजन
          </TextButton>
        </Link>
      </header>
      
      <AdminEventsView events={events} />
    </div>
  )
}
