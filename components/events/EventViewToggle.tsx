'use client'

import { useState } from 'react'
import { EventCalendar } from './EventCalendar'
import { EventList } from './EventList'

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

interface EventViewToggleProps {
  events: Event[]
}

export function EventViewToggle({ events }: EventViewToggleProps) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  return (
    <div>
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView('calendar')}
          className={`px-6 py-2 rounded-sm font-ui transition-colors ${
            view === 'calendar'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-divider'
          }`}
        >
          कैलेंडर
        </button>
        <button
          onClick={() => setView('list')}
          className={`px-6 py-2 rounded-sm font-ui transition-colors ${
            view === 'list'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-divider'
          }`}
        >
          सूची
        </button>
      </div>

      {view === 'calendar' ? (
        <EventCalendar events={events} />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-heading text-2xl text-text-primary mb-6">
              आगामी
            </h2>
            <EventList events={events} showPast={false} />
          </section>
          <section>
            <h2 className="font-heading text-2xl text-text-primary mb-6">
              पिछली प्रस्तुतियाँ
            </h2>
            <EventList events={events} showPast={true} />
          </section>
        </div>
      )}
    </div>
  )
}
