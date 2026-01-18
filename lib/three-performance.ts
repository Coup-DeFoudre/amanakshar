/**
 * Three.js Performance Monitoring and Adaptive Quality System
 * 
 * Provides real-time FPS monitoring, adaptive quality settings,
 * and automatic fallback to lower quality modes for better performance.
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { getPerformanceTier, type PerformanceTier } from './performance-utils'

// ===== TYPES =====

export type QualityLevel = 'ultra' | 'high' | 'medium' | 'low'

export interface PerformanceConfig {
  /** Target FPS to maintain */
  targetFPS: number
  /** FPS threshold to trigger quality reduction */
  lowFPSThreshold: number
  /** FPS threshold to allow quality increase */
  highFPSThreshold: number
  /** Time in ms to wait before adjusting quality */
  adaptiveDelayMs: number
  /** Enable adaptive quality adjustments */
  enableAdaptiveQuality: boolean
}

export interface QualitySettings {
  /** Enable shadow rendering */
  shadows: boolean
  /** Shadow map size */
  shadowMapSize: number
  /** Particle count multiplier (0-1) */
  particleMultiplier: number
  /** Enable post-processing effects */
  postProcessing: boolean
  /** Enable volumetric effects */
  volumetricEffects: boolean
  /** Texture quality multiplier (0-1) */
  textureQuality: number
  /** Enable anti-aliasing */
  antialiasing: boolean
  /** Pixel ratio cap */
  maxPixelRatio: number
}

export interface PerformanceStats {
  /** Current FPS */
  fps: number
  /** Average FPS over last second */
  avgFps: number
  /** Current quality level */
  qualityLevel: QualityLevel
  /** Memory usage (Chrome only) */
  memoryUsage?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
  /** Whether performance is throttled */
  isThrottled: boolean
}

export interface PerformanceBudget {
  /** Maximum triangles to render */
  maxTriangles: number
  /** Maximum draw calls */
  maxDrawCalls: number
  /** Maximum texture memory in MB */
  maxTextureMemoryMB: number
}

// ===== DEFAULT CONFIGURATIONS =====

export const defaultPerformanceConfig: PerformanceConfig = {
  targetFPS: 60,
  lowFPSThreshold: 30,
  highFPSThreshold: 55,
  adaptiveDelayMs: 2000,
  enableAdaptiveQuality: true,
}

export const qualityPresets: Record<QualityLevel, QualitySettings> = {
  ultra: {
    shadows: true,
    shadowMapSize: 2048,
    particleMultiplier: 1.0,
    postProcessing: true,
    volumetricEffects: true,
    textureQuality: 1.0,
    antialiasing: true,
    maxPixelRatio: 2,
  },
  high: {
    shadows: true,
    shadowMapSize: 1024,
    particleMultiplier: 0.5,
    postProcessing: true,
    volumetricEffects: false,
    textureQuality: 1.0,
    antialiasing: true,
    maxPixelRatio: 1.5,
  },
  medium: {
    shadows: false,
    shadowMapSize: 512,
    particleMultiplier: 0.25,
    postProcessing: false,
    volumetricEffects: false,
    textureQuality: 0.75,
    antialiasing: false,
    maxPixelRatio: 1,
  },
  low: {
    shadows: false,
    shadowMapSize: 256,
    particleMultiplier: 0.1,
    postProcessing: false,
    volumetricEffects: false,
    textureQuality: 0.5,
    antialiasing: false,
    maxPixelRatio: 1,
  },
}

export const performanceBudgets: Record<QualityLevel, PerformanceBudget> = {
  ultra: {
    maxTriangles: 1000000,
    maxDrawCalls: 500,
    maxTextureMemoryMB: 256,
  },
  high: {
    maxTriangles: 500000,
    maxDrawCalls: 200,
    maxTextureMemoryMB: 128,
  },
  medium: {
    maxTriangles: 200000,
    maxDrawCalls: 100,
    maxTextureMemoryMB: 64,
  },
  low: {
    maxTriangles: 50000,
    maxDrawCalls: 50,
    maxTextureMemoryMB: 32,
  },
}

// ===== HELPER FUNCTIONS =====

/**
 * Get initial quality level based on device performance tier
 */
export function getInitialQualityLevel(): QualityLevel {
  const tier = getPerformanceTier()
  
  switch (tier) {
    case 'high':
      return 'ultra'
    case 'medium':
      return 'high'
    case 'low':
    default:
      return 'medium'
  }
}

/**
 * Get optimal settings for current performance tier
 */
export function getOptimalSettings(tier?: PerformanceTier): QualitySettings {
  const effectiveTier = tier || getPerformanceTier()
  const qualityLevel = effectiveTier === 'high' ? 'ultra' : effectiveTier === 'medium' ? 'high' : 'medium'
  return qualityPresets[qualityLevel]
}

/**
 * Get performance budget for quality level
 */
export function getPerformanceBudget(qualityLevel: QualityLevel): PerformanceBudget {
  return performanceBudgets[qualityLevel]
}

/**
 * Check if performance budget is exceeded
 */
