/**
 * Animation Presets Library
 * 
 * Centralized animation configuration for consistent, premium-quality animations
 * across the application. All presets respect reduced motion preferences.
 * 
 * @example
 * ```tsx
 * import { springPresets, getSpringConfig } from '@/lib/animation-presets'
 * 
 * // Direct use
 * const transition = { type: 'spring', ...springPresets.smooth }
 * 
 * // With reduced motion support
 * const config = getSpringConfig('smooth', prefersReducedMotion)
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type SpringPreset = 'gentle' | 'smooth' | 'snappy' | 'bouncy' | 'stiff' | 'cinematic'
export type EasingPreset = 'easeOut' | 'easeInOut' | 'anticipate' | 'cinematic' | 'elastic'
export type StaggerPreset = 'tight' | 'normal' | 'relaxed' | 'dramatic' | 'cinematic'
export type DurationPreset = 'instant' | 'fast' | 'normal' | 'slow' | 'cinematic'
export type ViewportPreset = 'standard' | 'eager' | 'lazy' | 'repeat'

export interface SpringConfig {
  stiffness: number
  damping: number
  mass: number
}

export interface ViewportConfig {
  once: boolean
  margin: string
}

// ============================================================================
// Spring Physics Presets
// ============================================================================

/**
 * Spring physics presets for natural motion
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ scale: 1 }}
 *   transition={{ type: 'spring', ...springPresets.bouncy }}
 * />
 * ```
 */
export const springPresets: Record<SpringPreset, SpringConfig> = {
  /** Soft, slow movement - ideal for subtle background elements */
  gentle: { stiffness: 50, damping: 20, mass: 1 },
  
  /** Balanced default - works well for most UI animations */
  smooth: { stiffness: 120, damping: 20, mass: 1 },
  
  /** Quick, responsive - great for interactive elements */
  snappy: { stiffness: 200, damping: 25, mass: 1 },
  
  /** Playful bounce - for attention-grabbing elements */
  bouncy: { stiffness: 300, damping: 12, mass: 1 },
  
  /** Minimal overshoot - for precise movements */
  stiff: { stiffness: 400, damping: 30, mass: 1 },
  
  /** Slow, weighty - for cinematic, dramatic movements */
  cinematic: { stiffness: 60, damping: 25, mass: 1.2 },
}

// ============================================================================
// Easing Curve Presets
// ============================================================================

/**
 * Cubic bezier easing curves for tween animations
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: 0.6, ease: easingPresets.cinematic }}
 * />
 * ```
 */
export const easingPresets: Record<EasingPreset, [number, number, number, number]> = {
  /** Smooth deceleration - current default */
  easeOut: [0.2, 0.65, 0.3, 0.9],
  
  /** Smooth both ends - for longer animations */
  easeInOut: [0.4, 0, 0.2, 1],
  
  /** Slight overshoot - adds energy to movement */
  anticipate: [0.5, 0.05, 0.2, 1.1],
  
  /** Dramatic, slow start - for cinematic reveals */
  cinematic: [0.76, 0, 0.24, 1],
  
  /** Subtle overshoot - for elastic feel */
  elastic: [0.68, -0.55, 0.265, 1.55],
}

// ============================================================================
// Stagger Timing Presets
// ============================================================================

/**
 * Stagger delay presets for sequential animations
 * 
 * @example
 * ```tsx
 * <motion.ul
 *   variants={{
 *     visible: {
 *       transition: { staggerChildren: staggerPresets.normal }
 *     }
 *   }}
 * />
 * ```
 */
export const staggerPresets: Record<StaggerPreset, number> = {
  /** Rapid succession - for dense lists */
  tight: 0.015,
  
  /** Balanced spacing - default for most use cases */
  normal: 0.05,
  
  /** Leisurely pace - for important content */
  relaxed: 0.1,
  
  /** Emphasized spacing - for hero sections */
  dramatic: 0.18,
  
  /** Cinematic spacing - for hero section reveals */
  cinematic: 0.25,
}

// ============================================================================
// Duration Presets
// ============================================================================

/**
 * Duration presets in seconds
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: durationPresets.normal }}
 * />
 * ```
 */
export const durationPresets: Record<DurationPreset, number> = {
  /** No animation - for reduced motion */
  instant: 0,
  
  /** Quick interactions - buttons, toggles */
  fast: 0.25,
  
  /** Standard animations - most UI elements */
  normal: 0.5,
  
  /** Emphasized animations - section transitions */
  slow: 1.0,
  
  /** Dramatic reveals - hero sections, page loads */
  cinematic: 1.8,
}

// ============================================================================
// Viewport Configuration Presets
// ============================================================================

