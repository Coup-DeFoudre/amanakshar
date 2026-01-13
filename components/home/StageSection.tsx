'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'

interface StageSectionProps {
  tagline: string
  signatureSong: string
  credentials: string[]
}

// Animated counter component
function AnimatedCounter({ 
  target, 
  suffix = '', 
  isVisible 
}: { 
  target: number
  suffix?: string
  isVisible: boolean 
}) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000 // ms
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [isVisible, target])
  
  return <span>{count}{suffix}</span>
}

export function StageSection({ 
  tagline, 
  signatureSong, 
  credentials 
}: StageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  // Parallax for background
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-28 sm:py-40 overflow-hidden"
    >
      {/* Atmospheric background with stage imagery */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        {/* Gradient overlay simulating stage lights */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/20 to-transparent" />
        
        {/* Stage light effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-amber-700/15 via-transparent to-transparent blur-3xl" />
        </div>
        
        {/* Crowd silhouette effect using gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-bg-primary/60 via-bg-primary/30 to-transparent" />
        
        {/* Subtle animated particles for atmosphere */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent-gold rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          मंच
        </motion.p>
        
        {/* Main heading */}
        <motion.h2
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-primary mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          कवि-सम्मेलन
        </motion.h2>
        
        {/* Tagline */}
        <motion.p
          className="font-poem text-xl sm:text-2xl text-text-secondary italic mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          "{tagline}"
        </motion.p>
        
        {/* Signature song highlight */}
        <motion.div
          className="inline-block mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative px-8 py-4 border border-accent-gold/30 bg-accent-gold/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 bg-bg-primary">
              <span className="font-ui text-xs text-accent-gold tracking-wider">सबसे चर्चित</span>
            </div>
            <p className="font-heading text-2xl sm:text-3xl text-accent-gold">
              {signatureSong}
            </p>
          </div>
        </motion.div>
        
        {/* Decorative divider */}
        <motion.div
          className="w-24 h-px bg-gradient-to-r from-transparent via-divider-strong to-transparent mx-auto mb-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        
        {/* Credentials */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {credentials.map((credential, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 font-ui text-text-secondary"
            >
              <svg className="w-4 h-4 text-accent-gold/70" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{credential}</span>
            </div>
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link 
            href="/prastutiyaan"
            className="inline-flex items-center gap-3 font-ui text-text-secondary hover:text-text-primary border border-divider hover:border-divider-strong px-6 py-3 transition-all group"
          >
            <span>सभी प्रस्तुतियाँ देखें</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

