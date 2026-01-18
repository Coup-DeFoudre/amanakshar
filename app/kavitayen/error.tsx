'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { TextButton } from '@/components/ui/TextButton'

export default function KavitayenError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Poems section error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          {/* Decorative icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-bg-elevated border border-divider flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-accent-indigo"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl text-text-primary mb-4"
          >
            शब्द खो गए
          </motion.h1>

          {/* Poetic verse */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-poem text-lg text-text-secondary whitespace-pre-line mb-2 leading-relaxed max-w-md mx-auto"
          >
            कविता की पंक्तियाँ बिखर गईं,{'\n'}
            पर भाव अभी भी हृदय में हैं।
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-ui text-sm text-text-muted mb-8"
          >
            कविताएँ लोड करने में समस्या हुई
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <TextButton onClick={reset} icon="↻">
              फिर से कोशिश करें
            </TextButton>
            <TextButton href="/" icon="🏠">
              घर जाएँ
            </TextButton>
          </motion.div>
        </motion.div>
      </PageContainer>
    </main>
  )
}
