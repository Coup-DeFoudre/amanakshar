import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { PoemText } from '@/components/ui/PoemText'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { TextButton } from '@/components/ui/TextButton'
import { PoemNavigation, RelatedPoems } from '@/components/poems'
import { Metadata } from 'next'

// Static data - will be replaced with DB queries
const staticPoems = [
  {
    id: '1',
    title: 'कुछ शब्द सिर्फ़ कहे जाते',
    slug: 'kuch-shabd-sirf-kahe-jaate',
    poetName: 'अमन अक्षर',
    text: `कुछ शब्द सिर्फ़ कहे जाते
जिए जाते हैं

दिल की गहराइयों में उतरते
सांसों में बसते हैं

कुछ शब्द सिर्फ़ सुने जाते
महसूस किए जाते हैं

वो शब्द जो आंखों से निकलते हैं
होंठों तक नहीं आते`,
    bhavs: ['प्रेम'],
    youtubeUrl: undefined,
    firstPerformancePlace: 'इंदौर',
    firstPerformanceYear: 2023,
    bookTitle: undefined,
  },
  {
    id: '2',
    title: 'दिल से निकली बात',
    slug: 'dil-se-nikli-baat',
    poetName: 'अमन अक्षर',
    text: `रात थी मन्नतों की
जब दिल से आवाज़ दी

झुठ वाले क्या जानें वो
जो सिर्फ़ दुआएँ जिए थे

दिल से निकली बात
शब्दों में ढली जाती है

और कविता बन जाती है`,
    bhavs: ['प्रेम', 'जीवन'],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    firstPerformancePlace: 'भोपाल',
    firstPerformanceYear: 2023,
    bookTitle: undefined,
  },
  {
    id: '3',
    title: 'भक्ति का सार',
    slug: 'bhakti-ka-saar',
    poetName: 'अमन अक्षर',
    text: `जब मन में बसे प्रभु का नाम
तो कैसी चिंता, कैसा काम

हर श्वास में उनका ध्यान
यही है सच्ची पहचान

भक्ति का सार यही है
प्रेम में खो जाना

जब तुम नहीं रहते
तब वो मिल जाते हैं`,
    bhavs: ['भक्ति'],
    youtubeUrl: undefined,
    firstPerformancePlace: 'उज्जैन',
    firstPerformanceYear: 2022,
    bookTitle: undefined,
  },
  {
    id: '4',
    title: 'जीवन की राह',
    slug: 'jeevan-ki-raah',
    poetName: 'अमन अक्षर',
    text: `कठिन है राह, पर चलना है
गिरना है, संभलना है

यही जीवन का सार है
हर पल नया विचार है

मंज़िल की चिंता मत करो
बस राह पर चलते रहो

जो चलता है वो पहुँचता है
जो रुकता है वो बिछड़ जाता है`,
    bhavs: ['जीवन', 'दर्शन'],
    youtubeUrl: undefined,
    firstPerformancePlace: 'इंदौर',
    firstPerformanceYear: 2022,
    bookTitle: undefined,
  },
]

function getPoem(slug: string) {
  return staticPoems.find(p => p.slug === slug)
}

function getAdjacentPoems(currentSlug: string) {
  const currentIndex = staticPoems.findIndex(p => p.slug === currentSlug)
  return {
    prev: currentIndex > 0 ? staticPoems[currentIndex - 1] : undefined,
    next: currentIndex < staticPoems.length - 1 ? staticPoems[currentIndex + 1] : undefined,
  }
}

function getRelatedPoems(currentSlug: string, bhavs: string[]) {
  return staticPoems
    .filter(p => p.slug !== currentSlug && p.bhavs.some(b => bhavs.includes(b)))
    .slice(0, 3)
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function KavitaPage({ params }: PageProps) {
  const { slug } = await params
  const poem = getPoem(slug)
  
  if (!poem) {
    notFound()
  }
  
  const { prev, next } = getAdjacentPoems(slug)
  const relatedPoems = getRelatedPoems(slug, poem.bhavs)
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Poem Header */}
          <header className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
              {poem.title}
            </h1>
            <p className="font-ui text-text-secondary">
              — {poem.poetName}
            </p>
          </header>
          
          {/* YouTube Embed (if available) */}
          {poem.youtubeUrl && (
            <div className="mb-12">
              <YouTubeEmbed url={poem.youtubeUrl} title={poem.title} />
              <div className="mt-4 text-center">
                <TextButton icon="▶">
                  सुनिए
                </TextButton>
              </div>
            </div>
          )}
          
          {/* Poem Text */}
          <article className="max-w-xl mx-auto">
            <PoemText text={poem.text} />
          </article>
          
          {/* Metadata */}
          <div className="mt-12 pt-8 border-t border-divider">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-ui text-text-muted">
              {/* Bhav Tags */}
              {poem.bhavs.map((bhav) => (
                <span key={bhav} className="flex items-center gap-1">
                  भाव: <span className="text-text-secondary">{bhav}</span>
                </span>
              ))}
              
              {/* First Performance */}
              {poem.firstPerformancePlace && (
                <span className="flex items-center gap-1">
                  प्रथम प्रस्तुति: 
                  <span className="text-text-secondary">
                    {poem.firstPerformancePlace}
                    {poem.firstPerformanceYear && `, ${poem.firstPerformanceYear}`}
                  </span>
                </span>
              )}
              
              {/* Book Reference */}
              {poem.bookTitle && (
                <span className="flex items-center gap-1">
                  पुस्तक: <span className="text-text-secondary">{poem.bookTitle}</span>
                </span>
              )}
            </div>
            
            {/* Share Action */}
            <div className="mt-6 text-center">
              <TextButton icon="↗">
                एक पंक्ति साझा करें
              </TextButton>
            </div>
          </div>
          
          {/* Related Poems */}
          <RelatedPoems 
            poems={relatedPoems.map(p => ({ title: p.title, slug: p.slug }))} 
            currentBhav={poem.bhavs[0]}
          />
          
          {/* Navigation */}
          <PoemNavigation
            prevPoem={prev ? { title: prev.title, slug: prev.slug } : undefined}
            nextPoem={next ? { title: next.title, slug: next.slug } : undefined}
          />
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const poem = getPoem(slug)
  
  if (!poem) {
    return { title: 'कविता नहीं मिली' }
  }
  
  return {
    title: `${poem.title} — अमन अक्षर`,
    description: poem.text.substring(0, 160).replace(/\n/g, ' '),
  }
}

