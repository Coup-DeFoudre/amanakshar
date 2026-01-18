/**
 * Three.js Utilities Library
 * 
 * Provides utilities for 3D rendering including:
 * - Draco loader configuration
 * - Lighting presets
 * - Model loading utilities
 * - Performance detection
 * - Material helpers
 */

import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ===== DRACO LOADER CONFIGURATION =====

/** Path to Draco decoder files in public directory */
export const DRACO_DECODER_PATH = '/draco/'

/** Draco loader configuration options */
export interface DracoLoaderConfig {
  decoderPath?: string
  workerLimit?: number
}

/**
 * Creates and configures a DRACOLoader instance
 * @param config - Optional configuration for the loader
 * @returns Configured DRACOLoader instance
 */
export function setupDracoLoader(config: DracoLoaderConfig = {}): DRACOLoader {
  const loader = new DRACOLoader()
  loader.setDecoderPath(config.decoderPath || DRACO_DECODER_PATH)
  
  // Set worker limit based on device cores (default to 4)
  const workerLimit = config.workerLimit ?? Math.min(navigator.hardwareConcurrency || 4, 4)
  loader.setDecoderConfig({ type: 'js' }) // Use JS decoder for better compatibility
  
  // Preload the decoder
  loader.preload()
  
  return loader
}

// ===== LIGHTING PRESETS =====

/** Configuration for a single light */
export interface LightConfig {
  color: string
  intensity: number
  position?: [number, number, number]
  castShadow?: boolean
  shadowMapSize?: number
  shadowBias?: number
}

/** Complete lighting preset configuration */
export interface LightingPreset {
  name: string
  ambient: LightConfig
  directional?: LightConfig
  points?: LightConfig[]
  hemisphere?: {
    skyColor: string
    groundColor: string
    intensity: number
  }
}

/** Studio lighting - balanced, professional look */
export const STUDIO_LIGHTING: LightingPreset = {
  name: 'studio',
  ambient: {
    color: '#faf8f5',
    intensity: 0.4,
  },
  directional: {
    color: '#ffffff',
    intensity: 1.4,
    position: [5, 10, 7.5],
    castShadow: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001,
  },
  points: [
    {
      color: '#d4a855', // Gold accent
      intensity: 0.6,
      position: [-4, 3, 5],
    },
    {
      color: '#c4b8a8', // Warm fill
      intensity: 0.4,
      position: [3, 1, -2],
    },
  ],
}

/** Dramatic lighting - high contrast with strong shadows */
export const DRAMATIC_LIGHTING: LightingPreset = {
  name: 'dramatic',
  ambient: {
    color: '#1a1a1a',
    intensity: 0.15,
  },
  directional: {
    color: '#ffeedd',
    intensity: 2.2,
    position: [3, 8, 5],
    castShadow: true,
    shadowMapSize: 2048,
    shadowBias: -0.0002,
  },
  points: [
    {
      color: '#d4a855',
      intensity: 1.5,
      position: [-5, 3, 2],
    },
  ],
}

/** Soft lighting - gentle, flattering illumination */
export const SOFT_LIGHTING: LightingPreset = {
  name: 'soft',
  ambient: {
    color: '#faf8f5',
    intensity: 0.6,
  },
  hemisphere: {
    skyColor: '#faf8f5',
    groundColor: '#0a0908',
    intensity: 0.8,
  },
  directional: {
    color: '#ffffff',
    intensity: 0.6,
    position: [0, 10, 5],
    castShadow: false,
  },
}

/** Portrait lighting - optimized for character rendering */
export const PORTRAIT_LIGHTING: LightingPreset = {
  name: 'portrait',
  ambient: {
    color: '#faf8f5',
    intensity: 0.4,
  },
  directional: {
    color: '#fffaf0',
    intensity: 1.0,
    position: [2, 5, 5],
    castShadow: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001,
  },
  points: [
    {
      color: '#d4a855', // Key light - warm gold
      intensity: 1.0,
      position: [3, 2, 3],
    },
    {
      color: '#818cf8', // Rim light - cool indigo
      intensity: 0.6,
      position: [-3, 2, -2],
    },
    {
      color: '#c4b8a8', // Fill light
      intensity: 0.4,
      position: [0, -1, 3],
    },
    {
      color: '#faf8f5', // Top fill
      intensity: 0.2,
      position: [0, 3, 0],
    },
  ],
}

