/**
 * Three.js Type Declarations
 * 
 * Extends Three.js types with custom properties and provides
 * shared type definitions for 3D components.
 */

import * as THREE from 'three'
import type { ReactNode } from 'react'
import type { RootState } from '@react-three/fiber'

// ===== MODULE AUGMENTATION =====

declare module 'three' {
  /**
   * Extended Object3D with custom user data
   */
  interface Object3DUserData {
    /** Custom name for identification */
    customName?: string
    /** Whether object should be excluded from raycasting */
    excludeFromRaycast?: boolean
    /** Animation clip names associated with this object */
    animations?: string[]
    /** Original material reference for restoration */
    originalMaterial?: THREE.Material | THREE.Material[]
    /** Performance tier when object was created */
    performanceTier?: 'low' | 'medium' | 'high'
  }
}

// ===== COMPONENT PROP TYPES =====

/**
 * Base props for 3D model components
 */
export interface Model3DProps {
  /** URL to the model file (.glb, .gltf) */
  url: string
  /** Position in 3D space [x, y, z] */
  position?: [number, number, number]
  /** Rotation in radians [x, y, z] */
  rotation?: [number, number, number]
  /** Scale factor or [x, y, z] scale */
  scale?: number | [number, number, number]
  /** Whether to cast shadows */
  castShadow?: boolean
  /** Whether to receive shadows */
  receiveShadow?: boolean
  /** Callback when model finishes loading */
  onLoad?: (model: THREE.Group) => void
  /** Callback for loading progress (0-100) */
  onProgress?: (progress: number) => void
  /** Callback for loading errors */
  onError?: (error: Error) => void
  /** Additional children to render inside the model */
  children?: ReactNode
}

/**
 * Props for scene wrapper components
 */
export interface Scene3DProps {
  /** Background color or null for transparent */
  background?: string | null
  /** Fog configuration */
  fog?: {
    color: string
    near: number
    far: number
  }
  /** Environment map URL or preset */
  environment?: string | 'studio' | 'sunset' | 'dawn' | 'night'
  /** Whether to enable shadows */
  shadows?: boolean
  /** Children to render in the scene */
  children?: ReactNode
}

/**
 * Props for camera components
 */
export interface Camera3DProps {
  /** Field of view in degrees */
  fov?: number
  /** Near clipping plane */
  near?: number
  /** Far clipping plane */
  far?: number
  /** Camera position [x, y, z] */
  position?: [number, number, number]
  /** Point to look at [x, y, z] */
  lookAt?: [number, number, number]
  /** Enable orbit controls */
  controls?: boolean
  /** Control constraints */
  controlsConfig?: {
    enableZoom?: boolean
    enablePan?: boolean
    enableRotate?: boolean
    minDistance?: number
    maxDistance?: number
    minPolarAngle?: number
    maxPolarAngle?: number
  }
}

/**
 * Props for light components
 */
export interface Light3DProps {
  /** Light type */
  type: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere'
  /** Light color */
  color?: string
  /** Light intensity */
  intensity?: number
  /** Position for positional lights [x, y, z] */
  position?: [number, number, number]
  /** Whether to cast shadows */
  castShadow?: boolean
  /** Shadow map size */
  shadowMapSize?: number
  /** Target for directional/spot lights [x, y, z] */
  target?: [number, number, number]
  /** For hemisphere lights - ground color */
  groundColor?: string
}

// ===== ANIMATION TYPES =====

/**
 * Animation state for 3D objects
 */
export interface Animation3DState {
  /** Current animation name */
  currentAnimation: string | null
  /** Whether animation is playing */
  isPlaying: boolean
  /** Playback speed (1 = normal) */
  speed: number
  /** Whether to loop animation */
  loop: boolean
  /** Current animation time */
  time: number
  /** Total animation duration */
  duration: number
}

/**
 * Animation controller interface
 */
