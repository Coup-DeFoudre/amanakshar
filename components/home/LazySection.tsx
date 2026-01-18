'use client'

import { useRef, useState, useEffect, ReactNode, Suspense } from 'react'

interface LazySectionProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
}

/**
 * Wrapper component that only renders children when the section enters viewport
 * Uses Intersection Observer for efficient lazy loading of heavy sections
 */
export function LazySection({
  children,
  fallback,
  rootMargin = '200px', // Start loading 200px before entering viewport
  threshold = 0,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      setHasLoaded(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasLoaded(true)
          // Once loaded, disconnect observer
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  // Default fallback skeleton
  const defaultFallback = (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-2xl px-6">
        <div className="h-4 bg-bg-elevated rounded w-1/4 mx-auto" />
        <div className="h-8 bg-bg-elevated rounded w-3/4 mx-auto" />
        <div className="h-4 bg-bg-elevated rounded w-1/2 mx-auto" />
      </div>
    </div>
  )

  return (
    <div ref={ref}>
      {hasLoaded ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  )
}

/**
 * Skeleton component for section loading states
 */
export function SectionSkeleton({ 
  height = '400px',
  variant = 'default' 
}: { 
  height?: string
  variant?: 'default' | 'video' | 'cards' 
}) {
  if (variant === 'video') {
    return (
      <div className="py-20 px-6" style={{ minHeight: height }}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-3 bg-bg-elevated rounded w-16 mx-auto mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="aspect-video bg-bg-elevated rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-bg-elevated rounded w-3/4" />
                <div className="h-6 bg-bg-elevated rounded w-full" />
                <div className="h-6 bg-bg-elevated rounded w-5/6" />
                <div className="flex gap-4 mt-6">
                  <div className="h-12 w-12 bg-bg-elevated rounded-full" />
                  <div className="h-6 bg-bg-elevated rounded w-24 self-center" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className="py-20 px-6" style={{ minHeight: height }}>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-3 bg-bg-elevated rounded w-16 mx-auto mb-8" />
            <div className="h-10 bg-bg-elevated rounded w-1/2 mx-auto mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-bg-elevated rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-6" style={{ minHeight: height }}>
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-3 bg-bg-elevated rounded w-16 mx-auto" />
          <div className="h-12 bg-bg-elevated rounded w-3/4 mx-auto" />
          <div className="h-6 bg-bg-elevated rounded w-1/2 mx-auto" />
          <div className="h-20 bg-bg-elevated rounded w-2/3 mx-auto mt-8" />
          <div className="flex justify-center gap-4 mt-8">
            <div className="h-4 bg-bg-elevated rounded w-32" />
            <div className="h-4 bg-bg-elevated rounded w-32" />
            <div className="h-4 bg-bg-elevated rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