// ===== MODEL LOADING UTILITIES =====

/** Progress callback type for model loading */
export type LoadProgressCallback = (progress: number) => void

/** Error callback type for model loading */
export type LoadErrorCallback = (error: Error) => void

/** Options for loading GLTF models */
export interface LoadGLTFOptions {
  useDraco?: boolean
  onProgress?: LoadProgressCallback
  onError?: LoadErrorCallback
}

// Singleton GLTF loader with Draco support
let gltfLoader: GLTFLoader | null = null
let dracoLoader: DRACOLoader | null = null

/**
 * Gets or creates the singleton GLTF loader
 */
function getGLTFLoader(useDraco = true): GLTFLoader {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader()
    
    if (useDraco) {
      dracoLoader = setupDracoLoader()
      gltfLoader.setDRACOLoader(dracoLoader)
    }
  }
  
  return gltfLoader
}

/**
 * Loads a GLTF/GLB model with error handling and progress tracking
 * @param url - URL to the model file
 * @param options - Loading options
 * @returns Promise resolving to the loaded GLTF
 */
export async function loadGLTFModel(
  url: string,
  options: LoadGLTFOptions = {}
): Promise<GLTF> {
  const { useDraco = true, onProgress, onError } = options
  const loader = getGLTFLoader(useDraco)
  
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => resolve(gltf),
      (event) => {
        if (onProgress && event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(progress)
        }
      },
      (error) => {
        const err = error instanceof Error ? error : new Error('Failed to load model')
        onError?.(err)
        reject(err)
      }
    )
  })
}

/**
 * Preloads a model for eager loading of critical 3D assets
 * @param url - URL to the model file
 */
export async function preloadModel(url: string): Promise<void> {
  try {
    await loadGLTFModel(url)
  } catch (error) {
    console.warn(`Failed to preload model: ${url}`, error)
  }
}

/**
 * Calculates the bounding box of a 3D object
 * @param object - Three.js Object3D to measure
 * @returns Bounding box with size and center
 */
export function getModelBounds(object: THREE.Object3D): {
  box: THREE.Box3
  size: THREE.Vector3
  center: THREE.Vector3
} {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  
  box.getSize(size)
  box.getCenter(center)
  
  return { box, size, center }
}

// ===== PERFORMANCE UTILITIES =====

/** WebGL support detection result */
export interface WebGLSupport {
  webgl: boolean
  webgl2: boolean
  renderer: string
  vendor: string
  maxTextureSize: number
  maxAnisotropy: number
}

/**
 * Detects WebGL support and capabilities
 * @returns WebGL support information
 */
export function detectWebGLSupport(): WebGLSupport {
  const result: WebGLSupport = {
    webgl: false,
    webgl2: false,
    renderer: 'Unknown',
    vendor: 'Unknown',
    maxTextureSize: 0,
    maxAnisotropy: 1,
  }
  
  if (typeof window === 'undefined') {
    return result
  }
  
  try {
    const canvas = document.createElement('canvas')
    
    // Try WebGL 2 first
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2')
    if (gl) {
      result.webgl2 = true
      result.webgl = true
    } else {
      // Fall back to WebGL 1
      gl = canvas.getContext('webgl')
      if (gl) {
        result.webgl = true
      }
    }
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown'
        result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown'
      }
      
      result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
      
      const anisotropyExt = gl.getExtension('EXT_texture_filter_anisotropic')
      if (anisotropyExt) {
        result.maxAnisotropy = gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1
      }
    }
  } catch (e) {
    console.warn('WebGL detection failed:', e)
  }
  
  return result
}

/**
 * Extended WebGL capabilities detection
 * Provides detailed information about GPU capabilities
 */
export interface WebGLLimits extends WebGLSupport {
  maxVertexAttributes: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  maxVaryingVectors: number;
  maxVertexTextureImageUnits: number;
  maxFragmentTextureImageUnits: number;
  maxCombinedTextureImageUnits: number;
  maxCubeMapTextureSize: number;
  maxRenderbufferSize: number;
  maxViewportDims: [number, number];
  supportsFloatTextures: boolean;
  supportsHalfFloatTextures: boolean;
  supportsInstancing: boolean;
  supportsStandardDerivatives: boolean;
  gpuTier: 'low' | 'medium' | 'high';
}

