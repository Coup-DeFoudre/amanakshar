import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { defaultSections, getHomepageSection, type SectionKey } from '@/lib/homepage'
import { HomepageSectionForm } from './HomepageSectionForm'

const sectionLabels: Record<SectionKey, string> = {
  opening: 'Opening Section',
  voice: 'Voice Section',
  stage: 'Stage Section',
  poet: 'Poet Section',
  bhav: 'Bhav Section',
  words: 'Words Section',
  connection: 'Connection Section',
}

interface PageProps {
  params: Promise<{ key: string }>
}

export default async function EditHomepageSectionPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  const { key } = await params
  
  // Check if valid section key
  if (!Object.keys(defaultSections).includes(key)) {
    notFound()
  }
  
  const sectionKey = key as SectionKey
  const section = await getHomepageSection(sectionKey)
  
  // Prepare serializable data for client component
  const sectionData = {
    sectionKey: section.sectionKey,
    title: section.title || '',
    content: section.content as Record<string, unknown>,
    isActive: section.isActive,
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link 
          href="/admin/homepage"
          className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors"
        >
          ← होमपेज प्रबंधन
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2 mb-2">
          {sectionLabels[sectionKey]} संपादित करें
        </h1>
        <p className="font-ui text-text-secondary">
          इस अनुभाग की सामग्री यहाँ संपादित करें
        </p>
      </header>
      
      <HomepageSectionForm 
        sectionKey={sectionKey}
        initialData={sectionData}
      />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { key } = await params
  const sectionKey = key as SectionKey
  const label = sectionLabels[sectionKey] || 'Section'
  
  return {
    title: `${label} संपादित करें — Admin`,
  }
}
