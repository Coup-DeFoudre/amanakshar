'use client'

import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { getPerformanceTier } from '@/lib/performance-utils'

// ===== LAYER TYPES =====

export type LayerType = 'gradient-overlay' | 'texture-pattern' | 'geometric-shapes' | 'light-rays'

interface DepthLayersConfig {
  type: LayerType
  depth: number
  speed: number
  opacity: number
  color: string
}

const defaultLayers: DepthLayersConfig[] = [
  { type: 'light-rays', depth: -6, speed: 0.08, opacity: 0.6, color: '#d4a855' },
  { type: 'gradient-overlay', depth: -5, speed: 0.1, opacity: 0.4, color: '#d4a855' },
  { type: 'gradient-overlay', depth: -4, speed: 0.15, opacity: 0.3, color: '#bf7a3d' },
  { type: 'geometric-shapes', depth: -3, speed: 0.2, opacity: 0.5, color: '#d4a855' },
  { type: 'gradient-overlay', depth: -2, speed: 0.3, opacity: 0.2, color: '#c4b8a8' },
]

// ===== CSS FALLBACK =====

function CSSDepthLayers({ layers = defaultLayers }: { layers?: DepthLayersConfig[] }) {
  const { scrollYProgress } = useScroll()
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <div className="fixed inset-0 -z-18 pointer-events-none overflow-hidden" aria-hidden="true">
      {layers.slice(0, 3).map((layer, i) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          prefersReducedMotion ? [0, 0] : [0, -layer.speed * 200]
        )
        
        return (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              y,
              zIndex: Math.floor(layer.depth),
            }}
          >
            {layer.type === 'gradient-overlay' && (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${layer.color}${Math.floor(layer.opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                }}
              />
            )}
            {layer.type === 'light-rays' && (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${layer.color}${Math.floor(layer.opacity * 0.1 * 255).toString(16).padStart(2, '0')} 20%, transparent 40%, ${layer.color}${Math.floor(layer.opacity * 0.08 * 255).toString(16).padStart(2, '0')} 60%, transparent 80%, ${layer.color}${Math.floor(layer.opacity * 0.12 * 255).toString(16).padStart(2, '0')} 100%)`,
                }}
              />
            )}
            {layer.type === 'geometric-shapes' && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `
                    radial-gradient(circle at 20% 30%, ${layer.color} 0%, transparent 20%),
                    radial-gradient(circle at 80% 70%, ${layer.color} 0%, transparent 15%),
                    radial-gradient(circle at 50% 50%, ${layer.color} 0%, transparent 25%)
                  `,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// ===== MAIN COMPONENT =====

export interface DepthLayersProps {
  layers?: DepthLayersConfig[]
  className?: string
  enableWebGL?: boolean
}

export function DepthLayers({
  layers = defaultLayers,
  className = '',
  enableWebGL = true,
}: DepthLayersProps) {
  const [tier, setTier] = useState<'low' | 'medium' | 'high'>('low')
  
  useEffect(() => {
    setTier(getPerformanceTier())
  }, [])
  
  // For now, always use CSS fallback for stability
  // WebGL version can be added later when @react-three/fiber issues are resolved
  return <CSSDepthLayers layers={layers} />
}

export default DepthLayers
