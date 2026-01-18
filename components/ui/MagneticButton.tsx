'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
  target?: string
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
  target,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 20 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    
    // Increased magnetic strength from 0.3 to 0.35
    x.set(distanceX * 0.35)
    y.set(distanceY * 0.35)
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
    x.set(0)
    y.set(0)
    scale.set(1)
  }
  
  const handleMouseEnter = () => {
    setIsHovered(true)
    // Subtle scale pulse on hover
    scale.set(1.02)
  }
  
  const handleMouseDown = () => {
    setIsPressed(true)
    // Haptic feedback simulation - brief scale down
    scale.set(0.98)
  }
  
  const handleMouseUp = () => {
    setIsPressed(false)
    scale.set(isHovered ? 1.02 : 1)
  }
  
  const Component = href ? motion.a : motion.button
  
  return (
    <Component
      ref={ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      href={href}
      target={target}
      style={{
        x: xSpring,
        y: ySpring,
        scale: scaleSpring,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover with animated intensity */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered 
            ? '0 0 30px rgba(212, 168, 85, 0.6)' 
            : '0 0 20px rgba(212, 168, 85, 0.3)',
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      
      {children}
    </Component>
  )
}
