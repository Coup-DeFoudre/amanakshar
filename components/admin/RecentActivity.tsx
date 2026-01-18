import Link from 'next/link'
import { format } from 'date-fns'

interface RecentActivityProps {
  items: Array<{
    id: string
    type: 'poem' | 'event' | 'enquiry' | 'performance' | 'book'
    title: string
    href: string
    date: Date
  }>
}

export function RecentActivity({ items }: RecentActivityProps) {
  const typeLabels: Record<string, string> = {
    poem: 'कविता',
    event: 'आयोजन',
    enquiry: 'संपर्क',
    performance: 'प्रस्तुति',
    book: 'पुस्तक',
  }

  const typeIcons: Record<string, string> = {
    poem: '📝',
    event: '📅',
    enquiry: '📧',
    performance: '🎬',
    book: '📚',
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted font-ui">
        कोई हाल की गतिविधि नहीं
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="block p-4 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">{typeIcons[item.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-ui text-xs text-text-muted">
                  {typeLabels[item.type]}
                </span>
                <span className="font-ui text-xs text-text-muted">
                  {format(item.date, 'dd MMM yyyy')}
                </span>
              </div>
              <p className="font-ui text-sm text-text-primary truncate">
                {item.title}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
