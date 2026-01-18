'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'

// Collection of poetic error messages
const poeticErrors = [
  {
    title: 'राह भटक गई',
    verse: 'कभी-कभी रास्ते खो जाते हैं,\nपर मंज़िल फिर भी मिल जाती है।',
    couplet: 'गिरना भी ज़रूरी है कभी चलने के लिए,\nठोकर ही सिखाती है संभलने के लिए।',
  },
  {
    title: 'क्षण भर रुकिए',
    verse: 'यात्रा में विराम है यह,\nनई शुरुआत का संकेत।',
    couplet: 'हर रुकावट एक सबक देती है,\nहर गिरावट उठना सिखाती है।',
  },
  {
    title: 'तकनीक ने ली विश्राम',
    verse: 'यंत्र भी थक जाते हैं कभी,\nपर शब्द कभी नहीं मरते।',
    couplet: 'जहाँ मशीनें रुक जाती हैं,\nवहाँ कविताएँ बोलती हैं।',
  },
  {
    title: 'पन्ना खो गया',
    verse: 'किताब के बीच का एक पृष्ठ,\nअभी खोजा जा रहा है।',
    couplet: 'खोई हुई चीज़ें मिल जाती हैं,\nबस धैर्य रखना होता है।',
  },
]

// Recovery suggestions
const recoverySuggestions = [
  { icon: '↻', label: 'फिर से कोशिश करें', action: 'retry' },
  { icon: '🏠', label: 'घर जाएँ', action: 'home' },
  { icon: '📚', label: 'कविताएँ पढ़ें', action: 'poems' },
  { icon: '📞', label: 'संपर्क करें', action: 'contact' },
]

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [selectedError] = useState(() => 
    poeticErrors[Math.floor(Math.random() * poeticErrors.length)]
  )
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Log error for debugging
    console.error('Application Error:', error)
  }, [error])

  const handleAction = async (action: string) => {
    switch (action) {
      case 'retry':
        setIsRetrying(true)
        setRetryCount(prev => prev + 1)
        
        // Add a small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 500))
        reset()
        setIsRetrying(false)
        break
      case 'home':
        window.location.href = '/'
        break
      case 'poems':
        window.location.href = '/kavitayen'
        break
      case 'contact':
        window.location.href = '/sampark'
        break
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-accent-warm/10 via-transparent to-transparent opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-radial from-accent-rose/5 via-transparent to-transparent opacity-40" />
      </div>

      <PageContainer>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12 sm:py-20 relative z-10"
        >
          {/* Error code with decorative styling */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="relative inline-block mb-8"
          >
            <span className="font-heading text-7xl sm:text-9xl text-text-muted/20">
              ५००
            </span>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-heading text-4xl sm:text-5xl text-accent-warm">
                ⚡
              </span>
            </motion.div>
          </motion.div>

          {/* Poetic title */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary mb-6"
          >
            {selectedError.title}
          </motion.h1>

          {/* Decorative divider */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent mx-auto mb-8"
          />

          {/* Poetic verse */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-poem text-lg sm:text-xl text-text-secondary whitespace-pre-line leading-relaxed mb-8 max-w-md mx-auto"
          >
            {selectedError.verse}
          </motion.p>

          {/* Couplet in a decorative box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-lg mx-auto mb-12"
          >
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-accent-gold/30" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-accent-gold/30" />
            <div className="bg-bg-elevated/50 border border-divider rounded-lg p-6 backdrop-blur-sm">
              <p className="font-poem text-base sm:text-lg text-accent-gold/90 whitespace-pre-line leading-relaxed italic">
                "{selectedError.couplet}"
              </p>
            </div>
          </motion.div>

          {/* Recovery options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {recoverySuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.action}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                onClick={() => handleAction(suggestion.action)}
                disabled={isRetrying && suggestion.action === 'retry'}
                className={`
                  inline-flex items-center gap-2 px-4 sm:px-6 py-3 font-ui text-sm
                  border rounded-lg transition-all duration-300
                  ${suggestion.action === 'retry'
                    ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold hover:bg-accent-gold/20 hover:border-accent-gold/50'
                    : 'bg-bg-elevated border-divider text-text-secondary hover:text-text-primary hover:border-divider-strong'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                  touch-manipulation active:scale-95
                `}
              >
                <AnimatePresence mode="wait">
                  {isRetrying && suggestion.action === 'retry' ? (
                    <motion.svg
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </motion.svg>
                  ) : (
                    <motion.span
                      key="icon"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-base"
                    >
                      {suggestion.icon}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span>{suggestion.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Retry count indicator */}
          <AnimatePresence>
            {retryCount > 0 && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="font-ui text-xs text-text-muted mt-6"
              >
                {retryCount} बार कोशिश की गई
                {retryCount >= 3 && ' — कृपया कुछ देर बाद प्रयास करें'}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Technical error info (collapsed by default) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-left max-w-2xl mx-auto"
            >
              <summary className="font-ui text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors">
                तकनीकी विवरण देखें
              </summary>
              <div className="mt-4 p-4 bg-bg-elevated border border-divider rounded-lg overflow-auto">
                <pre className="font-mono text-xs text-text-muted whitespace-pre-wrap break-words">
                  {error.message}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </div>
            </motion.details>
          )}
        </motion.div>
      </PageContainer>
    </main>
  )
}
