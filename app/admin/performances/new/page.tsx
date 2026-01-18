import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PerformanceForm } from '@/components/admin/PerformanceForm'

export default async function NewPerformancePage() {
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
        <Link href="/admin/performances" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← प्रस्तुतियाँ
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          नई प्रस्तुति
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          नई YouTube प्रस्तुति जोड़ें और प्रकाशित करें
        </p>
      </header>
      
      <PerformanceForm bhavs={bhavs} />
    </div>
  )
}
