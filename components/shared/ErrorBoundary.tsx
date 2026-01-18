'use client'

import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  section?: 'poems' | 'performances' | 'events' | 'books' | 'general'
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// Poetic error messages in Hindi for different sections
const poeticMessages: Record<string, { title: string; verse: string; subtitle: string }> = {
  poems: {
    title: 'शब्द खो गए',
    verse: 'कविता की पंक्तियाँ बिखर गईं,\nपर भाव अभी भी हृदय में हैं।',
    subtitle: 'कविताएँ लोड करने में समस्या हुई',
  },
  performances: {
    title: 'मंच सूना है',
    verse: 'आवाज़ थमी है पल भर को,\nपर गूँज हमेशा रहेगी।',
    subtitle: 'प्रस्तुतियाँ लोड करने में समस्या हुई',
  },
  events: {
    title: 'आयोजन रुका',
    verse: 'समय ने ली एक साँस,\nपर कार्यक्रम जारी रहेगा।',
    subtitle: 'आयोजन लोड करने में समस्या हुई',
  },
  books: {
    title: 'पुस्तकें अदृश्य',
    verse: 'पृष्ठ उलटने रुके हैं,\nपर कहानियाँ जीवित हैं।',
    subtitle: 'पुस्तकें लोड करने में समस्या हुई',
  },
  general: {
    title: 'कुछ अटक गया',
    verse: 'राह में एक पत्थर आया,\nपर मंज़िल अभी दूर नहीं।',
    subtitle: 'कुछ तकनीकी समस्या हुई',
  },
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in child component tree
 * Features:
 * - Section-specific poetic error messages
 * - Elegant fallback UI
 * - Recovery option with reset
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you could send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorReporting(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default poetic error UI
      const section = this.props.section || 'general'
      const message = poeticMessages[section]

      return <ErrorFallback message={message} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

// Extracted fallback component for animation support
interface ErrorFallbackProps {
  message: { title: string; verse: string; subtitle: string }
  onReset: () => void
}

function ErrorFallback({ message, onReset }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 px-6 text-center"
    >
      {/* Decorative icon with pulse animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring', 
          delay: 0.1,
          stiffness: 260,
          damping: 20 
        }}
        className="w-16 h-16 mx-auto mb-6 rounded-full bg-bg-elevated border border-divider flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-accent-warm"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-heading text-2xl sm:text-3xl text-text-primary mb-4"
      >
        {message.title}
      </motion.h3>

      {/* Poetic verse with stagger animation */}
      <motion.div className="font-poem text-lg text-text-secondary whitespace-pre-line mb-2 leading-relaxed">
        {message.verse.split('\n').map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-ui text-sm text-text-muted mb-8"
      >
        {message.subtitle}
      </motion.p>

      {/* Reset button with ripple effect */}
      <motion.button
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: 0.7,
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 font-ui text-sm bg-bg-elevated border border-divider rounded-lg text-text-secondary hover:text-accent-gold hover:border-accent-gold/30 hover:shadow-[0_0_20px_rgba(212,168,85,0.2)] transition-all duration-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>फिर से कोशिश करें</span>
      </motion.button>
    </motion.div>
  )
}

// Wrapper HOC for convenience
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  section?: ErrorBoundaryProps['section']
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary section={section}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
