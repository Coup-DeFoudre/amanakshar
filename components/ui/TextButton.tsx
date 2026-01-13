'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextButtonProps {
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
}

export function TextButton({
  children,
  icon,
  iconPosition = 'left',
  onClick,
  href,
  className,
  disabled = false,
}: TextButtonProps) {
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="text-sm">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="text-sm">{icon}</span>}
    </>
  )

  const baseClasses = cn(
    'font-ui inline-flex items-center gap-2',
    'text-text-secondary hover:text-text-primary',
    'transition-colors duration-200',
    'cursor-pointer select-none',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={{ opacity: 0.9 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
      disabled={disabled}
      whileHover={disabled ? undefined : { opacity: 0.9 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      {content}
    </motion.button>
  )
}

