'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  // Video emerges from darkness effect
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const videoX = useTransform(scrollYProgress, [0, 0.3], [-30, 0])
  const textX = useTransform(scrollYProgress, [0.1, 0.4], [30, 0])
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          आवाज़
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Video with film grain overlay */}
          <motion.div
            className="relative"
            style={{ opacity: videoOpacity, x: videoX }}
          >
            {/* Film grain overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 mix-blend-multiply opacity-10">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' fill='%237a6850'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
            
            {/* Video embed */}
            <div className="relative overflow-hidden shadow-2xl">
              <YouTubeEmbed url={youtubeUrl} title={title} />
            </div>
            
            {/* Decorative corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent-gold/30" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent-gold/30" />
          </motion.div>
          
          {/* Content */}
          <motion.div
            className="lg:pl-8"
            style={{ x: textX }}
          >
            {/* Title */}
            <motion.h2
              className="font-heading text-2xl sm:text-3xl text-accent-gold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            
            {/* Quote */}
            <motion.blockquote
              className="relative mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="absolute -left-4 top-0 font-heading text-4xl text-accent-gold/20">
                "
              </span>
              <p className="font-poem text-xl sm:text-2xl lg:text-3xl text-text-primary leading-relaxed pl-2">
                {quote}
              </p>
              <span className="font-heading text-4xl text-accent-gold/20">
                "
              </span>
            </motion.blockquote>
            
            {/* Actions */}
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="group flex items-center gap-3 font-ui text-text-secondary hover:text-text-primary transition-colors">
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-divider-strong group-hover:border-accent-gold/50 group-hover:bg-accent-gold/5 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>पूरा सुनें</span>
              </button>
              
              {poemSlug && (
                <Link 
                  href={`/kavita/${poemSlug}`}
                  className="group flex items-center gap-3 font-ui text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span>पूरी कविता पढ़ें</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

