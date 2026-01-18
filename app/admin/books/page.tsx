import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { BooksList } from '@/components/admin/BooksList'

export default async function AdminBooksPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const books = await db.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { poems: true },
      },
    },
  })
  
  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-text-primary">
            पुस्तकें
          </h1>
          <p className="font-ui text-text-secondary mt-1">
            कुल {books.length} पुस्तकें
          </p>
        </div>
        <Link
          href="/admin/books/new"
          className="px-4 py-2 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>+</span>
          <span>नई पुस्तक</span>
        </Link>
      </header>
      
      {books.length === 0 ? (
        <div className="text-center py-16 border border-divider rounded-sm">
          <p className="font-heading text-2xl text-text-muted mb-4">
            अभी कोई पुस्तक नहीं है
          </p>
          <p className="font-ui text-text-muted mb-6">
            अपनी पहली पुस्तक जोड़ें
          </p>
          <Link
            href="/admin/books/new"
            className="inline-block px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity"
          >
            नई पुस्तक जोड़ें
          </Link>
        </div>
      ) : (
        <BooksList books={books} />
      )}
    </div>
  )
}
