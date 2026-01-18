'use client'

import { motion } from 'framer-motion'
import { TextButton } from '@/components/ui/TextButton'
import { OptimizedImage } from '@/components/ui/OptimizedImage'

interface AboutPreviewSectionProps {
  name: string
  bio: string
  imageUrl?: string
}

export function AboutPreviewSection({ name, bio, imageUrl }: AboutPreviewSectionProps) {
  return (
    <section className="py-12 sm:py-16">
      <motion.div
        className="flex flex-col sm:flex-row items-start gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Photo */}
        {imageUrl && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-sm overflow-hidden flex-shrink-0 bg-bg-secondary">
            <OptimizedImage
              src={imageUrl}
              alt={name}
              width={128}
              height={128}
              objectFit="cover"
              fallback="/images/placeholders/poet.svg"
              sizes="(max-width: 640px) 96px, 128px"
            />
          </div>
        )}
        
        {/* Bio */}
        <div className="flex-1">
          <h2 className="font-heading text-2xl sm:text-3xl text-text-primary mb-3">
            {name}
          </h2>
          
          <p className="font-ui text-text-secondary leading-relaxed mb-4">
            {bio}
          </p>
          
          <TextButton icon="→" iconPosition="right" href="/parichay">
            और जानें
          </TextButton>
        </div>
      </motion.div>
    </section>
  )
}
