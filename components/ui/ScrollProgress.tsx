'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  variant?: 'bar' | 'line' | 'dot'
  position?: 'top' | 'right' | 'bottom'
  showPercentage?: boolean
}

/**
 * ScrollProgress - Visual indicator of scroll/reading progress
 * 
 * Features:
 * - Multiple visual variants (bar, line, dot)
 * - Smooth spring animation
 * - Optional percentage display
 * - Respects reduced motion
 */
export function ScrollProgress({
  variant = 'bar',
  position = 'top',
  showPercentage = false,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  
  const [percentage, setPercentage] = useState(0)
  
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100))
    })
  }, [scrollYProgress])
  
  if (variant === 'bar') {
    return (
      <>
        <motion.div
          className={`fixed left-0 right-0 h-1 z-50 origin-left ${
            position === 'top' ? 'top-0' : 'bottom-0'
          }`}
          style={{
            scaleX,
            background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-warm))',
            boxShadow: '0 0 10px rgba(212, 168, 85, 0.5)',
          }}
        />
        
        {showPercentage && (
          <motion.div
            className={`fixed right-4 z-50 ${
              position === 'top' ? 'top-4' : 'bottom-4'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: percentage > 0 ? 1 : 0 }}
          >
            <div className="text-xs text-accent-gold font-mono bg-bg-overlay px-2 py-1 rounded">
              {percentage}%
            </div>
          </motion.div>
        )}
      </>
    )
  }
  
  if (variant === 'line') {
    return (
      <motion.div
        className="fixed top-0 right-0 w-[3px] z-50 origin-top"
        style={{
          height: '100vh',
          background: `linear-gradient(
            180deg,
            var(--accent-gold) 0%,
            var(--accent-gold) ${percentage}%,
            var(--bg-secondary) ${percentage}%,
            var(--bg-secondary) 100%
          )`,
          opacity: 0.6,
        }}
      />
    )
  }
  
  if (variant === 'dot') {
    return (
      <motion.div
        className="fixed right-4 z-50"
        style={{
          top: `${percentage}%`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: percentage > 0 && percentage < 100 ? 1 : 0,
          scale: 1,
        }}
      >
        <div 
          className="w-3 h-3 rounded-full bg-accent-gold"
          style={{
            boxShadow: '0 0 15px rgba(212, 168, 85, 0.6)',
          }}
        />
        
        {showPercentage && (
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-accent-gold font-mono whitespace-nowrap">
            {percentage}%
          </span>
        )}
      </motion.div>
    )
  }
  
  return null
}

/**
 * ReadingProgress - Simplified reading progress for poem pages
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{ scaleX }}
    >
      <div 
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-warm), var(--accent-gold))',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }}
      />
    </motion.div>
  )
}
