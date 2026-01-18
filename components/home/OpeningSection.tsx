'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage, imageGradients } from '@/components/ui/SafeImage'

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
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  
  // Parallax effect for background image
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']
  )
  
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1, 0]
  )
  
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [1, 1.1]
  )

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Hero Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <SafeImage
          src="https://images.unsplash.com/photo-1516414447565-b14be0adf13e?q=80&w=2073&auto=format&fit=crop"
          alt="Writing desk with old books and pen"
          fill
          className="object-cover"
          priority
          quality={90}
          fallbackGradient={imageGradients.hero}
        />
        {/* Overlay gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      </motion.div>
      
      {/* Main Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content - Left Side */}
          <div className="text-left">
            {/* Poet Name Badge */}
            <motion.div
              className="inline-flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="w-12 h-px bg-accent-gold" />
              <span className="font-ui text-accent-gold text-sm tracking-[0.2em] uppercase">
                {poetName}
              </span>
            </motion.div>
            
            {/* Primary Tagline */}
            <motion.h1
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {primaryTagline}
            </motion.h1>
            
            {/* Secondary Couplet */}
            <motion.div
              className="max-w-lg mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="font-poem text-xl sm:text-2xl text-white/80 leading-relaxed mb-2">
                {secondaryCouplet.line1}
              </p>
              <p className="font-poem text-xl sm:text-2xl text-white/80 leading-relaxed">
                {secondaryCouplet.line2}
              </p>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                href="/kavitayen"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold text-bg-primary font-ui font-medium rounded-lg hover:bg-accent-gold-hover transition-colors duration-300"
              >
                कविताएँ पढ़ें
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/parichay"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-ui font-medium rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                परिचय
              </Link>
            </motion.div>
          </div>
          
          {/* Poet Portrait - Right Side */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative aspect-[3/4] max-w-md ml-auto">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-accent-gold/30 rounded-2xl" />
              <div className="absolute -inset-8 border border-accent-gold/10 rounded-3xl" />
              
              {/* Portrait Image */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <SafeImage
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  alt={poetName}
                  fill
                  className="object-cover"
                  priority
                  fallbackGradient={imageGradients.poet}
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              
              {/* Floating quote card */}
              <motion.div
                className="absolute -left-8 bottom-12 bg-bg-primary/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-xs border border-divider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <p className="font-poem text-text-secondary text-sm leading-relaxed italic">
                  &ldquo;शब्दों में वो ताक़त है जो पहाड़ों को हिला दे...&rdquo;
                </p>
                <p className="font-ui text-accent-gold text-xs mt-3">— अमन अक्षर</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/60"
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-ui text-xs tracking-wider">स्क्रॉल करें</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
