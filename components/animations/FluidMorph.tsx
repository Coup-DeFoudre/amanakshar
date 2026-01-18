'use client'

import { useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup, Transition, TargetAndTransition } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { springPresets, easingPresets } from '@/lib/animation-presets'

export interface MorphState {
  scale?: number
  borderRadius?: string
  backgroundColor?: string
  width?: string | number
  height?: string | number
  rotate?: number
  x?: number
  y?: number
  opacity?: number
}

export interface FluidMorphSpringConfig {
  stiffness: number
  damping: number
}

export type MorphEase = 'spring' | 'easeOut' | 'easeInOut' | 'elastic'

export interface FluidMorphProps {
  morphKey: string
  states: MorphState[]
  currentState: number
  duration?: number
  springConfig?: FluidMorphSpringConfig
  morphScale?: number
  staggerDelay?: number
  ease?: MorphEase
  onMorphComplete?: () => void
  className?: string
  children?: React.ReactNode
  enableHover?: boolean
  enableTap?: boolean
  hoverState?: MorphState
  tapState?: MorphState
}

// Default spring configuration
const defaultSpringConfig: FluidMorphSpringConfig = {
  stiffness: springPresets.smooth.stiffness,
  damping: springPresets.smooth.damping,
}

// Get transition configuration based on ease type
function getTransitionConfig(
  ease: MorphEase,
  duration: number,
  springConfig: FluidMorphSpringConfig,
  reducedMotion: boolean
): Transition {
  if (reducedMotion) {
    return { duration: 0 }
  }

  if (ease === 'spring') {
    return {
      type: 'spring',
      stiffness: springConfig.stiffness,
      damping: springConfig.damping,
    }
  }

  // Use elastic easing for shape transitions
  if (ease === 'elastic') {
    return {
      duration,
      ease: easingPresets.elastic,
    }
  }

  return {
    duration,
    ease: easingPresets[ease],
  }
}

// Interpolate colors for smooth transitions
function interpolateColor(from: string, to: string, progress: number): string {
  // Simple hex color interpolation
  const parseHex = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '')
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ]
  }
  
  try {
    const [r1, g1, b1] = parseHex(from)
    const [r2, g2, b2] = parseHex(to)
    
    const r = Math.round(r1 + (r2 - r1) * progress)
    const g = Math.round(g1 + (g2 - g1) * progress)
    const b = Math.round(b1 + (b2 - b1) * progress)
    
    return `rgb(${r}, ${g}, ${b})`
  } catch {
    return to // Fallback to target color
  }
}

export function FluidMorph({
  morphKey,
  states,
  currentState,
  duration = 0.8,
  springConfig = defaultSpringConfig,
  morphScale = 1,
  staggerDelay,
  ease = 'elastic',
  onMorphComplete,
  className = '',
  children,
  enableHover = false,
  enableTap = false,
  hoverState,
  tapState,
}: FluidMorphProps) {
  const prefersReducedMotion = useReducedMotion()
  
  // Get current morph state
  const activeState = useMemo(() => {
    const state = states[currentState] || states[0] || {}
    
    // Apply morphScale to scale transforms
    if (state.scale !== undefined && morphScale !== 1) {
      return {
        ...state,
        scale: state.scale * morphScale,
      }
    }
    
    return state
  }, [states, currentState, morphScale])
  
  // Build transition
  const transition = useMemo(
    () => getTransitionConfig(ease, duration, springConfig, prefersReducedMotion),
    [ease, duration, springConfig, prefersReducedMotion]
  )
  
  // Handle morph complete callback
  const handleAnimationComplete = useCallback(() => {
    onMorphComplete?.()
  }, [onMorphComplete])
  
  // Build hover and tap states
  const whileHover = enableHover && hoverState ? hoverState : undefined
  const whileTap = enableTap && tapState ? tapState : undefined
  
  return (
    <LayoutGroup id={morphKey}>
      <motion.div
        layoutId={morphKey}
        className={className}
        animate={activeState as TargetAndTransition}
        transition={transition}
        onAnimationComplete={handleAnimationComplete}
        whileHover={whileHover as TargetAndTransition}
        whileTap={whileTap as TargetAndTransition}
        style={{
          willChange: 'transform, opacity, background-color, border-radius',
        }}
      >
        {children}
      </motion.div>
    </LayoutGroup>
  )
}

// ============================================================================
// Morph Group Component for Staggered Morphing
// ============================================================================

export interface MorphGroupItem {
  key: string
  states: MorphState[]
  currentState: number
  children?: React.ReactNode
  className?: string
}

