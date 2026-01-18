'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { getPerformanceTier } from '@/lib/performance-utils'

// ===== PARTICLE TYPES =====

export type ParticleType = 'fireflies' | 'dust' | 'embers' | 'stars'

interface ParticleConfig {
  color: string
  glowColor: string
  size: [number, number]
  speed: [number, number]
  opacity: [number, number]
  glow: boolean
  pulseSpeed: number
  turbulence: number
}

const particleConfigs: Record<ParticleType, ParticleConfig> = {
  fireflies: {
    color: '#ffdc96',
    glowColor: '#d4a855',
    size: [0.02, 0.06],
    speed: [0.001, 0.003],
    opacity: [0.3, 0.8],
    glow: true,
    pulseSpeed: 0.5,
    turbulence: 0.3,
  },
  dust: {
    color: '#c4b8a8',
    glowColor: '#a89888',
    size: [0.01, 0.03],
    speed: [0.0005, 0.001],
    opacity: [0.1, 0.3],
    glow: false,
    pulseSpeed: 0.1,
    turbulence: 0.1,
  },
  embers: {
    color: '#ff9944',
    glowColor: '#ff6622',
    size: [0.02, 0.05],
    speed: [0.002, 0.005],
    opacity: [0.4, 0.9],
    glow: true,
    pulseSpeed: 0.8,
    turbulence: 0.5,
  },
  stars: {
    color: '#ffffff',
    glowColor: '#aaccff',
    size: [0.01, 0.04],
    speed: [0.0001, 0.0003],
    opacity: [0.2, 0.6],
    glow: true,
    pulseSpeed: 0.2,
    turbulence: 0.05,
  },
}

// ===== CANVAS 2D PARTICLES =====

interface Canvas2DParticlesProps {
  type: ParticleType
  count: number
}

function Canvas2DParticles({ type, count }: Canvas2DParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const config = particleConfigs[type]
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    interface Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      phase: number
    }
    
    const particles: Particle[] = []
    
    for (let i = 0; i < count; i++) {
      const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0])
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: (config.size[0] + Math.random() * (config.size[1] - config.size[0])) * 50,
        speedX: (Math.random() - 0.5) * speed * 100,
        speedY: (Math.random() - 0.5) * speed * 100,
        opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
        phase: Math.random() * Math.PI * 2,
      })
    }
    
    let animationId: number
    let time = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016
      
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.speedX
          p.y += p.speedY
          
          if (p.x < 0) p.x = canvas.width
          if (p.x > canvas.width) p.x = 0
          if (p.y < 0) p.y = canvas.height
          if (p.y > canvas.height) p.y = 0
        }
        
        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(time * config.pulseSpeed + p.phase))
        
        if (config.glow) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
          gradient.addColorStop(0, `${config.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(0.5, `${config.glowColor}${Math.floor(currentOpacity * 0.3 * 255).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(1, 'transparent')
          
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${config.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    if (!prefersReducedMotion) {
      animate()
    } else {
      // Draw static particles
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${config.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })
    }
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [count, type, config, prefersReducedMotion])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-15 pointer-events-none"
      aria-hidden="true"
    />
  )
}

// ===== MAIN COMPONENT =====

export interface AmbientParticlesProps {
  type?: ParticleType
  count?: number
  className?: string
  enableWebGL?: boolean
  mouseRepulsion?: boolean
}

export function AmbientParticles({
  type = 'fireflies',
  count = 50,
  className = '',
  enableWebGL = true,
  mouseRepulsion = true,
}: AmbientParticlesProps) {
  const [tier, setTier] = useState<'low' | 'medium' | 'high'>('low')
  
  useEffect(() => {
    const detectedTier = getPerformanceTier()
    setTier(detectedTier)
  }, [])
  
  // Adjust count based on performance tier
  const adjustedCount = useMemo(() => {
    switch (tier) {
      case 'low':
        return Math.floor(count * 0.3)
      case 'medium':
        return Math.floor(count * 0.6)
      default:
        return count
    }
  }, [tier, count])
  
  // Use Canvas2D for stability
  return <Canvas2DParticles type={type} count={adjustedCount} />
}

export default AmbientParticles
