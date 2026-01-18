import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { defaultSections, getHomepageSections, type SectionKey } from '@/lib/homepage'

const sectionDescriptions: Record<SectionKey, { icon: string; description: string }> = {
  opening: {
    icon: '🎭',
    description: 'Hero section - poet name, tagline, opening couplet',
  },
  voice: {
    icon: '🎵',
    description: 'Featured video section - YouTube embed, quote',
  },
  stage: {
    icon: '🎪',
    description: 'Kavi Sammelan section - tagline, signature song, credentials',
  },
  poet: {
    icon: '✍️',
    description: 'Poet profile - bio, achievements, collaborations',
  },
  bhav: {
    icon: '💫',
    description: 'Poetry categories - Prem, Bhakti, Jeevan, Darshan',
  },
  words: {
    icon: '📜',
    description: 'Featured poems carousel',
  },
  connection: {
    icon: '🔗',
    description: 'Footer - social links, email, navigation',
  },
}

export default async function AdminHomepage() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  // Fetch actual sections from database, fall back to defaults
  const dbSections = await getHomepageSections()
  const dbSectionsMap = new Map(dbSections.map(s => [s.sectionKey, s]))
  
  // Merge DB sections with defaults for display
  const sections = Object.entries(defaultSections).map(([key, defaultSection]) => {
    const dbSection = dbSectionsMap.get(key)
    return {
      key: key as SectionKey,
      title: dbSection?.title || defaultSection.title,
      content: dbSection?.content || defaultSection.content,
      isActive: dbSection?.isActive ?? true,
    }
  })
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-3xl text-text-primary mb-2">
          होमपेज प्रबंधन
        </h1>
        <p className="font-ui text-text-secondary">
          होमपेज के प्रत्येक अनुभाग की सामग्री संपादित करें
        </p>
      </header>
      
      <div className="space-y-4">
        {sections.map((section) => {
          const meta = sectionDescriptions[section.key]
          
          return (
            <Link
              key={section.key}
              href={`/admin/homepage/${section.key}`}
              className={`block p-5 border border-divider rounded-sm hover:border-accent-gold/30 hover:bg-bg-elevated/50 transition-all group ${
                !section.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{meta.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-lg text-text-primary group-hover:text-accent-gold transition-colors">
                        {section.title}
                      </h2>
                      {!section.isActive && (
                        <span className="px-2 py-0.5 text-xs bg-text-muted/20 text-text-muted rounded">
                          निष्क्रिय
                        </span>
                      )}
                    </div>
                    <svg 
                      className="w-5 h-5 text-text-muted group-hover:text-accent-gold group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="font-ui text-sm text-text-muted mt-1">
                    {meta.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="mt-12 pt-8 border-t border-divider">
        <div className="flex items-center justify-between">
          <p className="font-ui text-sm text-text-muted">
            बदलाव सहेजने के बाद होमपेज पर स्वतः लागू होंगे
          </p>
          <Link
            href="/"
            target="_blank"
            className="font-ui text-sm text-accent-gold hover:text-accent-warm transition-colors"
          >
            होमपेज देखें →
          </Link>
        </div>
      </div>
    </div>
  )
}
