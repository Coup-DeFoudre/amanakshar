import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PoemsList } from '@/components/admin/PoemsList'

export default async function AdminPoemsPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch poems from database
  const poems = await db.poem.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      bhavs: {
        include: {
          bhav: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  })
  
  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-text-primary">
            कविताएँ
          </h1>
          <p className="font-ui text-text-secondary mt-1">
            कुल {poems.length} कविताएँ
          </p>
        </div>
        <Link
          href="/admin/poems/new"
          className="px-4 py-2 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span>
          <span>नई कविता</span>
        </Link>
      </header>
      
      {poems.length === 0 ? (
        <div className="text-center py-16 border border-divider rounded-sm">
          <p className="font-heading text-2xl text-text-muted mb-4">
            अभी कोई कविता नहीं है
          </p>
          <p className="font-ui text-text-muted mb-6">
            अपनी पहली कविता जोड़ें
          </p>
          <Link
            href="/admin/poems/new"
            className="inline-block px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity"
          >
            नई कविता जोड़ें
          </Link>
        </div>
      ) : (
        <PoemsList poems={poems} />
      )}
    </div>
  )
}
