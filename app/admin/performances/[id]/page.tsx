import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PerformanceForm } from '@/components/admin/PerformanceForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPerformancePage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params

  const [performance, bhavs] = await Promise.all([
    db.performance.findUnique({
      where: { id },
      include: {
        bhavs: {
          include: {
            bhav: true,
          },
        },
      },
    }),
    db.bhav.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ])

  if (!performance) {
    notFound()
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/performances" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← प्रस्तुतियाँ
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          प्रस्तुति संपादित करें
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          {performance.title}
        </p>
      </header>
      
      <PerformanceForm performance={performance} bhavs={bhavs} />
    </div>
  )
}