/**
 * Gets detailed WebGL limits and capabilities
 * @returns Detailed WebGL capabilities
 */
export function getWebGLLimits(): WebGLLimits {
  const baseSupport = detectWebGLSupport();
  
  const limits: WebGLLimits = {
    ...baseSupport,
    maxVertexAttributes: 0,
    maxVertexUniforms: 0,
    maxFragmentUniforms: 0,
    maxVaryingVectors: 0,
    maxVertexTextureImageUnits: 0,
    maxFragmentTextureImageUnits: 0,
    maxCombinedTextureImageUnits: 0,
    maxCubeMapTextureSize: 0,
    maxRenderbufferSize: 0,
    maxViewportDims: [0, 0],
    supportsFloatTextures: false,
    supportsHalfFloatTextures: false,
    supportsInstancing: false,
    supportsStandardDerivatives: false,
    gpuTier: 'medium',
  };
  
  if (typeof window === 'undefined' || !baseSupport.webgl) {
    return limits;
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | WebGL2RenderingContext | null;
    
    if (gl) {
      limits.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) || 0;
      limits.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) || 0;
      limits.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) || 0;
      limits.maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS) || 0;
      limits.maxVertexTextureImageUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) || 0;
      limits.maxFragmentTextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) || 0;
      limits.maxCombinedTextureImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) || 0;
      limits.maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE) || 0;
      limits.maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0;
      
      const viewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      limits.maxViewportDims = viewportDims ? [viewportDims[0], viewportDims[1]] : [0, 0];
      
      // Check for float texture support
      const floatExt = gl.getExtension('OES_texture_float');
      limits.supportsFloatTextures = floatExt !== null;
      
      const halfFloatExt = gl.getExtension('OES_texture_half_float');
      limits.supportsHalfFloatTextures = halfFloatExt !== null;
      
      // Check for instancing support
      const instancingExt = gl.getExtension('ANGLE_instanced_arrays');
      limits.supportsInstancing = instancingExt !== null || baseSupport.webgl2;
      
      // Check for standard derivatives
      const derivativesExt = gl.getExtension('OES_standard_derivatives');
      limits.supportsStandardDerivatives = derivativesExt !== null || baseSupport.webgl2;
      
      // Determine GPU tier based on capabilities
      limits.gpuTier = determineGPUTier(limits);
    }
  } catch (e) {
    console.warn('Failed to get WebGL limits:', e);
  }
  
  return limits;
}

/**
 * Determines GPU tier based on capabilities
 */
