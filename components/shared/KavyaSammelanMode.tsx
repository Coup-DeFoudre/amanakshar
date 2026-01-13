'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KavyaSammelanModeProps {
  isOpen: boolean
  onClose: () => void
  title: string
  text: string
}

export function KavyaSammelanMode({ isOpen, onClose, title, text }: KavyaSammelanModeProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(1) // 1 = slow, 2 = medium, 3 = fast
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  
  const lines = text.split('\n')
  
  // Auto-scroll logic
  const scroll = useCallback(() => {
    if (!containerRef.current || isPaused) return
    
    const speed = scrollSpeed * 0.5
    containerRef.current.scrollTop += speed
    
    // Check if reached bottom
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    if (scrollTop + clientHeight >= scrollHeight) {
      // Reached end, pause
      setIsPaused(true)
    } else {
      animationRef.current = requestAnimationFrame(scroll)
    }
  }, [isPaused, scrollSpeed])
  
  useEffect(() => {
    if (isOpen && !isPaused) {
      animationRef.current = requestAnimationFrame(scroll)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isOpen, isPaused, scroll])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case ' ':
        case 'Space':
          e.preventDefault()
          setIsPaused(p => !p)
          break
        case 'Escape':
          onClose()
          break
        case 'ArrowUp':
          e.preventDefault()
          setScrollSpeed(s => Math.max(1, s - 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setScrollSpeed(s => Math.min(3, s + 1))
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
  
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Content */}
          <div
            ref={containerRef}
            className="h-full overflow-y-auto px-6 py-20 scroll-smooth"
            onClick={() => setIsPaused(p => !p)}
          >
            <div className="max-w-3xl mx-auto">
              {/* Title */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white text-center mb-16">
                {title}
              </h1>
              
              {/* Poem Lines */}
              <div className="space-y-6">
                {lines.map((line, index) => {
                  if (line.trim() === '') {
                    return <div key={index} className="h-12" />
                  }
                  
                  return (
                    <p
                      key={index}
                      className="font-poem text-3xl sm:text-4xl md:text-5xl text-white leading-relaxed text-center"
                    >
                      {line}
                    </p>
                  )
                })}
              </div>
              
              {/* End marker */}
              <div className="text-center py-20">
                <span className="text-white/30 text-2xl">॥</span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center justify-center gap-6 font-ui text-white/60">
              {/* Pause/Play */}
              <button
                onClick={() => setIsPaused(p => !p)}
                className="hover:text-white transition-colors"
              >
                {isPaused ? '▶ चलाएं' : '⏸ रोकें'}
              </button>
              
              {/* Speed */}
              <div className="flex items-center gap-2">
                <span>गति:</span>
                {[1, 2, 3].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setScrollSpeed(speed)}
                    className={`w-6 h-6 rounded-full border ${
                      scrollSpeed === speed 
                        ? 'border-white bg-white/20' 
                        : 'border-white/30 hover:border-white/60'
                    } transition-colors`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
              
              {/* Close */}
              <button
                onClick={onClose}
                className="hover:text-white transition-colors"
              >
                ✕ बंद करें
              </button>
            </div>
            
            {/* Keyboard hints */}
            <p className="text-center text-white/30 text-xs mt-2">
              Space: रोकें/चलाएं | ↑↓: गति | Esc: बंद
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

