'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { EventCalendar } from '@/components/events/EventCalendar'
import { Event } from '@prisma/client'

interface AdminEventsViewProps {
  events: Event[]
}

export function AdminEventsView({ events }: AdminEventsViewProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-ui text-text-muted">
          कोई आयोजन नहीं मिला
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-sm font-ui text-sm transition-colors ${
            view === 'list'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-divider'
          }`}
        >
          सूची
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`px-4 py-2 rounded-sm font-ui text-sm transition-colors ${
            view === 'calendar'
              ? 'bg-accent-gold text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-divider'
          }`}
        >
          कैलेंडर
        </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-heading text-lg text-text-primary">
                  {event.title}
                </h3>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {event.eventDate && (
                    <span className="font-ui text-xs text-text-muted">
                      {format(new Date(event.eventDate), 'dd MMM yyyy')}
                    </span>
                  )}
                  {event.venue && (
                    <span className="font-ui text-xs text-text-muted">
                      {event.venue}
                    </span>
                  )}
                  {event.city && (
                    <span className="font-ui text-xs text-text-muted">
                      {event.city}
                    </span>
                  )}
                  {event.isPaid ? (
                    <span className="font-ui text-xs text-accent-gold">
                      {event.price ? `₹${event.price}` : 'भुगतान'}
                    </span>
                  ) : (
                    <span className="font-ui text-xs text-green-400">
                      मुफ्त
                    </span>
                  )}
                  <span className={`font-ui text-xs ${event.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                    {event.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                  </span>
                  {event.isLive && (
                    <span className="font-ui text-xs text-red-400">
                      लाइव
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link 
                  href={`/admin/events/${event.id}`}
                  className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  संपादित
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('क्या आप इस आयोजन को हटाना चाहते हैं?')) {
                      const response = await fetch(`/api/admin/events/${event.id}`, {
                        method: 'DELETE',
                      })
                      if (response.ok) {
                        window.location.reload()
                      }
                    }
                  }}
                  className="font-ui text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  हटाएँ
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EventCalendar events={events.map(e => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          eventDate: e.eventDate,
          isPaid: e.isPaid,
          price: e.price,
          city: e.city,
        }))} />
      )}
    </div>
  )
}
