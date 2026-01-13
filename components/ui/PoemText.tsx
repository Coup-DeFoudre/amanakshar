'use client'

import { cn } from '@/lib/utils'
import { PoemLine } from './PoemLine'

interface PoemTextProps {
  text: string
  className?: string
}

export function PoemText({ text, className }: PoemTextProps) {
  // Split poem into lines, preserving empty lines for stanza breaks
  const lines = text.split('\n')
  
  return (
    <div className={cn('font-poem text-lg sm:text-xl leading-relaxed', className)}>
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

