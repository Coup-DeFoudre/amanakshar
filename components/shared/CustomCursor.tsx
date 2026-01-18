'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

// ============================================================================
// Types
// ============================================================================

type CursorState = 'default' | 'hover' | 'click' | 'magnetic' | 'drag'

interface MagneticElement {
  element: HTMLElement
  rect: DOMRect
  strength: number
}

interface TrailPoint {
  x: number
  y: number
  opacity: number
  velocity: number
}

interface CursorHint {
  text: string
  textHindi?: string
  x: number
  y: number
}

// ============================================================================
// Constants
// ============================================================================

const MAGNETIC_THRESHOLD = 100 // pixels
const MAGNETIC_MAX_DISPLACEMENT = 40 // pixels
const MAGNETIC_STIFFNESS = 400
const DEFAULT_STIFFNESS = 300
const DEFAULT_DAMPING = 28
const TRAIL_LENGTH = 20

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate distance between two points
 */
function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * Calculate magnetic attraction strength (0-1) based on distance
 */
function getMagneticStrength(distance: number, threshold: number): number {
  if (distance >= threshold) return 0
  // Exponential easing for natural attraction
  const normalizedDistance = distance / threshold
  return Math.pow(1 - normalizedDistance, 2)
}

/**
 * Calculate displacement towards target with max limit
 */
function getMagneticDisplacement(
  cursorX: number,
  cursorY: number,
  targetX: number,
  targetY: number,
  strength: number,
  maxDisplacement: number
): { dx: number; dy: number } {
  const dx = (targetX - cursorX) * strength
  const dy = (targetY - cursorY) * strength
  
  // Clamp displacement
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance > maxDisplacement) {
    const scale = maxDisplacement / distance
    return { dx: dx * scale, dy: dy * scale }
  }
  
  return { dx, dy }
}

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Hook to detect desktop with pointer
 */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    const checkDesktop = () => {
      const hasPointer = window.matchMedia('(pointer: fine)').matches
      const notTouch = !('ontouchstart' in window)
      const wideScreen = window.innerWidth >= 1024
      setIsDesktop(hasPointer && notTouch && wideScreen)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  return isDesktop
}

/**
 * Hook to track magnetic elements
 */
function useMagneticElements(): MagneticElement[] {
  const [magneticElements, setMagneticElements] = useState<MagneticElement[]>([])
  
  useEffect(() => {
    const updateMagneticElements = () => {
      const elements = document.querySelectorAll('[data-cursor-magnetic]')
      const mapped: MagneticElement[] = Array.from(elements).map((el) => {
        const htmlEl = el as HTMLElement
        const strength = parseFloat(htmlEl.dataset.cursorMagneticStrength || '1')
        return {
          element: htmlEl,
          rect: htmlEl.getBoundingClientRect(),
          strength: Math.min(Math.max(strength, 0), 2), // Clamp 0-2
        }
      })
      setMagneticElements(mapped)
    }
    
    // Initial update
    updateMagneticElements()
    
    // Update on scroll and resize
    window.addEventListener('scroll', updateMagneticElements, { passive: true })
    window.addEventListener('resize', updateMagneticElements, { passive: true })
    
    // MutationObserver for dynamic elements
    const observer = new MutationObserver(updateMagneticElements)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => {
      window.removeEventListener('scroll', updateMagneticElements)
      window.removeEventListener('resize', updateMagneticElements)
      observer.disconnect()
    }
  }, [])
  
  return magneticElements
}

/**
 * Hook for cursor hint detection
 */
function useCursorHint(
  mouseX: number,
  mouseY: number,
  cursorState: CursorState
): CursorHint | null {
  const [hint, setHint] = useState<CursorHint | null>(null)
  
  useEffect(() => {
    if (cursorState !== 'magnetic') {
      setHint(null)
      return
    }
    
    const hoveredElement = document.elementFromPoint(mouseX, mouseY)
    if (!hoveredElement) {
      setHint(null)
      return
    }
    
    const magneticParent = hoveredElement.closest('[data-cursor-magnetic]') as HTMLElement | null
    if (!magneticParent) {
      setHint(null)
      return
    }
    
    const hintText = magneticParent.dataset.cursorHint
    const hintTextHindi = magneticParent.dataset.cursorHintHindi
    
    if (hintText) {
      setHint({
        text: hintText,
        textHindi: hintTextHindi,
        x: mouseX,
        y: mouseY,
      })
    } else {
      setHint(null)
    }
  }, [mouseX, mouseY, cursorState])
  
  return hint
}

