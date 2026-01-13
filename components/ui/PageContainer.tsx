import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6',
        narrow ? 'max-w-xl' : 'max-w-2xl',
        className
      )}
    >
      {children}
    </div>
  )
}

