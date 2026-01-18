'use client'

import { useRef, useMemo } from 'react'
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  MotionValue,
} from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { springPresets } from '@/lib/animation-presets'

export type ParallaxDirection = 'vertical' | 'horizontal' | 'both'
export type ParallaxSplitBy = 'none' | 'word' | 'character'

export interface ParallaxSpringConfig {
  stiffness: number
  damping: number
}

export interface ParallaxTextProps {
  children: string
  depth?: number // -1 to 1: negative = slower (background), positive = faster (foreground)
  direction?: ParallaxDirection
  range?: ['start end' | 'end start' | 'start center' | 'center end', 'start end' | 'end start' | 'start center' | 'center end']
  springConfig?: ParallaxSpringConfig
  offset?: number
  enableBlur?: boolean
  enableOpacity?: boolean
  splitBy?: ParallaxSplitBy
  className?: string
}

// Default spring configuration for smooth parallax
const defaultSpringConfig: ParallaxSpringConfig = {
  stiffness: springPresets.gentle.stiffness,
  damping: springPresets.gentle.damping,
}

// Split text into segments based on splitBy type
function splitText(text: string, splitBy: ParallaxSplitBy): string[] {
  switch (splitBy) {
    case 'word':
      return text.split(/(\s+)/).filter(Boolean)
    case 'character':
      // Use Intl.Segmenter for proper Hindi/Devanagari support
      if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
        const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' })
        return Array.from(segmenter.segment(text), (segment) => segment.segment)
      }
      return text.split('')
    default:
      return [text]
  }
}

// Component for parallax segment
interface ParallaxSegmentProps {
  children: string
  depth: number
  direction: ParallaxDirection
  scrollProgress: MotionValue<number>
  springConfig: ParallaxSpringConfig
  offset: number
  enableBlur: boolean
  enableOpacity: boolean
  segmentIndex: number
  totalSegments: number
  reducedMotion: boolean
}

function ParallaxSegment({
  children,
  depth,
  direction,
  scrollProgress,
  springConfig,
  offset,
  enableBlur,
  enableOpacity,
  segmentIndex,
  totalSegments,
  reducedMotion,
}: ParallaxSegmentProps) {
  // Calculate depth variation for segments
  const segmentDepth = depth * (1 + (segmentIndex / totalSegments) * 0.2)
  
  // Maximum movement in pixels - reduced by 15% for subtler effect
  const maxMovement = 85
  const movement = segmentDepth * maxMovement
  
  // Create parallax transforms
  const rawY = useTransform(
    scrollProgress,
    [0, 1],
    direction === 'horizontal' ? [0, 0] : [offset + movement, offset - movement]
  )
  
  const rawX = useTransform(
    scrollProgress,
    [0, 1],
    direction === 'vertical' ? [0, 0] : [offset + movement * 0.5, offset - movement * 0.5]
  )
  
  // Apply spring smoothing
  const y = useSpring(rawY, springConfig)
  const x = useSpring(rawX, springConfig)
  
  // Blur based on depth (background elements are blurrier)
  const blurValue = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    enableBlur && !reducedMotion
      ? [Math.abs(depth) * 2, 0, Math.abs(depth) * 2]
      : [0, 0, 0]
  )
  
  // Opacity based on depth
  const opacityValue = useTransform(
    scrollProgress,
    [0, 0.3, 0.7, 1],
    enableOpacity && !reducedMotion
      ? [0.5, 1, 1, 0.5]
      : [1, 1, 1, 1]
  )
  
  // If reduced motion, return static text
  if (reducedMotion) {
    return (
      <span 
        className="inline-block"
        style={{ whiteSpace: children.trim() === '' ? 'pre' : 'normal' }}
      >
        {children.trim() === '' ? '\u00A0' : children}
      </span>
    )
  }
  
  return (
    <motion.span
      className="inline-block"
      style={{
        y: direction !== 'horizontal' ? y : 0,
        x: direction !== 'vertical' ? x : 0,
        filter: enableBlur ? `blur(${blurValue}px)` : undefined,
        opacity: opacityValue,
        whiteSpace: children.trim() === '' ? 'pre' : 'normal',
        willChange: 'transform',
      }}
    >
      {children.trim() === '' ? '\u00A0' : children}
    </motion.span>
  )
}

