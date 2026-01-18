'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

export interface MagneticCardProps {
  children: React.ReactNode
  /** Magnetic pull strength (0-1) */
  strength?: number
  /** Glow color on hover */
  glowColor?: string
  /** 3D tilt intensity in degrees */
  tiltIntensity?: number
  /** Custom class name */
  className?: string
  /** Enable spotlight effect following cursor */
  enableSpotlight?: boolean
  /** Enable depth shadow */
  enableDepthShadow?: boolean
  /** Card padding */
  padding?: string
  /** On click handler */
  onClick?: () => void
}

export function MagneticCard({
  children,
  strength = 0.3,
  glowColor = 'rgba(212, 168, 85, 0.3)',
  tiltIntensity = 10,
  className = '',
  enableSpotlight = true,
  enableDepthShadow = true,
  padding = 'p-4',
  onClick,
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
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
  
  // Motion values for magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Motion values for tilt effect
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  
  // Motion values for spotlight position
  const spotlightX = useMotionValue(50)
  const spotlightY = useMotionValue(50)
  
  // Create spotlight background gradient
  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, ${glowColor}, transparent 60%)`
  
  // Spring configurations - smooth return animation
  const springConfig = { stiffness: 150, damping: 20 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  const rotateXSpring = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const rotateYSpring = useSpring(rotateY, { stiffness: 150, damping: 20 })
  
  // Transform for depth shadow
  const shadowX = useTransform(rotateYSpring, [-tiltIntensity, tiltIntensity], [8, -8])
  const shadowY = useTransform(rotateXSpring, [-tiltIntensity, tiltIntensity], [-8, 8])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion || isMobile) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    // Magnetic pull effect
    x.set(distanceX * strength)
    y.set(distanceY * strength)
    
    // Tilt effect based on mouse position relative to center - increased by 15%
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPercent = (mouseX / rect.width - 0.5) * 2
    const yPercent = (mouseY / rect.height - 0.5) * 2
    
    rotateY.set(xPercent * tiltIntensity * 1.15)
    rotateX.set(-yPercent * tiltIntensity * 1.15)
    
    // Spotlight position
    spotlightX.set((mouseX / rect.width) * 100)
    spotlightY.set((mouseY / rect.height) * 100)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    rotateX.set(0)
    rotateY.set(0)
    spotlightX.set(50)
    spotlightY.set(50)
  }
  
  // Touch handlers for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    const touchX = touch.clientX - rect.left
    const touchY = touch.clientY - rect.top
    
    // Only spotlight effect on mobile (no tilt for better UX)
    if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
      spotlightX.set((touchX / rect.width) * 100)
      spotlightY.set((touchY / rect.height) * 100)
    }
  }
  
  const handleTouchStart = () => {
    if (!prefersReducedMotion) {
      setIsHovered(true)
    }
  }
  
  const handleTouchEnd = () => {
    setIsHovered(false)
    spotlightX.set(50)
    spotlightY.set(50)
  }
  
  // Disable effects for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        className={`relative ${padding} ${className}`}
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
      className={`relative ${padding} touch-manipulation ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX: isMobile ? 0 : rotateXSpring,
        rotateY: isMobile ? 0 : rotateYSpring,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Depth shadow layer */}
      {enableDepthShadow && !isMobile && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none -z-10"
          style={{
            x: shadowX,
            y: shadowY,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      
      {/* Spotlight gradient layer with subtle inner glow */}
      {enableSpotlight && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            background: spotlightBackground,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
      
      {/* Inner glow on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.05), transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${glowColor.replace('0.3', '0.5')}`,
          opacity: isHovered ? 1 : 0.2,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Outer glow on hover */}
      <motion.div
        className="absolute -inset-px rounded-inherit pointer-events-none -z-5"
        style={{
          boxShadow: `0 0 30px ${glowColor}`,
          opacity: isHovered ? 0.5 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Content */}
      <div
        style={{
          transform: isMobile ? 'none' : 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default MagneticCard
