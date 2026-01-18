import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { BookForm } from '@/components/admin/BookForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBookPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params

  const book = await db.book.findUnique({
    where: { id },
  })

  if (!book) {
    notFound()
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/books" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← पुस्तकें
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          पुस्तक संपादित करें
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          {book.title}
        </p>
      </header>
      
      <BookForm book={book} />
    </div>
  )
}