export interface Animation3DController {
  /** Play an animation by name */
  play: (name: string, options?: { loop?: boolean; speed?: number }) => void
  /** Pause current animation */
  pause: () => void
  /** Stop and reset animation */
  stop: () => void
  /** Set playback speed */
  setSpeed: (speed: number) => void
  /** Seek to time */
  seek: (time: number) => void
  /** Get available animation names */
  getAnimations: () => string[]
}

// ===== INTERACTION TYPES =====

/**
 * Pointer event data for 3D objects
 */
export interface Pointer3DEvent {
  /** Original Three.js intersection */
  intersection: THREE.Intersection
  /** World position of intersection */
  point: THREE.Vector3
  /** Normal at intersection point */
  normal: THREE.Vector3
  /** Distance from camera */
  distance: number
  /** The intersected object */
  object: THREE.Object3D
  /** UV coordinates if available */
  uv?: THREE.Vector2
  /** Original DOM event */
  nativeEvent: PointerEvent | MouseEvent
  /** Stop propagation to other objects */
  stopPropagation: () => void
}

/**
 * Props for interactive 3D objects
 */
export interface Interactive3DProps {
  /** Click handler */
  onClick?: (event: Pointer3DEvent) => void
  /** Pointer enter handler */
  onPointerEnter?: (event: Pointer3DEvent) => void
  /** Pointer leave handler */
  onPointerLeave?: (event: Pointer3DEvent) => void
  /** Pointer move handler */
  onPointerMove?: (event: Pointer3DEvent) => void
  /** Pointer down handler */
  onPointerDown?: (event: Pointer3DEvent) => void
  /** Pointer up handler */
  onPointerUp?: (event: Pointer3DEvent) => void
  /** Custom cursor on hover */
  cursor?: string
}

// ===== PERFORMANCE TYPES =====

/**
 * Level of detail configuration
 */
export interface LODConfig {
  /** Distance thresholds for LOD levels */
  distances: number[]
  /** URLs or geometry for each LOD level */
  levels: string[] | THREE.BufferGeometry[]
}

/**
 * Instanced mesh configuration
 */
export interface InstancedMeshConfig {
  /** Number of instances */
  count: number
  /** Geometry to instance */
  geometry: THREE.BufferGeometry
  /** Material for instances */
  material: THREE.Material
  /** Transform matrices for each instance */
  matrices?: THREE.Matrix4[]
  /** Colors for each instance (if using instance colors) */
  colors?: THREE.Color[]
}

// ===== FRAME CALLBACK TYPES =====

/**
 * Frame callback state from R3F
 */
export interface FrameState extends RootState {
  /** Delta time since last frame */
  delta: number
  /** Elapsed time since start */
  elapsed: number
}

/**
 * Frame callback function type
 */
export type FrameCallback = (state: FrameState, delta: number) => void

// ===== UTILITY TYPES =====

/**
 * Vector3 tuple type
 */
export type Vector3Tuple = [number, number, number]

/**
 * Euler tuple type (rotation)
 */
export type EulerTuple = [number, number, number, THREE.EulerOrder?]

/**
 * Color input type
 */
export type ColorInput = string | number | THREE.Color

/**
 * Transform props for 3D objects
 */
export interface Transform3DProps {
  position?: Vector3Tuple
  rotation?: EulerTuple
  scale?: number | Vector3Tuple
}

// ===== DRACO LOADER TYPES =====

/**
 * Draco decoder configuration
 */
export interface DracoDecoderConfig {
  type: 'js' | 'wasm'
}

/**
 * Draco loader extended interface
 */
export interface DracoLoaderExtended {
  setDecoderPath: (path: string) => void
  setDecoderConfig: (config: DracoDecoderConfig) => void
  preload: () => void
  dispose: () => void
}

// ===== EXPORT HELPERS =====

/**
 * Helper to create typed Object3D user data
 */
export function createUserData(data: THREE.Object3DUserData): THREE.Object3DUserData {
  return data
}
