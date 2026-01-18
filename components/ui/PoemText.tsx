'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { isDevanagariText, getDevanagariLetterSpacing } from '@/lib/typography-utils'
import { PoemLine } from './PoemLine'

interface PoemTextProps {
  text: string
  className?: string
}

/**
 * PoemText - Renders poem text with enhanced typography for Devanagari
 * 
 * Features:
 * - Fluid typography using CSS custom properties
 * - Devanagari-optimized letter and word spacing
 * - Proper line-height for comfortable reading
 * - Text balancing to prevent orphans
 * - Accessibility with proper lang attribute
 */
export function PoemText({ text, className }: PoemTextProps) {
  // Split poem into lines, preserving empty lines for stanza breaks
  const lines = text.split('\n')
  
  // Detect if text is primarily Devanagari and calculate optimal spacing
  const typographyConfig = useMemo(() => {
    const isHindi = isDevanagariText(text)
    // Use 18px as base font size for poem text
    const letterSpacing = isHindi ? getDevanagariLetterSpacing(18) : 0
    
    return {
      isHindi,
      letterSpacing: `${letterSpacing}em`,
    }
  }, [text])
  
  return (
    <div 
      className={cn(
        'font-poem text-poem-optimal',
        className
      )}
      lang={typographyConfig.isHindi ? 'hi' : undefined}
      role="article"
      style={{
        fontSize: 'var(--font-size-poem)',
        lineHeight: 'var(--line-height-poem)',
        letterSpacing: 'var(--letter-spacing-devanagari, -0.005em)',
        wordSpacing: 'clamp(0.05em, 0.03em + 0.02vw, 0.08em)',
        textWrap: 'balance',
        maxWidth: 'min(65ch, 100%)',
        hyphens: 'none',
      } as React.CSSProperties}
    >
      {lines.map((line, index) => {
        // Empty line = stanza break
        if (line.trim() === '') {
          return <div key={index} className="h-6" aria-hidden="true" />
        }
        return <PoemLine key={index}>{line}</PoemLine>
      })}
    </div>
  )
}
