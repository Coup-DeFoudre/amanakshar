import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookForm } from '@/components/admin/BookForm'

export default async function NewBookPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/books" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← पुस्तकें
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          नई पुस्तक
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          नई पुस्तक जोड़ें और प्रकाशित करें
        </p>
      </header>
      
      <BookForm />
    </div>
  )
}
