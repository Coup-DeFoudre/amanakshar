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

interface EventListProps {
  events: Event[]
  showPast?: boolean
}

export function EventList({ events, showPast = false }: EventListProps) {
  const now = new Date()
  const filteredEvents = showPast
    ? events
    : events.filter(event => new Date(event.eventDate) >= now)

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-ui text-text-muted">
          {showPast ? 'कोई पिछला आयोजन नहीं' : 'इस समय कोई आगामी आयोजन नहीं है'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredEvents.map((event) => (
        <Link
          key={event.id}
          href={`/prastutiyaan-live/${event.slug}`}
          className="block p-6 border border-divider rounded-sm hover:border-divider-strong hover:bg-bg-secondary/50 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-heading text-xl text-text-primary">
                  {event.title}
                </h3>
                {event.isLive && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-ui rounded-sm">
                    लाइव
                  </span>
                )}
                {event.isPaid ? (
                  <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs font-ui rounded-sm">
                    {event.price ? `₹${event.price}` : 'भुगतान'}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-ui rounded-sm">
                    मुफ्त
                  </span>
                )}
              </div>
              {event.description && (
                <p className="font-ui text-text-secondary text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 font-ui text-sm text-text-muted">
                {event.eventDate && (
                  <span>
                    📅 {format(new Date(event.eventDate), 'dd MMMM yyyy')}
                    {event.eventTime && `, ${event.eventTime}`}
                  </span>
                )}
                {event.venue && <span>📍 {event.venue}</span>}
                {event.city && <span>🏙️ {event.city}</span>}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
