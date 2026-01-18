import Link from 'next/link'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  slug: string
  description?: string | null
  eventDate: Date
  eventTime?: string | null
  venue?: string | null
  city?: string | null
  isPaid: boolean
  price?: number | null
  isLive?: boolean
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/prastutiyaan-live/${event.slug}`}
      className="block p-6 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-heading text-lg text-text-primary">
          {event.title}
        </h3>
        <div className="flex gap-2">
          {event.isLive && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-ui rounded-sm">
              लाइव
            </span>
          )}
          {event.isPaid ? (
            <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs font-ui rounded-sm">
              {event.price ? `₹${event.price}` : 'भुगतान'}
            </span>
          ) : (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-ui rounded-sm">
              मुफ्त
            </span>
          )}
        </div>
      </div>
      {event.description && (
        <p className="font-ui text-text-secondary text-sm mb-3 line-clamp-2">
          {event.description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 text-xs font-ui text-text-muted">
        <span>📅 {format(new Date(event.eventDate), 'dd MMM yyyy')}</span>
        {event.venue && <span>📍 {event.venue}</span>}
        {event.city && <span>🏙️ {event.city}</span>}
      </div>
    </Link>
  )
}
