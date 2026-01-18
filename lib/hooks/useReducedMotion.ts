'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if matchMedia is available (SSR safety)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    
    // Legacy browsers
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Returns motion-safe animation variants
 * When reduced motion is preferred, returns static values
 */
export function getReducedMotionVariants<T extends Record<string, unknown>>(
  normalVariants: T,
  reducedVariants?: Partial<T>
): T {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return { ...normalVariants, ...reducedVariants } as T
  }
  return normalVariants
}

/**
 * Motion configuration that respects reduced motion
 */
export const safeMotionConfig = {
  // For initial/animate transitions
  transition: (prefersReduced: boolean) => 
    prefersReduced 
      ? { duration: 0 } 
      : { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  
  // For scroll-triggered animations
  viewport: { once: true, margin: '-100px' },
  
  // Static fallback for reduced motion
  getInitial: (prefersReduced: boolean, normalInitial: object) =>
    prefersReduced ? {} : normalInitial,
    
  getAnimate: (prefersReduced: boolean, isInView: boolean, normalAnimate: object) =>
    prefersReduced || isInView ? normalAnimate : {},
}
