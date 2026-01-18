import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { EventForm } from '@/components/admin/EventForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params
  const event = await db.event.findUnique({
    where: { id },
  })

  if (!event) {
    notFound()
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/events" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← आयोजन
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          आयोजन संपादित करें
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          {event.title}
        </p>
      </header>
      
      <EventForm event={event} />
    </div>
  )
}
