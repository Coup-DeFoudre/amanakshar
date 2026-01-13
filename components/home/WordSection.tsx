'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface FeaturedPoem {
  title: string
  slug: string
  openingLines: string[]
  bhav: string
  bhavSlug: string
}

interface WordSectionProps {
  poems: FeaturedPoem[]
}

export function WordSection({ poems }: WordSectionProps) {
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
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' }
    },
  }
  
  return (
    <section className="relative py-20 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          शब्द
        </motion.p>
        
        <motion.h2
          className="font-heading text-3xl sm:text-4xl text-text-primary text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          चुनिंदा कविताएँ
        </motion.h2>
        
        {/* Poems Grid - Asymmetric layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {poems.map((poem, index) => (
            <motion.div
              key={poem.slug}
              variants={itemVariants}
              className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
            >
              <Link
                href={`/kavita/${poem.slug}`}
                className="group block h-full"
              >
                <article className="relative h-full min-h-[280px] p-6 sm:p-8 border border-divider hover:border-divider-strong bg-bg-secondary/50 hover:bg-bg-secondary/80 transition-all duration-500 overflow-hidden">
                  {/* Bhav tag */}
                  <div className="absolute top-4 right-4">
                    <span className="font-ui text-xs text-text-muted px-2 py-1 border border-divider">
                      {poem.bhav}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-heading text-xl sm:text-2xl text-text-primary mb-6 pr-16 group-hover:text-accent-gold transition-colors duration-300">
                    {poem.title}
                  </h3>
                  
                  {/* Opening lines with fade effect */}
                  <div className="relative">
                    {poem.openingLines.map((line, lineIndex) => (
                      <p 
                        key={lineIndex}
                        className="font-poem text-text-secondary leading-loose"
                        style={{
                          opacity: 1 - (lineIndex * 0.25),
                        }}
                      >
                        {line}
                      </p>
                    ))}
                    
                    {/* Fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-secondary/80 to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Read more indicator */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="font-ui text-sm text-text-muted">पूरी कविता पढ़ें</span>
                    <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  
                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </article>
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
            className="inline-flex items-center gap-3 font-ui text-text-secondary hover:text-text-primary border border-divider hover:border-divider-strong px-6 py-3 transition-all group"
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

