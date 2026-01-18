'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage, imageGradients } from '@/components/ui/SafeImage'

interface Collaboration {
  name: string
  role?: string
}

interface Achievement {
  title: string
  icon: string
}

interface PoetSectionProps {
  name: string
  bio: string
  imageUrl?: string
  signatureUrl?: string
  personalQuotes?: string[]
  collaborations: Collaboration[]
  achievements: Achievement[]
}

// Default poet image if none provided
const DEFAULT_POET_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'

export function PoetSection({ 
  name, 
  bio, 
  imageUrl,
  signatureUrl,
  personalQuotes = [],
  collaborations,
  achievements
}: PoetSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const displayImage = imageUrl || DEFAULT_POET_IMAGE
  
  return (
    <section className="py-20 sm:py-32 px-6 bg-gradient-to-b from-bg-primary via-bg-secondary/30 to-bg-primary">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-accent-gold text-xs tracking-[0.3em] uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          कवि परिचय
        </motion.p>
        
        <motion.h2
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {name}
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Portrait with decorative elements */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
          >
            <div className="relative">
              {/* Decorative background shapes */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-accent-gold/10 rounded-2xl" />
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-accent-gold/20 rounded-2xl" />
              
              {/* Main image */}
              <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem] rounded-xl overflow-hidden">
                <SafeImage
                  src={displayImage}
                  alt={name}
                  fill
                  className="object-cover"
                  fallbackGradient={imageGradients.poet}
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Floating achievement card */}
              <motion.div
                className="absolute -right-4 sm:-right-12 bottom-16 bg-bg-primary/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-divider"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <p className="font-ui text-accent-gold font-medium">500+</p>
                    <p className="font-ui text-text-muted text-sm">मंच प्रस्तुतियाँ</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: 0.2 }}
          >
            {/* Bio */}
            <blockquote className="relative pl-6 border-l-4 border-accent-gold">
              <p className="font-poem text-xl sm:text-2xl text-text-secondary leading-relaxed">
                {bio}
              </p>
            </blockquote>
            
            {/* Personal Quotes */}
            {personalQuotes.length > 0 && (
              <div className="pt-4">
                <h3 className="font-ui text-sm text-text-muted uppercase tracking-wider mb-6">
                  विचार
                </h3>
                <div className="space-y-4">
                  {personalQuotes.slice(0, 2).map((quote, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-bg-elevated/50 rounded-lg border border-divider/50"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: prefersReducedMotion ? 0 : 0.4, 
                        delay: prefersReducedMotion ? 0 : 0.3 + index * 0.1 
                      }}
                    >
                      <p className="font-poem text-text-secondary italic">&ldquo;{quote}&rdquo;</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements row */}
            <div className="flex flex-wrap gap-3 pt-4">
              {achievements.slice(0, 4).map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-divider rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0 : 0.3, 
                    delay: prefersReducedMotion ? 0 : 0.4 + index * 0.1 
                  }}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="font-ui text-text-secondary text-sm">{achievement.title}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                href="/parichay"
                className="inline-flex items-center gap-3 font-ui text-bg-primary bg-accent-gold hover:bg-accent-gold-hover px-8 py-4 rounded-lg transition-colors duration-300"
              >
                <span>पूरा परिचय पढ़ें</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Collaborations - Image gallery style */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-ui text-sm text-text-muted uppercase tracking-wider mb-8 text-center">
            प्रसिद्ध कलाकारों के साथ सहयोग
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {collaborations.slice(0, 4).map((collab, index) => (
              <motion.div
                key={index}
                className="group relative aspect-square rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.4, 
                  delay: prefersReducedMotion ? 0 : 0.1 + index * 0.1 
                }}
              >
                <SafeImage
                  src={`https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1472099645785-5658abf4ff4e', '1438761681033-6461ffad8d80', '1500648767791-00dcc994a43e'][index]}?q=80&w=400&auto=format&fit=crop`}
                  alt={collab.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  fallbackGradient={imageGradients.poet}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-ui text-white font-medium">{collab.name}</p>
                  {collab.role && (
                    <p className="font-ui text-white/70 text-sm">{collab.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
