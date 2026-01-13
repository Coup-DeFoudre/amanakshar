'use client'

import { cn } from '@/lib/utils'

interface PoemLineProps {
  children: string
  className?: string
}

export function PoemLine({ children, className }: PoemLineProps) {
  return (
    <p className={cn('poem-line', className)}>
      {children}
    </p>
  )
}

