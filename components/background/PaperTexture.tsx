'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * PaperTexture - Procedurally generated weathered paper background
 * 
 * Layers:
 * 1. Base gradient (bright center with random spots)
 * 2. SVG turbulence filter for organic grain
 * 3. Animated noise overlay with pulsing grain
 * 4. Random light spots throughout
 * 5. Floating fiber particles (optional, canvas-based)
 * 6. Animated grain particles for texture depth
 */
export function PaperTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grainCanvasRef = useRef<HTMLCanvasElement>(null)
  const [grainSeed, setGrainSeed] = useState(0)
  
  // Animated grain effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Update grain seed for subtle animation
    const grainInterval = setInterval(() => {
      setGrainSeed(prev => (prev + 1) % 100)
    }, 100) // ~10fps for subtle grain animation

    return () => clearInterval(grainInterval)
  }, [])

  // Grain canvas animation
  useEffect(() => {
    const canvas = grainCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Draw static grain
      drawGrain(ctx, canvas.width, canvas.height, 0)
      return () => window.removeEventListener('resize', resize)
    }

    let animationId: number
    let frame = 0

    const animate = () => {
      frame++
      if (frame % 6 === 0) { // ~10fps grain animation
        drawGrain(ctx, canvas.width, canvas.height, frame)
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Draw animated grain pattern
  function drawGrain(ctx: CanvasRenderingContext2D, width: number, height: number, seed: number) {
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // Simple pseudo-random based on seed
    const random = (x: number, y: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453
      return n - Math.floor(n)
    }

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width
      const y = Math.floor((i / 4) / width)
      
      // Sample every 2 pixels for performance
      if (x % 2 === 0 && y % 2 === 0) {
        const grain = random(x, y)
        const intensity = grain * 30 // Subtle grain
        
        data[i] = 120 + intensity     // R - brownish
        data[i + 1] = 100 + intensity // G
        data[i + 2] = 80 + intensity  // B
        data[i + 3] = grain * 15      // Very subtle alpha
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }
  
  // Floating fiber particles effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size - extended for scrolling
    const resize = () => {
      canvas.width = window.innerWidth
      // Extend canvas height to cover scrollable area
      canvas.height = Math.max(window.innerHeight * 2, document.documentElement.scrollHeight)
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Particle system for floating fibers
    interface Fiber {
      x: number
      y: number
      length: number
      angle: number
      speed: number
      opacity: number
      drift: number
      thickness: number
    }
    
    const fibers: Fiber[] = []
    const fiberCount = 60 // More fibers for extended height
    
    // Initialize fibers distributed throughout the extended canvas
    for (let i = 0; i < fiberCount; i++) {
      fibers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.08 + 0.02,
        drift: Math.random() * 0.002 - 0.001,
        thickness: Math.random() * 0.5 + 0.3,
      })
    }
    
    let animationId: number
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      fibers.forEach(fiber => {
        // Update position
        fiber.y += fiber.speed
        fiber.x += Math.sin(fiber.angle) * 0.3
        fiber.angle += fiber.drift
        
        // Reset if off screen
        if (fiber.y > canvas.height + 20) {
          fiber.y = -20
          fiber.x = Math.random() * canvas.width
        }
        
        // Draw fiber - darker brown fibers on light background with slight blur
        ctx.save()
        ctx.translate(fiber.x, fiber.y)
        ctx.rotate(fiber.angle)
        
        // Add subtle shadow for depth
        ctx.shadowColor = 'rgba(80, 60, 40, 0.1)'
        ctx.shadowBlur = 2
        
        ctx.strokeStyle = `rgba(120, 100, 80, ${fiber.opacity})`  // Dark brown fibers
        ctx.lineWidth = fiber.thickness
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(-fiber.length / 2, 0)
        ctx.lineTo(fiber.length / 2, 0)
        ctx.stroke()
        ctx.restore()
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
  
  return (
    <div className="paper-texture-container" aria-hidden="true">
      {/* SVG Filters for paper grain */}
      <svg className="paper-filters" aria-hidden="true">
        <defs>
          {/* Primary turbulence for paper texture */}
          <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="4"
              seed={15 + grainSeed}
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
              <feFuncR type="linear" slope="0.3" intercept="0" />
              <feFuncG type="linear" slope="0.3" intercept="0" />
              <feFuncB type="linear" slope="0.3" intercept="0" />
              <feFuncA type="linear" slope="0.15" intercept="0" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="grain" mode="overlay" />
          </filter>
          
          {/* Secondary subtle displacement for paper imperfections */}
          <filter id="paper-texture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed="42"
              result="warp"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warp"
              scale="3"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          
          {/* Fine grain overlay with animation seed */}
          <filter id="fine-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.5"
              numOctaves="2"
              seed={100 + (grainSeed * 3)}
              result="fineNoise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.08 0"
              in="fineNoise"
            />
          </filter>
        </defs>
      </svg>
      
      {/* Layer 1: Base gradient */}
      <div className="paper-base" />
      
      {/* Layer 2: Primary grain texture */}
      <div className="paper-grain" />
      
      {/* Layer 3: Animated noise overlay */}
      <div className="paper-noise" />
      
      {/* Layer 4: Animated micro-grain canvas */}
      <canvas ref={grainCanvasRef} className="paper-micro-grain" />
      
      {/* Layer 5: Vignette effect */}
      <div className="paper-vignette" />
      
      {/* Layer 6: Floating fiber particles */}
      <canvas ref={canvasRef} className="paper-fibers" />
      
      <style jsx>{`
        .paper-texture-container {
          position: fixed;
          inset: 0;
          width: 100%;
          min-height: 100vh;
          z-index: -1;
          overflow: visible;
          pointer-events: none;
        }
        
        .paper-filters {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        
        .paper-base {
          position: absolute;
          inset: 0;
          width: 100%;
          min-height: 200vh; /* Extended for scrolling */
          background: 
            /* Bright center spot - aged paper color */
            radial-gradient(
              ellipse 100% 60% at 50% 30%,
              rgba(248, 240, 225, 0.95) 0%,  /* Very light cream */
              rgba(232, 221, 210, 0.92) 30%, /* Light beige */
              rgba(212, 196, 176, 0.98) 60%, /* Beige */
              #d4c4b0 100%                   /* Base beige */
            ),
            /* Random bright spots throughout - lighter aged spots */
            radial-gradient(
              circle at 20% 15%,
              rgba(250, 245, 235, 0.8) 0%,  /* Almost white cream */
              transparent 25%
            ),
            radial-gradient(
              circle at 70% 25%,
              rgba(245, 238, 225, 0.7) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at 35% 45%,
              rgba(248, 240, 228, 0.6) 0%,
              transparent 35%
            ),
            radial-gradient(
              circle at 85% 60%,
              rgba(242, 235, 220, 0.7) 0%,
              transparent 30%
            ),
            radial-gradient(
              circle at 15% 70%,
              rgba(245, 238, 225, 0.6) 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at 60% 85%,
              rgba(248, 242, 230, 0.7) 0%,
              transparent 30%
            ),
            /* Darker aged spots for texture */
            radial-gradient(
              circle at 25% 35%,
              rgba(180, 160, 140, 0.3) 0%,  /* Light brown spots */
              transparent 20%
            ),
            radial-gradient(
              circle at 65% 55%,
              rgba(170, 150, 130, 0.25) 0%,
              transparent 25%
            ),
            radial-gradient(
              circle at 45% 120%,
              rgba(240, 232, 218, 0.6) 0%,
              transparent 35%
            ),
            radial-gradient(
              circle at 75% 140%,
              rgba(245, 238, 225, 0.7) 0%,
              transparent 30%
            ),
            linear-gradient(
              180deg,
              #d4c4b0 0%,     /* Base beige */
              #d8c8b4 50%,    /* Slightly lighter middle */
              #d4c4b0 100%    /* Base beige */
            );
        }
        
        .paper-grain {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 220%; /* Extended for scrolling */
          background: 
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='%23866450'/%3E%3C/svg%3E");
          opacity: 0.08;  /* Lighter opacity for light background */
          mix-blend-mode: multiply;  /* Better for light backgrounds */
          animation: grain-drift 20s ease-in-out infinite alternate, grain-pulse 4s ease-in-out infinite;
        }
        
        .paper-noise {
          position: absolute;
          inset: 0;
          min-height: 200vh; /* Extended for scrolling */
          background: 
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' fill='%237a6850'/%3E%3C/svg%3E");
          opacity: 0.04;  /* Very subtle for light background */
          mix-blend-mode: multiply;
          animation: noise-shift 15s ease-in-out infinite alternate-reverse;
        }
        
        .paper-micro-grain {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        
        .paper-vignette {
          position: absolute;
          inset: 0;
          min-height: 200vh; /* Extended for scrolling */
          background: 
            /* Subtle aged edge darkening - brown tones */
            linear-gradient(
              90deg,
              rgba(160, 140, 120, 0.15) 0%,  /* Light brown edges */
              transparent 5%,
              transparent 95%,
              rgba(160, 140, 120, 0.15) 100%
            ),
            linear-gradient(
              180deg,
              rgba(150, 130, 110, 0.1) 0%,
              transparent 3%,
              transparent 97%,
              rgba(140, 120, 100, 0.2) 100%
            );
        }
        
        .paper-fibers {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 200vh; /* Extended for scrolling */
          opacity: 0.6;
        }
        
        @keyframes grain-drift {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-2%, -1%) scale(1.02);
          }
        }
        
        @keyframes grain-pulse {
          0%, 100% {
            opacity: 0.06;
          }
          50% {
            opacity: 0.1;
          }
        }
        
        @keyframes noise-shift {
          0% {
            transform: translate(0, 0);
            opacity: 0.06;
          }
          50% {
            opacity: 0.08;
          }
          100% {
            transform: translate(1%, 0.5%);
            opacity: 0.06;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .paper-grain,
          .paper-noise {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