export interface FluidMorphGroupProps {
  items: MorphGroupItem[]
  staggerDelay?: number
  duration?: number
  springConfig?: FluidMorphSpringConfig
  ease?: MorphEase
  onAllMorphsComplete?: () => void
  className?: string
}

/**
 * FluidMorphGroup - Stagger multiple morph animations
 * 
 * @example
 * ```tsx
 * <FluidMorphGroup
 *   items={[
 *     { key: 'card1', states: [...], currentState: 0 },
 *     { key: 'card2', states: [...], currentState: 1 },
 *   ]}
 *   staggerDelay={0.1}
 * />
 * ```
 */
export function FluidMorphGroup({
  items,
  staggerDelay = 0.1,
  duration = 0.8,
  springConfig = defaultSpringConfig,
  ease = 'spring',
  onAllMorphsComplete,
  className = '',
}: FluidMorphGroupProps) {
  const prefersReducedMotion = useReducedMotion()
  
  // Track completed morphs
  const completedCount = useMemo(() => ({ current: 0 }), [items.length])
  
  const handleMorphComplete = useCallback(() => {
    completedCount.current++
    if (completedCount.current >= items.length) {
      onAllMorphsComplete?.()
      completedCount.current = 0
    }
  }, [items.length, onAllMorphsComplete, completedCount])
  
  return (
    <div className={className}>
      {items.map((item, index) => {
        const itemDelay = prefersReducedMotion ? 0 : index * staggerDelay
        
        return (
          <FluidMorph
            key={item.key}
            morphKey={item.key}
            states={item.states}
            currentState={item.currentState}
            duration={duration}
            springConfig={springConfig}
            ease={ease}
            onMorphComplete={handleMorphComplete}
            className={item.className}
          >
            {item.children}
          </FluidMorph>
        )
      })}
    </div>
  )
}

// ============================================================================
// SVG Path Morph Component
// ============================================================================

export interface PathMorphProps {
  paths: string[]
  currentPath: number
  duration?: number
  springConfig?: FluidMorphSpringConfig
  ease?: MorphEase
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

/**
 * PathMorph - Morph between SVG paths
 * 
 * @example
 * ```tsx
 * <svg viewBox="0 0 100 100">
 *   <PathMorph
 *     paths={['M10 10 L90 90', 'M10 90 L90 10']}
 *     currentPath={isActive ? 1 : 0}
 *   />
 * </svg>
 * ```
 */
export function PathMorph({
  paths,
  currentPath,
  duration = 0.8,
  springConfig = defaultSpringConfig,
  ease = 'spring',
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 2,
  className = '',
}: PathMorphProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const activePath = paths[currentPath] || paths[0] || ''
  
  const transition = useMemo(
    () => getTransitionConfig(ease, duration, springConfig, prefersReducedMotion),
    [ease, duration, springConfig, prefersReducedMotion]
  )
  
  return (
    <motion.path
      className={className}
      d={activePath}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      animate={{ d: activePath }}
      transition={transition}
    />
  )
}

// ============================================================================
// Presence Morph Component
// ============================================================================

export interface PresenceMorphProps {
  isVisible: boolean
  enterState?: MorphState
  exitState?: MorphState
  duration?: number
  springConfig?: FluidMorphSpringConfig
  ease?: MorphEase
  children: React.ReactNode
  className?: string
}

/**
 * PresenceMorph - Animate presence with morph effects
 * 
 * @example
 * ```tsx
 * <PresenceMorph
 *   isVisible={showModal}
 *   enterState={{ scale: 1, opacity: 1 }}
 *   exitState={{ scale: 0.9, opacity: 0 }}
 * >
 *   <Modal />
 * </PresenceMorph>
 * ```
 */
export function PresenceMorph({
  isVisible,
  enterState = { scale: 1, opacity: 1 },
  exitState = { scale: 0.95, opacity: 0 },
  duration = 0.5,
  springConfig = defaultSpringConfig,
  ease = 'spring',
  children,
  className = '',
}: PresenceMorphProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const transition = useMemo(
    () => getTransitionConfig(ease, duration, springConfig, prefersReducedMotion),
    [ease, duration, springConfig, prefersReducedMotion]
  )
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          initial={(prefersReducedMotion ? { opacity: 0 } : exitState) as TargetAndTransition}
          animate={(prefersReducedMotion ? { opacity: 1 } : enterState) as TargetAndTransition}
          exit={(prefersReducedMotion ? { opacity: 0 } : exitState) as TargetAndTransition}
          transition={transition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
