import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { EventCardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton'

export default function EventsLoading() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title Skeleton */}
          <PageHeaderSkeleton />
          
          {/* Events List Skeleton */}
          <div className="space-y-4 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 75}ms` }}>
                <EventCardSkeleton />
              </div>
            ))}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}
