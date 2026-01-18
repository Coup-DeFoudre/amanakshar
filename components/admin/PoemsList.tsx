'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Bhav {
  id: string
  name: string
  slug: string
}

interface PoemWithRelations {
  id: string
  title: string
  slug: string
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  bhavs: Array<{ bhav: Bhav }>
  _count: {
    likes: number
  }
}

interface PoemsListProps {
  poems: PoemWithRelations[]
}

export function PoemsList({ poems }: PoemsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप वाकई "${title}" कविता हटाना चाहते हैं?`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/poems/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('कविता हटाने में त्रुटि')
      }
    } catch (error) {
      console.error('Error deleting poem:', error)
      alert('कविता हटाने में त्रुटि')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {poems.map((poem) => (
        <div
          key={poem.id}
          className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg text-text-primary truncate">
              {poem.title}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`font-ui text-xs px-2 py-0.5 rounded-sm ${
                poem.isPublished 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-yellow-900/30 text-yellow-400'
              }`}>
                {poem.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
              </span>
              {poem.isFeatured && (
                <span className="font-ui text-xs px-2 py-0.5 rounded-sm bg-accent-gold/20 text-accent-gold">
                  विशेष
                </span>
              )}
              {poem.bhavs.map(({ bhav }) => (
                <span
                  key={bhav.id}
                  className="font-ui text-xs px-2 py-0.5 rounded-sm bg-bg-secondary text-text-muted"
                >
                  {bhav.name}
                </span>
              ))}
              {poem._count.likes > 0 && (
                <span className="font-ui text-xs text-text-muted flex items-center gap-1">
                  ❤️ {poem._count.likes}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 ml-4">
            <Link
              href={`/kavita/${poem.slug}`}
              target="_blank"
              className="font-ui text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              देखें
            </Link>
            <Link
              href={`/admin/poems/${poem.id}`}
              className="font-ui text-sm text-text-secondary hover:text-accent-gold transition-colors"
            >
              संपादित
            </Link>
            <button
              onClick={() => handleDelete(poem.id, poem.title)}
              disabled={deletingId === poem.id}
              className="font-ui text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === poem.id ? 'हटा रहे...' : 'हटाएँ'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
