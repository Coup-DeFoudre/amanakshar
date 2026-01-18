'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import Link from 'next/link'

interface VoiceSectionProps {
  title: string
  quote: string
  youtubeUrl: string
  poemSlug?: string
}

export function VoiceSection({ 
  title, 
  quote, 
  youtubeUrl, 
  poemSlug 
}: VoiceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  const videoOpacity = useTransform(
    scrollYProgress, 
    [0, 0.3], 
    prefersReducedMotion ? [1, 1] : [0, 1]
  )
  
  return (
    <section 
      ref={sectionRef}
      className="py-16 sm:py-24 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          आवाज़
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Video */}
          <motion.div
            className="relative"
            style={{ opacity: videoOpacity }}
          >
            <div className="rounded-lg overflow-hidden">
              <YouTubeEmbed url={youtubeUrl} title={title} />
            </div>
          </motion.div>
          
          {/* Content */}
          <div className="lg:pl-4">
            {/* Title */}
            <motion.h2
              className="font-heading text-2xl sm:text-3xl text-accent-gold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.h2>
            
            {/* Quote */}
            <motion.blockquote
              className="relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="absolute -left-4 top-0 font-heading text-4xl text-accent-gold/20">
                "
              </span>
              <p className="font-poem text-xl sm:text-2xl text-text-primary leading-relaxed pl-2">
                {quote}
              </p>
            </motion.blockquote>
            
            {/* Actions */}
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {poemSlug && (
                <Link 
                  href={`/kavita/${poemSlug}`}
                  className="group flex items-center gap-2 font-ui text-text-secondary hover:text-accent-gold transition-colors"
                >
                  <span>पूरी कविता पढ़ें</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
