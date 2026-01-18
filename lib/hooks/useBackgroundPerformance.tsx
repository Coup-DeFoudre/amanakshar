'use client'

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { getPerformanceTier, type PerformanceTier } from '@/lib/performance-utils'

// ===== TYPES =====

export type QualityLevel = 'high' | 'medium' | 'low'

export interface BackgroundPerformanceState {
  quality: QualityLevel
  fps: number
  isThrottling: boolean
  tier: PerformanceTier
  setQualityOverride: (quality: QualityLevel | null) => void
}

// ===== CONSTANTS =====

const FPS_SAMPLE_SIZE = 30
const LOW_FPS_THRESHOLD = 25
const CRITICAL_FPS_THRESHOLD = 15
const THROTTLE_DURATION = 5000 // 5 seconds of low FPS before downgrading

// ===== LOCAL STORAGE KEYS =====

const QUALITY_PREFERENCE_KEY = 'background-quality-preference'

// ===== CONTEXT =====

const BackgroundPerformanceContext = createContext<BackgroundPerformanceState | null>(null)

// ===== HOOK =====

/**
 * Hook for monitoring and adapting background quality based on performance
 * 
 * @example
 * ```tsx
 * const { quality, fps, isThrottling } = useBackgroundPerformance()
 * 
 * // Use quality to adjust effects
 * const particleCount = quality === 'high' ? 100 : quality === 'medium' ? 50 : 20
 * ```
 */
export function useBackgroundPerformance(): BackgroundPerformanceState {
  const [quality, setQuality] = useState<QualityLevel>('high')
  const [fps, setFps] = useState(60)
  const [isThrottling, setIsThrottling] = useState(false)
  const [tier, setTier] = useState<PerformanceTier>('high')
  const [qualityOverride, setQualityOverride] = useState<QualityLevel | null>(null)
  
  // FPS tracking refs
  const fpsHistoryRef = useRef<number[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const lowFpsStartRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number>(0)
  
  // Initialize from device capabilities and stored preference
  useEffect(() => {
    // Get device performance tier
    const detectedTier = getPerformanceTier()
    setTier(detectedTier)
    
    // Map tier to initial quality
    const tierToQuality: Record<PerformanceTier, QualityLevel> = {
      high: 'high',
      medium: 'medium',
      low: 'low',
    }
    
    // Check for stored preference
    try {
      const storedPreference = localStorage.getItem(QUALITY_PREFERENCE_KEY)
      if (storedPreference && ['high', 'medium', 'low'].includes(storedPreference)) {
        setQualityOverride(storedPreference as QualityLevel)
        setQuality(storedPreference as QualityLevel)
        return
      }
    } catch {
      // localStorage not available
    }
    
    setQuality(tierToQuality[detectedTier])
  }, [])
  
  // Handle quality override changes
  const handleSetQualityOverride = useCallback((newQuality: QualityLevel | null) => {
    setQualityOverride(newQuality)
    
    if (newQuality) {
      setQuality(newQuality)
      try {
        localStorage.setItem(QUALITY_PREFERENCE_KEY, newQuality)
      } catch {
        // localStorage not available
      }
    } else {
      // Reset to auto-detected quality
      const tierToQuality: Record<PerformanceTier, QualityLevel> = {
        high: 'high',
        medium: 'medium',
        low: 'low',
      }
      setQuality(tierToQuality[tier])
      try {
        localStorage.removeItem(QUALITY_PREFERENCE_KEY)
      } catch {
        // localStorage not available
      }
    }
  }, [tier])
  
  // FPS monitoring loop
  useEffect(() => {
    // Skip if user has manual override
    if (qualityOverride) return
    
    const measureFps = (timestamp: number) => {
      if (lastFrameTimeRef.current) {
        const delta = timestamp - lastFrameTimeRef.current
        const currentFps = Math.round(1000 / delta)
        
        // Add to history
        fpsHistoryRef.current.push(currentFps)
        if (fpsHistoryRef.current.length > FPS_SAMPLE_SIZE) {
          fpsHistoryRef.current.shift()
        }
        
        // Calculate rolling average
        const avgFps = Math.round(
          fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
        )
        setFps(avgFps)
        
        // Check for sustained low FPS
        if (avgFps < LOW_FPS_THRESHOLD) {
          if (!lowFpsStartRef.current) {
            lowFpsStartRef.current = timestamp
          } else if (timestamp - lowFpsStartRef.current > THROTTLE_DURATION) {
            setIsThrottling(true)
            
            // Downgrade quality
            setQuality((prevQuality) => {
              if (prevQuality === 'high') return 'medium'
              if (prevQuality === 'medium') return 'low'
              return 'low'
            })
            
            // Reset throttle detection
            lowFpsStartRef.current = null
            setIsThrottling(false)
          }
        } else {
          lowFpsStartRef.current = null
          setIsThrottling(false)
        }
        
        // Critical FPS - immediate downgrade
        if (avgFps < CRITICAL_FPS_THRESHOLD && quality !== 'low') {
          setQuality('low')
        }
      }
      
      lastFrameTimeRef.current = timestamp
      animationFrameRef.current = requestAnimationFrame(measureFps)
    }
    
    animationFrameRef.current = requestAnimationFrame(measureFps)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [qualityOverride, quality])
  
  // Listen for visibility changes to pause/resume monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause monitoring when tab is hidden
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      } else {
        // Reset timing when tab becomes visible again
        lastFrameTimeRef.current = 0
        fpsHistoryRef.current = []
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  return {
    quality,
    fps,
    isThrottling,
    tier,
    setQualityOverride: handleSetQualityOverride,
  }
}

// ===== PROVIDER =====

interface BackgroundPerformanceProviderProps {
  children: React.ReactNode
}

export function BackgroundPerformanceProvider({ children }: BackgroundPerformanceProviderProps) {
  const performanceState = useBackgroundPerformance()
  
  return (
    <BackgroundPerformanceContext.Provider value={performanceState}>
      {children}
    </BackgroundPerformanceContext.Provider>
  )
}

// ===== CONTEXT HOOK =====

/**
 * Hook to access background performance context
 * Must be used within BackgroundPerformanceProvider
 */
export function useBackgroundPerformanceContext(): BackgroundPerformanceState {
  const context = useContext(BackgroundPerformanceContext)
  
  if (!context) {
    throw new Error(
      'useBackgroundPerformanceContext must be used within BackgroundPerformanceProvider'
    )
  }
  
  return context
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get particle count adjusted for quality level
 */
export function getAdjustedParticleCount(baseCount: number, quality: QualityLevel): number {
  switch (quality) {
    case 'high':
      return baseCount
    case 'medium':
      return Math.floor(baseCount * 0.5)
    case 'low':
      return Math.floor(baseCount * 0.2)
  }
}

/**
 * Check if WebGL effects should be enabled based on quality
 */
export function shouldEnableWebGL(quality: QualityLevel): boolean {
  return quality !== 'low'
}

/**
 * Get shader complexity level for quality
 */
export function getShaderComplexity(quality: QualityLevel): 'full' | 'simplified' | 'none' {
  switch (quality) {
    case 'high':
      return 'full'
    case 'medium':
      return 'simplified'
    case 'low':
      return 'none'
  }
}

export default useBackgroundPerformance
