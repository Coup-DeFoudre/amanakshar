'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
  animate?: boolean
  delay?: number
}

export function GradientText({
  children,
  className = '',
  from = '#d4a855',
  to = '#bf7a3d',
  animate = true,
  delay = 0,
}: GradientTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundSize: animate ? '200% 200%' : '100% 100%',
      }}
      initial={{ opacity: 0, backgroundPosition: '0% 50%' }}
      animate={isInView ? {
        opacity: 1,
        backgroundPosition: animate ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
      } : {}}
      transition={{
        opacity: { duration: 0.5, delay },
        backgroundPosition: {
          duration: 5,
          delay,
          repeat: Infinity,
          ease: 'linear',
        },
      }}
    >
      {children}
    </motion.span>
  )
}
