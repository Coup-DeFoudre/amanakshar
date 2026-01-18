'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage, imageGradients } from '@/components/ui/SafeImage'

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

// Background images for poem cards
const poemImages = [
  'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=800&auto=format&fit=crop', // Rain on window
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop', // Open book
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop', // Person reading
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop', // Library
  'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=800&auto=format&fit=crop', // Coffee and book
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop', // Vintage typewriter
]

export function WordSection({ poems }: WordSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <section className="py-20 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.p
          className="font-ui text-accent-gold text-xs tracking-[0.3em] uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          चुनिंदा रचनाएँ
        </motion.p>
        
        <motion.h2
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          शब्दों का संसार
        </motion.h2>
        
        <motion.p
          className="font-poem text-lg text-text-secondary text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          हर कविता एक अलग कहानी, हर शब्द एक अलग एहसास
        </motion.p>
        
        {/* Poems Grid - Bento style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((poem, index) => {
            const isLarge = index === 0
            const imageUrl = poemImages[index % poemImages.length]
            
            return (
              <motion.div
                key={poem.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.1 
                }}
                className={isLarge ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
              >
                <Link
                  href={`/kavita/${poem.slug}`}
                  className="group block h-full"
                >
                  <div className={`relative overflow-hidden rounded-xl ${isLarge ? 'h-[400px] lg:h-full min-h-[500px]' : 'h-64'}`}>
                    {/* Background Image */}
                    <SafeImage
                      src={imageUrl}
                      alt={poem.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      fallbackGradient={imageGradients.poem}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-colors duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      {/* Bhav tag */}
                      <span className="absolute top-4 right-4 font-ui text-xs text-white/90 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        {poem.bhav}
                      </span>
                      
                      {/* Title */}
                      <h3 className={`font-heading text-white mb-4 group-hover:text-accent-gold transition-colors ${isLarge ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>
                        {poem.title}
                      </h3>
                      
                      {/* Opening lines */}
                      <div className="space-y-2 mb-6">
                        {poem.openingLines.slice(0, isLarge ? 4 : 2).map((line, lineIndex) => (
                          <p 
                            key={lineIndex}
                            className={`font-poem text-white/80 leading-relaxed ${isLarge ? 'text-lg' : 'text-sm'}`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                      
                      {/* Read more link */}
                      <div className="flex items-center gap-2 text-accent-gold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="font-ui text-sm">पूरी कविता पढ़ें</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
        
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
            className="inline-flex items-center gap-3 font-ui text-text-primary hover:text-accent-gold border border-divider hover:border-accent-gold/50 px-8 py-4 rounded-lg transition-all duration-300"
          >
            <span>सभी कविताएँ देखें</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
