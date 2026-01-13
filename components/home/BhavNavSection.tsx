'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Bhav {
  name: string
  slug: string
}

interface BhavNavSectionProps {
  bhavs: Bhav[]
}

export function BhavNavSection({ bhavs }: BhavNavSectionProps) {
  return (
    <motion.section
      className="py-12 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <nav className="font-ui text-lg">
        {bhavs.map((bhav, index) => (
          <span key={bhav.slug}>
            <Link
              href={`/bhav/${bhav.slug}`}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {bhav.name}
            </Link>
            {index < bhavs.length - 1 && (
              <span className="mx-3 sm:mx-4 text-text-muted">|</span>
            )}
          </span>
        ))}
      </nav>
    </motion.section>
  )
}

