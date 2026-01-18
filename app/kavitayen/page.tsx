import { Suspense } from 'react'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { PoemCard, PoemFilters } from '@/components/poems'
import { db } from '@/lib/db'

interface PageProps {
  searchParams: Promise<{ bhav?: string; year?: string }>
}

export default async function KavitayenPage({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedBhav = params.bhav
  const selectedYear = params.year

  // Fetch bhavs for filter
  const bhavs = await db.bhav.findMany({
    orderBy: { name: 'asc' },
    select: {
      name: true,
      slug: true,
    },
  })

  // Build query filter
  const where: {
    isPublished: boolean
    bhavs?: { some: { bhav: { slug: string } } }
    firstPerformanceYear?: number
  } = {
    isPublished: true,
  }

  if (selectedBhav) {
    where.bhavs = {
      some: {
        bhav: { slug: selectedBhav },
      },
    }
  }

  if (selectedYear) {
    where.firstPerformanceYear = parseInt(selectedYear)
  }

  // Fetch published poems
  const poems = await db.poem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      bhavs: {
        include: {
          bhav: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  // Get unique years for filter
  const yearsResult = await db.poem.findMany({
    where: { isPublished: true },
    select: { firstPerformanceYear: true },
    distinct: ['firstPerformanceYear'],
    orderBy: { firstPerformanceYear: 'desc' },
  })
  const years = yearsResult
    .map(p => p.firstPerformanceYear)
    .filter((y): y is number => y !== null)

  // Transform poems for display
  const displayPoems = poems.map(poem => ({
    id: poem.id,
    title: poem.title,
    slug: poem.slug,
    excerpt: poem.text.substring(0, 150).replace(/\n/g, ' ') + (poem.text.length > 150 ? '...' : ''),
    bhavs: poem.bhavs.map(b => b.bhav.name),
  }))
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title */}
          <h1 className="font-heading text-3xl sm:text-4xl text-center text-text-primary mb-8">
            कविताएँ
          </h1>
          
          {/* Filters */}
          <Suspense fallback={null}>
            <PoemFilters
              bhavs={bhavs}
              selectedBhav={selectedBhav}
              selectedYear={selectedYear}
              years={years}
            />
          </Suspense>
          
          <Divider />
          
          {/* Poems List */}
          <div className="space-y-8">
            {displayPoems.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-heading text-2xl text-text-muted mb-2">
                  {selectedBhav || selectedYear 
                    ? 'इस श्रेणी में कोई कविता नहीं मिली'
                    : 'अभी कोई कविता प्रकाशित नहीं है'
                  }
                </p>
                <p className="font-ui text-text-muted">
                  {selectedBhav || selectedYear 
                    ? 'अन्य फ़िल्टर आज़माएं'
                    : 'जल्द ही नई कविताएँ आएंगी'
                  }
                </p>
              </div>
            ) : (
              displayPoems.map((poem, index) => (
                <div key={poem.id}>
                  <PoemCard
                    title={poem.title}
                    slug={poem.slug}
                    excerpt={poem.excerpt}
                    bhavs={poem.bhavs}
                    index={index}
                  />
                  {index < displayPoems.length - 1 && <Divider />}
                </div>
              ))
            )}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export const metadata = {
  title: 'कविताएँ — अमन अक्षर',
  description: 'अमन अक्षर की सम्पूर्ण कविताओं का संग्रह। प्रेम, भक्ति, जीवन और दर्शन की कविताएँ।',
}
