/**
 * Background Configuration System
 * 
 * Centralized configuration for background effects including:
 * - Color palettes for themes
 * - Preset configurations for sections
 * - Particle system settings
 * - Depth layer configurations
 * - Noise settings
 * - Performance thresholds
 */

import type { GradientPreset } from '@/components/background/DynamicGradient'
import type { ParticleType } from '@/components/background/AmbientParticles'
import type { NoisePreset } from '@/components/background/AtmosphericNoise'
import type { LayerType } from '@/components/background/DepthLayers'

// ===== COLOR PALETTES =====

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  glow: string
}

export const colorPalettes: Record<string, ColorPalette> = {
  midnight: {
    primary: '#0a0908',
    secondary: '#1a1512',
    accent: '#d4a855',
    background: '#0d0b09',
    surface: '#2a1f18',
    glow: '#ffdc96',
  },
  dawn: {
    primary: '#1a0f0a',
    secondary: '#3d2814',
    accent: '#e8a850',
    background: '#2a1a10',
    surface: '#4a3020',
    glow: '#ffc875',
  },
  twilight: {
    primary: '#0d0a14',
    secondary: '#1a1428',
    accent: '#9f7aea',
    background: '#12101a',
    surface: '#201830',
    glow: '#c4b5fd',
  },
}

// ===== PARTICLE CONFIGURATIONS =====

export interface ParticleSettings {
  type: ParticleType
  count: number
  mouseRepulsion: boolean
}

export const particleSettings: Record<string, ParticleSettings> = {
  fireflies: {
    type: 'fireflies',
    count: 60,
    mouseRepulsion: true,
  },
  dust: {
    type: 'dust',
    count: 100,
    mouseRepulsion: false,
  },
  embers: {
    type: 'embers',
    count: 40,
    mouseRepulsion: true,
  },
  stars: {
    type: 'stars',
    count: 80,
    mouseRepulsion: false,
  },
  subtle: {
    type: 'fireflies',
    count: 30,
    mouseRepulsion: true,
  },
}

// ===== DEPTH LAYER CONFIGURATIONS =====

export interface DepthLayerConfig {
  type: LayerType
  depth: number
  speed: number
  opacity: number
  color: string
}

export const depthLayerConfigs: Record<string, DepthLayerConfig[]> = {
  standard: [
    { type: 'light-rays', depth: -6, speed: 0.08, opacity: 0.6, color: '#d4a855' },
    { type: 'gradient-overlay', depth: -5, speed: 0.1, opacity: 0.4, color: '#d4a855' },
    { type: 'gradient-overlay', depth: -4, speed: 0.15, opacity: 0.3, color: '#bf7a3d' },
    { type: 'geometric-shapes', depth: -3, speed: 0.2, opacity: 0.5, color: '#d4a855' },
    { type: 'gradient-overlay', depth: -2, speed: 0.3, opacity: 0.2, color: '#c4b8a8' },
  ],
  minimal: [
    { type: 'gradient-overlay', depth: -5, speed: 0.1, opacity: 0.3, color: '#d4a855' },
    { type: 'gradient-overlay', depth: -3, speed: 0.2, opacity: 0.2, color: '#c4b8a8' },
  ],
  dramatic: [
    { type: 'light-rays', depth: -7, speed: 0.05, opacity: 0.8, color: '#d4a855' },
    { type: 'light-rays', depth: -6, speed: 0.08, opacity: 0.5, color: '#bf7a3d' },
    { type: 'gradient-overlay', depth: -5, speed: 0.1, opacity: 0.5, color: '#d4a855' },
    { type: 'geometric-shapes', depth: -4, speed: 0.15, opacity: 0.6, color: '#d4a855' },
    { type: 'gradient-overlay', depth: -3, speed: 0.2, opacity: 0.4, color: '#bf7a3d' },
    { type: 'gradient-overlay', depth: -2, speed: 0.3, opacity: 0.3, color: '#c4b8a8' },
  ],
}

// ===== NOISE CONFIGURATIONS =====

export interface NoiseSettings {
  preset: NoisePreset
  opacity?: number
  frequency?: number
  speed?: number
}

export const noiseSettings: Record<string, NoiseSettings> = {
  subtle: {
    preset: 'film-grain',
    opacity: 0.05,
  },
  atmospheric: {
    preset: 'fog',
    opacity: 0.3,
  },
  paper: {
    preset: 'paper-texture',
    opacity: 0.08,
  },
  smoky: {
    preset: 'smoke',
    opacity: 0.25,
  },
}

// ===== SECTION PRESETS =====

export interface SectionPreset {
  gradient: GradientPreset
  particles: ParticleSettings
  depth: DepthLayerConfig[]
  noise: NoiseSettings
  enableWebGL: boolean
}

