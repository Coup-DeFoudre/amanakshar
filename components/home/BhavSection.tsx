'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage, imageGradients } from '@/components/ui/SafeImage'

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

// Background images for each bhav category
const bhavImages: Record<string, string> = {
  prem: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=500&auto=format&fit=crop',
  deshbhakti: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=500&auto=format&fit=crop',
  hasya: 'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?q=80&w=500&auto=format&fit=crop',
  shringaar: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=500&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop',
}

export function BhavSection({ bhavs }: BhavSectionProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <section className="py-20 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          className="font-ui text-text-muted text-xs tracking-[0.2em] uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          भाव के अनुसार
        </motion.p>
        
        <motion.h2
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          कविताओं की दुनिया
        </motion.h2>
        
        <motion.p
          className="font-poem text-lg text-text-secondary text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          हर भाव की अपनी एक अलग दुनिया है, अपना एक अलग रंग
        </motion.p>
        
        {/* Bhav Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bhavs.map((bhav, index) => {
            const imageUrl = bhavImages[bhav.slug] || bhavImages.default
            
            return (
              <motion.div
                key={bhav.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.1 
                }}
              >
                <Link
                  href={`/bhav/${bhav.slug}`}
                  className="group block h-full"
                >
                  <div className="relative h-72 rounded-xl overflow-hidden">
                    {/* Background Image */}
                    <SafeImage
                      src={imageUrl}
                      alt={bhav.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      fallbackGradient={imageGradients.bhav}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      {/* Icon */}
                      <span className="text-3xl mb-3 drop-shadow-lg">
                        {bhav.icon}
                      </span>
                      
                      {/* Name */}
                      <h3 className="font-heading text-2xl text-white mb-2 group-hover:text-accent-gold transition-colors">
                        {bhav.name}
                      </h3>
                      
                      {/* Sample line */}
                      <p className="font-poem text-sm text-white/70 leading-relaxed line-clamp-2">
                        {bhav.sampleLine}
                      </p>
                      
                      {/* Arrow indicator */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
