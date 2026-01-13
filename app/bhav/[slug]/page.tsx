import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { PoemCard } from '@/components/poems'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Metadata } from 'next'
import Link from 'next/link'

// Static data - will be replaced with DB queries
const bhavData: Record<string, {
  name: string
  slug: string
  description: string
  highlightedLine: string
  poems: Array<{ id: string; title: string; slug: string; excerpt: string }>
  performances: Array<{ id: string; title: string; youtubeUrl: string; context: string }>
}> = {
  prem: {
    name: 'प्रेम',
    slug: 'prem',
    description: 'प्रेम की कविताएँ — जहाँ दिल की बात शब्दों में ढलती है। यहाँ वो सभी कविताएँ हैं जो प्रेम के विभिन्न रंगों को दर्शाती हैं।',
    highlightedLine: 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं',
    poems: [
      { id: '1', title: 'कुछ शब्द सिर्फ़ कहे जाते', slug: 'kuch-shabd-sirf-kahe-jaate', excerpt: 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं।' },
      { id: '2', title: 'दिल से निकली बात', slug: 'dil-se-nikli-baat', excerpt: 'रात थी मन्नतों की, जब दिल से आवाज़ दी।' },
    ],
    performances: [
      { id: '1', title: 'कुछ शब्द सिर्फ़ कहे जाते', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', context: 'इंदौर कवि सम्मेलन' },
    ],
  },
  bhakti: {
    name: 'भक्ति',
    slug: 'bhakti',
    description: 'भक्ति की कविताएँ — ईश्वर से बातें, मन की शांति, आत्मा की खोज। यहाँ वो कविताएँ हैं जो श्रद्धा और समर्पण को व्यक्त करती हैं।',
    highlightedLine: 'जब मन में बसे प्रभु का नाम, तो कैसी चिंता, कैसा काम',
    poems: [
      { id: '3', title: 'भक्ति का सार', slug: 'bhakti-ka-saar', excerpt: 'जब मन में बसे प्रभु का नाम, तो कैसी चिंता, कैसा काम।' },
    ],
    performances: [
      { id: '2', title: 'भक्ति रस की प्रस्तुति', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', context: 'उज्जैन महाकाल मंदिर' },
    ],
  },
  jeevan: {
    name: 'जीवन',
    slug: 'jeevan',
    description: 'जीवन की कविताएँ — अनुभवों का सार, राह की कठिनाइयाँ, और आगे बढ़ने की प्रेरणा।',
    highlightedLine: 'कठिन है राह, पर चलना है। गिरना है, संभलना है।',
    poems: [
      { id: '4', title: 'जीवन की राह', slug: 'jeevan-ki-raah', excerpt: 'कठिन है राह, पर चलना है। गिरना है, संभलना है।' },
    ],
    performances: [
      { id: '3', title: 'जीवन के रंग', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', context: 'भोपाल साहित्य उत्सव' },
    ],
  },
  darshan: {
    name: 'दर्शन',
    slug: 'darshan',
    description: 'दार्शनिक कविताएँ — जीवन के गहरे सवाल, अस्तित्व का अर्थ, और चिंतन की गहराइयाँ।',
    highlightedLine: 'यही जीवन का सार है, हर पल नया विचार है',
    poems: [
      { id: '4', title: 'जीवन की राह', slug: 'jeevan-ki-raah', excerpt: 'यही जीवन का सार है, हर पल नया विचार है।' },
    ],
    performances: [],
  },
}

function getBhav(slug: string) {
  return bhavData[slug]
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BhavPage({ params }: PageProps) {
  const { slug } = await params
  const bhav = getBhav(slug)
  
  if (!bhav) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl text-text-primary mb-4">
              {bhav.name}
            </h1>
            <p className="font-ui text-text-secondary max-w-xl mx-auto">
              {bhav.description}
            </p>
          </header>
          
          {/* Highlighted Line */}
          <div className="text-center py-8 mb-8 border-t border-b border-divider">
            <p className="font-poem text-xl sm:text-2xl text-accent-gold italic">
              "{bhav.highlightedLine}"
            </p>
          </div>
          
          {/* Poems Section */}
          {bhav.poems.length > 0 && (
            <>
              <section>
                <h2 className="font-heading text-2xl text-text-primary mb-6">
                  {bhav.name} की कविताएँ
                </h2>
                
                <div className="space-y-6">
                  {bhav.poems.map((poem, index) => (
                    <div key={poem.id}>
                      <PoemCard
                        title={poem.title}
                        slug={poem.slug}
                        excerpt={poem.excerpt}
                        bhavs={[bhav.name]}
                        index={index}
                      />
                      {index < bhav.poems.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              </section>
              
              <Divider />
            </>
          )}
          
          {/* Performances Section */}
          {bhav.performances.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl text-text-primary mb-6">
                {bhav.name} की प्रस्तुतियाँ
              </h2>
              
              <div className="space-y-8">
                {bhav.performances.map((perf) => (
                  <div key={perf.id}>
                    <h3 className="font-heading text-xl text-text-secondary mb-2">
                      {perf.title}
                    </h3>
                    <p className="font-ui text-text-muted text-sm mb-4">
                      {perf.context}
                    </p>
                    <YouTubeEmbed url={perf.youtubeUrl} title={perf.title} />
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Other Bhavs */}
          <div className="mt-16 pt-8 border-t border-divider text-center">
            <p className="font-ui text-text-muted mb-4">अन्य भाव देखें</p>
            <nav className="font-ui text-lg">
              {Object.values(bhavData)
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
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const bhav = getBhav(slug)
  
  if (!bhav) {
    return { title: 'भाव नहीं मिला' }
  }
  
  return {
    title: `${bhav.name} — अमन अक्षर`,
    description: bhav.description,
  }
}

export function generateStaticParams() {
  return Object.keys(bhavData).map(slug => ({ slug }))
}

