'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Bhav {
  name: string
  slug: string
  icon: string
  sampleLine: string
  color: 'warm' | 'gold' | 'muted' | 'primary'
}

interface BhavSectionProps {
  bhavs: Bhav[]
}

const colorMap = {
  warm: 'from-rose-200/30 to-transparent hover:from-rose-200/50',
  gold: 'from-amber-200/30 to-transparent hover:from-amber-200/50',
  muted: 'from-emerald-200/30 to-transparent hover:from-emerald-200/50',
  primary: 'from-indigo-200/30 to-transparent hover:from-indigo-200/50',
}

const iconColorMap = {
  warm: 'text-rose-700',
  gold: 'text-accent-gold',
  muted: 'text-emerald-700',
  primary: 'text-indigo-700',
}

export function BhavSection({ bhavs }: BhavSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    },
  }
  
  return (
    <section className="relative py-20 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          भाव के अनुसार
        </motion.p>
        
        <motion.h2
          className="font-heading text-3xl sm:text-4xl text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          कविताओं की दुनिया
        </motion.h2>
        
        {/* Bhav Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {bhavs.map((bhav) => (
            <motion.div
              key={bhav.slug}
              variants={itemVariants}
            >
              <Link
                href={`/bhav/${bhav.slug}`}
                className="group block relative h-full"
              >
                <div className={`
                  relative overflow-hidden p-6 h-full min-h-[200px]
                  border border-divider hover:border-divider-strong
                  bg-gradient-to-b ${colorMap[bhav.color]}
                  transition-all duration-500
                `}>
                  {/* Icon */}
                  <div className={`text-3xl mb-4 ${iconColorMap[bhav.color]} transition-transform duration-300 group-hover:scale-110`}>
                    {bhav.icon}
                  </div>
                  
                  {/* Name */}
                  <h3 className="font-heading text-2xl text-text-primary mb-3 group-hover:text-accent-gold transition-colors duration-300">
                    {bhav.name}
                  </h3>
                  
                  {/* Sample line - reveals on hover */}
                  <p className="font-poem text-sm text-text-muted leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {bhav.sampleLine}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-divider-strong opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/kavitayen"
            className="inline-flex items-center gap-2 font-ui text-text-secondary hover:text-text-primary transition-colors group"
          >
            <span>सभी कविताएँ देखें</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

