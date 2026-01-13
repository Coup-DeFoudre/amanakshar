'use client'

import { motion } from 'framer-motion'
import { TextButton } from '@/components/ui/TextButton'

interface KaviSammelanSectionProps {
  tagline: string
}

export function KaviSammelanSection({ tagline }: KaviSammelanSectionProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Atmospheric background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-secondary/50 to-transparent"
        aria-hidden="true"
      />
      
      <motion.div
        className="relative text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary mb-4">
          कवि-समेलन
        </h2>
        
        <p className="font-poem text-xl sm:text-2xl text-text-secondary mb-8 italic">
          "{tagline}"
        </p>
        
        <div className="w-16 h-px bg-divider-strong mx-auto mb-8" />
        
        <TextButton icon="→" iconPosition="right" href="/prastutiyaan">
          सभी प्रस्तुतियाँ देखें
        </TextButton>
      </motion.div>
    </section>
  )
}

