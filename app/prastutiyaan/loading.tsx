import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { PerformanceCardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton'

export default function PrastutiyaanLoading() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title Skeleton */}
          <PageHeaderSkeleton />
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ animationDelay: `${i * 75}ms` }}>
                <PerformanceCardSkeleton />
              </div>
            ))}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}
