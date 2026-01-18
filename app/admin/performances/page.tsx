import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PerformancesList } from '@/components/admin/PerformancesList'

export default async function AdminPerformancesPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const performances = await db.performance.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      bhavs: {
        include: {
          bhav: true,
        },
      },
    },
  })
  
  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-text-primary">
            प्रस्तुतियाँ
          </h1>
          <p className="font-ui text-text-secondary mt-1">
            कुल {performances.length} प्रस्तुतियाँ
          </p>
        </div>
        <Link
          href="/admin/performances/new"
          className="px-4 py-2 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span>
          <span>नई प्रस्तुति</span>
        </Link>
      </header>
      
      {performances.length === 0 ? (
        <div className="text-center py-16 border border-divider rounded-sm">
          <p className="font-heading text-2xl text-text-muted mb-4">
            अभी कोई प्रस्तुति नहीं है
          </p>
          <p className="font-ui text-text-muted mb-6">
            अपनी पहली प्रस्तुति जोड़ें
          </p>
          <Link
            href="/admin/performances/new"
            className="inline-block px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity"
          >
            नई प्रस्तुति जोड़ें
          </Link>
        </div>
      ) : (
        <PerformancesList performances={performances} />
      )}
    </div>
  )
}