function determineGPUTier(limits: Partial<WebGLLimits>): 'low' | 'medium' | 'high' {
  let score = 0;
  
  // WebGL 2 support
  if (limits.webgl2) score += 2;
  
  // Texture size
  if (limits.maxTextureSize && limits.maxTextureSize >= 8192) score += 2;
  else if (limits.maxTextureSize && limits.maxTextureSize >= 4096) score += 1;
  
  // Anisotropic filtering
  if (limits.maxAnisotropy && limits.maxAnisotropy >= 8) score += 1;
  
  // Float textures
  if (limits.supportsFloatTextures) score += 1;
  
  // Instancing
  if (limits.supportsInstancing) score += 1;
  
  // GPU renderer check
  const renderer = limits.renderer?.toLowerCase() || '';
  const highEndGPUs = ['nvidia', 'geforce rtx', 'geforce gtx', 'radeon rx', 'apple m1', 'apple m2', 'apple m3'];
  const lowEndGPUs = ['intel hd', 'intel uhd 6', 'mali-4', 'adreno 5'];
  
  if (highEndGPUs.some(gpu => renderer.includes(gpu.toLowerCase()))) score += 2;
  else if (lowEndGPUs.some(gpu => renderer.includes(gpu.toLowerCase()))) score -= 2;
  
  if (score >= 6) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

/**
 * Gets quality settings for reduced motion preferences
 * @returns Static quality settings for reduced motion
 */
export function getReducedMotionSettings() {
  return {
    frameloop: 'demand' as const,
    enableAnimations: false,
    enableParticles: false,
    enableRotation: false,
    enableCameraMovements: false,
    enableSpotlightAnimations: false,
    enableGlowPulsing: false,
    staticLighting: true,
    disableAutoRotation: true,
    disableTransitions: true,
  };
}

/**
 * Gets optimal pixel ratio based on device capabilities
 * @param maxRatio - Maximum pixel ratio to return (default: 2)
 * @returns Optimal pixel ratio for performance
 */
export function getOptimalPixelRatio(maxRatio = 2): number {
  if (typeof window === 'undefined') {
    return 1
  }
  
  const dpr = window.devicePixelRatio || 1
  
  // Check for mobile devices or low-end GPUs
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  
  if (isMobile) {
    return Math.min(dpr, 1.5) // Cap mobile at 1.5 for performance
  }
  
  return Math.min(dpr, maxRatio)
}

/** Performance tier levels */
export type PerformanceTier = 'low' | 'medium' | 'high'

/**
 * Determines if simplified geometry should be used based on device performance
 * @returns Whether to use simplified geometry
 */
export function shouldUseSimplifiedGeometry(): boolean {
  const support = detectWebGLSupport()
  
  // Use simplified geometry if:
  // - No WebGL 2 support
  // - Low texture size support
  // - Mobile device
  if (!support.webgl2) return true
  if (support.maxTextureSize < 4096) return true
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  
  return isMobile
}

/**
 * Detects the performance tier of the current device
 * @returns Performance tier: 'low', 'medium', or 'high'
 */
export function getPerformanceTier(): PerformanceTier {
  const support = detectWebGLSupport()
  
  if (!support.webgl) return 'low'
  
  // Check for high-end indicators
  const isHighEnd = 
    support.webgl2 && 
    support.maxTextureSize >= 8192 &&
    support.maxAnisotropy >= 8 &&
    !shouldUseSimplifiedGeometry()
  
  if (isHighEnd) return 'high'
  
  // Check for medium indicators
  const isMedium = 
    support.webgl && 
    support.maxTextureSize >= 4096
  
  if (isMedium) return 'medium'
  
  return 'low'
}

// ===== MATERIAL HELPERS =====

/** Options for creating portrait material */
export interface PortraitMaterialOptions {
  color?: string
  roughness?: number
  metalness?: number
  envMapIntensity?: number
}

/**
 * Creates an optimized material for character/portrait rendering
 * @param options - Material configuration options
 * @returns Configured MeshStandardMaterial
 */
export function createPortraitMaterial(
  options: PortraitMaterialOptions = {}
): THREE.MeshPhysicalMaterial {
  const {
    color = '#faf8f5',
    roughness = 0.6,
    metalness = 0.1,
    envMapIntensity = 0.7,
  } = options
  
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness,
    envMapIntensity,
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
    side: THREE.FrontSide,
  })
}

/** Options for creating glow material */
export interface GlowMaterialOptions {
  color?: string
  opacity?: number
  emissiveIntensity?: number
}

/**
 * Creates a glow/holographic effect material
 * @param options - Material configuration options
 * @returns Configured MeshBasicMaterial with additive blending
 */
export function createGlowMaterial(
  options: GlowMaterialOptions = {}
): THREE.MeshBasicMaterial {
  const {
    color = '#d4a855',
    opacity = 0.7,
  } = options
  
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
}

/**
 * Disposes of a Three.js object and its resources to prevent memory leaks
 * @param object - Object to dispose
 */
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose()
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material))
        } else {
          disposeMaterial(child.material)
        }
      }
    }
  })
}

/**
 * Disposes of a material and its textures
 * @param material - Material to dispose
 */
export function disposeMaterial(material: THREE.Material): void {
  material.dispose()
  
  // Dispose textures if present
  const matWithMaps = material as THREE.MeshStandardMaterial
  if (matWithMaps.map) matWithMaps.map.dispose()
  if (matWithMaps.normalMap) matWithMaps.normalMap.dispose()
  if (matWithMaps.roughnessMap) matWithMaps.roughnessMap.dispose()
  if (matWithMaps.metalnessMap) matWithMaps.metalnessMap.dispose()
  if (matWithMaps.aoMap) matWithMaps.aoMap.dispose()
  if (matWithMaps.emissiveMap) matWithMaps.emissiveMap.dispose()
  if (matWithMaps.envMap) matWithMaps.envMap.dispose()
}

/**
 * Cleans up 3D resources when component unmounts
 * Should be called in useEffect cleanup
 */
export function cleanupThreeResources(): void {
  if (dracoLoader) {
    dracoLoader.dispose()
    dracoLoader = null
  }
  gltfLoader = null
}
