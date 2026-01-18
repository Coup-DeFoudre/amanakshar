import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PoemForm } from '@/components/admin/PoemForm'

export default async function NewPoemPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch available bhavs for the form
  const bhavs = await db.bhav.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/poems" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← कविताएँ
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          नई कविता
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          नई कविता जोड़ें और प्रकाशित करें
        </p>
      </header>
      
      <PoemForm bhavs={bhavs} />
    </div>
  )
}
