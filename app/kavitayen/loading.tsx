import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { PoemCardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton'
import { Divider } from '@/components/ui/Divider'

export default function KavitayenLoading() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title Skeleton */}
          <PageHeaderSkeleton />
          
          <Divider />
          
          {/* Poems List Skeleton */}
          <div className="space-y-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 50}ms` }}>
                <PoemCardSkeleton />
                {i < 7 && <Divider />}
              </div>
            ))}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}
