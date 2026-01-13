'use client'

import { PageContainer } from '@/components/ui/PageContainer'
import { TextButton } from '@/components/ui/TextButton'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <PageContainer>
        <div className="text-center py-20">
          <h1 className="font-heading text-6xl sm:text-8xl text-text-muted mb-4">
            ५००
          </h1>
          <h2 className="font-heading text-2xl sm:text-3xl text-text-primary mb-4">
            कुछ गलत हो गया
          </h2>
          <p className="font-ui text-text-secondary mb-8">
            क्षमा करें, कुछ तकनीकी समस्या आ गई है।
          </p>
          <TextButton onClick={reset} icon="↻">
            फिर से कोशिश करें
          </TextButton>
        </div>
      </PageContainer>
    </main>
  )
}

