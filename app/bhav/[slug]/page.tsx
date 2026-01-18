import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { PoemCard } from '@/components/poems'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBhav(slug: string) {
  const bhav = await db.bhav.findUnique({
    where: { slug },
    include: {
      poems: {
        where: {
          poem: {
            isPublished: true,
          },
        },
        include: {
          poem: {
            select: {
              id: true,
              title: true,
              slug: true,
              text: true,
            },
          },
        },
      },
      performances: {
        where: {
          performance: {
            isPublished: true,
          },
        },
        include: {
          performance: {
            select: {
              id: true,
              title: true,
              youtubeUrl: true,
              context: true,
            },
          },
        },
      },
    },
  })
  return bhav
}

async function getAllBhavs() {
  return db.bhav.findMany({
    select: {
      name: true,
      slug: true,
    },
  })
}

export default async function BhavPage({ params }: PageProps) {
  const { slug } = await params
  const bhav = await getBhav(slug)
  
  if (!bhav) {
    notFound()
  }

  const allBhavs = await getAllBhavs()

  // Transform poems for display
  const poems = bhav.poems.map(pb => ({
    id: pb.poem.id,
    title: pb.poem.title,
    slug: pb.poem.slug,
    excerpt: pb.poem.text.substring(0, 100).replace(/\n/g, ' ') + (pb.poem.text.length > 100 ? '...' : ''),
  }))

  // Transform performances
  const performances = bhav.performances.map(pf => ({
    id: pf.performance.id,
    title: pf.performance.title,
    youtubeUrl: pf.performance.youtubeUrl,
    context: pf.performance.context || '',
  }))
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl text-text-primary mb-4">
              {bhav.name}
            </h1>
            {bhav.description && (
              <p className="font-ui text-text-secondary max-w-xl mx-auto">
                {bhav.description}
              </p>
            )}
          </header>
          
          {/* Highlighted Line */}
          {bhav.sampleLine && (
            <div className="text-center py-8 mb-8 border-t border-b border-divider">
              <p className="font-poem text-xl sm:text-2xl text-accent-gold italic">
                "{bhav.sampleLine}"
              </p>
            </div>
          )}
          
          {/* Poems Section */}
          {poems.length > 0 ? (
            <>
              <section>
                <h2 className="font-heading text-2xl text-text-primary mb-6">
                  {bhav.name} की कविताएँ
                </h2>
                
                <div className="space-y-6">
                  {poems.map((poem, index) => (
                    <div key={poem.id}>
                      <PoemCard
                        title={poem.title}
                        slug={poem.slug}
                        excerpt={poem.excerpt}
                        bhavs={[bhav.name]}
                        index={index}
                      />
                      {index < poems.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              </section>
              
              <Divider />
            </>
          ) : (
            <div className="text-center py-12 mb-8">
              <p className="font-ui text-text-muted">
                इस भाव में अभी कोई कविता प्रकाशित नहीं है
              </p>
            </div>
          )}
          
          {/* Performances Section */}
          {performances.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl text-text-primary mb-6">
                {bhav.name} की प्रस्तुतियाँ
              </h2>
              
              <div className="space-y-8">
                {performances.map((perf) => (
                  <div key={perf.id}>
                    <h3 className="font-heading text-xl text-text-secondary mb-2">
                      {perf.title}
                    </h3>
                    {perf.context && (
                      <p className="font-ui text-text-muted text-sm mb-4">
                        {perf.context}
                      </p>
                    )}
                    <YouTubeEmbed url={perf.youtubeUrl} title={perf.title} />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Other Bhavs */}
          {allBhavs.length > 1 && (
            <div className="mt-16 pt-8 border-t border-divider text-center">
              <p className="font-ui text-text-muted mb-4">अन्य भाव देखें</p>
              <nav className="font-ui text-lg">
                {allBhavs
                  .filter(b => b.slug !== slug)
                  .map((b, index, arr) => (
                    <span key={b.slug}>
                      <Link
                        href={`/bhav/${b.slug}`}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {b.name}
                      </Link>
                      {index < arr.length - 1 && (
                        <span className="mx-3 text-text-muted">|</span>
                      )}
                    </span>
                  ))}
              </nav>
            </div>
          )}
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const bhav = await getBhav(slug)
  
  if (!bhav) {
    return { title: 'भाव नहीं मिला' }
  }
  
  return {
    title: `${bhav.name} — अमन अक्षर`,
    description: bhav.description || `${bhav.name} की कविताएँ — अमन अक्षर`,
  }
}
