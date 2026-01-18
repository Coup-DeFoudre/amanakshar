'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface TextRevealProps {
  children: string
  className?: string
  once?: boolean
}

export function TextReveal({
  children,
  className = '',
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: '-100px' })
  
  const words = children.split(' ')
  
  return (
    <span ref={ref} className={`inline ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  )
}
