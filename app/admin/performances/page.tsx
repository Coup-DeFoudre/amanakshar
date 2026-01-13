import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { TextButton } from '@/components/ui/TextButton'

// Static data
const staticPerformances = [
  { id: '1', title: 'कुछ शब्द सिर्फ़ कहे जाते', type: 'कवि-सम्मेलन', isPublished: true },
  { id: '2', title: 'भक्ति रस की प्रस्तुति', type: 'भक्ति', isPublished: true },
  { id: '3', title: 'जीवन के रंग', type: 'विशेष प्रस्तुति', isPublished: true },
]

export default async function AdminPerformancesPage() {
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
                प्रस्तुतियाँ
              </h1>
            </div>
            <TextButton icon="+">
              नई प्रस्तुति
            </TextButton>
          </header>
          
          <div className="space-y-4">
            {staticPerformances.map((perf) => (
              <div
                key={perf.id}
                className="flex items-center justify-between p-4 border border-divider rounded-sm hover:border-divider-strong transition-colors"
              >
                <div>
                  <h3 className="font-heading text-lg text-text-primary">
                    {perf.title}
                  </h3>
                  <div className="flex gap-3 mt-1">
                    <span className="font-ui text-xs text-text-muted">
                      {perf.type}
                    </span>
                    <span className={`font-ui text-xs ${perf.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
                      {perf.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                    </span>
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

