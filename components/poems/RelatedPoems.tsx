'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface RelatedPoem {
  title: string
  slug: string
}

interface RelatedPoemsProps {
  poems: RelatedPoem[]
  currentBhav?: string
}

export function RelatedPoems({ poems, currentBhav }: RelatedPoemsProps) {
  if (poems.length === 0) return null
  
  return (
    <motion.section
      className="mt-12 pt-8 border-t border-divider"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="font-heading text-xl text-text-secondary mb-4">
        {currentBhav ? `${currentBhav} की और कविताएँ` : 'और कविताएँ'}
      </h3>
      
      <ul className="space-y-2">
        {poems.map((poem) => (
          <li key={poem.slug}>
            <Link
              href={`/kavita/${poem.slug}`}
              className="font-poem text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
            >
              <span className="text-text-muted">→</span>
              {poem.title}
            </Link>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