export const sectionPresets: Record<string, SectionPreset> = {
  hero: {
    gradient: 'midnight',
    particles: particleSettings.fireflies,
    depth: depthLayerConfigs.dramatic,
    noise: noiseSettings.atmospheric,
    enableWebGL: true,
  },
  content: {
    gradient: 'midnight',
    particles: particleSettings.subtle,
    depth: depthLayerConfigs.minimal,
    noise: noiseSettings.subtle,
    enableWebGL: true,
  },
  footer: {
    gradient: 'ember',
    particles: particleSettings.embers,
    depth: depthLayerConfigs.standard,
    noise: noiseSettings.smoky,
    enableWebGL: true,
  },
  poems: {
    gradient: 'midnight',
    particles: { ...particleSettings.dust, count: 50 },
    depth: depthLayerConfigs.minimal,
    noise: noiseSettings.subtle,
    enableWebGL: true,
  },
  performances: {
    gradient: 'ember',
    particles: particleSettings.fireflies,
    depth: depthLayerConfigs.dramatic,
    noise: noiseSettings.atmospheric,
    enableWebGL: true,
  },
}

// ===== PERFORMANCE SETTINGS =====

export interface PerformanceConfig {
  fpsThresholds: {
    low: number
    critical: number
  }
  particleMultipliers: {
    high: number
    medium: number
    low: number
  }
  pixelRatioLimits: {
    high: number
    medium: number
    low: number
  }
  shaderQuality: {
    high: 'full' | 'simplified'
    medium: 'simplified'
    low: 'none'
  }
}

export const performanceConfig: PerformanceConfig = {
  fpsThresholds: {
    low: 25,
    critical: 15,
  },
  particleMultipliers: {
    high: 1.0,
    medium: 0.5,
    low: 0.2,
  },
  pixelRatioLimits: {
    high: 2,
    medium: 1.5,
    low: 1,
  },
  shaderQuality: {
    high: 'full',
    medium: 'simplified',
    low: 'none',
  },
}

// ===== MOBILE SETTINGS =====

export interface MobileConfig {
  particleCountMultiplier: number
  disableMouseInteraction: boolean
  disableDepthLayers: boolean
  useSimplifiedShaders: boolean
  pixelRatioLimit: number
  disableNoise: boolean
}

export const mobileConfig: MobileConfig = {
  particleCountMultiplier: 0.3,
  disableMouseInteraction: true,
  disableDepthLayers: true,
  useSimplifiedShaders: true,
  pixelRatioLimit: 1.5,
  disableNoise: false,
}

// ===== ANIMATION SETTINGS =====

export interface AnimationConfig {
  gradientSpeed: number
  particleSpeed: number
  noiseSpeed: number
  parallaxIntensity: number
  mouseInfluence: number
  scrollInfluence: number
}

export const animationConfig: AnimationConfig = {
  gradientSpeed: 0.3,
  particleSpeed: 1.0,
  noiseSpeed: 0.3,
  parallaxIntensity: 1.0,
  mouseInfluence: 0.5,
  scrollInfluence: 0.3,
}

// ===== HELPER FUNCTIONS =====

/**
 * Get section preset by name
 */
export function getSectionPreset(section: string): SectionPreset {
  return sectionPresets[section] || sectionPresets.content
}

/**
 * Get particle count adjusted for performance
 */
export function getAdjustedCount(
  baseCount: number,
  quality: 'high' | 'medium' | 'low',
  isMobile: boolean
): number {
  let count = baseCount * performanceConfig.particleMultipliers[quality]
  
  if (isMobile) {
    count *= mobileConfig.particleCountMultiplier
  }
  
  return Math.max(Math.floor(count), 5)
}

/**
 * Get depth layers adjusted for performance
 */
export function getAdjustedLayers(
  layers: DepthLayerConfig[],
  quality: 'high' | 'medium' | 'low',
  isMobile: boolean
): DepthLayerConfig[] {
  if (isMobile && mobileConfig.disableDepthLayers) {
    return layers.slice(0, 2)
  }
  
  switch (quality) {
    case 'high':
      return layers
    case 'medium':
      return layers.slice(0, Math.ceil(layers.length * 0.6))
    case 'low':
      return layers.slice(0, 2)
  }
}

/**
 * Check if effects should be enabled
 */
export function shouldEnableEffects(
  quality: 'high' | 'medium' | 'low',
  isMobile: boolean
): {
  webgl: boolean
  particles: boolean
  noise: boolean
  depth: boolean
} {
  if (quality === 'low') {
    return {
      webgl: false,
      particles: true, // CSS fallback
      noise: !mobileConfig.disableNoise,
      depth: false,
    }
  }
  
  if (isMobile) {
    return {
      webgl: quality === 'high',
      particles: true,
      noise: !mobileConfig.disableNoise,
      depth: !mobileConfig.disableDepthLayers,
    }
  }
  
  return {
    webgl: true,
    particles: true,
    noise: true,
    depth: true,
  }
}

// ===== TYPES EXPORT =====

export type { GradientPreset, ParticleType, NoisePreset, LayerType }
