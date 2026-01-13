'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface PoemCardProps {
  title: string
  slug: string
  excerpt: string
  bhavs: string[]
  index: number
}

export function PoemCard({ title, slug, excerpt, bhavs, index }: PoemCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/kavita/${slug}`} className="block group">
        <h3 className="font-heading text-xl sm:text-2xl text-text-primary group-hover:text-accent-gold transition-colors duration-200 mb-2">
          {title}
        </h3>
        
        <p className="font-poem text-text-secondary leading-relaxed mb-3 line-clamp-2">
          {excerpt}
        </p>
        
        {bhavs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {bhavs.map((bhav) => (
              <span
                key={bhav}
                className="font-ui text-xs text-text-muted"
              >
                {bhav}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.article>
  )
}

