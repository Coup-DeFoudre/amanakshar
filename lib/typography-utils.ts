/**
 * =============================================================================
 * TYPOGRAPHY UTILITIES FOR DEVANAGARI TEXT
 * =============================================================================
 * 
 * This module provides utility functions for text measurement, balancing,
 * and optimal typography rendering specifically optimized for Hindi/Devanagari
 * script in the Aman Akshar poetry website.
 * 
 * Key features:
 * - Text width measurement for layout calculations
 * - Devanagari text detection and optimization
 * - Line balancing to prevent orphans and widows
 * - Responsive typography hooks for React components
 * - Typography scale constants for consistent styling
 * 
 * Usage:
 * ```tsx
 * import { isDevanagariText, getDevanagariLetterSpacing, TYPOGRAPHY_SCALE } from '@/lib/typography-utils'
 * 
 * const letterSpacing = isDevanagariText(text) 
 *   ? getDevanagariLetterSpacing(fontSize)
 *   : 0
 * ```
 * =============================================================================
 */

import { useState, useEffect, useCallback, RefObject } from 'react'

// =============================================================================
// TYPOGRAPHY SCALE CONSTANTS
// =============================================================================

/**
 * Fluid typography scale using CSS clamp() values
 * These values match the CSS custom properties defined in globals.css
 * 
 * @example
 * ```tsx
 * <h1 style={{ fontSize: TYPOGRAPHY_SCALE['3xl'] }}>शीर्षक</h1>
 * ```
 */
export const TYPOGRAPHY_SCALE = {
  xs: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)',
  sm: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',
  base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
  lg: 'clamp(1.125rem, 1rem + 0.5vw, 1.375rem)',
  xl: 'clamp(1.25rem, 1.125rem + 0.5vw, 1.625rem)',
  '2xl': 'clamp(1.5rem, 1.25rem + 1vw, 2.25rem)',
  '3xl': 'clamp(2rem, 1.5rem + 2vw, 3.5rem)',
} as const

/**
 * Line height scale for different content types
 * 
 * @example
 * ```tsx
 * <p style={{ lineHeight: LINE_HEIGHT_SCALE.poem }}>कविता की पंक्ति</p>
 * ```
 */
export const LINE_HEIGHT_SCALE = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
  poem: 'clamp(1.9, 1.8 + 0.3vw, 2.2)',
  heading: 'clamp(1.2, 1.15 + 0.1vw, 1.35)',
  body: 'clamp(1.6, 1.5 + 0.2vw, 1.75)',
} as const

/**
 * Letter spacing scale optimized for Devanagari and UI text
 * 
 * @example
 * ```tsx
 * <span style={{ letterSpacing: LETTER_SPACING_SCALE.devanagari }}>हिंदी टेक्स्ट</span>
 * ```
 */
export const LETTER_SPACING_SCALE = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.02em',
  devanagari: 'clamp(-0.01em, -0.005em + 0.005vw, 0.005em)',
  heading: 'clamp(-0.02em, -0.015em + 0.005vw, -0.01em)',
} as const

/**
 * Optimal characters per line for Devanagari text at different breakpoints
 * These values ensure comfortable reading without eye strain
 * 
 * @example
 * ```tsx
 * const maxChars = window.innerWidth < 640 
 *   ? DEVANAGARI_OPTIMAL_CHARS_PER_LINE.mobile 
 *   : DEVANAGARI_OPTIMAL_CHARS_PER_LINE.desktop
 * ```
 */
export const DEVANAGARI_OPTIMAL_CHARS_PER_LINE = {
  mobile: 35,
  tablet: 50,
  desktop: 65,
} as const

// =============================================================================
// TEXT DETECTION UTILITIES
// =============================================================================

/**
 * Unicode range for Devanagari script characters
 * Includes basic Devanagari (U+0900–U+097F) and extended (U+A8E0–U+A8FF)
 */
const DEVANAGARI_REGEX = /[\u0900-\u097F\uA8E0-\uA8FF]/

/**
 * Detects if text contains Devanagari characters
 * 
 * @param text - The text to check
 * @returns True if the text contains at least one Devanagari character
 * 
 * @example
 * ```tsx
 * if (isDevanagariText('नमस्ते')) {
 *   // Apply Hindi-specific styling
 * }
 * ```
 */
export function isDevanagariText(text: string): boolean {
  return DEVANAGARI_REGEX.test(text)
}