export function ParallaxText({
  children,
  depth = 0.5,
  direction = 'vertical',
  range,
  springConfig = defaultSpringConfig,
  offset = 0,
  enableBlur = false,
  enableOpacity = false,
  splitBy = 'none',
  className = '',
}: ParallaxTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  // Clamp depth between -1 and 1
  const clampedDepth = Math.max(-1, Math.min(1, depth))
  
  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: (range || ['start end', 'end start']) as ['start end', 'end start'],
  })
  
  // Split text into segments
  const segments = useMemo(() => splitText(children, splitBy), [children, splitBy])
  
  // If reduced motion or no split, render simple parallax
  if (prefersReducedMotion || splitBy === 'none') {
    // Even for no-split, we still apply parallax to the whole text
    const rawY = useTransform(
      scrollYProgress,
      [0, 1],
      direction === 'horizontal' 
        ? [0, 0] 
        : [offset + clampedDepth * 85, offset - clampedDepth * 85]
    )
    
    const rawX = useTransform(
      scrollYProgress,
      [0, 1],
      direction === 'vertical' 
        ? [0, 0] 
        : [offset + clampedDepth * 42.5, offset - clampedDepth * 42.5]
    )
    
    const y = useSpring(rawY, springConfig)
    const x = useSpring(rawX, springConfig)
    
    if (prefersReducedMotion) {
      return <span className={className}>{children}</span>
    }
    
    return (
      <motion.span
        ref={ref}
        className={`inline-block ${className}`}
        style={{
          y: direction !== 'horizontal' ? y : 0,
          x: direction !== 'vertical' ? x : 0,
          willChange: 'transform',
        }}
      >
        {children}
      </motion.span>
    )
  }
  
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {segments.map((segment, index) => (
        <ParallaxSegment
          key={index}
          depth={clampedDepth}
          direction={direction}
          scrollProgress={scrollYProgress}
          springConfig={springConfig}
          offset={offset}
          enableBlur={enableBlur}
          enableOpacity={enableOpacity}
          segmentIndex={index}
          totalSegments={segments.length}
          reducedMotion={prefersReducedMotion}
        >
          {segment}
        </ParallaxSegment>
      ))}
    </span>
  )
}

// ============================================================================
// Parallax Container Component
// ============================================================================

export interface ParallaxContainerProps {
  children: React.ReactNode
  depth?: number
  direction?: ParallaxDirection
  range?: [string, string]
  springConfig?: ParallaxSpringConfig
  className?: string
}

/**
 * ParallaxContainer - Apply parallax effect to any content
 * 
 * @example
 * ```tsx
 * <ParallaxContainer depth={-0.3}>
 *   <Image src="/background.jpg" />
 * </ParallaxContainer>
 * ```
 */
export function ParallaxContainer({
  children,
  depth = 0.5,
  direction = 'vertical',
  range,
  springConfig = defaultSpringConfig,
  className = '',
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const clampedDepth = Math.max(-1, Math.min(1, depth))
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: (range || ['start end', 'end start']) as ['start end', 'end start'],
  })
  
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'horizontal' 
      ? [0, 0] 
      : [clampedDepth * 85, -clampedDepth * 85]
  )
  
  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'vertical' 
      ? [0, 0] 
      : [clampedDepth * 42.5, -clampedDepth * 42.5]
  )
  
  const y = useSpring(rawY, springConfig)
  const x = useSpring(rawX, springConfig)
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: direction !== 'horizontal' ? y : 0,
        x: direction !== 'vertical' ? x : 0,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}
