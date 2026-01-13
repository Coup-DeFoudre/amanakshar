import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { TextButton } from '@/components/ui/TextButton'

// Static data
const staticBooks = [
  { id: '1', title: 'शब्दों का सफर', year: 2022, isPublished: true, isFeatured: false },
  { id: '2', title: 'दिल की बातें', year: 2023, isPublished: true, isFeatured: true },
]

export default async function AdminBooksPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          <header className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
                ← पीछे
              </Link>
              <h1 className="font-heading text-3xl text-text-primary mt-2">
                पुस्तकें
              </h1>
            </div>
            <TextButton icon="+">
              नई पुस्तक
            </TextButton>
          </header>
          
          <div className="space-y-4">
            {staticBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Cover placeholder */}
                  <div className="w-12 h-16 bg-bg-secondary rounded-sm flex items-center justify-center">
                    <span className="text-text-muted text-xs">📕</span>
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-lg text-text-primary">
                      {book.title}
                    </h3>
                    <div className="flex gap-3 mt-1">
                      <span className="font-ui text-xs text-text-muted">
                        {book.year}
                      </span>
                      <span className={`font-ui text-xs ${book.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                        {book.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                      </span>
                      {book.isFeatured && (
                        <span className="font-ui text-xs text-accent-gold">
                          विशेष
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors">
                    संपादित
                  </button>
                  <button className="font-ui text-sm text-red-400 hover:text-red-300 transition-colors">
                    हटाएँ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