/**
 * Calculates the proportion of Devanagari characters in text
 * Useful for mixed-language content
 * 
 * @param text - The text to analyze
 * @returns A number between 0 and 1 representing the proportion of Devanagari characters
 */
export function getDevanagariProportion(text: string): number {
  if (!text.length) return 0
  const devanagariChars = text.match(/[\u0900-\u097F\uA8E0-\uA8FF]/g)
  return devanagariChars ? devanagariChars.length / text.length : 0
}

// =============================================================================
// TEXT MEASUREMENT UTILITIES
// =============================================================================

/**
 * Canvas context for text measurement (lazy initialized)
 */
let measurementCanvas: HTMLCanvasElement | null = null
let measurementContext: CanvasRenderingContext2D | null = null

/**
 * Gets or creates a canvas context for text measurement
 */
function getMeasurementContext(): CanvasRenderingContext2D | null {
  if (typeof window === 'undefined') return null
  
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas')
    measurementContext = measurementCanvas.getContext('2d')
  }
  
  return measurementContext
}

/**
 * Measures the rendered width of text in pixels
 * Uses canvas 2D context for accurate measurement
 * 
 * @param text - The text to measure
 * @param font - CSS font string (e.g., "16px Noto Serif Devanagari")
 * @returns Width in pixels, or 0 if measurement fails
 * 
 * @example
 * ```tsx
 * const width = measureTextWidth('कविता', '16px Noto Serif Devanagari')
 * ```
 */
export function measureTextWidth(text: string, font: string): number {
  const ctx = getMeasurementContext()
  if (!ctx) return 0
  
  ctx.font = font
  const metrics = ctx.measureText(text)
  return metrics.width
}

/**
 * Measures text dimensions including height
 * 
 * @param text - The text to measure
 * @param font - CSS font string
 * @returns Object with width and approximate height
 */
export function measureTextDimensions(text: string, font: string): { width: number; height: number } {
  const ctx = getMeasurementContext()
  if (!ctx) return { width: 0, height: 0 }
  
  ctx.font = font
  const metrics = ctx.measureText(text)
  
  // Approximate height from font metrics
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
  
  return {
    width: metrics.width,
    height: height || parseInt(font) * 1.2, // Fallback to font size * 1.2
  }
}

/**
 * Calculates optimal line length for readability
 * Based on the typographic principle of 45-75 characters per line
 * 
 * @param containerWidth - Container width in pixels
 * @param fontSize - Font size in pixels
 * @returns Optimal max-width in pixels
 * 
 * @example
 * ```tsx
 * const maxWidth = calculateOptimalLineLength(800, 18)
 * // Returns a width that fits ~55-65 characters
 * ```
 */
export function calculateOptimalLineLength(containerWidth: number, fontSize: number): number {
  // Average character width for Devanagari is approximately 0.6 * fontSize
  const avgCharWidth = fontSize * 0.6
  
  // Target 55 characters for optimal readability
  const optimalWidth = avgCharWidth * 55
  
  // Don't exceed container width
  return Math.min(optimalWidth, containerWidth)
}

// =============================================================================
// TEXT BALANCING UTILITIES
// =============================================================================

/**
 * Splits text into balanced lines to prevent orphans and widows
 * Uses a greedy algorithm with adjustment for last line
 * 
 * @param text - The text to balance
 * @param maxWidth - Maximum line width in pixels
 * @param font - CSS font string
 * @returns Array of balanced lines
 * 
 * @example
 * ```tsx
 * const lines = balanceTextLines(poemLine, 400, '18px Noto Serif Devanagari')
 * ```
 */
