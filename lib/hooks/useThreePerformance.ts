'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { getPerformanceTier, type PerformanceTier } from '@/lib/performance-utils'

// ===== QUALITY SETTINGS =====

/** Quality level type */
export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra'

/** Quality settings configuration */
export interface QualitySettings {
  /** Shadow map quality (0 = off, 1 = low, 2 = medium, 3 = high) */
  shadowQuality: 0 | 1 | 2 | 3
  /** Shadow map size in pixels */
  shadowMapSize: number
  /** Texture resolution multiplier */
  textureResolution: number
  /** Anti-aliasing enabled */
  antialias: boolean
  /** Post-processing effects enabled */
  postProcessing: boolean
  /** Maximum pixel ratio */
  maxPixelRatio: number
  /** Enable animations */
  animations: boolean
  /** Maximum number of point lights */
  maxPointLights: number
  /** Enable environment mapping */
  envMapping: boolean
  /** Geometry detail level (0-1) */
  geometryDetail: number
}

/** Quality presets for each level */
const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  low: {
    shadowQuality: 0,
    shadowMapSize: 512,
    textureResolution: 0.5,
    antialias: false,
    postProcessing: false,
    maxPixelRatio: 1,
    animations: false,
    maxPointLights: 1,
    envMapping: false,
    geometryDetail: 0.5,
  },
  medium: {
    shadowQuality: 1,
    shadowMapSize: 1024,
    textureResolution: 0.75,
    antialias: true,
    postProcessing: false,
    maxPixelRatio: 1.5,
    animations: true,
    maxPointLights: 2,
    envMapping: false,
    geometryDetail: 0.75,
  },
  high: {
    shadowQuality: 2,
    shadowMapSize: 2048,
    textureResolution: 1,
    antialias: true,
    postProcessing: true,
    maxPixelRatio: 2,
    animations: true,
    maxPointLights: 4,
    envMapping: true,
    geometryDetail: 1,
  },
  ultra: {
    shadowQuality: 3,
    shadowMapSize: 4096,
    textureResolution: 1,
    antialias: true,
    postProcessing: true,
    maxPixelRatio: 2,
    animations: true,
    maxPointLights: 8,
    envMapping: true,
    geometryDetail: 1,
  },
}

/**
 * Gets quality settings based on quality level
 * @param level - Quality level
 * @returns Quality settings configuration
 */
export function getQualitySettings(level: QualityLevel): QualitySettings {
  return { ...QUALITY_PRESETS[level] }
}

/**
 * Gets quality level based on performance tier
 * @param tier - Performance tier from device detection
 * @returns Appropriate quality level
 */
export function getQualityFromTier(tier: PerformanceTier): QualityLevel {
  switch (tier) {
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'low':
    default:
      return 'low'
  }
}

// ===== PERFORMANCE METRICS =====

/** Performance metrics data */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number
  /** Average FPS over sample period */
  avgFps: number
  /** Memory usage in MB (if available) */
  memoryMB: number | null
  /** Number of draw calls */
  drawCalls: number
  /** Number of triangles rendered */
  triangles: number
  /** Frame time in milliseconds */
  frameTime: number
  /** GPU utilization (estimated) */
  gpuLoad: 'low' | 'medium' | 'high'
}

/** Performance recommendation */
export interface PerformanceRecommendation {
  shouldReduceQuality: boolean
  suggestedLevel: QualityLevel
  reason: string
}

// ===== PERFORMANCE HOOK =====

/** Options for useThreePerformance hook */
export interface UseThreePerformanceOptions {
  /** Target FPS (default: 60) */
  targetFps?: number
  /** FPS threshold below which to reduce quality (default: 30) */
  minFps?: number
  /** Enable adaptive quality adjustment */
  adaptiveQuality?: boolean
  /** Sample size for FPS averaging */
  sampleSize?: number
}

/** Return type for useThreePerformance hook */
export interface UseThreePerformanceReturn {
  /** Current performance metrics */
  metrics: PerformanceMetrics
  /** Current quality level */
  qualityLevel: QualityLevel
  /** Current quality settings */
  qualitySettings: QualitySettings
  /** Set quality level manually */
  setQualityLevel: (level: QualityLevel) => void
  /** Performance recommendation */
  recommendation: PerformanceRecommendation | null
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean
  /** Update metrics with frame data (call in render loop) */
  updateMetrics: (drawCalls?: number, triangles?: number) => void
  /** Static fallback settings for reduced motion */
  staticSettings: QualitySettings
}

/**
 * Hook for monitoring and managing 3D performance
 * Tracks FPS, memory, and provides adaptive quality recommendations
 * 
 * @param options - Configuration options
 * @returns Performance metrics and quality management
 */
