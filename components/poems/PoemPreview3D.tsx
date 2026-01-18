'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CinematicReveal } from '@/components/animations/CinematicReveal'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { springPresets } from '@/lib/animation-presets'

export interface PoemPreview3DProps {
  title: string
  lines: string[]
  bhav: string
  bhavColor: string
  className?: string
}

/**
 * PoemPreview3D - 3D poem preview with layered text depth effects
 * 
 * Creates a cinematic reveal of poem lines with parallax depth,
 * blur effects for background layers, and scroll-based animations.
 * Enhanced with fluid typography for optimal Devanagari rendering.
 * 
 * @example
 * ```tsx
 * <PoemPreview3D
 *   title="प्रेम की बातें"
 *   lines={['पहली पंक्ति', 'दूसरी पंक्ति', 'तीसरी पंक्ति']}
 *   bhav="प्रेम"
 *   bhavColor="rgba(232, 89, 107, 0.3)"
 * />
 * ```
 */
export function PoemPreview3D({
  title,
  lines,
  bhav,
  bhavColor,
  className = '',
}: PoemPreview3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  // Scroll tracking for the component
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  
  // Transform scroll progress to line opacity for sequential reveal
  const lineOpacities = lines.map((_, index) => 
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTransform(
      scrollYProgress,
      [0.1 + index * 0.1, 0.2 + index * 0.1],
      [0, 1]
    )
  )
  
  // Calculate depth for each line (title is foreground, later lines go to background)
  const getLineDepth = (index: number): number => {
    // Title: 0.3 (foreground)
    // Line 1: 0.2
    // Line 2: 0.1
    // Line 3: 0 (center)
    // Line 4+: negative (background)
    const baseDepth = 0.2 - index * 0.1
    return Math.max(-0.3, baseDepth) // Clamp to prevent too much blur
  }
  
  // Determine if line should have blur (background layers)
  const shouldBlur = (index: number): boolean => {
    return index > 2 && !prefersReducedMotion
  }
  
  // Reduced motion fallback - static text with enhanced typography
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={`relative ${className}`} lang="hi">
        <h4 
          className="font-heading text-text-primary mb-4"
          style={{ 
            textShadow: `0 0 20px ${bhavColor}`,
            fontSize: 'var(--font-size-xl)',
            lineHeight: 'var(--line-height-heading)',
            letterSpacing: 'var(--letter-spacing-heading)',
          }}
        >
          {title}
        </h4>
        {lines.map((line, index) => (
          <p 
            key={index}
            className="font-poem text-text-secondary"
            style={{ 
              opacity: 1 - index * 0.15,
              fontSize: 'var(--font-size-poem)',
              lineHeight: 'var(--line-height-poem)',
              letterSpacing: 'var(--letter-spacing-devanagari)',
              wordSpacing: 'clamp(0.05em, 0.03em + 0.02vw, 0.08em)',
              textRendering: 'optimizeLegibility',
            }}
          >
            {line}
          </p>
        ))}
      </div>
    )
  }
  
  return (
    <div 
      ref={ref} 
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
      lang="hi"
    >
      {/* Title with cinematic reveal and foreground depth */}
      <CinematicReveal 
        pattern="wipe-right" 
        delay={0}
        duration={0.8}
        easing="spring"
      >
        <h4 
          className="font-heading text-text-primary mb-4 pr-16"
          style={{ 
            textShadow: `0 0 20px ${bhavColor}, 0 0 40px ${bhavColor.replace('0.3', '0.15')}`,
            fontSize: 'var(--font-size-xl)',
            lineHeight: 'var(--line-height-heading)',
            letterSpacing: 'var(--letter-spacing-heading)',
          }}
        >
          {title}
        </h4>
      </CinematicReveal>
      
      {/* Poem lines with staggered reveal and depth-based parallax */}
      {lines.map((line, index) => {
        const depth = getLineDepth(index)
        const enableBlur = shouldBlur(index)
        const staggerDelay = 0.1 * (index + 1)
        
        return (
          <CinematicReveal
            key={index}
            pattern="wipe-up"
            delay={staggerDelay}
            duration={0.6}
            easing="spring"
          >
            <motion.div
              style={{
                opacity: lineOpacities[index],
                transform: `translateZ(${depth * 30}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <p 
                className="font-poem text-text-secondary"
                style={{
                  // Fade opacity for background layers
                  opacity: Math.max(0.4, 1 - index * 0.15),
                  // Subtle blur for depth layers
                  filter: enableBlur ? `blur(${Math.abs(depth) * 2}px)` : undefined,
                  // Ambient glow with bhav color
                  textShadow: index < 2 ? `0 0 15px ${bhavColor.replace('0.3', '0.1')}` : undefined,
                  // Enhanced typography
                  fontSize: 'var(--font-size-poem)',
                  lineHeight: 'var(--line-height-poem)',
                  letterSpacing: 'var(--letter-spacing-devanagari)',
                  wordSpacing: 'clamp(0.05em, 0.03em + 0.02vw, 0.08em)',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {line}
              </p>
            </motion.div>
          </CinematicReveal>
        )
      })}
      
      {/* Atmospheric depth glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, ${bhavColor.replace('0.3', '0.1')} 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}

export default PoemPreview3D
