'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage, imageGradients } from '@/components/ui/SafeImage'

interface StageSectionProps {
  tagline: string
  signatureSong: string
  credentials: string[]
}

export function StageSection({ 
  tagline, 
  signatureSong, 
  credentials 
}: StageSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  const bgY = useTransform(
    scrollYProgress, 
    [0, 1], 
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '20%']
  )
  
  const bgScale = useTransform(
    scrollYProgress, 
    [0, 1], 
    prefersReducedMotion ? [1, 1] : [1.1, 1]
  )
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-24 sm:py-40 overflow-hidden"
    >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <SafeImage
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
          alt="Stage with spotlights"
          fill
          className="object-cover"
          fallbackGradient={imageGradients.stage}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
        {/* Accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent-gold/10 rounded-full blur-3xl" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Section label */}
        <motion.p
          className="font-ui text-accent-gold/80 text-xs tracking-[0.3em] uppercase mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          मंच प्रस्तुतियाँ
        </motion.p>
        
        {/* Main heading */}
        <motion.h2
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          कवि-सम्मेलन
        </motion.h2>
        
        {/* Tagline */}
        <motion.p
          className="font-poem text-xl sm:text-2xl text-white/80 italic mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          &ldquo;{tagline}&rdquo;
        </motion.p>
        
        {/* Signature song card */}
        <motion.div
          className="inline-block mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative px-10 py-6 bg-white/5 backdrop-blur-sm border border-accent-gold/30 rounded-xl">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gold text-bg-primary font-ui text-xs font-medium rounded-full">
              सबसे चर्चित
            </span>
            <p className="font-heading text-2xl sm:text-3xl md:text-4xl text-accent-gold">
              {signatureSong}
            </p>
          </div>
        </motion.div>
        
        {/* Decorative divider */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent-gold/50" />
          <div className="w-2 h-2 rounded-full bg-accent-gold/50" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent-gold/50" />
        </motion.div>
        
        {/* Credentials */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {credentials.map((credential, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.4, 
                delay: prefersReducedMotion ? 0 : 0.5 + index * 0.1 
              }}
            >
              <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-ui text-white/90">{credential}</span>
            </motion.div>
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
            className="inline-flex items-center gap-3 font-ui text-white bg-accent-gold/20 hover:bg-accent-gold hover:text-bg-primary border border-accent-gold/50 hover:border-accent-gold px-8 py-4 rounded-lg transition-all duration-300"
          >
            <span>सभी प्रस्तुतियाँ देखें</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
