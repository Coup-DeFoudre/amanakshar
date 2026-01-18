'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * PageTransition - Smooth page transitions between routes
 * 
 * Features:
 * - Fade and subtle slide animation
 * - Ink wash effect during transition
 * - Staggered content reveal
 * - Respects reduced motion preferences
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  
  // Reduced motion variants - simple opacity only
  const reducedMotionVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0 },
    },
  }
  
  // Full motion variants with blur, scale, and translate
  const fullMotionVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 1.02,
      filter: 'blur(8px)',
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      filter: 'blur(8px)',
      transition: {
        duration: 0.6,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }
  
  // Use appropriate variants based on motion preference
  const pageVariants = prefersReducedMotion ? reducedMotionVariants : fullMotionVariants
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="page-transition-wrapper"
      >
        {children}
        
        {/* Ink wash overlay during transition - skip for reduced motion */}
        {!prefersReducedMotion && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ 
              scaleY: 0,
              transition: { 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                delay: 0.1
              }
            }}
            exit={{ 
              scaleY: 1,
              transition: { 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1]
              }
            }}
            style={{
              background: 'linear-gradient(180deg, rgba(10, 9, 8, 0.98) 0%, rgba(10, 9, 8, 0.95) 100%)',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * FadeIn - Fade in animation wrapper for content sections
 */
export function FadeIn({ 
  children, 
  delay = 0,
  direction = 'up',
  className = ''
}: { 
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}) {
  const directionOffset = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { y: 0, x: 20 },
    right: { y: 0, x: -20 },
  }
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: 'blur(4px)',
        ...directionOffset[direction],
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.76, 0, 0.24, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerChildren - Stagger animation for child elements
 */
export function StaggerChildren({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}: { 
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerItem - Child element for StaggerChildren
 */
export function StaggerItem({ 
  children,
  className = ''
}: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
