'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  disabled?: boolean
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(212, 168, 85, 0.1)',
  disabled = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
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
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion || isMobile) return
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }
  
  // Touch handler for mobile - follows finger
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return
    if (!ref.current || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    
    setPosition({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
  }
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return
    if (!ref.current || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    const rect = ref.current.getBoundingClientRect()
    
    setPosition({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
    setIsHovered(true)
  }
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
      }
    },
  }
  
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden touch-manipulation ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovered(false)}
      onTouchCancel={() => setIsHovered(false)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Spotlight gradient - simplified for mobile */}
      {!disabled && !prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: isMobile
              ? `radial-gradient(200px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`
              : `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}
      
      {/* Border glow on hover/touch */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(212, 168, 85, ${isHovered ? 0.3 : 0.1})`,
          opacity: 1,
        }}
      />
      
      {/* Touch feedback ripple for mobile */}
      {isMobile && isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute pointer-events-none rounded-full bg-accent-gold/10"
          initial={{ 
            width: 0, 
            height: 0, 
            x: position.x, 
            y: position.y,
            opacity: 0.5 
          }}
          animate={{ 
            width: 100, 
            height: 100, 
            x: position.x - 50, 
            y: position.y - 50,
            opacity: 0 
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}
      
      {children}
    </motion.div>
  )
}
