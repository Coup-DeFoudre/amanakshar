'use client'

import { useRef, useMemo } from 'react'
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  MotionValue,
  Variants,
} from 'framer-motion'
import { CinematicReveal, LayeredReveal, type RevealPattern } from '@/components/animations/CinematicReveal'
import { ParallaxText, ParallaxContainer } from '@/components/animations/ParallaxText'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { 
  springPresets, 
  staggerPresets, 
  durationPresets,
  easingPresets,
} from '@/lib/animation-presets'

// ============================================================================
// Types
// ============================================================================

export interface TextLayer {
  /** Content to display */
  content: string | React.ReactNode
  /** Depth for parallax effect (-1 to 1: negative = slower/background, positive = faster/foreground) */
  depth: number
  /** Reveal pattern for cinematic entrance */
  revealPattern?: RevealPattern
  /** Delay before reveal starts (in seconds) */
  delay?: number
  /** Custom className for styling */
  className?: string
  /** Whether to apply blur based on depth */
  enableBlur?: boolean
  /** Whether to apply opacity changes based on scroll */
  enableOpacityFade?: boolean
}

export interface HeroOverlayProps {
  /** Background layer - decorative Hindi calligraphy with low opacity */
  backgroundLayer?: TextLayer
  /** Mid layer - primary tagline with main reveal */
  midLayer?: TextLayer
  /** Foreground layer - secondary couplet */
  foregroundLayer?: TextLayer
  /** Custom layers array for advanced usage */
  customLayers?: TextLayer[]
  /** Base delay before any animations start (in seconds) */
  baseDelay?: number
  /** Scroll progress motion value (0-1) */
  scrollProgress?: MotionValue<number>
  /** Callback when all reveals are complete */
  onRevealComplete?: () => void
  /** Additional className */
  className?: string
}

// ============================================================================
// Layer Component
// ============================================================================

interface DepthLayerProps {
  layer: TextLayer
  index: number
  scrollProgress: MotionValue<number>
  baseDelay: number
  reducedMotion: boolean
  onRevealComplete?: () => void
}

