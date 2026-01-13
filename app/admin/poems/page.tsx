import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { TextButton } from '@/components/ui/TextButton'
import { Divider } from '@/components/ui/Divider'

// Static data - will be replaced with DB queries
const staticPoems = [
  { id: '1', title: 'कुछ शब्द सिर्फ़ कहे जाते', slug: 'kuch-shabd-sirf-kahe-jaate', isPublished: true, isFeatured: true },
  { id: '2', title: 'दिल से निकली बात', slug: 'dil-se-nikli-baat', isPublished: true, isFeatured: false },
  { id: '3', title: 'भक्ति का सार', slug: 'bhakti-ka-saar', isPublished: true, isFeatured: false },
  { id: '4', title: 'जीवन की राह', slug: 'jeevan-ki-raah', isPublished: false, isFeatured: false },
]

export default async function AdminPoemsPage() {
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
                कविताएँ
              </h1>
            </div>
            <TextButton icon="+">
              नई कविता
            </TextButton>
          </header>
          
          <div className="space-y-4">
            {staticPoems.map((poem) => (
              <div
                key={poem.id}
                className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors"
              >
                <div>
                  <h3 className="font-heading text-lg text-text-primary">
                    {poem.title}
                  </h3>
                  <div className="flex gap-3 mt-1">
                    <span className={`font-ui text-xs ${poem.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                      {poem.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                    </span>
                    {poem.isFeatured && (
                      <span className="font-ui text-xs text-accent-gold">
                        विशेष
                      </span>
                    )}
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
          
          {staticPoems.length === 0 && (
            <p className="text-center text-text-muted font-ui py-12">
              कोई कविता नहीं मिली
            </p>
          )}
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

