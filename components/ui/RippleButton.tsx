'use client'

import { useState, useRef, ReactNode, MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RippleButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

/**
 * RippleButton - Button with ink ripple effect on click
 * 
 * Features:
 * - Ink ripple animation from click point
 * - Multiple variant styles
 * - Hover glow effect
 * - Magnetic attraction on hover (optional)
 * - Supports links and buttons
 */
export function RippleButton({
  children,
  className = '',
  onClick,
  disabled = false,
  variant = 'default',
  size = 'md',
  href,
  target,
  type = 'button',
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  
  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) return
    
    const button = buttonRef.current
    if (!button) return
    
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2
    
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation - extended to 0.7s for smoother dissipation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 700)
    
    onClick?.()
  }
  
  const baseStyles = cn(
    'relative overflow-hidden inline-flex items-center justify-center',
    'font-medium transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
    'disabled:opacity-50 disabled:pointer-events-none',
    'touch-manipulation',
    {
      // Sizes
      'px-4 py-2 text-sm rounded-md': size === 'sm',
      'px-6 py-3 text-base rounded-lg': size === 'md',
      'px-8 py-4 text-lg rounded-xl': size === 'lg',
      // Variants
      'bg-accent-gold text-bg-primary hover:bg-accent-warm': variant === 'default',
      'border border-accent-gold text-accent-gold hover:bg-accent-gold/10': variant === 'outline',
      'text-text-secondary hover:text-accent-gold hover:bg-accent-gold/5': variant === 'ghost',
      'bg-accent-gold text-bg-primary shadow-[0_0_20px_rgba(212,168,85,0.3)] hover:shadow-[0_0_30px_rgba(212,168,85,0.5)]': variant === 'glow',
    },
    className
  )
  
  const Component = href ? motion.a : motion.button
  
  return (
    <Component
      ref={buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      className={baseStyles}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      href={href}
      target={target}
      type={href ? undefined : type}
      data-cursor-hover
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Hover glow background */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: 'inherit' }}
        animate={{
          background: isHovered 
            ? 'radial-gradient(circle at center, rgba(212, 168, 85, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, transparent 0%, transparent 100%)',
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              background: variant === 'default' || variant === 'glow'
                ? 'radial-gradient(circle, rgba(10, 9, 8, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(212, 168, 85, 0.3) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Hover scale effect with border glow */}
      <motion.span
        className="absolute inset-0 pointer-events-none border border-transparent"
        style={{ borderRadius: 'inherit' }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          borderColor: isHovered ? 'rgba(212, 168, 85, 0.3)' : 'transparent',
        }}
        transition={{ duration: 0.3 }}
      />
    </Component>
  )
}

/**
 * IconButton - Circular button with ripple effect for icons
 */
export function IconButton({
  children,
  className = '',
  onClick,
  disabled = false,
  size = 'md',
  label,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label: string
}) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const button = buttonRef.current
    if (!button) return
    
    const rect = button.getBoundingClientRect()
    const x = rect.width / 2
    const y = rect.height / 2
    const size = Math.max(rect.width, rect.height) * 2
    
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
    
    onClick?.()
  }
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }
  
  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center rounded-full',
        'text-text-secondary hover:text-accent-gold',
        'hover:bg-accent-gold/10 transition-colors duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
        'disabled:opacity-50 disabled:pointer-events-none',
        'touch-manipulation touch-target',
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      data-cursor-hover
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none bg-accent-gold/30"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