/**
 * Viewport trigger configurations for scroll animations
 * 
 * @example
 * ```tsx
 * const isInView = useInView(ref, viewportPresets.lazy)
 * ```
 */
export const viewportPresets: Record<ViewportPreset, ViewportConfig> = {
  /** Standard trigger - plays once, 50px before entering */
  standard: { once: true, margin: '-50px' },
  
  /** Eager trigger - plays once, at viewport edge */
  eager: { once: true, margin: '0px' },
  
  /** Lazy trigger - plays once, 100px before entering */
  lazy: { once: true, margin: '-100px' },
  
  /** Repeating - plays every time element enters view */
  repeat: { once: false, margin: '-50px' },
}

// ============================================================================
// Reduced Motion Variants
// ============================================================================

/**
 * Reduced motion spring config (instant transitions)
 */
export const reducedMotionSpring: SpringConfig = {
  stiffness: 1000,
  damping: 100,
  mass: 0.1,
}

/**
 * Reduced motion duration (instant)
 */
export const reducedMotionDuration = 0

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get spring configuration with reduced motion support
 * 
 * @param preset - Spring preset name
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Spring configuration object
 * 
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const spring = getSpringConfig('smooth', prefersReducedMotion)
 * ```
 */
export function getSpringConfig(
  preset: SpringPreset,
  reducedMotion: boolean
): SpringConfig {
  if (reducedMotion) {
    return reducedMotionSpring
  }
  return springPresets[preset]
}

/**
 * Get stagger delay with reduced motion support
 * 
 * @param preset - Stagger preset name
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Stagger delay in seconds
 * 
 * @example
 * ```tsx
 * const delay = getStaggerDelay('normal', prefersReducedMotion)
 * ```
 */
export function getStaggerDelay(
  preset: StaggerPreset,
  reducedMotion: boolean
): number {
  if (reducedMotion) {
    return 0
  }
  return staggerPresets[preset]
}

/**
 * Get duration with reduced motion support
 * 
 * @param preset - Duration preset name
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Duration in seconds
 * 
 * @example
 * ```tsx
 * const duration = getDuration('normal', prefersReducedMotion)
 * ```
 */
export function getDuration(
  preset: DurationPreset,
  reducedMotion: boolean
): number {
  if (reducedMotion) {
    return reducedMotionDuration
  }
  return durationPresets[preset]
}

/**
 * Get viewport configuration
 * 
 * @param preset - Viewport preset name
 * @returns Viewport configuration object
 * 
 * @example
 * ```tsx
 * const viewport = getViewportConfig('lazy')
 * const isInView = useInView(ref, viewport)
 * ```
 */
export function getViewportConfig(preset: ViewportPreset): ViewportConfig {
  return viewportPresets[preset]
}

/**
 * Get complete transition config for spring animations
 * 
 * @param springPreset - Spring preset name
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Complete transition configuration
 * 
 * @example
 * ```tsx
 * <motion.div
 *   transition={getSpringTransition('bouncy', prefersReducedMotion)}
 * />
 * ```
 */
export function getSpringTransition(
  springPreset: SpringPreset,
  reducedMotion: boolean
) {
  const config = getSpringConfig(springPreset, reducedMotion)
  return {
    type: 'spring' as const,
    ...config,
  }
}

/**
 * Get complete transition config for tween animations
 * 
 * @param durationPreset - Duration preset name
 * @param easingPreset - Easing preset name
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Complete transition configuration
 * 
 * @example
 * ```tsx
 * <motion.div
 *   transition={getTweenTransition('normal', 'easeOut', prefersReducedMotion)}
 * />
 * ```
 */
export function getTweenTransition(
  durationPreset: DurationPreset,
  easingPreset: EasingPreset,
  reducedMotion: boolean
) {
  return {
    duration: getDuration(durationPreset, reducedMotion),
    ease: reducedMotion ? [0, 0, 1, 1] : easingPresets[easingPreset],
  }
}

// ============================================================================
// Common Animation Variants
// ============================================================================

/**
 * Fade in/out variants with reduced motion support
 */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

/**
 * Slide up variants with reduced motion support
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Scale variants with reduced motion support
 */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

/**
 * Get variants with reduced motion fallback
 * 
 * @param normalVariants - Standard animation variants
 * @param reducedMotion - Whether user prefers reduced motion
 * @returns Appropriate variants based on motion preference
 */
export function getMotionSafeVariants<T extends { hidden: object; visible: object }>(
  normalVariants: T,
  reducedMotion: boolean
): T {
  if (reducedMotion) {
    return {
      ...normalVariants,
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    } as T
  }
  return normalVariants
}
