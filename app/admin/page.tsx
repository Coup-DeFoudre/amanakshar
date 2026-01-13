import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'

const adminSections = [
  {
    title: 'कविताएँ',
    description: 'कविताएँ जोड़ें, संपादित करें, या हटाएँ',
    href: '/admin/poems',
    icon: '📝',
  },
  {
    title: 'प्रस्तुतियाँ',
    description: 'YouTube प्रस्तुतियाँ प्रबंधित करें',
    href: '/admin/performances',
    icon: '🎬',
  },
  {
    title: 'पुस्तकें',
    description: 'पुस्तकें और कवर इमेज प्रबंधित करें',
    href: '/admin/books',
    icon: '📚',
  },
]

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          <header className="mb-12">
            <h1 className="font-heading text-3xl text-text-primary mb-2">
              प्रबंधक पैनल
            </h1>
            <p className="font-ui text-text-secondary">
              स्वागत है, {session.user?.name || 'Admin'}
            </p>
          </header>
          
          <div className="grid gap-6">
            {adminSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="block p-6 border border-divider rounded-sm hover:border-divider-strong hover:bg-bg-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h2 className="font-heading text-xl text-text-primary mb-1">
                      {section.title}
                    </h2>
                    <p className="font-ui text-text-secondary text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-divider">
            <form action={async () => {
              'use server'
              const { signOut } = await import('@/lib/auth')
              await signOut({ redirectTo: '/admin/login' })
            }}>
              <button
                type="submit"
                className="font-ui text-text-muted hover:text-text-primary transition-colors"
              >
                लॉग आउट
              </button>
            </form>
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

