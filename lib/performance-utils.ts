/**
 * Simple Performance Utilities
 * Detects device performance tier without 3D/WebGL dependencies
 */

export type PerformanceTier = 'low' | 'medium' | 'high'

/**
 * Detect performance tier based on device capabilities
 * Uses hardware concurrency, device memory, and screen resolution
 */
export function getPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'medium'
  
  try {
    const nav = navigator as Navigator & { 
      deviceMemory?: number
      connection?: { effectiveType?: string }
    }
    
    // Check hardware cores
    const cores = navigator.hardwareConcurrency || 2
    
    // Check device memory (if available)
    const memory = nav.deviceMemory || 4
    
    // Check connection type (if available)
    const connectionType = nav.connection?.effectiveType || '4g'
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(connectionType)
    
    // Check screen resolution
    const screenPixels = window.screen.width * window.screen.height
    const isHighResScreen = screenPixels > 2000000 // > 2MP
    
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Low tier conditions
    if (memory <= 2 || cores <= 2 || isSlowConnection || prefersReducedMotion) {
      return 'low'
    }
    
    // High tier conditions
    if (memory >= 8 && cores >= 6 && isHighResScreen) {
      return 'high'
    }
    
    // Default to medium
    return 'medium'
  } catch {
    return 'medium'
  }
}

/**
 * Check if device is likely a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get optimized animation settings based on performance tier
 */
export function getAnimationSettings(tier: PerformanceTier) {
  switch (tier) {
    case 'low':
      return {
        duration: 0,
        stagger: 0,
        enableParallax: false,
        enableBlur: false,
      }
    case 'medium':
      return {
        duration: 0.3,
        stagger: 0.05,
        enableParallax: true,
        enableBlur: false,
      }
    case 'high':
      return {
        duration: 0.5,
        stagger: 0.1,
        enableParallax: true,
        enableBlur: true,
      }
  }
}
