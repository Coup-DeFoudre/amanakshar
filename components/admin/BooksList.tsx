'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Book {
  id: string
  title: string
  slug: string
  description: string | null
  year: number | null
  purchaseUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  _count: {
    poems: number
  }
}

interface BooksListProps {
  books: Book[]
}

export function BooksList({ books }: BooksListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप "${title}" पुस्तक को हटाना चाहते हैं?`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/books/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('पुस्तक हटाने में त्रुटि')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('पुस्तक हटाने में त्रुटि')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors bg-bg-secondary/30"
        >
          <div className="flex items-center gap-4">
            {/* Cover placeholder */}
            <div className="w-12 h-16 bg-bg-primary rounded-sm flex items-center justify-center border border-divider">
              <span className="text-text-muted text-xs">📕</span>
            </div>
            
            <div>
              <h3 className="font-heading text-lg text-text-primary">
                {book.title}
              </h3>
              <div className="flex flex-wrap gap-3 mt-1">
                {book.year && (
                  <span className="font-ui text-xs text-text-muted">
                    {book.year}
                  </span>
                )}
                <span className={`font-ui text-xs ${book.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                  {book.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                </span>
                {book.isFeatured && (
                  <span className="font-ui text-xs text-accent-gold">
                    विशेष
                  </span>
                )}
                {book._count.poems > 0 && (
                  <span className="font-ui text-xs text-text-muted">
                    {book._count.poems} कविताएँ
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link
              href={`/admin/books/${book.id}`}
              className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              संपादित
            </Link>
            <button
              onClick={() => handleDelete(book.id, book.title)}
              disabled={deletingId === book.id}
              className="font-ui text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {deletingId === book.id ? 'हटा रहे...' : 'हटाएँ'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
