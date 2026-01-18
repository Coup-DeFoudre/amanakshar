import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { PoemText } from '@/components/ui/PoemText'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { TextButton } from '@/components/ui/TextButton'
import { PoemNavigation, RelatedPoems, LikeButton, OfflineIndicator } from '@/components/poems'
import { PoemJsonLd, BreadcrumbJsonLd } from '@/components/seo'
import { Metadata } from 'next'
import { db } from '@/lib/db'
import { generatePoemMetadata } from '@/lib/metadata'

interface PageProps {
  params: Promise<{ slug: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amanakshar.com'

async function getPoem(slug: string) {
  const poem = await db.poem.findUnique({
    where: { slug, isPublished: true },
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
      book: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  })
  return poem
}

async function getAdjacentPoems(currentSlug: string) {
  // Get all published poems ordered by creation date
  const poems = await db.poem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true },
  })
  
  const currentIndex = poems.findIndex(p => p.slug === currentSlug)
  
  return {
    prev: currentIndex > 0 ? poems[currentIndex - 1] : undefined,
    next: currentIndex < poems.length - 1 ? poems[currentIndex + 1] : undefined,
  }
}

async function getRelatedPoems(currentSlug: string, bhavSlugs: string[]) {
  if (bhavSlugs.length === 0) return []
  
  const relatedPoems = await db.poem.findMany({
    where: {
      isPublished: true,
      slug: { not: currentSlug },
      bhavs: {
        some: {
          bhav: {
            slug: { in: bhavSlugs },
          },
        },
      },
    },
    take: 3,
    select: {
      title: true,
      slug: true,
    },
  })
  
  return relatedPoems
}