export function balanceTextLines(text: string, maxWidth: number, font: string): string[] {
  if (!text.trim()) return []
  
  const words = text.split(/\s+/)
  if (words.length === 0) return []
  if (words.length === 1) return [text]
  
  const lines: string[] = []
  let currentLine = words[0]
  
  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`
    const testWidth = measureTextWidth(testLine, font)
    
    if (testWidth <= maxWidth) {
      currentLine = testLine
    } else {
      lines.push(currentLine)
      currentLine = words[i]
    }
  }
  
  // Add the last line
  lines.push(currentLine)
  
  // Prevent orphans: if last line has only one word and there are previous lines,
  // move one word from the previous line to the last line
  if (lines.length > 1) {
    const lastLine = lines[lines.length - 1]
    const lastLineWords = lastLine.split(/\s+/)
    
    if (lastLineWords.length === 1) {
      const prevLine = lines[lines.length - 2]
      const prevWords = prevLine.split(/\s+/)
      
      if (prevWords.length > 1) {
        const movedWord = prevWords.pop()!
        lines[lines.length - 2] = prevWords.join(' ')
        lines[lines.length - 1] = `${movedWord} ${lastLine}`
      }
    }
  }
  
  return lines
}

/**
 * Wraps text with proper line breaks for optimal readability
 * 
 * @param text - The text to wrap
 * @param maxCharsPerLine - Maximum characters per line
 * @returns Text with line breaks inserted
 * 
 * @example
 * ```tsx
 * const wrapped = wrapTextOptimally(longText, 50)
 * ```
 */
export function wrapTextOptimally(text: string, maxCharsPerLine: number): string {
  if (!text.trim()) return ''
  
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
      }
      currentLine = word
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines.join('\n')
}

// =============================================================================
// DEVANAGARI-SPECIFIC SPACING UTILITIES
// =============================================================================

/**
 * Calculates optimal letter-spacing for Devanagari text based on font size
 * Larger text can have tighter spacing; smaller text needs more spacing
 * 
 * @param fontSize - Font size in pixels
 * @returns Letter-spacing in em units
 * 
 * @example
 * ```tsx
 * const spacing = getDevanagariLetterSpacing(18)
 * // Returns approximately -0.005 for comfortable reading
 * ```
 */
export function getDevanagariLetterSpacing(fontSize: number): number {
  // Base spacing: slightly negative for aesthetic
  const baseSpacing = -0.005
  
  // Adjust for font size: larger fonts can be tighter
  // Smaller fonts (< 14px) need looser spacing
  if (fontSize < 14) {
    return baseSpacing + 0.01 // Looser for small text
  } else if (fontSize > 24) {
    return baseSpacing - 0.005 // Tighter for large text
  }
  
  return baseSpacing
}

/**
 * Calculates optimal word-spacing for Devanagari text
 * Hindi words need slightly more separation than Latin text
 * 
 * @param fontSize - Font size in pixels
 * @returns Word-spacing in em units
 * 
 * @example
 * ```tsx
 * const wordSpacing = getDevanagariWordSpacing(18)
 * // Returns approximately 0.05 for proper word separation
 * ```
 */
export function getDevanagariWordSpacing(fontSize: number): number {
  // Base word spacing for Hindi
  const baseSpacing = 0.05
  
  // Slightly more spacing for smaller fonts
  if (fontSize < 14) {
    return baseSpacing + 0.02
  }
  
  return baseSpacing
}

// =============================================================================
// REACT HOOKS FOR RESPONSIVE TYPOGRAPHY
// =============================================================================

/**
 * Hook to get optimal font size based on viewport
 * Calculates the fluid font size that would be applied at current viewport width
 * 
 * @param baseSize - Base font size in rem
 * @param minSize - Minimum size in rem
 * @param maxSize - Maximum size in rem
 * @returns Current optimal font size in pixels
 * 
 * @example
 * ```tsx
 * const fontSize = useFluidFontSize(1.125, 1, 1.375)
 * // Returns calculated size based on viewport
 * ```
 */
export function useFluidFontSize(baseSize: number, minSize: number, maxSize: number): number {
  const [fontSize, setFontSize] = useState(baseSize * 16)
  
  useEffect(() => {
    const calculateSize = () => {
      const vw = window.innerWidth
      const vwUnit = vw / 100
      
      // Calculate fluid size: min + (vw * scale)
      // This mimics clamp(min, preferred, max)
      const fluidSize = minSize * 16 + vwUnit * 0.5
      const clampedSize = Math.max(minSize * 16, Math.min(maxSize * 16, fluidSize))
      
      setFontSize(clampedSize)
    }
    
    calculateSize()
    window.addEventListener('resize', calculateSize)
    
    return () => window.removeEventListener('resize', calculateSize)
  }, [baseSize, minSize, maxSize])
  
  return fontSize
}

/**
 * Hook to measure text dimensions in real-time
 * Recalculates when text, font family, or font size changes
 * 
 * @param text - The text to measure
 * @param fontFamily - Font family name
 * @param fontSize - Font size in pixels
 * @returns Object with width and height
 * 
 * @example
 * ```tsx
 * const { width, height } = useTextDimensions('कविता', 'Noto Serif Devanagari', 18)
 * ```
 */
export function useTextDimensions(
  text: string, 
  fontFamily: string, 
  fontSize: number
): { width: number; height: number } {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    const font = `${fontSize}px ${fontFamily}`
    const measured = measureTextDimensions(text, font)
    setDimensions(measured)
  }, [text, fontFamily, fontSize])
  
  return dimensions
}

/**
 * Hook to detect if text overflows its container
 * Useful for adding ellipsis or "read more" functionality
 * 
 * @param ref - React ref to text container element
 * @returns True if text overflows the container
 * 
 * @example
 * ```tsx
 * const textRef = useRef<HTMLParagraphElement>(null)
 * const isOverflowing = useTextOverflow(textRef)
 * 
 * return (
 *   <p ref={textRef} className="line-clamp-2">
 *     {text}
 *     {isOverflowing && <span>...</span>}
 *   </p>
 * )
 * ```
 */
export function useTextOverflow(ref: RefObject<HTMLElement | null>): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false)
  
  const checkOverflow = useCallback(() => {
    const element = ref.current
    if (!element) return
    
    const isOverflowingWidth = element.scrollWidth > element.clientWidth
    const isOverflowingHeight = element.scrollHeight > element.clientHeight
    
    setIsOverflowing(isOverflowingWidth || isOverflowingHeight)
  }, [ref])
  
  useEffect(() => {
    checkOverflow()
    
    // Re-check on resize
    window.addEventListener('resize', checkOverflow)
    
    // Use ResizeObserver if available for more accurate detection
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && ref.current) {
      resizeObserver = new ResizeObserver(checkOverflow)
      resizeObserver.observe(ref.current)
    }
    
    return () => {
      window.removeEventListener('resize', checkOverflow)
      resizeObserver?.disconnect()
    }
  }, [checkOverflow, ref])
  
  return isOverflowing
}

/**
 * Hook to get the current breakpoint for typography decisions
 * 
 * @returns Current breakpoint: 'mobile' | 'tablet' | 'desktop'
 * 
 * @example
 * ```tsx
 * const breakpoint = useTypographyBreakpoint()
 * const maxChars = DEVANAGARI_OPTIMAL_CHARS_PER_LINE[breakpoint]
 * ```
 */
export function useTypographyBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width < 640) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}

// =============================================================================
// CSS STYLE GENERATORS
// =============================================================================

/**
 * Generates optimal typography styles for poem text
 * 
 * @param fontSize - Font size in pixels (optional, uses fluid default)
 * @returns CSS properties object for React style prop
 * 
 * @example
 * ```tsx
 * <div style={getPoemTypographyStyles()}>
 *   <PoemLine>कविता की पंक्ति</PoemLine>
 * </div>
 * ```
 */
export function getPoemTypographyStyles(fontSize?: number): React.CSSProperties {
  const letterSpacing = fontSize 
    ? `${getDevanagariLetterSpacing(fontSize)}em`
    : 'var(--letter-spacing-devanagari, -0.005em)'
  
  const wordSpacing = fontSize
    ? `${getDevanagariWordSpacing(fontSize)}em`
    : 'clamp(0.05em, 0.03em + 0.02vw, 0.08em)'
  
  return {
    fontSize: fontSize ? `${fontSize}px` : 'var(--font-size-poem)',
    lineHeight: 'var(--line-height-poem)',
    letterSpacing,
    wordSpacing,
    textRendering: 'optimizeLegibility',
    fontFeatureSettings: '"kern" 1, "liga" 1',
    fontVariantLigatures: 'common-ligatures contextual',
    textWrap: 'balance',
    hyphens: 'none',
  } as React.CSSProperties
}

/**
 * Generates optimal typography styles for headings
 * 
 * @param level - Heading level (1, 2, or 3)
 * @returns CSS properties object for React style prop
 */
export function getHeadingTypographyStyles(level: 1 | 2 | 3): React.CSSProperties {
  const sizes = {
    1: 'var(--font-size-3xl)',
    2: 'var(--font-size-2xl)',
    3: 'var(--font-size-xl)',
  }
  
  return {
    fontSize: sizes[level],
    lineHeight: 'var(--line-height-heading)',
    letterSpacing: 'var(--letter-spacing-heading)',
    textWrap: 'balance',
    hyphens: 'none',
  } as React.CSSProperties
}
