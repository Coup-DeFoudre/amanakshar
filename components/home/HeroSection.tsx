'use client'

import { motion } from 'framer-motion'
import { TextButton } from '@/components/ui/TextButton'

interface HeroSectionProps {
  quote: string
  poetName: string
}

export function HeroSection({ quote, poetName }: HeroSectionProps) {
  const lines = quote.split('\n')
  
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight mb-6">
          {lines.map((line, index) => (
            <span key={index}>
              {line}
              {index < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </motion.div>
      
      <motion.p
        className="font-ui text-text-secondary text-lg mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        — {poetName}
      </motion.p>
      
      <motion.div
        className="flex items-center gap-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <TextButton icon="▶" href="#featured">
          सुनिए
        </TextButton>
        <TextButton icon="↓" href="#poems">
          पढ़िए
        </TextButton>
      </motion.div>
    </section>
  )
}

