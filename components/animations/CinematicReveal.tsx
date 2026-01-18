'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { springPresets, easingPresets, durationPresets } from '@/lib/animation-presets'

export type RevealPattern = 
  | 'wipe-right' 
  | 'wipe-left' 
  | 'wipe-up' 
  | 'wipe-down' 
  | 'circle' 
  | 'diamond' 
  | 'split-horizontal' 
  | 'split-vertical'

export type RevealEasing = 'easeOut' | 'easeInOut' | 'spring'
export type RevealFrom = 'start' | 'center' | 'end'

export interface CinematicRevealProps {
  children: React.ReactNode
  pattern?: RevealPattern
  duration?: number
  delay?: number
  easing?: RevealEasing
  customClipPath?: string
  revealFrom?: RevealFrom
  once?: boolean
  className?: string
}

// Clip-path definitions for each pattern
const getClipPaths = (from: RevealFrom = 'start'): Record<RevealPattern, { hidden: string; visible: string }> => {
  // Adjust directions based on revealFrom
  const getWipeStart = (direction: 'h' | 'v', from: RevealFrom): string => {
    if (direction === 'h') {
      switch (from) {
        case 'start': return 'inset(0 100% 0 0)'
        case 'center': return 'inset(0 50% 0 50%)'
        case 'end': return 'inset(0 0 0 100%)'
      }
    } else {
      switch (from) {
        case 'start': return 'inset(0 0 100% 0)'
        case 'center': return 'inset(50% 0 50% 0)'
        case 'end': return 'inset(100% 0 0 0)'
      }
    }
  }

  return {
    'wipe-right': {
      hidden: 'inset(0 100% 0 0)',
      visible: 'inset(0 0% 0 0)',
    },
    'wipe-left': {
      hidden: 'inset(0 0 0 100%)',
      visible: 'inset(0 0 0 0%)',
    },
    'wipe-up': {
      hidden: 'inset(100% 0 0 0)',
      visible: 'inset(0% 0 0 0)',
    },
    'wipe-down': {
      hidden: 'inset(0 0 100% 0)',
      visible: 'inset(0 0 0% 0)',
    },
    'circle': {
      hidden: from === 'center' 
        ? 'circle(0% at 50% 50%)' 
        : from === 'start' 
          ? 'circle(0% at 0% 50%)'
          : 'circle(0% at 100% 50%)',
      visible: 'circle(150% at 50% 50%)',
    },
    'diamond': {
      hidden: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
      visible: 'polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)',
    },
    'split-horizontal': {
      hidden: 'inset(0 50% 0 50%)',
      visible: 'inset(0 0% 0 0%)',
    },
    'split-vertical': {
      hidden: 'inset(50% 0 50% 0)',
      visible: 'inset(0% 0 0% 0)',
    },
  }
}

// Get transition configuration based on easing type
function getTransitionConfig(
  easing: RevealEasing,
  duration: number,
  delay: number,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    return {
      duration: 0,
      delay: 0,
    }
  }

  if (easing === 'spring') {
    return {
      type: 'spring' as const,
      stiffness: springPresets.smooth.stiffness,
      damping: springPresets.smooth.damping,
      mass: springPresets.smooth.mass,
      delay,
    }
  }

  return {
    duration,
    ease: easingPresets[easing],
    delay,
  }
}

export function CinematicReveal({
  children,
  pattern = 'wipe-right',
  duration = 1.44,
  delay = 0,
  easing = 'easeOut',
  customClipPath,
  revealFrom = 'start',
  once = true,
  className = '',
}: CinematicRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once, margin: '-50px' })

  const clipPaths = useMemo(() => getClipPaths(revealFrom), [revealFrom])
  
  // Use custom clip path or pattern-based
  const hiddenClipPath = customClipPath || clipPaths[pattern].hidden
  const visibleClipPath = customClipPath 
    ? 'inset(0 0 0 0)' 
    : clipPaths[pattern].visible

  const transition = useMemo(
    () => getTransitionConfig(easing, duration, delay, prefersReducedMotion),
    [easing, duration, delay, prefersReducedMotion]
  )

  // Variants for the reveal animation
  const variants: Variants = useMemo(() => ({
    hidden: prefersReducedMotion 
      ? { opacity: 0 }
      : { 
          clipPath: hiddenClipPath,
          opacity: 1,
        },
    visible: prefersReducedMotion
      ? { opacity: 1 }
      : { 
          clipPath: visibleClipPath,
          opacity: 1,
        },
  }), [prefersReducedMotion, hiddenClipPath, visibleClipPath])

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      style={{
        willChange: 'clip-path',
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Layered Reveal Component
// ============================================================================

export interface LayeredRevealProps {
  layers: Array<{
    content: React.ReactNode
    pattern?: RevealPattern
    delay?: number
    className?: string
  }>
  baseDelay?: number
  staggerDelay?: number
  duration?: number
  easing?: RevealEasing
  once?: boolean
  className?: string
}

/**
 * LayeredReveal - Reveal multiple layers with offset timing
 * 
 * @example
 * ```tsx
 * <LayeredReveal
 *   layers={[
 *     { content: <Background />, pattern: 'wipe-right' },
 *     { content: <Text />, pattern: 'wipe-up', delay: 0.2 },
 *   ]}
 * />
 * ```
 */
export function LayeredReveal({
  layers,
  baseDelay = 0,
  staggerDelay = 0.15,
  duration = 1.0,
  easing = 'easeOut',
  once = true,
  className = '',
}: LayeredRevealProps) {
  return (
    <div className={`relative ${className}`}>
      {layers.map((layer, index) => (
        <CinematicReveal
          key={index}
          pattern={layer.pattern || 'wipe-right'}
          delay={baseDelay + (layer.delay ?? index * staggerDelay)}
          duration={duration}
          easing={easing}
          once={once}
          className={layer.className}
        >
          {layer.content}
        </CinematicReveal>
      ))}
    </div>
  )
}
