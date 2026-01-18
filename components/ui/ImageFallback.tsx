'use client'

import { useState, useCallback } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type ImageCategory = 'poet' | 'poem' | 'book' | 'performance' | 'event' | 'generic'

interface ImageFallbackProps extends Omit<ImageProps, 'onError' | 'onLoad' | 'placeholder'> {
  category?: ImageCategory
  showLoadingState?: boolean
  showErrorState?: boolean
  fallbackText?: string
}

// Elegant SVG placeholders for different categories
const placeholders: Record<ImageCategory, { icon: string; gradient: string; bgColor: string }> = {
  poet: {
    icon: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
    gradient: 'from-accent-gold/20 to-accent-warm/10',
    bgColor: 'bg-bg-elevated',
  },
  poem: {
    icon: `<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    gradient: 'from-accent-indigo/20 to-accent-indigo/5',
    bgColor: 'bg-bg-elevated',
  },
  book: {
    icon: `<path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
    gradient: 'from-accent-warm/20 to-accent-warm/5',
    bgColor: 'bg-bg-elevated',
  },
  performance: {
    icon: `<path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    gradient: 'from-accent-rose/20 to-accent-rose/5',
    bgColor: 'bg-bg-elevated',
  },
  event: {
    icon: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5"/>`,
    gradient: 'from-accent-emerald/20 to-accent-emerald/5',
    bgColor: 'bg-bg-elevated',
  },
  generic: {
    icon: `<rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    gradient: 'from-text-muted/10 to-transparent',
    bgColor: 'bg-bg-elevated',
  },
}

/**
 * ImageFallback - Image component with elegant fallback states
 * 
 * Features:
 * - Category-specific placeholder SVGs
 * - Smooth loading transitions
 * - Error state with retry option
 * - Maintains aspect ratio
 */
export function ImageFallback({
  src,
  alt,
  width,
  height,
  className,
  category = 'generic',
  showLoadingState = true,
  showErrorState = true,
  fallbackText,
  fill,
  ...props
}: ImageFallbackProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1)
    setIsLoading(true)
    setHasError(false)
  }, [])

  const placeholder = placeholders[category]

  // Render fallback placeholder
  if (hasError || !src) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden',
          placeholder.bgColor,
          fill && 'w-full h-full',
          className
        )}
        style={!fill ? { width, height } : undefined}
        role="img"
        aria-label={alt}
      >
        {/* Gradient background */}
        <div className={cn('absolute inset-0 bg-gradient-to-br', placeholder.gradient)} />

        {/* Decorative border */}
        <div className="absolute inset-2 sm:inset-4 border border-dashed border-text-muted/20 rounded-lg" />

        {/* Icon and text */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted/40"
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <g dangerouslySetInnerHTML={{ __html: placeholder.icon }} />
            </svg>
          </motion.div>

          {fallbackText && (
            <p className="font-ui text-xs sm:text-sm text-text-muted/60 max-w-[150px]">
              {fallbackText}
            </p>
          )}

          {showErrorState && hasError && retryCount < 3 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleRetry}
              className="mt-2 px-3 py-1.5 text-xs font-ui text-text-muted border border-divider rounded hover:border-accent-gold/30 hover:text-accent-gold transition-colors"
            >
              पुनः प्रयास करें
            </motion.button>
          )}
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-text-muted/10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-text-muted/10" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill && 'w-full h-full',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* Loading skeleton */}
      {showLoadingState && isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            placeholder.bgColor
          )}
        >
          <div className={cn('absolute inset-0 bg-gradient-to-br', placeholder.gradient)} />
          <div className="absolute inset-0 shimmer" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 text-text-muted/30"
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <g dangerouslySetInnerHTML={{ __html: placeholder.icon }} />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Actual image */}
      <Image
        key={retryCount} // Force re-render on retry
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-500',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill && 'object-cover'
        )}
        {...props}
      />
    </div>
  )
}

/**
 * Compact placeholder for inline use
 */
export function InlinePlaceholder({ 
  size = 'md',
  category = 'generic',
}: { 
  size?: 'sm' | 'md' | 'lg'
  category?: ImageCategory
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const placeholder = placeholders[category]

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full',
        placeholder.bgColor,
        sizeClasses[size]
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br rounded-full', placeholder.gradient)} />
      <svg 
        viewBox="0 0 24 24" 
        className="w-1/2 h-1/2 text-text-muted/40 relative z-10"
      >
        <g dangerouslySetInnerHTML={{ __html: placeholder.icon }} />
      </svg>
    </div>
  )
}
