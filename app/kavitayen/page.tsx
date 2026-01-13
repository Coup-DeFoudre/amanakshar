import { Suspense } from 'react'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { PoemCard, PoemFilters } from '@/components/poems'

// Static data - will be replaced with DB queries
const staticPoems = [
  {
    id: '1',
    title: 'कुछ शब्द सिर्फ़ कहे जाते',
    slug: 'kuch-shabd-sirf-kahe-jaate',
    excerpt: 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं। दिल की गहराइयों में उतरते, सांसों में बसते हैं।',
    bhavs: ['प्रेम'],
    year: 2023,
  },
  {
    id: '2',
    title: 'दिल से निकली बात',
    slug: 'dil-se-nikli-baat',
    excerpt: 'रात थी मन्नतों की, जब दिल से आवाज़ दी, झुठ वाले क्या जानें वो, जो सिर्फ़ दुआएँ जिए थे।',
    bhavs: ['प्रेम', 'जीवन'],
    year: 2023,
  },
  {
    id: '3',
    title: 'भक्ति का सार',
    slug: 'bhakti-ka-saar',
    excerpt: 'जब मन में बसे प्रभु का नाम, तो कैसी चिंता, कैसा काम। हर श्वास में उनका ध्यान, यही है सच्ची पहचान।',
    bhavs: ['भक्ति'],
    year: 2022,
  },
  {
    id: '4',
    title: 'जीवन की राह',
    slug: 'jeevan-ki-raah',
    excerpt: 'कठिन है राह, पर चलना है। गिरना है, संभलना है। यही जीवन का सार है, हर पल नया विचार है।',
    bhavs: ['जीवन', 'दर्शन'],
    year: 2022,
  },
]

const staticBhavs = [
  { name: 'प्रेम', slug: 'prem' },
  { name: 'भक्ति', slug: 'bhakti' },
  { name: 'जीवन', slug: 'jeevan' },
  { name: 'दर्शन', slug: 'darshan' },
]

const staticYears = [2023, 2022]

interface PageProps {
  searchParams: Promise<{ bhav?: string; year?: string }>
}

export default async function KavitayenPage({ searchParams }: PageProps) {
  const params = await searchParams
  const selectedBhav = params.bhav
  const selectedYear = params.year
  
  // Filter poems based on selected filters
  let filteredPoems = staticPoems
  
  if (selectedBhav) {
    const bhavName = staticBhavs.find(b => b.slug === selectedBhav)?.name
    if (bhavName) {
      filteredPoems = filteredPoems.filter(p => p.bhavs.includes(bhavName))
    }
  }
  
  if (selectedYear) {
    filteredPoems = filteredPoems.filter(p => p.year === parseInt(selectedYear))
  }
  
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
              bhavs={staticBhavs}
              selectedBhav={selectedBhav}
              selectedYear={selectedYear}
              years={staticYears}
            />
          </Suspense>
          
          <Divider />
          
          {/* Poems List */}
          <div className="space-y-8">
            {filteredPoems.length === 0 ? (
              <p className="text-center text-text-muted font-ui py-12">
                इस श्रेणी में कोई कविता नहीं मिली
              </p>
            ) : (
              filteredPoems.map((poem, index) => (
                <div key={poem.id}>
                  <PoemCard
                    title={poem.title}
                    slug={poem.slug}
                    excerpt={poem.excerpt}
                    bhavs={poem.bhavs}
                    index={index}
                  />
                  {index < filteredPoems.length - 1 && <Divider />}
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

