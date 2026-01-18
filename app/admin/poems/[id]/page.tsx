import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { PoemForm } from '@/components/admin/PoemForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPoemPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params

  // Fetch the poem
  const poem = await db.poem.findUnique({
    where: { id },
    include: {
      bhavs: {
        include: {
          bhav: true,
        },
      },
    },
  })

  if (!poem) {
    notFound()
  }

  // Fetch available bhavs for the form
  const bhavs = await db.bhav.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })

  // Transform poem to match form expectations
  const poemForForm = {
    ...poem,
    writtenDate: poem.writtenDate?.toISOString() || null,
  }
  
  return (
    <div>
      <header className="mb-8">
        <Link href="/admin/poems" className="font-ui text-text-muted text-sm hover:text-text-secondary transition-colors">
          ← कविताएँ
        </Link>
        <h1 className="font-heading text-3xl text-text-primary mt-2">
          कविता संपादित करें
        </h1>
        <p className="font-ui text-text-secondary mt-1">
          {poem.title}
        </p>
      </header>
      
      <PoemForm poem={poemForForm} bhavs={bhavs} />
    </div>
  )
}
