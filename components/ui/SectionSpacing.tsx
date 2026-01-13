import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionSpacingProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const spacingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

export function SectionSpacing({ children, className, size = 'md' }: SectionSpacingProps) {
  return (
    <section className={cn(spacingMap[size], className)}>
      {children}
    </section>
  )
}

