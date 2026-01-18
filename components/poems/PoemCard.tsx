'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

interface PoemCardProps {
  title: string
  slug: string
  excerpt: string
  bhavs: string[]
  index: number
  variant?: 'default' | 'compact' | 'featured'
}

export function PoemCard({ 
  title, 
  slug, 
  excerpt, 
  bhavs, 
  index,
  variant = 'default'
}: PoemCardProps) {
  const prefersReducedMotion = useReducedMotion()
  
  // Animation variants with mobile optimization
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.4,
        delay: prefersReducedMotion ? 0 : index * 0.1,
      }
    },
  }

  if (variant === 'compact') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group"
      >
        <Link 
          href={`/kavita/${slug}`} 
          className="block py-4 px-4 -mx-4 rounded-lg touch-manipulation active:bg-bg-elevated/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-heading text-text-primary group-hover:text-accent-gold transition-colors duration-200 truncate"
                style={{ 
                  fontSize: 'var(--font-size-lg)',
                  lineHeight: 'var(--line-height-heading)',
                  letterSpacing: 'var(--letter-spacing-heading)',
                }}
              >
                {title}
              </h3>
              {bhavs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {bhavs.slice(0, 2).map((bhav) => (
                    <span
                      key={bhav}
                      className="font-ui text-text-muted"
                      style={{ 
                        fontSize: 'var(--font-size-xs)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {bhav}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <svg 
              className="w-5 h-5 text-text-muted group-hover:text-accent-gold group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group"
      >
        <Link 
          href={`/kavita/${slug}`} 
          className="block p-5 sm:p-6 bg-bg-elevated/50 border border-divider rounded-lg touch-manipulation active:scale-[0.99] transition-all hover:border-accent-gold/30 hover:shadow-[0_0_30px_rgba(212,168,85,0.1)]"
        >
          <h3 
            className="font-heading text-text-primary group-hover:text-accent-gold transition-colors duration-200 mb-3"
            style={{ 
              fontSize: 'var(--font-size-2xl)',
              lineHeight: 'var(--line-height-heading)',
              letterSpacing: 'var(--letter-spacing-heading)',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {title}
          </h3>
          
          {/* Poem excerpt with enhanced typography */}
          <p 
            className="font-poem text-text-secondary mb-4 line-clamp-3"
            style={{ 
              fontSize: 'var(--font-size-poem)',
              lineHeight: 'var(--line-height-relaxed)',
              letterSpacing: 'var(--letter-spacing-devanagari)',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            {bhavs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bhavs.map((bhav) => (
                  <span
                    key={bhav}
                    className="font-ui px-2 py-1 bg-bg-secondary rounded text-text-muted"
                    style={{ 
                      fontSize: 'var(--font-size-xs)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {bhav}
                  </span>
                ))}
              </div>
            )}
            
            <span 
              className="font-ui text-accent-gold flex items-center gap-1 group-hover:gap-2 transition-all"
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              पढ़ें
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Default variant
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <Link 
        href={`/kavita/${slug}`} 
        className="block py-5 px-4 -mx-4 sm:mx-0 sm:px-5 sm:py-4 rounded-lg touch-manipulation active:bg-bg-elevated/30 transition-colors sm:hover:bg-bg-elevated/20"
      >
        <h3 
          className="font-heading text-text-primary group-hover:text-accent-gold transition-colors duration-200 mb-2"
          style={{ 
            fontSize: 'var(--font-size-xl)',
            lineHeight: 'var(--line-height-heading)',
            letterSpacing: 'var(--letter-spacing-heading)',
          }}
        >
          {title}
        </h3>
        
        {/* Poem excerpt with enhanced typography */}
        <p 
          className="font-poem text-text-secondary mb-3 line-clamp-2"
          style={{ 
            fontSize: 'var(--font-size-poem)',
            lineHeight: 'var(--line-height-relaxed)',
            letterSpacing: 'var(--letter-spacing-devanagari)',
            textWrap: 'balance',
          } as React.CSSProperties}
        >
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          {bhavs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {bhavs.map((bhav) => (
                <span
                  key={bhav}
                  className="font-ui text-text-muted"
                  style={{ 
                    fontSize: 'var(--font-size-xs)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {bhav}
                </span>
              ))}
            </div>
          )}
          
          {/* Mobile-friendly "read more" indicator */}
          <svg 
            className="w-5 h-5 text-text-muted group-hover:text-accent-gold group-hover:translate-x-1 transition-all sm:opacity-0 sm:group-hover:opacity-100" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.article>
  )
}
