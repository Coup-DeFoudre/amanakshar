'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Bhav {
  id: string
  name: string
  slug: string
}

interface Performance {
  id: string
  title: string
  slug: string
  context: string | null
  youtubeUrl: string
  type: string
  isFeatured: boolean
  isPublished: boolean
  bhavs: Array<{ bhav: Bhav }>
}

interface PerformancesListProps {
  performances: Performance[]
}

export function PerformancesList({ performances }: PerformancesListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप "${title}" प्रस्तुति को हटाना चाहते हैं?`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/performances/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('प्रस्तुति हटाने में त्रुटि')
      }
    } catch (error) {
      console.error('Error deleting performance:', error)
      alert('प्रस्तुति हटाने में त्रुटि')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {performances.map((performance) => (
        <div
          key={performance.id}
          className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors bg-bg-secondary/30"
        >
          <div>
            <h3 className="font-heading text-lg text-text-primary">
              {performance.title}
            </h3>
            <div className="flex flex-wrap gap-3 mt-1">
              <span className="font-ui text-xs text-text-muted">
                {performance.type}
              </span>
              <span className={`font-ui text-xs ${performance.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                {performance.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
              </span>
              {performance.isFeatured && (
                <span className="font-ui text-xs text-accent-gold">
                  विशेष
                </span>
              )}
              {performance.bhavs.length > 0 && (
                <span className="font-ui text-xs text-text-muted">
                  {performance.bhavs.map(b => b.bhav.name).join(', ')}
                </span>
              )}
            </div>
            {performance.context && (
              <p className="font-ui text-xs text-text-muted mt-1 line-clamp-1">
                {performance.context}
              </p>
            )}
          </div>
          
          <div className="flex gap-4">
            <a
              href={performance.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              YouTube
            </a>
            <Link
              href={`/admin/performances/${performance.id}`}
              className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              संपादित
            </Link>
            <button
              onClick={() => handleDelete(performance.id, performance.title)}
              disabled={deletingId === performance.id}
              className="font-ui text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {deletingId === performance.id ? 'हटा रहे...' : 'हटाएँ'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
