'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

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
  collaborations: Collaboration[]
  achievements: Achievement[]
}

export function PoetSection({ 
  name, 
  bio, 
  imageUrl,
  collaborations,
  achievements
}: PoetSectionProps) {
  return (
    <section className="relative py-20 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          कवि
        </motion.p>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Portrait - 2 columns */}
          <motion.div
            className="lg:col-span-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Portrait container with subtle float animation */}
              <motion.div
                className="relative w-56 h-72 sm:w-64 sm:h-80 overflow-hidden"
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover grayscale-[20%] contrast-[1.1]"
                  />
                ) : (
                  // Placeholder with decorative pattern
                  <div className="w-full h-full bg-gradient-to-b from-bg-secondary to-bg-primary/80 flex items-center justify-center">
                    <span className="font-heading text-6xl text-text-muted/30">अ</span>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/30 via-transparent to-transparent" />
              </motion.div>
              
              {/* Decorative frame */}
              <div className="absolute -inset-3 border border-divider pointer-events-none" />
              <div className="absolute -inset-6 border border-divider/50 pointer-events-none" />
              
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-accent-gold/40" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-accent-gold/40" />
            </div>
          </motion.div>
          
          {/* Content - 3 columns */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Name */}
            <h2 className="font-heading text-3xl sm:text-4xl text-text-primary mb-6">
              {name}
            </h2>
            
            {/* Poetic bio */}
            <blockquote className="relative mb-8 pl-4 border-l-2 border-accent-gold/30">
              <p className="font-poem text-lg sm:text-xl text-text-secondary leading-relaxed italic">
                {bio}
              </p>
            </blockquote>
            
            {/* Achievements */}
            <div className="mb-8">
              <h3 className="font-ui text-sm text-text-muted uppercase tracking-wider mb-4">
                उपलब्धियाँ
              </h3>
              <div className="flex flex-wrap gap-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-secondary/70 border border-divider"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <span className="font-ui text-sm text-text-secondary">{achievement.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Collaborations */}
            <div className="mb-8">
              <h3 className="font-ui text-sm text-text-muted uppercase tracking-wider mb-4">
                सहयोग
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {collaborations.map((collab, index) => (
                  <motion.span
                    key={index}
                    className="font-ui text-text-secondary"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  >
                    {collab.name}
                    {collab.role && (
                      <span className="text-text-muted text-sm ml-1">({collab.role})</span>
                    )}
                  </motion.span>
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                href="/parichay"
                className="inline-flex items-center gap-2 font-ui text-accent-gold hover:text-accent-warm transition-colors group"
              >
                <span>पूरा परिचय पढ़ें</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

