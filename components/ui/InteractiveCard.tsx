'use client'

import { useState, useRef, ReactNode, MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  variant?: 'default' | 'glow' | 'elevated'
  enableTilt?: boolean
  enableShine?: boolean
}

/**
 * InteractiveCard - Card with micro-interactions
 * 
 * Features:
 * - 3D tilt effect on hover
 * - Shine/glare effect following mouse
 * - Subtle lift on hover
 * - Glow border animation
 * - Ripple on click
 */
export function InteractiveCard({
  children,
  className = '',
  onClick,
  href,
  variant = 'default',
  enableTilt = true,
  enableShine = true,
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    if (enableTilt) {
      const tiltX = ((y - centerY) / centerY) * -8
      const tiltY = ((x - centerX) / centerX) * 8
      setTilt({ x: tiltX, y: tiltY })
    }
    
    if (enableShine) {
      const shineX = (x / rect.width) * 100
      const shineY = (y / rect.height) * 100
      setShine({ x: shineX, y: shineY })
    }
  }
  
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setShine({ x: 50, y: 50 })
    setIsHovered(false)
  }
  
  const variantStyles = {
    default: 'bg-bg-elevated border border-divider',
    glow: 'bg-bg-elevated border border-accent-gold/20 shadow-[0_0_20px_rgba(212,168,85,0.05)]',
    elevated: 'bg-bg-secondary border border-divider-strong shadow-lg',
  }
  
  const Component = href ? motion.a : motion.div
  
  return (
    <Component
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={cardRef as any}
      className={cn(
        'relative overflow-hidden rounded-xl cursor-pointer',
        'transition-shadow duration-300',
        variantStyles[variant],
        className
      )}
      href={href}
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMouseMove={handleMouseMove as any}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: enableTilt 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
      }}
      whileHover={{
        y: -4,
        boxShadow: variant === 'glow'
          ? '0 0 40px rgba(212, 168, 85, 0.15), 0 20px 40px rgba(0, 0, 0, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
      whileTap={{ scale: 0.98 }}
      data-cursor-hover
    >
      {/* Shine overlay */}
      {enableShine && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(
              circle at ${shine.x}% ${shine.y}%,
              rgba(212, 168, 85, ${isHovered ? 0.15 : 0}) 0%,
              transparent 50%
            )`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Glow border on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: '1px solid transparent',
          backgroundImage: isHovered
            ? 'linear-gradient(var(--bg-elevated), var(--bg-elevated)), linear-gradient(135deg, rgba(212, 168, 85, 0.5), transparent, rgba(212, 168, 85, 0.5))'
            : 'none',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </Component>
  )
}

/**
 * HoverGlowCard - Simple card with glow on hover
 */
export function HoverGlowCard({
  children,
  className = '',
  glowColor = 'rgba(212, 168, 85, 0.3)',
}: {
  children: ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-bg-elevated border border-divider',
        'transition-all duration-300',
        className
      )}
      whileHover={{
        borderColor: 'rgba(212, 168, 85, 0.3)',
        boxShadow: `0 0 30px ${glowColor}`,
      }}
    >
      {children}
    </motion.div>
  )
}