// ============================================================================
// Component
// ============================================================================

/**
 * CustomCursor - Elegant quill/pen cursor for desktop
 * 
 * Features:
 * - Custom quill icon cursor
 * - Smooth motion following mouse
 * - Context-aware states (default, hover, click, magnetic, drag)
 * - Magnetic attraction zones around interactive elements
 * - Trail effect for poetic atmosphere
 * - Cursor hints near magnetic zones
 * - Only visible on desktop with mouse
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>('default')
  const [isDragging, setIsDragging] = useState(false)
  const trailRef = useRef<TrailPoint[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const lastVelocityRef = useRef(0)
  
  const isDesktop = useIsDesktop()
  const magneticElements = useMagneticElements()
  
  // Raw mouse position
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  
  // Magnetic displacement
  const magneticDx = useMotionValue(0)
  const magneticDy = useMotionValue(0)
  
  // Spring configs based on state
  const springConfig = useMemo(() => ({
    stiffness: cursorState === 'magnetic' ? MAGNETIC_STIFFNESS : DEFAULT_STIFFNESS,
    damping: DEFAULT_DAMPING,
  }), [cursorState])
  
  // Final cursor position with spring
  const cursorX = useSpring(rawMouseX, springConfig)
  const cursorY = useSpring(rawMouseY, springConfig)
  
  // Cursor hint
  const [actualMousePos, setActualMousePos] = useState({ x: 0, y: 0 })
  const cursorHint = useCursorHint(actualMousePos.x, actualMousePos.y, cursorState)
  
  // Calculate nearest magnetic target and update cursor
  const updateMagneticState = useCallback((mouseX: number, mouseY: number) => {
    let nearestElement: MagneticElement | null = null
    let nearestDistance = Infinity
    let nearestCenterX = 0
    let nearestCenterY = 0
    
    for (const magEl of magneticElements) {
      const centerX = magEl.rect.left + magEl.rect.width / 2
      const centerY = magEl.rect.top + magEl.rect.height / 2
      const distance = getDistance(mouseX, mouseY, centerX, centerY)
      
      if (distance < MAGNETIC_THRESHOLD * magEl.strength && distance < nearestDistance) {
        nearestElement = magEl
        nearestDistance = distance
        nearestCenterX = centerX
        nearestCenterY = centerY
      }
    }
    
    if (nearestElement) {
      const strength = getMagneticStrength(
        nearestDistance,
        MAGNETIC_THRESHOLD * nearestElement.strength
      )
      const { dx, dy } = getMagneticDisplacement(
        mouseX,
        mouseY,
        nearestCenterX,
        nearestCenterY,
        strength,
        MAGNETIC_MAX_DISPLACEMENT * nearestElement.strength
      )
      
      magneticDx.set(dx)
      magneticDy.set(dy)
      
      if (strength > 0.1) {
        setCursorState('magnetic')
        return true
      }
    }
    
    magneticDx.set(0)
    magneticDy.set(0)
    return false
  }, [magneticElements, magneticDx, magneticDy])
  
  // Track mouse movement
  useEffect(() => {
    if (!isDesktop) return
    
    let lastX = 0
    let lastY = 0
    let lastTime = performance.now()
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now()
      const dt = currentTime - lastTime
      
      // Calculate velocity
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const velocity = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0
      lastVelocityRef.current = velocity
      
      lastX = e.clientX
      lastY = e.clientY
      lastTime = currentTime
      
      setActualMousePos({ x: e.clientX, y: e.clientY })
      
      // Update magnetic state
      const isMagnetic = updateMagneticState(e.clientX, e.clientY)
      
      // Apply position with magnetic offset
      rawMouseX.set(e.clientX + magneticDx.get())
      rawMouseY.set(e.clientY + magneticDy.get())
      
      setIsVisible(true)
      
      // Add to trail with velocity-based size
      const trailOpacity = Math.min(0.8, 0.4 + velocity * 0.5)
      trailRef.current.push({ 
        x: e.clientX, 
        y: e.clientY, 
        opacity: trailOpacity,
        velocity,
      })
      
      // Keep trail length based on state
      const maxTrailLength = cursorState === 'magnetic' ? TRAIL_LENGTH : 15
      if (trailRef.current.length > maxTrailLength) {
        trailRef.current.shift()
      }
    }
    
    const handleMouseDown = (e: MouseEvent) => {
      setCursorState('click')
      
      // Check for draggable elements
      const target = e.target as HTMLElement
      if (target.closest('[draggable="true"]') || target.closest('[data-cursor-drag]')) {
        setIsDragging(true)
        setCursorState('drag')
      }
    }
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
      }
      // Reset to appropriate state after click
      setTimeout(() => {
        if (!isDragging) {
          const isMagnetic = updateMagneticState(rawMouseX.get(), rawMouseY.get())
          if (!isMagnetic) {
            setCursorState('default')
          }
        }
      }, 50)
    }
    
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    // Detect hoverable elements (throttled)
    let hoverCheckTimeout: NodeJS.Timeout
    const handleHoverCheck = () => {
      clearTimeout(hoverCheckTimeout)
      hoverCheckTimeout = setTimeout(() => {
        if (cursorState === 'magnetic' || isDragging) return
        
        const hoveredElement = document.elementFromPoint(
          rawMouseX.get() - magneticDx.get(),
          rawMouseY.get() - magneticDy.get()
        )
        
        if (hoveredElement) {
          const isHoverable = 
            hoveredElement.matches('a, button, [role="button"], input, textarea, select, [data-cursor-hover]') ||
            hoveredElement.closest('a, button, [role="button"]')
          
          if (isHoverable && cursorState !== 'click') {
            setCursorState('hover')
          } else if (cursorState === 'hover') {
            setCursorState('default')
          }
        }
      }, 16) // ~60fps
    }
    
    const hoverInterval = setInterval(handleHoverCheck, 50)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      clearInterval(hoverInterval)
      clearTimeout(hoverCheckTimeout)
    }
  }, [isDesktop, rawMouseX, rawMouseY, magneticDx, magneticDy, cursorState, isDragging, updateMagneticState])
  
  // Animate ink trail
  useEffect(() => {
    if (!isDesktop || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    updateCanvasSize()
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Decay trail opacity with velocity-based sizing
      trailRef.current.forEach((point, i) => {
        point.opacity *= 0.9
        
        if (point.opacity > 0.05) {
          // Velocity-based particle size
          const baseSize = cursorState === 'magnetic' ? 3 : 2
          const velocityBoost = Math.min(point.velocity * 0.5, 2)
          const size = (baseSize + velocityBoost) * point.opacity
          
          ctx.beginPath()
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
          
          // Color based on cursor state
          const alpha = point.opacity * 0.3
          if (cursorState === 'magnetic') {
            ctx.fillStyle = `rgba(212, 168, 85, ${alpha * 1.5})`
          } else {
            ctx.fillStyle = `rgba(212, 168, 85, ${alpha})`
          }
          
          ctx.fill()
        }
      })
      
      // Remove faded points
      trailRef.current = trailRef.current.filter(p => p.opacity > 0.05)
      
      frameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    window.addEventListener('resize', updateCanvasSize)
    
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [isDesktop, cursorState])
  
  if (!isDesktop) return null
  
  // Calculate cursor scale and glow based on state
  const getCursorStyles = () => {
    switch (cursorState) {
      case 'click':
        return { scale: 0.8, glow: 'drop-shadow(0 0 4px rgba(212, 168, 85, 0.3))' }
      case 'hover':
        return { scale: 1.2, glow: 'drop-shadow(0 0 12px rgba(212, 168, 85, 0.6))' }
      case 'magnetic':
        return { scale: 1.4, glow: 'drop-shadow(0 0 20px rgba(212, 168, 85, 0.8))' }
      case 'drag':
        return { scale: 1.1, glow: 'drop-shadow(0 0 8px rgba(212, 168, 85, 0.5))' }
      default:
        return { scale: 1, glow: 'drop-shadow(0 0 4px rgba(212, 168, 85, 0.3))' }
    }
  }
  
  const cursorStyles = getCursorStyles()
  
  return (
    <>
      {/* Hide default cursor globally when custom cursor is active */}
      <style jsx global>{`
        @media (pointer: fine) and (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
      
      {/* Ink trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        aria-hidden="true"
      />
      
      {/* Cursor hint */}
      <AnimatePresence>
        {cursorHint && (
          <motion.div
            className="fixed pointer-events-none z-[9997] bg-bg-elevated/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-divider shadow-lg"
            style={{
              x: cursorHint.x + 30,
              y: cursorHint.y + 10,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {cursorHint.textHindi && (
                <span className="text-text-primary mr-1">{cursorHint.textHindi}</span>
              )}
              <span className="text-text-muted">{cursorHint.text}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: cursorStyles.scale,
          rotate: cursorState === 'drag' ? 15 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Quill/Pen cursor SVG */}
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform -rotate-45"
          style={{
            filter: cursorStyles.glow,
          }}
          animate={{
            // Motion blur stretch effect for magnetic state
            scaleX: cursorState === 'magnetic' ? 1.2 : 1,
            scaleY: cursorState === 'magnetic' ? 0.9 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Quill feather body */}
          <path
            d="M4 28C4 28 6 20 10 16C14 12 28 4 28 4C28 4 26 8 22 12C18 16 12 22 10 24C8 26 4 28 4 28Z"
            fill="url(#quill-gradient)"
            stroke="#d4a855"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Quill spine */}
          <path
            d="M8 24L24 8"
            stroke="#bf7a3d"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Nib tip */}
          <path
            d="M4 28L8 24"
            stroke="#0a0908"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Ink drop at tip */}
          <motion.circle
            cx="5"
            cy="27"
            r="1.5"
            fill="#0a0908"
            animate={{
              r: cursorState === 'click' ? 3 : 1.5,
              opacity: cursorState === 'click' ? [1, 0.5, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          
          <defs>
            <linearGradient id="quill-gradient" x1="4" y1="28" x2="28" y2="4">
              <stop offset="0%" stopColor="#bf7a3d" />
              <stop offset="50%" stopColor="#d4a855" />
              <stop offset="100%" stopColor="#f5e6c8" />
            </linearGradient>
          </defs>
        </motion.svg>
        
        {/* Hover/Magnetic ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ width: 32, height: 32, marginLeft: -16, marginTop: -16 }}
          animate={{
            scale: cursorState === 'hover' ? 1.5 : cursorState === 'magnetic' ? 2 : 0,
            opacity: cursorState === 'hover' || cursorState === 'magnetic' ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full border"
            style={{
              borderColor: cursorState === 'magnetic' ? 'rgba(212, 168, 85, 0.8)' : 'rgba(212, 168, 85, 0.5)',
              boxShadow: cursorState === 'magnetic' 
                ? '0 0 25px rgba(212, 168, 85, 0.6), inset 0 0 10px rgba(212, 168, 85, 0.2)'
                : '0 0 15px rgba(212, 168, 85, 0.4)',
            }}
            animate={{
              scale: cursorState === 'magnetic' ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: cursorState === 'magnetic' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        
        {/* Click ink splash effect */}
        <AnimatePresence>
          {cursorState === 'click' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-accent-gold"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{ 
                    x: Math.cos(i * (Math.PI / 3)) * 30,
                    y: Math.sin(i * (Math.PI / 3)) * 30,
                    scale: [0, 1.5, 0],
                    opacity: [1, 0.8, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
