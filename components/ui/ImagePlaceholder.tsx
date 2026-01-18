'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type PlaceholderType = 'book' | 'event' | 'poet' | 'performance'

interface ImagePlaceholderProps {
  type: PlaceholderType
  className?: string
  label?: string
  showLabel?: boolean
  animate?: boolean
}

const placeholderConfig: Record<PlaceholderType, { 
  icon: React.ReactNode
  defaultLabel: string
  bgPattern?: string
}> = {
  book: {
    icon: (
      <svg className="w-12 h-16" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="0" width="40" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-divider-strong"/>
        <rect x="8" y="4" width="32" height="4" rx="1" fill="currentColor" className="text-accent-gold/40"/>
        <path d="M12 20H36" stroke="currentColor" strokeWidth="1" className="text-divider-strong"/>
        <path d="M12 28H36" stroke="currentColor" strokeWidth="1" className="text-divider-strong"/>
        <path d="M12 36H28" stroke="currentColor" strokeWidth="1" className="text-divider-strong"/>
      </svg>
    ),
    defaultLabel: 'पुस्तक',
  },
  event: {
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="40" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-divider-strong"/>
        <path d="M16 12V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-accent-gold"/>
        <path d="M40 12V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-accent-gold"/>
        <path d="M8 22H48" stroke="currentColor" strokeWidth="1" className="text-divider-strong"/>
        <circle cx="28" cy="34" r="6" stroke="currentColor" strokeWidth="1" className="text-accent-gold/60"/>
      </svg>
    ),
    defaultLabel: 'कार्यक्रम',
  },
  poet: {
    icon: (
      <svg className="w-14 h-16" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" className="text-divider-strong"/>
        <path d="M10 60C10 46 20 38 28 38C36 38 46 46 46 60" stroke="currentColor" strokeWidth="1.5" className="text-divider-strong"/>
        <text x="28" y="24" textAnchor="middle" fill="currentColor" className="text-accent-gold/60 text-[18px]" fontFamily="serif">अ</text>
      </svg>
    ),
    defaultLabel: 'कवि',
  },
  performance: {
    icon: (
      <svg className="w-16 h-12" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="60" height="40" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-divider-strong"/>
        <circle cx="32" cy="24" r="12" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold/60"/>
        <path d="M28 18L40 24L28 30V18Z" fill="currentColor" className="text-accent-gold/60"/>
      </svg>
    ),
    defaultLabel: 'प्रस्तुति',
  },
}

/**
 * ImagePlaceholder - Decorative fallback component for missing images
 * Uses Devanagari text labels and matches site aesthetic
 */
export function ImagePlaceholder({
  type,
  className,
  label,
  showLabel = true,
  animate = true,
}: ImagePlaceholderProps) {
  const config = placeholderConfig[type]
  const displayLabel = label || config.defaultLabel

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        'bg-gradient-to-b from-bg-elevated to-bg-secondary',
        'border border-divider rounded-sm',
        'transition-all duration-300',
        animate && 'group-hover:border-accent-gold/30',
        className
      )}
    >
      <div className={cn(
        'transition-transform duration-300',
        animate && 'group-hover:scale-110'
      )}>
        {config.icon}
      </div>
      
      {showLabel && (
        <span className={cn(
          'font-heading text-text-muted text-sm',
          'transition-colors duration-300',
          animate && 'group-hover:text-text-secondary'
        )}>
          {displayLabel}
        </span>
      )}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        className="group w-full h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    )
  }

  return <div className="w-full h-full">{content}</div>
}