function DepthLayer({
  layer,
  index,
  scrollProgress,
  baseDelay,
  reducedMotion,
  onRevealComplete,
}: DepthLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  
  // Calculate depth-based transforms
  const depthMultiplier = layer.depth * 100
  
  // Parallax Y movement based on scroll
  const y = useTransform(
    scrollProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, depthMultiplier * 0.5]
  )
  
  // Smooth spring physics
  const smoothY = useSpring(y, {
    stiffness: springPresets.gentle.stiffness,
    damping: springPresets.gentle.damping,
  })
  
  // Opacity based on scroll progress
  const opacity = useTransform(
    scrollProgress,
    [0, 0.3, 0.7, 1],
    layer.enableOpacityFade && !reducedMotion
      ? [0.8, 1, 1, 0.3]
      : [1, 1, 1, 1]
  )
  
  // Blur based on depth and scroll
  const blurAmount = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    layer.enableBlur && !reducedMotion
      ? [Math.abs(layer.depth) * 3, 0, Math.abs(layer.depth) * 4]
      : [0, 0, 0]
  )
  
  // Calculate z-index based on depth
  const zIndex = Math.round(10 + layer.depth * 5)
  
  // Total delay for this layer
  const totalDelay = baseDelay + (layer.delay ?? index * staggerPresets.dramatic)
  
  // Reduced motion: simple fade
  if (reducedMotion) {
    return (
      <motion.div
        ref={layerRef}
        className={`hero-layer ${layer.className || ''}`}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: totalDelay }}
      >
        {layer.content}
      </motion.div>
    )
  }
  
  return (
    <motion.div
      ref={layerRef}
      className={`hero-layer ${layer.className || ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
        y: smoothY,
        opacity,
        filter: layer.enableBlur ? `blur(${blurAmount}px)` : undefined,
        willChange: 'transform, opacity, filter',
      }}
    >
      <CinematicReveal
        pattern={layer.revealPattern || 'wipe-up'}
        delay={totalDelay}
        duration={durationPresets.cinematic}
        easing="easeOut"
        revealFrom="center"
        once
        className="w-full"
      >
        {layer.content}
      </CinematicReveal>
    </motion.div>
  )
}

// ============================================================================
// Decorative Background Calligraphy
// ============================================================================

interface DecorativeCalligraphyProps {
  scrollProgress: MotionValue<number>
  reducedMotion: boolean
}

function DecorativeCalligraphy({ scrollProgress, reducedMotion }: DecorativeCalligraphyProps) {
  const opacity = useTransform(
    scrollProgress,
    [0, 0.3, 0.7, 1],
    [0.08, 0.12, 0.08, 0]
  )
  
  const scale = useTransform(
    scrollProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1, 1.1]
  )
  
  const rotate = useTransform(
    scrollProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-2, 2]
  )
  
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      style={{ opacity, scale, rotate }}
    >
      <div className="font-hindi text-[20vw] sm:text-[15vw] md:text-[12vw] text-accent-gold/20 whitespace-nowrap leading-none tracking-tight">
        काव्य संग्रह
      </div>
    </motion.div>
  )
}

// ============================================================================
// Floating Ink Particles (CSS-based for performance)
// ============================================================================

function FloatingInkParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    })),
    []
  )
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-accent-gold/30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(10px) scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-50px) translateX(-5px) scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-20px) translateX(-15px) scale(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================
// Light Rays Effect
// ============================================================================

interface LightRaysProps {
  scrollProgress: MotionValue<number>
  reducedMotion: boolean
}

function LightRays({ scrollProgress, reducedMotion }: LightRaysProps) {
  const opacity = useTransform(
    scrollProgress,
    [0, 0.2, 0.6, 1],
    [0.3, 0.5, 0.3, 0]
  )
  
  const rotation = useTransform(
    scrollProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 15]
  )
  
  if (reducedMotion) return null
  
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
        style={{ rotate: rotation }}
      >
        <defs>
          <linearGradient id="ray-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--accent-gold)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <motion.path
            key={angle}
            d="M200 200 L200 0 L210 0 L200 200"
            fill="url(#ray-gradient)"
            style={{
              transformOrigin: '200px 200px',
              rotate: angle,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.svg>
    </motion.div>
  )
}

// ============================================================================
// Main HeroOverlay Component
// ============================================================================

export function HeroOverlay({
  backgroundLayer,
  midLayer,
  foregroundLayer,
  customLayers,
  baseDelay = 1.5,
  scrollProgress: externalScrollProgress,
  onRevealComplete,
  className = '',
}: HeroOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  // Internal scroll progress if not provided externally
  const { scrollYProgress: internalScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  
  const scrollProgress = externalScrollProgress || internalScrollProgress
  
  // Build layers array from props
  const layers = useMemo(() => {
    if (customLayers && customLayers.length > 0) {
      return customLayers
    }
    
    const result: TextLayer[] = []
    
    if (backgroundLayer) {
      result.push({
        ...backgroundLayer,
        depth: backgroundLayer.depth ?? -0.5,
        revealPattern: backgroundLayer.revealPattern ?? 'circle',
        enableBlur: backgroundLayer.enableBlur ?? true,
        enableOpacityFade: backgroundLayer.enableOpacityFade ?? true,
      })
    }
    
    if (midLayer) {
      result.push({
        ...midLayer,
        depth: midLayer.depth ?? 0,
        revealPattern: midLayer.revealPattern ?? 'circle',
        delay: midLayer.delay ?? 0.3,
      })
    }
    
    if (foregroundLayer) {
      result.push({
        ...foregroundLayer,
        depth: foregroundLayer.depth ?? 0.3,
        revealPattern: foregroundLayer.revealPattern ?? 'wipe-up',
        delay: foregroundLayer.delay ?? 0.6,
      })
    }
    
    return result
  }, [backgroundLayer, midLayer, foregroundLayer, customLayers])
  
  return (
    <div
      ref={containerRef}
      className={`hero-overlay relative w-full h-full ${className}`}
    >
      {/* Decorative background calligraphy */}
      <DecorativeCalligraphy 
        scrollProgress={scrollProgress}
        reducedMotion={prefersReducedMotion}
      />
      
      {/* Light rays */}
      <LightRays 
        scrollProgress={scrollProgress}
        reducedMotion={prefersReducedMotion}
      />
      
      {/* Floating ink particles */}
      {!prefersReducedMotion && <FloatingInkParticles />}
      
      {/* Depth layers */}
      {layers.map((layer, index) => (
        <DepthLayer
          key={index}
          layer={layer}
          index={index}
          scrollProgress={scrollProgress}
          baseDelay={baseDelay}
          reducedMotion={prefersReducedMotion}
          onRevealComplete={index === layers.length - 1 ? onRevealComplete : undefined}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Pre-built Layer Presets
// ============================================================================

export const HeroLayerPresets = {
  /** Background decorative layer preset */
  decorativeBackground: (content: string | React.ReactNode): TextLayer => ({
    content,
    depth: -0.5,
    revealPattern: 'circle',
    delay: 0,
    enableBlur: true,
    enableOpacityFade: true,
    className: 'text-text-muted/20',
  }),
  
  /** Primary tagline layer preset */
  primaryTagline: (content: string | React.ReactNode): TextLayer => ({
    content,
    depth: 0,
    revealPattern: 'circle',
    delay: 0.3,
    className: 'text-text-primary',
  }),
  
  /** Secondary couplet layer preset */
  secondaryCouplet: (content: string | React.ReactNode): TextLayer => ({
    content,
    depth: 0.3,
    revealPattern: 'wipe-up',
    delay: 0.6,
    className: 'text-text-secondary',
  }),
  
  /** Poet name layer preset */
  poetName: (content: string | React.ReactNode): TextLayer => ({
    content,
    depth: 0.2,
    revealPattern: 'wipe-up',
    delay: 0.9,
    className: 'text-text-muted',
  }),
}

export default HeroOverlay
