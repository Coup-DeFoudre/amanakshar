'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BlurTextProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  blur?: number
}

export function BlurText({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  once = true,
  blur = 20,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  
  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{
        opacity: 0,
        filter: `blur(${blur}px)`,
        scale: 1.1,
      }}
      animate={isInView ? {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
    >
      {children}
    </motion.span>
  )
}
