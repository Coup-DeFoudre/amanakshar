'use client'

import { motion } from 'framer-motion'

interface ShinyTextProps {
  children: React.ReactNode
  className?: string
}

export function ShinyText({ children, className = '' }: ShinyTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover="hover"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        variants={{
          hover: {
            backgroundPosition: ['200% 0%', '-200% 0%'],
            transition: {
              duration: 0.8,
              ease: 'easeInOut',
            },
          },
        }}
      />
    </motion.span>
  )
}
