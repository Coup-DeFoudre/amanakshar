'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  tiltAmount?: number
  disabled?: boolean
}

export function TiltCard({
  children,
  className = '',
  glowColor = 'rgba(212, 168, 85, 0.15)',
  tiltAmount = 15,
  disabled = false,
}: TiltCardProps) {
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
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Softer spring for mobile
  // Smoother tilt transitions with spring damping of 25
  const springConfig = isMobile 
    ? { stiffness: 200, damping: 25 }
    : { stiffness: 300, damping: 25 }
  
  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)
  
  // Reduced tilt amount for mobile
  const mobileTiltAmount = tiltAmount * 0.5
  const effectiveTiltAmount = isMobile ? mobileTiltAmount : tiltAmount
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [effectiveTiltAmount, -effectiveTiltAmount])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-effectiveTiltAmount, effectiveTiltAmount])
  
  // Motion values for spotlight
  const spotlightX = useMotionValue(50)
  const spotlightY = useMotionValue(50)
  
  // Create motion template for shine effect
  const shineBackground = useMotionTemplate`radial-gradient(
    circle 300px at ${spotlightX}% ${spotlightY}%, 
    ${glowColor}, 
    transparent 50%
  )`
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion || isMobile) return
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPercent = mouseX / width - 0.5
    const yPercent = mouseY / height - 0.5
    
    x.set(xPercent)
    y.set(yPercent)
    
    // Shine effect that follows mouse
    spotlightX.set((mouseX / width) * 100)
    spotlightY.set((mouseY / height) * 100)
  }
  
  // Touch handlers for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return
    if (!ref.current || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const touchX = touch.clientX - rect.left
    const touchY = touch.clientY - rect.top
    
    // Only apply tilt if touch is within the element
    if (touchX >= 0 && touchX <= width && touchY >= 0 && touchY <= height) {
      const xPercent = (touchX / width - 0.5) * 0.5 // Reduced sensitivity for touch
      const yPercent = (touchY / height - 0.5) * 0.5
      
      x.set(xPercent)
      y.set(yPercent)
    }
  }
  
  const handleTouchStart = () => {
    if (!disabled && !prefersReducedMotion) {
      setIsHovered(true)
    }
  }
  
  const handleTouchEnd = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }
  
  // Disable 3D effects for reduced motion
  if (prefersReducedMotion || disabled) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    )
  }
  
  return (
    <motion.div
      ref={ref}
      className={`relative touch-manipulation ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        rotateX: isMobile && !isHovered ? 0 : rotateX,
        rotateY: isMobile && !isHovered ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        // Perspective depth - increased z-translation on hover
        translateZ: isHovered ? 20 : 0,
        transition: 'translateZ 0.3s ease',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shine effect that follows mouse position */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
          style={{
            background: shineBackground,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      
      {/* Edge highlighting that intensifies near mouse */}
      {!isMobile && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${glowColor.replace('0.15', '0.4')}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div
        style={{
          transform: isMobile ? 'none' : 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
