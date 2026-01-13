import Link from 'next/link'
import { PageContainer } from '@/components/ui/PageContainer'
import { TextButton } from '@/components/ui/TextButton'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="text-center py-20">
          <h1 className="font-heading text-6xl sm:text-8xl text-text-muted mb-4">
            ४०४
          </h1>
          <h2 className="font-heading text-2xl sm:text-3xl text-text-primary mb-4">
            पृष्ठ नहीं मिला
          </h2>
          <p className="font-ui text-text-secondary mb-8">
            जो आप खोज रहे हैं, वो यहाँ नहीं है।
          </p>
          <Link href="/">
            <TextButton icon="←">
              घर वापस जाएं
            </TextButton>
          </Link>
        </div>
      </PageContainer>
    </main>
  )
}