export default async function KavitaPage({ params }: PageProps) {
  const { slug } = await params
  const poem = await getPoem(slug)
  
  if (!poem) {
    notFound()
  }

  const bhavNames = poem.bhavs.map(b => b.bhav.name)
  const bhavSlugs = poem.bhavs.map(b => b.bhav.slug)
  
  const { prev, next } = await getAdjacentPoems(slug)
  const relatedPoems = await getRelatedPoems(slug, bhavSlugs)
  
  // Breadcrumb data
  const breadcrumbs = [
    { name: 'घर', url: '/' },
    { name: 'कविताएँ', url: '/kavitayen' },
    { name: poem.title, url: `/kavita/${slug}` },
  ]
  
  return (
    <>
      {/* Structured Data */}
      <PoemJsonLd
        title={poem.title}
        slug={slug}
        text={poem.text}
        poetName={poem.poetName}
        bhav={bhavNames[0]}
        datePublished={poem.createdAt}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      <main 
        className="min-h-screen"
        aria-label={`कविता: ${poem.title}`}
      >
        <PageContainer>
          <SectionSpacing size="lg">
            {/* Breadcrumb Navigation */}
            <nav 
              aria-label="ब्रेडक्रम्ब"
              className="text-sm font-ui text-text-muted mb-8"
            >
              <ol className="flex items-center gap-2" role="list">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.url} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-text-secondary" aria-current="page">
                        {crumb.name}
                      </span>
                    ) : (
                      <a 
                        href={crumb.url}
                        className="hover:text-accent-gold transition-colors"
                      >
                        {crumb.name}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            
            {/* Poem Header with Enhanced Typography */}
            <header className="text-center mb-12">
              <h1 
                className="font-heading text-text-primary mb-4 text-heading-optimal"
                style={{ 
                  fontSize: 'var(--font-size-3xl)',
                  lineHeight: 'var(--line-height-heading)',
                  letterSpacing: 'var(--letter-spacing-heading)',
                  textWrap: 'balance',
                } as React.CSSProperties}
              >
                {poem.title}
              </h1>
              <p 
                className="font-ui text-text-secondary"
                style={{ 
                  fontSize: 'var(--font-size-base)',
                  letterSpacing: '0.01em',
                }}
              >
                — {poem.poetName}
              </p>
              
              {/* Offline Indicator */}
              <div className="mt-4 flex justify-center">
                <OfflineIndicator poemSlug={slug} poemTitle={poem.title} />
              </div>
            </header>
            
            {/* YouTube Embed (if available) */}
            {poem.youtubeUrl && (
              <div className="mb-12">
                <YouTubeEmbed url={poem.youtubeUrl} title={poem.title} />
                <div className="mt-4 text-center">
                  <TextButton icon="▶" aria-label={`${poem.title} सुनें`}>
                    सुनिए
                  </TextButton>
                </div>
              </div>
            )}
            
            {/* Poem Text with Optimal Reading Experience */}
            <article 
              lang="hi"
              aria-label="कविता का पाठ"
              style={{ 
                maxWidth: 'min(65ch, 100%)',
                margin: '0 auto',
                overflowWrap: 'break-word',
              }}
            >
              <PoemText text={poem.text} />
            </article>
            
            {/* Metadata with Enhanced Typography */}
            <div className="mt-12 pt-8 border-t border-divider">
              <div 
                className="flex flex-wrap justify-center gap-4 font-ui text-text-muted"
                aria-label="कविता की जानकारी"
                style={{ fontSize: 'var(--font-size-sm)' }}
              >
                {/* Bhav Tags */}
                {bhavNames.map((bhav) => (
                  <span 
                    key={bhav} 
                    className="flex items-center gap-1"
                    style={{ fontSize: 'var(--font-size-sm)' }}
                  >
                    <span aria-hidden="true">भाव:</span>
                    <span className="text-text-secondary">{bhav}</span>
                  </span>
                ))}
                
                {/* First Performance */}
                {poem.firstPerformancePlace && (
                  <span 
                    className="flex items-center gap-1"
                    style={{ fontSize: 'var(--font-size-sm)' }}
                  >
                    प्रथम प्रस्तुति: 
                    <span className="text-text-secondary">
                      {poem.firstPerformancePlace}
                      {poem.firstPerformanceYear && `, ${poem.firstPerformanceYear}`}
                    </span>
                  </span>
                )}
                
                {/* Book Reference */}
                {poem.book && (
                  <span 
                    className="flex items-center gap-1"
                    style={{ fontSize: 'var(--font-size-sm)' }}
                  >
                    पुस्तक: <span className="text-text-secondary">{poem.book.title}</span>
                  </span>
                )}
              </div>
              
              {/* Like and Share Actions */}
              <div 
                className="mt-6 flex items-center justify-center gap-6"
                role="group"
                aria-label="कविता क्रियाएँ"
              >
                <LikeButton poemSlug={slug} />
                <TextButton icon="↗" aria-label="एक पंक्ति साझा करें">
                  एक पंक्ति साझा करें
                </TextButton>
              </div>
            </div>
            
            {/* Related Poems */}
            {relatedPoems.length > 0 && (
              <RelatedPoems 
                poems={relatedPoems} 
                currentBhav={bhavNames[0] || ''}
              />
            )}
            
            {/* Navigation */}
            <PoemNavigation
              prevPoem={prev}
              nextPoem={next}
            />
          </SectionSpacing>
        </PageContainer>
      </main>
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const poem = await getPoem(slug)
  
  if (!poem) {
    return { title: 'कविता नहीं मिली' }
  }
  
  const bhavName = poem.bhavs[0]?.bhav.name
  const ogImageUrl = `/api/og/poem?title=${encodeURIComponent(poem.title)}&poet=${encodeURIComponent(poem.poetName)}${bhavName ? `&bhav=${encodeURIComponent(bhavName)}` : ''}`
  
  return generatePoemMetadata({
    title: poem.title,
    slug: poem.slug,
    text: poem.text,
    poetName: poem.poetName,
    bhav: bhavName,
    imageUrl: ogImageUrl,
  })
}
