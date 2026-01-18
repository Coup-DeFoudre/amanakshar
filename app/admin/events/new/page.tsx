import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EventForm } from '@/components/admin/EventForm'

export default async function NewEventPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/events" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← आयोजन
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          नया आयोजन जोड़ें
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          नए कवि सम्मेलन या कार्यक्रम की जानकारी जोड़ें
        </p>
      </header>
      
      <EventForm />
    </div>
  )
}
