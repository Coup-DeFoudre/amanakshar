'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence, useMotionTemplate } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { springPresets } from '@/lib/animation-presets'

export interface FluidCardProps {
  children: React.ReactNode
  /** Morph intensity on hover (0-1) */
  morphIntensity?: number
  /** Glow color */
  glowColor?: string
  /** Enable magnetic hover effect */
  enableMagnetic?: boolean
  /** Magnetic strength */
  magneticStrength?: number
  /** Custom class name */
  className?: string
  /** Enable ripple effect on click */
  enableRipple?: boolean
  /** On click handler */
  onClick?: () => void
}

interface RippleState {
  x: number
  y: number
  id: number
}

export function FluidCard({
  children,
  morphIntensity = 0.5,
  glowColor = 'rgba(212, 168, 85, 0.3)',
  enableMagnetic = true,
  magneticStrength = 0.15,
  className = '',
  enableRipple = true,
  onClick,
}: FluidCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [ripples, setRipples] = useState<RippleState[]>([])
  const rippleIdRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  
  // Detect mobile/touch device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Motion values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const borderRadius = useMotionValue(8)
  
  // Spring configurations using animation presets
  const springConfig = springPresets.bouncy
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  const scaleSpring = useSpring(scale, springConfig)
  const borderRadiusSpring = useSpring(borderRadius, springConfig)
  
  // Spotlight position
  const spotlightX = useMotionValue(50)
  const spotlightY = useMotionValue(50)
  
  // Create motion template for spotlight gradient
  const spotlightBackground = useMotionTemplate`radial-gradient(
    ellipse at ${spotlightX}% ${spotlightY}%,
    ${glowColor},
    transparent 60%
  )`
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion || isMobile) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    // Magnetic pull effect
    if (enableMagnetic) {
      x.set(distanceX * magneticStrength)
      y.set(distanceY * magneticStrength)
    }
    
    // Spotlight position
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    spotlightX.set((mouseX / rect.width) * 100)
    spotlightY.set((mouseY / rect.height) * 100)
  }
  
  const handleMouseEnter = () => {
    if (isMobile || prefersReducedMotion) return
    setIsHovered(true)
    // Enhanced scale animation - grow to 1.02 with spring
    scale.set(1.02)
    // Morphing border radius on hover
    borderRadius.set(8 + morphIntensity * 12)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    scale.set(1)
    borderRadius.set(8)
    spotlightX.set(50)
    spotlightY.set(50)
  }
  
  // Ripple effect on click
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !enableRipple || prefersReducedMotion) {
      onClick?.()
      return
    }
    
    const rect = ref.current.getBoundingClientRect()
    const rippleX = e.clientX - rect.left
    const rippleY = e.clientY - rect.top
    
    const newRipple: RippleState = {
      x: rippleX,
      y: rippleY,
      id: rippleIdRef.current++,
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
    
    onClick?.()
  }, [enableRipple, onClick, prefersReducedMotion])
  
  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    setIsHovered(true)
    
    // Add ripple at touch position
    if (enableRipple && ref.current && e.touches.length === 1) {
      const touch = e.touches[0]
      const rect = ref.current.getBoundingClientRect()
      const rippleX = touch.clientX - rect.left
      const rippleY = touch.clientY - rect.top
      
      const newRipple: RippleState = {
        x: rippleX,
        y: rippleY,
        id: rippleIdRef.current++,
      }
      
      setRipples(prev => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }
  }
  
  const handleTouchEnd = () => {
    setIsHovered(false)
  }
  
  // Disable effects for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-lg ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {children}
      </div>
    )
  }
  
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden touch-manipulation ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        x: isMobile ? 0 : xSpring,
        y: isMobile ? 0 : ySpring,
        scale: isMobile ? 1 : scaleSpring,
        borderRadius: borderRadiusSpring,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Fluid glow layer that expands on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: spotlightBackground,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Border glow with background color shift */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        animate={{
          boxShadow: isHovered
            ? `0 0 40px ${glowColor}, inset 0 0 0 1px ${glowColor.replace('0.3', '0.5')}`
            : `0 0 0px transparent, inset 0 0 0 1px ${glowColor.replace('0.3', '0.15')}`,
          filter: isHovered ? 'hue-rotate(5deg)' : 'hue-rotate(0deg)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background: `radial-gradient(circle, ${glowColor.replace('0.3', '0.4')}, transparent 70%)`,
            }}
            initial={{
              width: 0,
              height: 0,
              x: 0,
              y: 0,
              opacity: 0.8,
            }}
            animate={{
              width: 300,
              height: 300,
              x: -150,
              y: -150,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      
      {/* Content with reveal animation */}
      <motion.div
        className="relative z-10"
        animate={{
          y: isHovered ? -2 : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default FluidCard
