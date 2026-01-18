import { db } from '@/lib/db'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { EventCalendar } from '@/components/events/EventCalendar'
import { EventList } from '@/components/events/EventList'
import { EventViewToggle } from '@/components/events/EventViewToggle'

async function getEvents() {
  try {
    const events = await db.event.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        eventDate: 'asc',
      },
    })
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function PrastutiyaanLivePage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          <header className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
              आगामी प्रस्तुतियाँ
            </h1>
            <p className="font-ui text-text-secondary">
              आगामी कवि-सम्मेलन और प्रस्तुतियों की जानकारी
            </p>
          </header>

          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-ui text-text-muted">
                इस समय कोई आगामी प्रस्तुति नहीं है
              </p>
            </div>
          ) : (
            <EventViewToggle events={events} />
          )}
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}