export function isBudgetExceeded(
  currentTriangles: number,
  currentDrawCalls: number,
  currentTextureMemoryMB: number,
  budget: PerformanceBudget
): boolean {
  return (
    currentTriangles > budget.maxTriangles ||
    currentDrawCalls > budget.maxDrawCalls ||
    currentTextureMemoryMB > budget.maxTextureMemoryMB
  )
}

// ===== PERFORMANCE MONITOR HOOK =====

export interface UsePerformanceMonitorOptions {
  /** Custom performance config */
  config?: Partial<PerformanceConfig>
  /** Callback when quality level changes */
  onQualityChange?: (level: QualityLevel, settings: QualitySettings) => void
  /** Initial quality level override */
  initialQuality?: QualityLevel
}

export interface UsePerformanceMonitorReturn {
  /** Current performance statistics */
  stats: PerformanceStats
  /** Current quality settings */
  settings: QualitySettings
  /** Force a specific quality level */
  setQualityLevel: (level: QualityLevel) => void
  /** Check if should use 2D fallback */
  shouldUseFallback: boolean
  /** Current quality level */
  qualityLevel: QualityLevel
}

/**
 * Hook for monitoring 3D performance and adjusting quality
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorReturn {
  const { config: customConfig, onQualityChange, initialQuality } = options
  
  const config: PerformanceConfig = {
    ...defaultPerformanceConfig,
    ...customConfig,
  }
  
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>(
    initialQuality || getInitialQualityLevel()
  )
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    avgFps: 60,
    qualityLevel,
    isThrottled: false,
  })
  
  // FPS tracking refs
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  const lastQualityChangeRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  
  // Calculate FPS
  const measureFPS = useCallback(() => {
    frameCountRef.current++
    const currentTime = performance.now()
    const elapsed = currentTime - lastTimeRef.current
    
    if (elapsed >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed)
      frameCountRef.current = 0
      lastTimeRef.current = currentTime
      
      // Update FPS history (keep last 5 samples)
      fpsHistoryRef.current.push(fps)
      if (fpsHistoryRef.current.length > 5) {
        fpsHistoryRef.current.shift()
      }
      
      const avgFps = Math.round(
        fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
      )
      
      // Check memory usage (Chrome only)
      let memoryUsage: PerformanceStats['memoryUsage']
      if (typeof performance !== 'undefined' && 'memory' in performance) {
        const memory = (performance as { memory: {
          usedJSHeapSize: number
          totalJSHeapSize: number
          jsHeapSizeLimit: number
        } }).memory
        memoryUsage = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }
      }
      
      setStats({
        fps,
        avgFps,
        qualityLevel,
        memoryUsage,
        isThrottled: fps < config.lowFPSThreshold,
      })
      
      // Adaptive quality adjustment
      if (config.enableAdaptiveQuality) {
        const timeSinceLastChange = currentTime - lastQualityChangeRef.current
        
        if (timeSinceLastChange > config.adaptiveDelayMs) {
          // Reduce quality if FPS is too low
          if (avgFps < config.lowFPSThreshold && qualityLevel !== 'low') {
            const levels: QualityLevel[] = ['ultra', 'high', 'medium', 'low']
            const currentIndex = levels.indexOf(qualityLevel)
            if (currentIndex < levels.length - 1) {
              const newLevel = levels[currentIndex + 1]
              setQualityLevel(newLevel)
              lastQualityChangeRef.current = currentTime
              onQualityChange?.(newLevel, qualityPresets[newLevel])
            }
          }
          // Increase quality if FPS is stable and high
          else if (avgFps > config.highFPSThreshold && qualityLevel !== 'ultra') {
            const levels: QualityLevel[] = ['ultra', 'high', 'medium', 'low']
            const currentIndex = levels.indexOf(qualityLevel)
            if (currentIndex > 0) {
              const newLevel = levels[currentIndex - 1]
              setQualityLevel(newLevel)
              lastQualityChangeRef.current = currentTime
              onQualityChange?.(newLevel, qualityPresets[newLevel])
            }
          }
        }
      }
    }
    
    rafIdRef.current = requestAnimationFrame(measureFPS)
  }, [qualityLevel, config, onQualityChange])
  
  // Start/stop FPS monitoring
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(measureFPS)
    
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [measureFPS])
  
  // Manual quality level setter
  const setQuality = useCallback((level: QualityLevel) => {
    setQualityLevel(level)
    lastQualityChangeRef.current = performance.now()
    onQualityChange?.(level, qualityPresets[level])
  }, [onQualityChange])
  
  return {
    stats,
    settings: qualityPresets[qualityLevel],
    setQualityLevel: setQuality,
    shouldUseFallback: qualityLevel === 'low' && stats.avgFps < 20,
    qualityLevel,
  }
}

// ===== THROTTLE UTILITY =====

/**
 * Throttle a function to run at most once per specified interval
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Create a throttled update function for expensive operations
 */
export function createThrottledUpdate(
  updateFn: () => void,
  qualityLevel: QualityLevel
): () => void {
  const intervals: Record<QualityLevel, number> = {
    ultra: 16,   // ~60fps
    high: 33,    // ~30fps
    medium: 50,  // ~20fps
    low: 100,    // ~10fps
  }
  
  return throttle(updateFn, intervals[qualityLevel])
}

// ===== EXPORT =====

export type { PerformanceTier }
