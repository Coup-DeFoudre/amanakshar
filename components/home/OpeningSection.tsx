'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface OpeningSectionProps {
  primaryTagline: string
  secondaryCouplet: {
    line1: string
    line2: string
  }
  poetName: string
}

export function OpeningSection({ 
  primaryTagline, 
  secondaryCouplet, 
  poetName 
}: OpeningSectionProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCouplet, setShowCouplet] = useState(false)
  const [typewriterComplete, setTypewriterComplete] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  // Typewriter effect for primary tagline
  useEffect(() => {
    let currentIndex = 0
    const text = primaryTagline
    
    // Initial delay before typing starts
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
          setTypewriterComplete(true)
          // Show couplet after tagline completes
          setTimeout(() => setShowCouplet(true), 600)
        }
      }, 80) // Typing speed
      
      return () => clearInterval(interval)
    }, 800)
    
    return () => clearTimeout(startDelay)
  }, [primaryTagline])
  
  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        {/* Poet Name - Subtle breathing animation */}
        <motion.p
          className="font-ui text-text-muted text-sm tracking-[0.3em] uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <motion.span
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            {poetName}
          </motion.span>
        </motion.p>
        
        {/* Primary Tagline with Typewriter Effect */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary leading-tight">
            {displayedText}
            {!typewriterComplete && (
              <motion.span
                className="inline-block w-[3px] h-[1em] bg-accent-gold ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </h1>
        </div>
        
        {/* Secondary Couplet - Fades in after typewriter */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={showCouplet ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <p className="font-poem text-xl sm:text-2xl text-text-secondary leading-relaxed mb-2">
            {secondaryCouplet.line1}
          </p>
          <p className="font-poem text-xl sm:text-2xl text-text-secondary leading-relaxed">
            {secondaryCouplet.line2}
          </p>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showCouplet ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-text-muted"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-ui text-xs tracking-wider">स्क्रॉल करें</span>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Decorative element */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-divider-strong to-transparent"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </section>
  )
}

