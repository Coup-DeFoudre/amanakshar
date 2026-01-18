'use client'

import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getPerformanceTier } from '@/lib/performance-utils'

// ===== GRADIENT PRESETS =====

export type GradientPreset = 'midnight' | 'warm-glow' | 'cool-ocean' | 'autumn' | 'ember'

interface GradientColors {
  colorA: string
  colorB: string
  colorC: string
  colorD: string
}

const gradientPresets: Record<GradientPreset, GradientColors> = {
  midnight: {
    colorA: '#0a0908',
    colorB: '#1a1512',
    colorC: '#0d1117',
    colorD: '#1a1a2e',
  },
  'warm-glow': {
    colorA: '#1a0f08',
    colorB: '#2a1810',
    colorC: '#3a2820',
    colorD: '#2a1818',
  },
  'cool-ocean': {
    colorA: '#0a1020',
    colorB: '#0d1825',
    colorC: '#102030',
    colorD: '#081828',
  },
  autumn: {
    colorA: '#1a1008',
    colorB: '#2a1810',
    colorC: '#3a2018',
    colorD: '#2a1512',
  },
  ember: {
    colorA: '#1a0a08',
    colorB: '#2a1410',
    colorC: '#3a2018',
    colorD: '#2a1008',
  },
}

// ===== CSS GRADIENT COMPONENT =====

function CSSGradient({ preset = 'midnight' }: { preset?: GradientPreset }) {
  const colors = gradientPresets[preset]
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.9, 1])
  
  return (
    <motion.div
      className="fixed inset-0 -z-20"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${colors.colorB} 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 30% 70%, ${colors.colorC} 0%, transparent 40%),
            radial-gradient(ellipse 50% 50% at 70% 50%, ${colors.colorD} 0%, transparent 45%),
            linear-gradient(180deg, ${colors.colorA} 0%, ${colors.colorB} 50%, ${colors.colorA} 100%)
          `,
        }}
      />
      
      {/* Animated overlay for subtle movement */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse 60% 40% at 40% 40%, ${colors.colorC}20 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 40% at 60% 60%, ${colors.colorC}20 0%, transparent 60%)`,
            `radial-gradient(ellipse 60% 40% at 40% 40%, ${colors.colorC}20 0%, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// ===== MAIN COMPONENT =====

export interface DynamicGradientProps {
  preset?: GradientPreset
  speed?: number
  scale?: number
  noiseIntensity?: number
  className?: string
  enableWebGL?: boolean
}

export function DynamicGradient({
  preset = 'midnight',
  className = '',
  enableWebGL = true,
}: DynamicGradientProps) {
  const [tier, setTier] = useState<'low' | 'medium' | 'high'>('low')
  
  useEffect(() => {
    setTier(getPerformanceTier())
  }, [])
  
  // Use CSS gradient for stability
  return <CSSGradient preset={preset} />
}

export default DynamicGradient
