import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { format } from 'date-fns'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await db.event.findUnique({
    where: { slug },
  })

  if (!event || !event.isPublished) {
    notFound()
  }

  const eventDate = new Date(event.eventDate)
  const isUpcoming = eventDate >= new Date()

  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          <article>
            <header className="mb-8">
              <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
                {event.title}
              </h1>
              
              {event.isLive && (
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs font-ui rounded-sm mb-4">
                  लाइव
                </span>
              )}

              <div className="flex flex-wrap gap-6 font-ui text-text-secondary mb-6">
                {event.eventDate && (
                  <div>
                    <span className="text-text-muted text-sm">तिथि:</span>{' '}
                    <span className="text-text-primary">
                      {format(eventDate, 'dd MMMM yyyy')}
                      {event.eventTime && `, ${event.eventTime}`}
                    </span>
                  </div>
                )}
                {event.venue && (
                  <div>
                    <span className="text-text-muted text-sm">स्थान:</span>{' '}
                    <span className="text-text-primary">{event.venue}</span>
                  </div>
                )}
                {event.city && (
                  <div>
                    <span className="text-text-muted text-sm">शहर:</span>{' '}
                    <span className="text-text-primary">{event.city}</span>
                    {event.state && `, ${event.state}`}
                  </div>
                )}
              </div>

              {event.venueAddress && (
                <div className="mb-6">
                  <p className="font-ui text-text-secondary">
                    <span className="text-text-muted text-sm">पता:</span>{' '}
                    {event.venueAddress}
                  </p>
                </div>
              )}

              <div className="mb-6 flex items-center gap-4">
                {event.isPaid ? (
                  <div className="px-4 py-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 rounded-sm">
                    <span className="font-ui text-sm">
                      {event.price ? `₹${event.price}` : 'भुगतान आयोजन'}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-sm">
                    <span className="font-ui text-sm">मुफ्त आयोजन</span>
                  </div>
                )}
                {event.ticketUrl && isUpcoming && (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity"
                  >
                    टिकट बुक करें
                  </a>
                )}
              </div>
            </header>

            {event.description && (
              <div className="prose prose-invert max-w-none mb-8">
                <div className="font-ui text-text-secondary leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>
            )}

            {event.imageUrl && (
              <div className="mb-8">
                <OptimizedImage
                  src={event.imageUrl}
                  alt={event.title}
                  width={1200}
                  height={630}
                  objectFit="cover"
                  fallback="/images/placeholders/event.svg"
                  className="w-full h-auto rounded-sm"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}
          </article>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = await db.event.findUnique({
    where: { slug },
  })

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: `${event.title} | अमन अक्षर`,
    description: event.description || `Upcoming event: ${event.title}`,
  }
}
