'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PoemLineProps {
  children: string
  className?: string
  enableInkBleed?: boolean
  delay?: number
}

/**
 * PoemLine - Individual line of poetry with premium typography and ink bleed effects
 * 
 * Features:
 * - Fluid typography with CSS custom properties
 * - Devanagari-optimized letter and word spacing
 * - Subtle ink bleed animation on character edges
 * - Handwritten text feel with slight imperfections
 * - Optional reveal animation with delay
 * - Enhanced first-letter styling
 * - Responsive adjustments for mobile and desktop
 */
export function PoemLine({ 
  children, 
  className, 
  enableInkBleed = true,
  delay = 0 
}: PoemLineProps) {
  const lineRef = useRef<HTMLParagraphElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (lineRef.current) {
      observer.observe(lineRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <p 
      ref={lineRef}
      className={cn(
        'poem-line',
        enableInkBleed && 'ink-bleed-effect',
        isVisible && 'poem-line-visible',
        isHovered && 'poem-line-hover',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--delay': `${delay}ms`,
      } as React.CSSProperties}
    >
      <span className="poem-line-text">
        {children}
      </span>
      
      {/* Ink bleed SVG filter */}
      <svg className="ink-filters" aria-hidden="true">
        <defs>
          <filter id="ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
            {/* Subtle blur for ink spread */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
            
            {/* Turbulence for organic imperfections */}
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.04" 
              numOctaves="3" 
              seed="15"
              result="noise" 
            />
            
            {/* Displace based on noise for irregular edges */}
            <feDisplacementMap
              in="blur"
              in2="noise"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            
            {/* Composite with original for clarity */}
            <feComposite 
              in="SourceGraphic" 
              in2="displaced" 
              operator="over"
            />
          </filter>
          
          {/* Hover state with more pronounced bleed */}
          <filter id="ink-bleed-hover" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.05" 
              numOctaves="4" 
              seed="20"
              result="noise" 
            />
            <feDisplacementMap
              in="blur"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feComposite 
              in="SourceGraphic" 
              in2="displaced" 
              operator="over"
            />
          </filter>
        </defs>
      </svg>
      
      <style jsx>{`
        .poem-line {
          font-family: var(--font-poem);
          line-height: var(--line-height-poem, 2);
          letter-spacing: var(--letter-spacing-devanagari, -0.005em);
          word-spacing: clamp(0.05em, 0.03em + 0.02vw, 0.08em);
          display: block;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(8px);
          text-rendering: optimizeLegibility;
          font-feature-settings: "kern" 1, "liga" 1;
          will-change: opacity, transform;
        }
        
        .poem-line-visible {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--delay, 0ms);
        }
        
        .poem-line-text {
          display: inline;
          position: relative;
          transition: all 0.3s ease;
        }
        
        /* Enhanced first-letter styling with fluid sizing */
        .poem-line::first-letter {
          font-size: clamp(1.1em, 1.08em + 0.1vw, 1.15em);
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        
        /* Ink bleed effect - subtle text shadow and filter */
        .ink-bleed-effect .poem-line-text {
          /* Subtle ink spread shadow with fluid blur radius */
          text-shadow: 
            0 0 clamp(0.4px, 0.3px + 0.05vw, 0.6px) currentColor,
            clamp(0.2px, 0.2px + 0.05vw, 0.4px) clamp(0.2px, 0.2px + 0.05vw, 0.4px) clamp(0.6px, 0.5px + 0.1vw, 1px) rgba(0, 0, 0, 0.15),
            clamp(-0.15px, -0.1px, -0.05px) clamp(0.15px, 0.1px + 0.05vw, 0.25px) clamp(0.4px, 0.4px + 0.1vw, 0.8px) rgba(0, 0, 0, 0.1);
          
          /* Apply SVG filter for organic look */
          filter: url(#ink-bleed);
          will-change: text-shadow, filter;
        }
        
        .ink-bleed-effect.poem-line-hover .poem-line-text {
          /* Enhanced bleed on hover */
          text-shadow: 
            0 0 1px currentColor,
            0.5px 0.5px 1.2px rgba(0, 0, 0, 0.2),
            -0.3px 0.3px 0.8px rgba(0, 0, 0, 0.15);
          filter: url(#ink-bleed-hover);
        }
        
        /* Ink soak animation - subtle darkening spread */
        @keyframes ink-soak {
          0%, 100% {
            text-shadow: 
              0 0 0.5px currentColor,
              0.3px 0.3px 0.8px rgba(0, 0, 0, 0.15);
          }
          50% {
            text-shadow: 
              0 0 1px currentColor,
              0.4px 0.4px 1px rgba(0, 0, 0, 0.18),
              -0.2px 0.2px 0.6px rgba(0, 0, 0, 0.12);
          }
        }
        
        .ink-bleed-effect .poem-line-text {
          animation: ink-soak 8s ease-in-out infinite;
        }
        
        .ink-filters {
          position: absolute;
          width: 0;
          height: 0;
          pointer-events: none;
        }
        
        /* Mobile-specific adjustments */
        @media (max-width: 640px) {
          .poem-line {
            /* Slightly increase letter-spacing for better mobile readability */
            letter-spacing: clamp(-0.005em, 0em, 0.01em);
            word-spacing: clamp(0.04em, 0.03em + 0.02vw, 0.06em);
          }
        }
        
        /* Large screen optimizations */
        @media (min-width: 1024px) {
          .poem-line {
            /* Tighten letter-spacing slightly for desktop */
            letter-spacing: clamp(-0.015em, -0.01em, -0.005em);
            /* Increase line-height for comfortable reading */
            line-height: clamp(2, 1.9 + 0.2vw, 2.3);
          }
        }
        
        /* Reduce animations for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .poem-line {
            opacity: 1;
            transform: none;
            transition: none;
          }
          
          .ink-bleed-effect .poem-line-text {
            animation: none;
            will-change: auto;
          }
        }
      `}</style>
    </p>
  )
}
