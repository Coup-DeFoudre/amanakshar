import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { TextButton } from '@/components/ui/TextButton'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import Link from 'next/link'

// Static data - will be replaced with DB queries
const staticBooks = [
  {
    id: '1',
    title: 'शब्दों का सफर',
    slug: 'shabdon-ka-safar',
    description: 'प्रेम, जीवन और दर्शन पर कविताओं का पहला संग्रह। इस पुस्तक में वो कविताएँ हैं जो मंच पर सबसे ज़्यादा सराही गईं।',
    year: 2022,
    coverImage: undefined as string | undefined, // Will be replaced with actual image
    purchaseUrl: 'https://amazon.in',
  },
  {
    id: '2',
    title: 'दिल की बातें',
    slug: 'dil-ki-batein',
    description: 'भक्ति और श्रद्धा की कविताओं का विशेष संग्रह। हर कविता में ईश्वर की खोज और आत्मा की आवाज़।',
    year: 2023,
    coverImage: undefined as string | undefined,
    purchaseUrl: 'https://amazon.in',
  },
]

export default function PustakeinPage() {
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title */}
          <header className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
              पुस्तकें
            </h1>
            <p className="font-ui text-text-secondary">
              कविताओं के प्रकाशित संग्रह
            </p>
          </header>
          
          {/* Books List */}
          <div className="space-y-12">
            {staticBooks.map((book, index) => (
              <article key={book.id}>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Book Cover */}
                  <div className="w-32 h-44 sm:w-40 sm:h-56 flex-shrink-0 rounded-sm overflow-hidden">
                    {book.coverImage ? (
                      <OptimizedImage
                        src={book.coverImage}
                        alt={book.title}
                        width={160}
                        height={224}
                        objectFit="cover"
                        fallback="/images/placeholders/book-cover.svg"
                        className="w-full h-full"
                        sizes="(max-width: 640px) 128px, 160px"
                      />
                    ) : (
                      <ImagePlaceholder 
                        type="book" 
                        label={book.title}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  
                  {/* Book Details */}
                  <div className="flex-1">
                    <Link href={`/pustak/${book.slug}`}>
                      <h2 className="font-heading text-2xl sm:text-3xl text-text-primary hover:text-accent-gold transition-colors mb-2">
                        {book.title}
                      </h2>
                    </Link>
                    
                    {book.year && (
                      <p className="font-ui text-text-muted text-sm mb-3">
                        प्रकाशन वर्ष: {book.year}
                      </p>
                    )}
                    
                    <p className="font-ui text-text-secondary leading-relaxed mb-4">
                      {book.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <Link href={`/pustak/${book.slug}`}>
                        <TextButton icon="→" iconPosition="right">
                          विस्तार से देखें
                        </TextButton>
                      </Link>
                      
                      {book.purchaseUrl && (
                        <a 
                          href={book.purchaseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <TextButton icon="↗" iconPosition="right">
                            खरीदें
                          </TextButton>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < staticBooks.length - 1 && <Divider />}
              </article>
            ))}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

export const metadata = {
  title: 'पुस्तकें — अमन अक्षर',
  description: 'अमन अक्षर की प्रकाशित पुस्तकें और कविता संग्रह।',
}
