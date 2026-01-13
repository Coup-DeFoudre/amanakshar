import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
  strong?: boolean
}

export function Divider({ className, strong = false }: DividerProps) {
  return (
    <hr
      className={cn(
        'border-0 my-8',
        strong ? 'divider-strong' : 'divider',
        className
      )}
    />
  )
}

