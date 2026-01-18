import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { TextButton } from '@/components/ui/TextButton'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Link from 'next/link'
import { Metadata } from 'next'

// Static data - will be replaced with DB queries
const staticBooks = [
  {
    id: '1',
    title: 'शब्दों का सफर',
    slug: 'shabdon-ka-safar',
    description: 'प्रेम, जीवन और दर्शन पर कविताओं का पहला संग्रह। इस पुस्तक में वो कविताएँ हैं जो मंच पर सबसे ज़्यादा सराही गईं।',
    intent: 'यह पुस्तक मेरी पहली प्रकाशित रचना है। इसमें वो सभी कविताएँ हैं जो पिछले कई वर्षों में मंच पर प्रस्तुत की गईं और श्रोताओं ने जिन्हें सराहा। हर कविता में एक कहानी है, एक अनुभव है।',
    year: 2022,
    coverImage: undefined as string | undefined,
    purchaseUrl: 'https://amazon.in',
    poems: [
      { title: 'कुछ शब्द सिर्फ़ कहे जाते', slug: 'kuch-shabd-sirf-kahe-jaate' },
      { title: 'दिल से निकली बात', slug: 'dil-se-nikli-baat' },
    ],
    performances: [
      { title: 'कुछ शब्द सिर्फ़ कहे जाते', slug: 'kuch-shabd-sirf-kahe-jaate' },
    ],
  },
  {
    id: '2',
    title: 'दिल की बातें',
    slug: 'dil-ki-batein',
    description: 'भक्ति और श्रद्धा की कविताओं का विशेष संग्रह। हर कविता में ईश्वर की खोज और आत्मा की आवाज़।',
    intent: 'भक्ति मेरे जीवन का अभिन्न अंग है। इस पुस्तक में वो कविताएँ हैं जो मंदिरों में, सत्संगों में प्रस्तुत की गईं। ईश्वर से बातें करने का मेरा तरीका।',
    year: 2023,
    coverImage: undefined as string | undefined,
    purchaseUrl: 'https://amazon.in',
    poems: [
      { title: 'भक्ति का सार', slug: 'bhakti-ka-saar' },
    ],
    performances: [
      { title: 'भक्ति रस की प्रस्तुति', slug: 'bhakti-ras-ki-prastuti' },
    ],
  },
]

function getBook(slug: string) {
  return staticBooks.find(b => b.slug === slug)
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PustakPage({ params }: PageProps) {
  const { slug } = await params
  const book = getBook(slug)
  
  if (!book) {
    notFound()
  }
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-sm overflow-hidden mx-auto md:mx-0">
                {book.coverImage ? (
                  <OptimizedImage
                    src={book.coverImage}
                    alt={book.title}
                    width={224}
                    height={288}
                    priority
                    objectFit="cover"
                    fallback="/images/placeholders/book-cover.svg"
                    className="w-full h-full"
                    sizes="(max-width: 640px) 192px, 224px"
                  />
                ) : (
                  <ImagePlaceholder 
                    type="book" 
                    label={book.title}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
            
            {/* Book Details */}
            <div className="flex-1">
              <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-2">
                {book.title}
              </h1>
              
              <p className="font-ui text-text-secondary mb-2">
                अमन अक्षर
              </p>
              
              {book.year && (
                <p className="font-ui text-text-muted text-sm mb-6">
                  प्रकाशन वर्ष: {book.year}
                </p>
              )}
              
              <p className="font-ui text-text-secondary leading-relaxed mb-6">
                {book.description}
              </p>
              
              {book.purchaseUrl && (
                <a 
                  href={book.purchaseUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <TextButton icon="↗" iconPosition="right">
                    पुस्तक खरीदें
                  </TextButton>
                </a>
              )}
            </div>
          </div>
          
          <Divider />
          
          {/* Book Intent */}
          {book.intent && (
            <>
              <section>
                <h2 className="font-heading text-2xl text-text-primary mb-4">
                  इस पुस्तक के बारे में
                </h2>
                <p className="font-poem text-text-secondary leading-relaxed text-lg">
                  {book.intent}
                </p>
              </section>
              
              <Divider />
            </>
          )}
          
          {/* Related Poems */}
          {book.poems && book.poems.length > 0 && (
            <>
              <section>
                <h2 className="font-heading text-2xl text-text-primary mb-4">
                  इस पुस्तक की कविताएँ
                </h2>
                <ul className="space-y-2">
                  {book.poems.map((poem) => (
                    <li key={poem.slug}>
                      <Link
                        href={`/kavita/${poem.slug}`}
                        className="font-poem text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                      >
                        <span className="text-text-muted">→</span>
                        {poem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
              
              <Divider />
            </>
          )}
          
          {/* Related Performances */}
          {book.performances && book.performances.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl text-text-primary mb-4">
                संबंधित प्रस्तुतियाँ
              </h2>
              <ul className="space-y-2">
                {book.performances.map((perf) => (
                  <li key={perf.slug}>
                    <Link
                      href={`/prastutiyaan`}
                      className="font-ui text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                    >
                      <span className="text-text-muted">▶</span>
                      {perf.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-divider">
            <Link href="/pustakein">
              <TextButton icon="←">
                सभी पुस्तकें देखें
              </TextButton>
            </Link>
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const book = getBook(slug)
  
  if (!book) {
    return { title: 'पुस्तक नहीं मिली' }
  }
  
  return {
    title: `${book.title} — अमन अक्षर`,
    description: book.description,
  }
}
