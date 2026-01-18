'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * MidnightInk - Immersive dark background for the poet's world
 * 
 * Layers:
 * 1. Deep black gradient base with warm undertones
 * 2. Radial golden glow spots (like distant diyas)
 * 3. Subtle noise texture (ink grain)
 * 4. Floating golden particles (fireflies/sparks)
 * 5. Aurora-like subtle color waves
 * 6. Parallax effect on scroll
 */
export function MidnightInk() {
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Hide on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Mouse parallax for glow spots
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Floating particles effect - golden fireflies
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(window.innerHeight * 2, document.documentElement.scrollHeight)
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Particle system for floating golden sparks
    interface Particle {
      x: number
      y: number
      size: number
      speedY: number
      speedX: number
      opacity: number
      pulse: number
      pulseSpeed: number
      parallaxFactor: number
    }
    
    const particles: Particle[] = []
    const particleCount = 40
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.2 - 0.1,
        speedX: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        parallaxFactor: Math.random() * 0.5 + 0.2, // Each particle has unique parallax
      })
    }
    
    let animationId: number
    let lastScrollY = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Get current scroll for parallax
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY
      
      particles.forEach(particle => {
        // Update position
        particle.y += particle.speedY
        particle.x += particle.speedX
        particle.pulse += particle.pulseSpeed
        
        // Apply parallax based on scroll
        particle.y -= scrollDelta * particle.parallaxFactor * 0.1
        
        // Wrap around edges
        if (particle.y < -10) particle.y = canvas.height + 10
        if (particle.y > canvas.height + 10) particle.y = -10
        if (particle.x < -10) particle.x = canvas.width + 10
        if (particle.x > canvas.width + 10) particle.x = -10
        
        // Pulsing opacity
        const currentOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse))
        
        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        )
        gradient.addColorStop(0, `rgba(212, 168, 85, ${currentOpacity})`)
        gradient.addColorStop(0.5, `rgba(212, 168, 85, ${currentOpacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(212, 168, 85, 0)')
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        
        // Core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 220, 150, ${currentOpacity})`
        ctx.fill()
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      animate()
    }
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  // Calculate parallax transforms
  const parallaxSlow = scrollY * 0.1
  const parallaxMedium = scrollY * 0.2
  const parallaxFast = scrollY * 0.3
  
  return (
    <div 
      ref={containerRef}
      className="midnight-ink-container" 
      aria-hidden="true"
    >
      {/* SVG Filters */}
      <svg className="midnight-filters" aria-hidden="true">
        <defs>
          {/* Noise filter for grain texture */}
          <filter id="ink-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              seed="42"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="mono"
            />
            <feComponentTransfer in="mono" result="grain">
              <feFuncR type="linear" slope="0.15" intercept="0" />
              <feFuncG type="linear" slope="0.15" intercept="0" />
              <feFuncB type="linear" slope="0.15" intercept="0" />
              <feFuncA type="linear" slope="0.08" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      
      {/* Layer 1: Base gradient - no parallax */}
      <div className="midnight-base" />
      
      {/* Layer 2: Golden glow spots - slow parallax + mouse follow */}
      <div 
        className="midnight-glows"
        style={{
          transform: `translate3d(${mousePosition.x}px, ${-parallaxSlow + mousePosition.y}px, 0)`,
        }}
      />
      
      {/* Layer 3: Secondary glow spots - medium parallax */}
      <div 
        className="midnight-glows-secondary"
        style={{
          transform: `translate3d(${-mousePosition.x * 0.5}px, ${-parallaxMedium}px, 0)`,
        }}
      />
      
      {/* Layer 4: Noise texture - fast parallax */}
      <div 
        className="midnight-grain"
        style={{
          transform: `translate3d(0, ${-parallaxFast}px, 0)`,
        }}
      />
      
      {/* Layer 5: Aurora effect - medium parallax */}
      <div 
        className="midnight-aurora"
        style={{
          transform: `translate3d(${mousePosition.x * 0.3}px, ${-parallaxMedium}px, 0)`,
        }}
      />
      
      {/* Layer 6: Floating particles */}
      <canvas ref={canvasRef} className="midnight-particles" />
      
      {/* Layer 7: Vignette - no parallax */}
      <div className="midnight-vignette" />
      
      <style jsx>{`
        .midnight-ink-container {
          position: fixed;
          inset: 0;
          width: 100%;
          min-height: 100vh;
          z-index: -1;
          overflow: visible;
          pointer-events: none;
        }
        
        .midnight-filters {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        
        .midnight-base {
          position: absolute;
          inset: 0;
          min-height: 200vh;
          background: #0a0908;
          background-image: 
            /* Deep warm black base */
            linear-gradient(
              180deg,
              #0a0908 0%,
              #0d0b09 30%,
              #0a0908 60%,
              #080706 100%
            );
        }
        
        .midnight-glows {
          position: absolute;
          inset: 0;
          min-height: 200vh;
          will-change: transform;
          transition: transform 0.1s ease-out;
          background: 
            /* Central diya glow */
            radial-gradient(
              ellipse 60% 40% at 50% 30%,
              rgba(212, 168, 85, 0.08) 0%,
              transparent 50%
            ),
            /* Corner glows */
            radial-gradient(
              circle at 10% 20%,
              rgba(212, 168, 85, 0.05) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 40%,
              rgba(191, 122, 61, 0.04) 0%,
              transparent 35%
            );
        }
        
        .midnight-glows-secondary {
          position: absolute;
          inset: 0;
          min-height: 200vh;
          will-change: transform;
          transition: transform 0.15s ease-out;
          background: 
            radial-gradient(
              circle at 20% 70%,
              rgba(212, 168, 85, 0.03) 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(191, 122, 61, 0.05) 0%,
              transparent 30%
            ),
            /* Bottom glow for stage feel */
            radial-gradient(
              ellipse 100% 30% at 50% 100%,
              rgba(212, 168, 85, 0.06) 0%,
              transparent 60%
            );
        }
        
        .midnight-grain {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 220%;
          will-change: transform;
          background: 
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23c4b8a8'/%3E%3C/svg%3E");
          opacity: 0.03;
          mix-blend-mode: overlay;
        }
        
        .midnight-aurora {
          position: absolute;
          inset: 0;
          min-height: 200vh;
          will-change: transform;
          transition: transform 0.2s ease-out;
          background: 
            /* Subtle aurora bands */
            linear-gradient(
              135deg,
              transparent 0%,
              rgba(212, 168, 85, 0.02) 20%,
              transparent 40%,
              rgba(191, 122, 61, 0.015) 60%,
              transparent 80%
            );
          animation: aurora-shift 30s ease-in-out infinite alternate;
        }
        
        .midnight-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 200vh;
          opacity: 0.8;
        }
        
        .midnight-vignette {
          position: absolute;
          inset: 0;
          min-height: 200vh;
          background: 
            /* Edge darkening */
            linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.3) 0%,
              transparent 10%,
              transparent 90%,
              rgba(0, 0, 0, 0.3) 100%
            ),
            /* Top/bottom vignette */
            radial-gradient(
              ellipse 100% 100% at 50% 50%,
              transparent 40%,
              rgba(0, 0, 0, 0.4) 100%
            );
        }
        
        @keyframes aurora-shift {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-5%) scale(1.05);
            opacity: 0.8;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .midnight-aurora {
            animation: none;
          }
          
          .midnight-glows,
          .midnight-glows-secondary,
          .midnight-grain,
          .midnight-aurora {
            transition: none;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  )
}
