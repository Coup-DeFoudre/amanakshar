'use client'

import { motion } from 'framer-motion'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  animate?: boolean
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(212, 168, 85, 0.3)',
  animate = true,
}: GlowCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow layer */}
      <motion.div
        className="absolute -inset-px pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${glowColor}, inset 0 0 20px ${glowColor.replace('0.3', '0.1')}`,
          borderRadius: 'inherit',
        }}
        animate={animate ? {
          boxShadow: [
            `0 0 20px ${glowColor}, inset 0 0 15px ${glowColor.replace('0.3', '0.05')}`,
            `0 0 40px ${glowColor}, inset 0 0 25px ${glowColor.replace('0.3', '0.1')}`,
            `0 0 20px ${glowColor}, inset 0 0 15px ${glowColor.replace('0.3', '0.05')}`,
          ],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `1px solid ${glowColor.replace('0.3', '0.4')}`,
          borderRadius: 'inherit',
        }}
      />
      
      {children}
    </motion.div>
  )
}
