'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format } from 'date-fns'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  slug: string
  eventDate: Date
  isPaid: boolean
  price?: number | null
  city?: string | null
}

interface EventCalendarProps {
  events: Event[]
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const eventsByDate = new Map<string, Event[]>()
  events.forEach(event => {
    const dateKey = format(new Date(event.eventDate), 'yyyy-MM-dd')
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, [])
    }
    eventsByDate.get(dateKey)!.push(event)
  })

  const tileContent = ({ date }: { date: Date }) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    const dayEvents = eventsByDate.get(dateKey) || []
    if (dayEvents.length > 0) {
      return (
        <div className="flex flex-col gap-1 mt-1">
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`h-1 w-1 rounded-full mx-auto ${
                event.isPaid ? 'bg-accent-gold' : 'bg-green-400'
              }`}
              title={event.title}
            />
          ))}
        </div>
      )
    }
    return null
  }

  const selectedDateEvents = selectedDate
    ? eventsByDate.get(format(selectedDate, 'yyyy-MM-dd')) || []
    : []

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary border border-divider rounded-sm p-4">
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value)
            } else if (Array.isArray(value) && value[0] instanceof Date) {
              setSelectedDate(value[0])
            }
          }}
          value={selectedDate}
          tileContent={tileContent}
          className="!bg-transparent !border-none w-full"
        />
        <div className="mt-4 flex gap-4 text-xs font-ui text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-gold" />
            <span>भुगतान</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>मुफ्त</span>
          </div>
        </div>
      </div>

      {selectedDate && selectedDateEvents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading text-lg text-text-primary">
            {format(selectedDate, 'dd MMMM yyyy')} के आयोजन
          </h3>
          {selectedDateEvents.map(event => (
            <Link
              key={event.id}
              href={`/prastutiyaan-live/${event.slug}`}
              className="block p-4 bg-bg-secondary border border-divider rounded-sm hover:border-divider-strong transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-heading text-text-primary mb-1">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap gap-3 text-sm font-ui text-text-muted">
                    {event.city && <span>📍 {event.city}</span>}
                    {event.isPaid && event.price && (
                      <span className="text-accent-gold">₹{event.price}</span>
                    )}
                    {!event.isPaid && (
                      <span className="text-green-400">मुफ्त</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
