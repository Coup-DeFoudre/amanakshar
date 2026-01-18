'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  disabled?: boolean
  threshold?: number
  maxPull?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  maxPull = 150,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  
  const pullDistance = useMotionValue(0)
  const pullProgress = useTransform(pullDistance, [0, threshold], [0, 1])
  const pullRotation = useTransform(pullDistance, [0, threshold], [0, 180])
  
  // Calculate opacity for the refresh indicator
  const indicatorOpacity = useTransform(pullDistance, [0, threshold / 2], [0, 1])
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    
    // Only activate if at top of scroll
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return
    
    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current
    
    if (diff > 0) {
      // Apply resistance - pulling gets harder the further you go
      const resistance = 1 - Math.min(diff / maxPull, 1) * 0.5
      const adjustedDiff = Math.min(diff * resistance, maxPull)
      pullDistance.set(adjustedDiff)
      
      // Prevent default scrolling while pulling
      if (adjustedDiff > 10) {
        e.preventDefault()
      }
    }
  }
  
  const handleTouchEnd = async () => {
    if (!isPulling || disabled) return
    
    const distance = pullDistance.get()
    
    if (distance >= threshold && !isRefreshing) {
      // Trigger refresh
      setIsRefreshing(true)
      pullDistance.set(threshold)
      
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        pullDistance.set(0)
      }
    } else {
      // Snap back
      pullDistance.set(0)
    }
    
    setIsPulling(false)
  }
  
  // Reset on scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleScroll = () => {
      if (container.scrollTop > 0 && isPulling) {
        setIsPulling(false)
        pullDistance.set(0)
      }
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isPulling, pullDistance])
  
  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-10"
            style={{ 
              height: pullDistance,
              opacity: indicatorOpacity,
            }}
            exit={{ opacity: 0, height: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              style={{ y: useTransform(pullDistance, [0, threshold], [-20, 0]) }}
            >
              {isRefreshing ? (
                // Loading spinner
                <motion.div
                  className="w-6 h-6 border-2 border-accent-gold/30 border-t-accent-gold rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                // Pull arrow
                <motion.svg
                  className="w-6 h-6 text-accent-gold"
                  style={{ rotate: pullRotation }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </motion.svg>
              )}
              
              <motion.span
                className="font-ui text-xs text-text-muted"
                style={{ opacity: pullProgress }}
              >
                {isRefreshing 
                  ? 'रिफ्रेश हो रहा है...' 
                  : pullDistance.get() >= threshold 
                    ? 'छोड़ें' 
                    : 'खींचें'
                }
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <motion.div style={{ y: isRefreshing ? threshold : pullDistance }}>
        {children}
      </motion.div>
    </div>
  )
}