export function useThreePerformance(
  options: UseThreePerformanceOptions = {}
): UseThreePerformanceReturn {
  const {
    targetFps = 60,
    minFps = 30,
    adaptiveQuality = true,
    sampleSize = 60,
  } = options

  const prefersReducedMotion = useReducedMotion()
  
  // State
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('medium')
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    avgFps: 60,
    memoryMB: null,
    drawCalls: 0,
    triangles: 0,
    frameTime: 16.67,
    gpuLoad: 'low',
  })
  const [recommendation, setRecommendation] = useState<PerformanceRecommendation | null>(null)

  // Refs for performance tracking
  const lastTimeRef = useRef<number>(performance.now())
  const frameCountRef = useRef<number>(0)
  const fpsHistoryRef = useRef<number[]>([])
  const lastAdaptiveCheckRef = useRef<number>(0)

  // Initialize quality level based on device capabilities
  useEffect(() => {
    const tier = getPerformanceTier()
    const initialQuality = getQualityFromTier(tier)
    setQualityLevel(initialQuality)
  }, [])

  // Get current quality settings
  const qualitySettings = getQualitySettings(qualityLevel)

  // Static settings for reduced motion
  const staticSettings: QualitySettings = {
    ...qualitySettings,
    animations: false,
    postProcessing: false,
  }

  // Update metrics function (to be called in render loop)
  const updateMetrics = useCallback((drawCalls = 0, triangles = 0) => {
    const now = performance.now()
    frameCountRef.current++

    // Calculate FPS every second
    if (now - lastTimeRef.current >= 1000) {
      const fps = frameCountRef.current
      frameCountRef.current = 0
      lastTimeRef.current = now

      // Update FPS history
      fpsHistoryRef.current.push(fps)
      if (fpsHistoryRef.current.length > sampleSize) {
        fpsHistoryRef.current.shift()
      }

      // Calculate average FPS
      const avgFps = fpsHistoryRef.current.length > 0
        ? fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
        : fps

      // Get memory usage if available
      let memoryMB: number | null = null
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
        if (memory) {
          memoryMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        }
      }

      // Estimate GPU load based on frame time
      const frameTime = 1000 / fps
      let gpuLoad: 'low' | 'medium' | 'high' = 'low'
      if (frameTime > 33) gpuLoad = 'high'
      else if (frameTime > 20) gpuLoad = 'medium'

      setMetrics({
        fps,
        avgFps: Math.round(avgFps),
        memoryMB,
        drawCalls,
        triangles,
        frameTime: Math.round(frameTime * 100) / 100,
        gpuLoad,
      })

      // Adaptive quality adjustment
      if (adaptiveQuality && now - lastAdaptiveCheckRef.current > 5000) {
        lastAdaptiveCheckRef.current = now
        
        if (avgFps < minFps && qualityLevel !== 'low') {
          // Performance is poor, suggest reducing quality
          const suggestedLevel = qualityLevel === 'ultra' ? 'high' :
                                qualityLevel === 'high' ? 'medium' : 'low'
          
          setRecommendation({
            shouldReduceQuality: true,
            suggestedLevel,
            reason: `Average FPS (${Math.round(avgFps)}) is below target (${minFps})`,
          })

          // Auto-apply reduction
          setQualityLevel(suggestedLevel)
        } else if (avgFps >= targetFps * 0.95 && qualityLevel !== 'ultra') {
          // Performance is good, could potentially increase quality
          setRecommendation({
            shouldReduceQuality: false,
            suggestedLevel: qualityLevel === 'low' ? 'medium' :
                          qualityLevel === 'medium' ? 'high' : 'ultra',
            reason: `Performance is stable at ${Math.round(avgFps)} FPS`,
          })
        } else {
          setRecommendation(null)
        }
      }
    }
  }, [adaptiveQuality, minFps, qualityLevel, sampleSize, targetFps])

  return {
    metrics,
    qualityLevel,
    qualitySettings: prefersReducedMotion ? staticSettings : qualitySettings,
    setQualityLevel,
    recommendation,
    prefersReducedMotion,
    updateMetrics,
    staticSettings,
  }
}

// ===== PERFORMANCE MONITOR INTEGRATION =====

/** Props for performance display component */
export interface PerformanceDisplayProps {
  metrics: PerformanceMetrics
  qualityLevel: QualityLevel
  recommendation: PerformanceRecommendation | null
}

/**
 * Gets a color based on FPS value for display
 * @param fps - Current FPS
 * @returns Color string
 */
export function getFpsColor(fps: number): string {
  if (fps >= 55) return '#4ade80' // Green
  if (fps >= 30) return '#fbbf24' // Yellow
  return '#ef4444' // Red
}

/**
 * Gets a color based on GPU load
 * @param load - GPU load level
 * @returns Color string
 */
export function getGpuLoadColor(load: 'low' | 'medium' | 'high'): string {
  switch (load) {
    case 'low':
      return '#4ade80' // Green
    case 'medium':
      return '#fbbf24' // Yellow
    case 'high':
      return '#ef4444' // Red
  }
}
