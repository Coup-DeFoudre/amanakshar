'use client'

import { motion } from 'framer-motion'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { TextButton } from '@/components/ui/TextButton'

interface FeaturedPoemSectionProps {
  title: string
  excerpt: string
  youtubeUrl?: string
  poemSlug: string
}

export function FeaturedPoemSection({ 
  title, 
  excerpt, 
  youtubeUrl, 
  poemSlug 
}: FeaturedPoemSectionProps) {
  return (
    <section id="featured" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Video */}
        {youtubeUrl && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <YouTubeEmbed url={youtubeUrl} title={title} />
          </motion.div>
        )}
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={!youtubeUrl ? 'md:col-span-2 max-w-lg mx-auto' : ''}
        >
          <h2 className="font-heading text-2xl sm:text-3xl text-accent-gold mb-4">
            {title}
          </h2>
          
          <p className="font-poem text-text-secondary text-lg leading-relaxed mb-6">
            {excerpt}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {youtubeUrl && (
              <TextButton icon="▶">
                पूरा सुनें
              </TextButton>
            )}
            <TextButton icon="→" iconPosition="right" href={`/kavita/${poemSlug}`}>
              पूरी कविता पढ़ें
            </TextButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

