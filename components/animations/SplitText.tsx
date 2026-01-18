'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion, useInView, useAnimation, Variants, Variant } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export type StaggerPattern = 'sequential' | 'wave' | 'spiral' | 'random' | 'reverse'
export type AnimationType = 'fadeUp' | 'fadeIn' | 'blur' | 'glow' | 'scale' | 'rotate' | 'elastic'

export interface SpringConfig {
  stiffness: number
  damping: number
  mass: number
}

export interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
  animation?: AnimationType
  staggerPattern?: StaggerPattern
  springConfig?: SpringConfig
  intensity?: number
  playOnce?: boolean
}

// Default spring configuration - cinematic preset for character reveals
const defaultSpringConfig: SpringConfig = {
  stiffness: 60,
  damping: 25,
  mass: 1.2,
}

// Animation definitions with spring physics support
const getAnimations = (intensity: number = 1): Record<AnimationType, { hidden: Variant; visible: Variant }> => ({
  fadeUp: {
    hidden: { opacity: 0, y: 20 * intensity },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: `blur(${10 * intensity}px)` },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  glow: {
    hidden: { opacity: 0, textShadow: '0 0 0px rgba(212, 168, 85, 0)' },
    visible: { 
      opacity: 1, 
      textShadow: [
        `0 0 ${20 * intensity}px rgba(212, 168, 85, 0.8)`,
        `0 0 ${10 * intensity}px rgba(212, 168, 85, 0.3)`,
        '0 0 0px rgba(212, 168, 85, 0)'
      ]
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -180 * intensity, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  elastic: {
    hidden: { opacity: 0, scale: 0, y: 30 * intensity },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
})

// Split text into grapheme clusters (handles Hindi/Devanagari correctly)
function splitIntoGraphemes(text: string): string[] {
  // Use Intl.Segmenter if available (modern browsers)
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(text), (segment) => segment.segment)
  }
  
  // Fallback: split by words for Hindi text to avoid breaking characters
  // This is safer than character-by-character for Devanagari
  return text.split(/(\s+)/).filter(Boolean)
}

// Calculate delay based on stagger pattern
function calculateStaggerDelay(
  index: number,
  total: number,
  baseDelay: number,
  pattern: StaggerPattern,
  randomSeed?: number[]
): number {
  switch (pattern) {
    case 'sequential':
      return index * baseDelay
    
    case 'reverse':
      return (total - 1 - index) * baseDelay
    
    case 'wave': {
      // Sine wave-based stagger for flowing effect
      const normalizedIndex = index / (total - 1 || 1)
      const waveOffset = Math.sin(normalizedIndex * Math.PI) * 0.5
      return (normalizedIndex + waveOffset) * baseDelay * total * 0.5
    }
    
    case 'spiral': {
      // Radial stagger from center outward
      const center = (total - 1) / 2
      const distance = Math.abs(index - center)
      return distance * baseDelay
    }
    
    case 'random': {
      // Use pre-generated random values for consistency
      return (randomSeed?.[index] ?? Math.random()) * baseDelay * total * 0.5
    }
    
    default:
      return index * baseDelay
  }
}

export function SplitText({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
  animation = 'fadeUp',
  staggerPattern = 'sequential',
  springConfig = defaultSpringConfig,
  intensity = 1,
  playOnce = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { once: playOnce && once, margin: '-50px' })
  const controls = useAnimation()
  
  const segments = useMemo(() => splitIntoGraphemes(children), [children])
  const animations = useMemo(() => getAnimations(intensity), [intensity])
  
  // Generate stable random delays for random pattern
  const randomDelays = useMemo(() => {
    if (staggerPattern !== 'random') return undefined
    // Use a simple seeded random based on text content for consistency
    const seed = children.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return segments.map((_, i) => {
      const x = Math.sin(seed + i * 9999) * 10000
      return x - Math.floor(x)
    })
  }, [staggerPattern, children, segments])
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!playOnce) {
      controls.start('hidden')
    }
  }, [isInView, controls, playOnce])
  
  // Calculate individual delays for each character
  const characterDelays = useMemo(() => {
    return segments.map((_, index) => 
      calculateStaggerDelay(index, segments.length, staggerDelay, staggerPattern, randomDelays)
    )
  }, [segments, staggerDelay, staggerPattern, randomDelays])
  
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
      },
    },
  }
  
  // Build transition based on reduced motion preference
  const getCharTransition = (charDelay: number) => {
    if (prefersReducedMotion) {
      return {
        duration: 0,
        delay: 0,
      }
    }
    
    // Use spring for animations that benefit from it
    const springAnimations: AnimationType[] = ['fadeUp', 'scale', 'rotate', 'elastic']
    const useSpring = springAnimations.includes(animation)
    
    if (useSpring) {
      return {
        type: 'spring' as const,
        stiffness: springConfig.stiffness,
        damping: springConfig.damping,
        mass: springConfig.mass,
        delay: charDelay,
      }
    }
    
    // Use tween for blur and glow animations
    return {
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9] as const,
      delay: charDelay,
    }
  }
  
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {segments.map((segment, index) => {
        const charDelay = characterDelays[index]
        
        const charVariants: Variants = {
          hidden: prefersReducedMotion 
            ? { opacity: 1 } 
            : animations[animation].hidden,
          visible: {
            ...animations[animation].visible,
            transition: getCharTransition(charDelay),
          },
        }
        
        return (
          <motion.span
            key={index}
            className="inline-block"
            variants={charVariants}
            style={{ 
              whiteSpace: segment.trim() === '' ? 'pre' : 'normal',
              display: 'inline-block',
            }}
          >
            {segment.trim() === '' ? '\u00A0' : segment}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
