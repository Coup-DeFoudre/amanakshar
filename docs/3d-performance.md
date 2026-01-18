# 3D Performance Optimization Guide

This guide covers the comprehensive performance optimization system for 3D components in the Aman Akshar website.

## Table of Contents

1. [Overview](#overview)
2. [Performance Monitoring](#performance-monitoring)
3. [Lazy Loading](#lazy-loading)
4. [Asset Preloading](#asset-preloading)
5. [Code Splitting](#code-splitting)
6. [Reduced Motion](#reduced-motion)
7. [Loading States](#loading-states)
8. [Performance Budgets](#performance-budgets)
9. [Best Practices](#best-practices)

## Overview

The 3D system uses a comprehensive multi-tier performance approach with automatic quality adjustment:

1. **Ultra**: All effects enabled, 4K textures, post-processing (high-end desktops)
2. **High**: Reduced particles, 2K textures, selective post-processing (standard desktops)
3. **Medium**: No shadows, fewer particles, 1K textures (laptops/tablets)
4. **Low**: CSS-only fallback, static content (mobile/low-end devices)

The system automatically detects device capabilities, monitors runtime performance, and adapts quality settings to maintain smooth framerates.

## Performance Monitoring

### Centralized Performance Monitor

The new `PerformanceMonitor` singleton provides real-time FPS tracking, memory monitoring, and adaptive quality management:

```typescript
import { PerformanceMonitor, usePerformanceMonitor } from '@/lib/performance-monitor'

// React hook for component integration
const { metrics, qualityLevel, performanceTier, shouldUseFallback } = usePerformanceMonitor()

// Access singleton directly
PerformanceMonitor.startMonitoring()
const currentMetrics = PerformanceMonitor.getMetrics()

// Listen to performance events
PerformanceMonitor.on('quality-change', ({ newLevel, oldLevel }) => {
  console.log(`Quality changed from ${oldLevel} to ${newLevel}`)
})

PerformanceMonitor.on('fps-drop', ({ avgFps, newQuality }) => {
  console.warn(`FPS dropped to ${avgFps}, reducing to ${newQuality}`)
})

PerformanceMonitor.on('budget-violation', ({ triangles, drawCalls }) => {
  console.warn('Performance budget exceeded:', triangles, drawCalls)
})

PerformanceMonitor.on('memory-warning', ({ used, limit, percentage }) => {
  console.warn(`Memory usage: ${percentage}%`)
})
```

### Performance Metrics

```typescript
interface PerformanceMetrics {
  fps: number                    // Current FPS
  avgFps: number                 // Rolling average FPS (60 samples)
  memory: {
    used: number                 // Used memory in MB
    limit: number                // Memory limit in MB
    percentage: number           // Usage percentage
  } | null
  triangles: number              // Current triangle count
  drawCalls: number             // Current draw calls
  textureMemory: number         // Texture memory in MB
  qualityLevel: QualityLevel    // Current quality level
  performanceTier: PerformanceTier // Device tier
}
```

### Automatic Tier Detection

Enhanced device capability detection:

```typescript
import { getPerformanceTier, getWebGLLimits } from '@/lib/three-utils'

const tier = getPerformanceTier() // Returns: 'low' | 'medium' | 'high'
const limits = getWebGLLimits()   // Detailed WebGL capabilities

// Detection based on:
// - WebGL 2 support
// - GPU tier (via WEBGL_debug_renderer_info)
// - Maximum texture size
// - Anisotropic filtering support
// - Float texture support
// - Instancing support
// - Hardware concurrency
// - Device memory
```

### Adaptive Quality System

Automatically adjusts quality when FPS drops below target:

```typescript
// Quality automatically reduces if:
// - Average FPS < budget minimum for 3 seconds (180 frames at 60fps)
// - Memory usage > 90%
// - Performance budget violations

// Manual quality adjustment
PerformanceMonitor.setQualityLevel('medium')
```

## Lazy Loading

### 3D-Specific Lazy Loading

Use `Lazy3D` wrapper for performance-aware lazy loading with Intersection Observer:

```typescript
import { Lazy3D, Lazy3DPortrait, Lazy3DStage } from '@/components/3d/Lazy3D'

// Basic usage
<Lazy3D
  minPerformanceTier="medium"
  priority="high"
  skeletonType="portrait"
  onLoadComplete={() => console.log('Loaded!')}
>
  <PoetPortrait3D />
</Lazy3D>

// Convenience wrappers
<Lazy3DPortrait
  component={PoetPortrait3D}
  componentProps={{ scrollProgress: 0.5 }}
  minPerformanceTier="low"
  priority="critical"
/>
```

### Lazy Loading Configuration

```typescript
interface Lazy3DProps {
  minPerformanceTier?: 'low' | 'medium' | 'high'  // Minimum device tier required
  rootMargin?: string                              // Intersection Observer margin
  threshold?: number                               // Intersection threshold
  priority?: 'high' | 'medium' | 'low'            // Loading priority
  preloadAssets?: string[]                         // Assets to preload
  skeletonType?: SkeletonType                      // Skeleton variant
  onLoadStart?: () => void
  onLoadComplete?: () => void
  onFallback?: () => void
}

// Priority-based root margins:
// - high: 600px (starts loading early)
// - medium: 300px (default)
// - low: 100px (loads just before viewport)
```

## Asset Preloading

### Asset Preloader System

Intelligent priority-based preloading with connection awareness:

```typescript
import { AssetPreloader, useAssetPreloader, preloadCriticalAssets } from '@/lib/asset-preloader'

// Preload 3D models
await AssetPreloader.preloadModel('/models/poet-portrait.glb', 'critical')

// Preload textures with format detection
await AssetPreloader.preloadTexture('/textures/portrait.jpg', 'high')

// Preload Draco decoder
await AssetPreloader.preloadDraco()

// Warmup CDN connections
AssetPreloader.warmupConnection([
  'https://cdn.amanakshar.com',
  'https://res.cloudinary.com'
])

// React hook
const { progress, preloadModel, connectionSpeed } = useAssetPreloader()

useEffect(() => {
  preloadModel('/models/stage.glb', 'medium')
}, [])
```

### Priority Queue System

```typescript
// Assets are loaded in priority order:
// 1. critical (hero 3D models, Draco decoder)
// 2. high (above-fold textures)
// 3. medium (below-fold models)
// 4. low (background assets)

// Connection-aware loading:
// - Fast (4G): 4 concurrent downloads
// - Medium (3G): 2 concurrent downloads
// - Slow (2G/3G): 1 concurrent download
```

### Preload Links for Next.js

```typescript
// Get preload links for critical assets
const links = AssetPreloader.getPreloadLinks()

// Add to Next.js <Head>
{links.map(link => (
  <link key={link.href} {...link} />
))}
```

## Code Splitting

### Three.js Dynamic Imports

Reduce initial bundle size by splitting Three.js libraries:

```typescript
import { 
  loadGLTFLoader, 
  loadDracoLoader, 
  loadPostProcessing,
  loadOrbitControls 
} from '@/lib/three-dynamic'

// Load GLTF loader on demand
const GLTFLoader = await loadGLTFLoader()
const loader = new GLTFLoader()

// Load post-processing only when needed
const { EffectComposer, UnrealBloomPass } = await loadPostProcessing()

// Preload core modules early
import { preloadCoreModules } from '@/lib/three-dynamic'
preloadCoreModules() // Call in app initialization
```

### Bundle Size Impact

```
Before code splitting:
- Initial bundle: ~800KB (Three.js + loaders)

After code splitting:
- Initial bundle: ~150KB (core Three.js only)
- GLTF loader: ~80KB (loaded on demand)
- Draco loader: ~200KB (loaded on first model)
- Post-processing: ~150KB (loaded when effects enabled)
```

## Reduced Motion

### Comprehensive Reduced Motion Support

All 3D and animation features respect `prefers-reduced-motion`:

```typescript
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { getReducedMotionSettings } from '@/lib/three-utils'

function Component3D() {
  const prefersReducedMotion = useReducedMotion()
  const settings = getReducedMotionSettings()
  
  // Canvas uses 'demand' frameloop for reduced motion
  <Canvas3D frameloop={settings.frameloop}>
    {/* Disable animations */}
    {!prefersReducedMotion && <AnimatedComponent />}
  </Canvas3D>
}
```

### Affected Components

All these components disable animations for reduced motion:

- **Canvas3D**: Sets `frameloop="demand"` (static rendering)
- **PoetPortrait3D**: Disables mouse-follow rotation and particles
- **Stage3D**: Disables spotlight animations and camera movements
- **PortraitGallery3D**: Disables auto-rotation and transitions
- **VideoFrame3D**: Disables holographic glow pulsing
- **ScrollCameraRig**: Uses static positioning instead of camera movements
- **AnimatedSpotlight**: Uses `animationPattern="static"`
- **All animation components**: Check `useReducedMotion()` before animating

## Loading States

### 3D Skeleton Components

Specialized skeleton loaders for different 3D component types:

```typescript
import { 
  Portrait3DSkeleton, 
  Stage3DSkeleton, 
  Gallery3DSkeleton,
  VideoFrame3DSkeleton,
  Model3DSkeleton,
  LoadingProgress3D 
} from '@/components/ui/Skeleton'

// Portrait skeleton with shimmer
<Portrait3DSkeleton className="mb-8" />

// Stage skeleton with spotlight placeholders
<Stage3DSkeleton />

// Gallery grid skeleton
<Gallery3DSkeleton count={6} />

// Video frame skeleton with holographic effects
<VideoFrame3DSkeleton />

// Generic model skeleton
<Model3DSkeleton />

// Progressive loading with states
<LoadingProgress3D 
  state="loading"  // or "parsing" | "rendering" | "complete"
  progress={45}
/>
```

### Loading State Machine

```typescript
type LoadingState = 'loading' | 'parsing' | 'rendering' | 'complete'

// Progression:
// 1. loading: Downloading model file
// 2. parsing: Parsing GLTF/GLB and Draco decompression
// 3. rendering: First render and shader compilation
// 4. complete: Ready for interaction
```

## Quality Settings

### Per-Tier Settings

| Setting | Ultra | High | Medium | Low |
|---------|-------|------|--------|-----|
| Shadows | ✓ | ✓ | ✗ | ✗ |
| Shadow Map Size | 2048 | 1024 | 512 | N/A |
| Particle Multiplier | 1.0 | 0.6 | 0.3 | 0 |
| Post-Processing | ✓ | ✓ | ✗ | ✗ |
| Volumetric Effects | ✓ | ✗ | ✗ | ✗ |
| Antialiasing | ✓ | ✓ | ✗ | ✗ |
| Max Pixel Ratio | 2 | 1.5 | 1 | 1 |
| Texture Size | 4096 | 2048 | 1024 | 512 |
| Model Complexity | High | Medium | Low | 2D Fallback |

### Accessing Settings

```typescript
import { PERFORMANCE_BUDGETS, PerformanceMonitor } from '@/lib/performance-monitor'

// Get budget for quality level
const budget = PERFORMANCE_BUDGETS['high']
// {
//   triangles: 300000,
//   drawCalls: 150,
//   textureMemory: 300, // MB
//   minFps: 55
// }

// Get current quality
const currentQuality = PerformanceMonitor.getQualityLevel()
const currentBudget = PerformanceMonitor.getBudget()
```

## Performance Budgets

### Budget Enforcement

The system automatically tracks and enforces performance budgets:

```typescript
import { PERFORMANCE_BUDGETS, PerformanceMonitor } from '@/lib/performance-monitor'

// Update render stats (call each frame in 3D scene)
PerformanceMonitor.updateRenderStats(
  renderer.info.render.triangles,
  renderer.info.render.calls,
  estimatedTextureMemoryMB
)

// Monitor for budget violations
PerformanceMonitor.on('budget-violation', ({ triangles, drawCalls, textureMemory }) => {
  console.warn('Budget exceeded:', {
    triangles: `${triangles.current}/${triangles.limit}`,
    drawCalls: `${drawCalls.current}/${drawCalls.limit}`,
    textureMemory: `${textureMemory.current}MB/${textureMemory.limit}MB`
  })
})
```

### Budget Limits by Quality

| Quality | Triangles | Draw Calls | Texture Memory | Min FPS |
|---------|-----------|------------|----------------|---------|
| Low | 50,000 | 50 | 50 MB | 30 |
| Medium | 150,000 | 100 | 150 MB | 45 |
| High | 300,000 | 150 | 300 MB | 55 |
| Ultra | 500,000 | 200 | 500 MB | 60 |

### Budget Presets

```typescript
interface PerformanceBudget {
  triangles: number
  drawCalls: number
  textureMemory: number // in MB
  minFps: number
}

// Access budgets
const mediumBudget = PERFORMANCE_BUDGETS['medium']
// {
//   triangles: 150000,
//   drawCalls: 100,
//   textureMemory: 150,
//   minFps: 45
// }
```

### Budget-Aware Model Loading

```typescript
// Skip high-poly models when budget is tight
const budget = PerformanceMonitor.getBudget()
const currentTriangles = renderer.info.render.triangles

if (currentTriangles + newModelTriangles > budget.triangles) {
  // Load low-poly version instead
  loadLowPolyModel()
} else {
  loadHighPolyModel()
}
```

## Optimization Strategies

### 1. Instanced Rendering

For repeated objects (audience silhouettes, particles):

```tsx
// Bad: Individual meshes
{Array.from({ length: 100 }).map((_, i) => (
  <mesh key={i} position={[i, 0, 0]}>
    <sphereGeometry args={[0.5]} />
    <meshBasicMaterial />
  </mesh>
))}

// Good: Instanced mesh
<instancedMesh args={[undefined, undefined, 100]}>
  <sphereGeometry args={[0.5]} />
  <meshBasicMaterial />
</instancedMesh>
```

### 2. Level of Detail (LOD)

Use simpler geometry for distant objects:

```tsx
import { Detailed } from '@react-three/drei'

<Detailed distances={[0, 5, 10]}>
  <HighDetailMesh />
  <MediumDetailMesh />
  <LowDetailMesh />
</Detailed>
```

### 3. Throttled Updates

For expensive operations:

```typescript
import { createThrottledUpdate } from '@/lib/three-performance'

const throttledShadowUpdate = createThrottledUpdate(
  () => updateShadows(),
  qualityLevel
)

useFrame(() => {
  throttledShadowUpdate()
})
```

### 4. Conditional Rendering

Skip effects based on tier:

```tsx
function Stage3DScene({ tier }) {
  return (
    <>
      <StageFloor />
      {tier !== 'low' && <StageParticles count={tier === 'high' ? 100 : 50} />}
      {tier === 'high' && <VolumetricLighting />}
    </>
  )
}
```

### 5. Reduced Motion Support

Always check for reduced motion preference:

```tsx
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()
  
  useFrame((state) => {
    if (prefersReducedMotion) return
    // Animation logic
  })
}
```

## Component-Specific Optimization

### VideoFrame3D

| Component | Optimization |
|-----------|--------------|
| Frame mesh | Simple BoxGeometry, no bevels on low-end |
| Glow layer | CSS gradient fallback on medium/low |
| Holographic shader | Simplified version on medium, disabled on low |
| Corner accents | Static on low-end, animated on high |

### Stage3D

| Component | Optimization |
|-----------|--------------|
| Spotlights | 3 on high, 2 on medium, CSS on low |
| Shadows | Full on high, reduced on medium, off on low |
| Particles | 100 high, 50 medium, 25 low, 0 on reduced motion |
| Audience | Instanced meshes, count scales with tier |
| Volumetric cones | High-end only |

### AnimatedSpotlight

| Feature | High | Medium | Low |
|---------|------|--------|-----|
| Volumetric cone | ✓ | ✗ | ✗ |
| Shadow map size | 2048 | 1024 | 512 |
| Animation pattern | Full | Reduced | Static |
| Intensity pulsing | ✓ | ✓ | ✗ |

## Memory Management

### Texture Cleanup

Always dispose of textures when done:

```typescript
import { disposeObject } from '@/lib/three-utils'

useEffect(() => {
  return () => {
    if (meshRef.current) {
      disposeObject(meshRef.current)
    }
  }
}, [])
```

### Material Reuse

Create materials once and reuse:

```tsx
// Bad: Creates new material each render
<meshStandardMaterial color="red" />

// Good: Reuse material
const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'red' }), [])
<mesh material={material} />
```

## Debugging Performance

### Enable Performance Monitor

```tsx
<Canvas3D enablePerformanceMonitor={process.env.NODE_ENV === 'development'}>
  {/* Scene */}
</Canvas3D>
```

### Check FPS in Console

```typescript
usePerformanceMonitor({
  config: { enableAdaptiveQuality: false },
  onQualityChange: (level, settings) => {
    console.table(settings)
  },
})
```

### Inspect Draw Calls

Use browser dev tools → Three.js DevTools extension to monitor:
- Draw calls per frame
- Triangle count
- Texture memory usage

## Best Practices

### 1. Use Lazy Loading

```typescript
// Bad: Loads immediately, even if off-screen
<PoetPortrait3D />

// Good: Loads when near viewport with appropriate skeleton
<Lazy3DPortrait
  component={PoetPortrait3D}
  priority="high"
  minPerformanceTier="medium"
  skeletonType="portrait"
/>
```

### 2. Preload Critical Assets

```typescript
// In app initialization or route component
import { preloadCriticalAssets } from '@/lib/asset-preloader'

useEffect(() => {
  preloadCriticalAssets([
    { url: '/models/poet-portrait.glb', type: 'model' },
    { url: '/textures/paper.svg', type: 'texture' },
  ])
}, [])
```

### 3. Dynamic Imports for Three.js

```typescript
// Bad: Imports everything upfront
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// Good: Loads on demand
import { loadGLTFLoader } from '@/lib/three-dynamic'

async function loadModel() {
  const GLTFLoader = await loadGLTFLoader()
  const loader = new GLTFLoader()
  // ...
}
```

### 4. Respect Reduced Motion

```typescript
// Always check for reduced motion preference
const prefersReducedMotion = useReducedMotion()

useFrame(() => {
  if (prefersReducedMotion) return
  // Animation logic
})

// Or use settings utility
const settings = getReducedMotionSettings()
<Canvas3D frameloop={settings.frameloop}>
```

### 5. Provide Skeleton Loading States

```typescript
// Use appropriate skeleton for content type
<Suspense fallback={<Portrait3DSkeleton />}>
  <Lazy3DPortrait component={PoetPortrait3D} />
</Suspense>

// Show progressive loading states
<LoadingProgress3D 
  state={loadingState} 
  progress={loadingProgress} 
/>
```

### 6. Monitor and Update Budgets

```typescript
// Update render stats each frame
useFrame(({ gl }) => {
  const { render } = gl.info
  PerformanceMonitor.updateRenderStats(
    render.triangles,
    render.calls,
    estimatedTextureMemory
  )
})

// React to budget violations
useEffect(() => {
  const handler = (data) => {
    console.warn('Budget exceeded, reducing quality')
    // Take corrective action
  }
  PerformanceMonitor.on('budget-violation', handler)
  return () => PerformanceMonitor.off('budget-violation', handler)
}, [])
```

### 7. Use Error Boundaries

```typescript
import { Lazy3DErrorBoundary } from '@/components/3d/Lazy3D'

<Lazy3DErrorBoundary
  maxRetries={3}
  fallback={<PortraitFallback2D />}
  onError={(error) => console.error('3D error:', error)}
>
  <PoetPortrait3D />
</Lazy3DErrorBoundary>
```

### 8. Optimize Service Worker Caching

The service worker automatically caches:
- Three.js chunks (Draco decoder, loaders)
- Critical 3D models
- Textures

```javascript
// Service worker caches:
// - /draco/* → THREE_CACHE (cache-first)
// - /models/*.glb → MODEL_CACHE (cache-first)
// - /textures/* → STATIC_CACHE (stale-while-revalidate)
```

### 9. Asset Manifest Coordination

Use `/public/assets-manifest.json` to coordinate preloading:

```json
{
  "critical": {
    "models": [
      {
        "url": "/models/poet-portrait.glb",
        "type": "model",
        "priority": "critical",
        "usage": "homepage_hero"
      }
    ]
  }
}
```

### 10. Test Performance Metrics

```typescript
// Get comprehensive metrics
const metrics = PerformanceMonitor.getMetrics()

console.table({
  'FPS': metrics.fps.toFixed(1),
  'Avg FPS': metrics.avgFps.toFixed(1),
  'Quality': metrics.qualityLevel,
  'Tier': metrics.performanceTier,
  'Triangles': metrics.triangles.toLocaleString(),
  'Draw Calls': metrics.drawCalls,
  'Memory': metrics.memory ? `${metrics.memory.percentage.toFixed(1)}%` : 'N/A'
})
```

## Summary

The comprehensive performance optimization system includes:

✅ **Centralized Performance Monitor** - Real-time FPS, memory, and budget tracking  
✅ **Lazy Loading** - Intersection Observer with performance-aware loading  
✅ **Asset Preloading** - Priority-based queue with connection awareness  
✅ **Code Splitting** - Dynamic imports for Three.js libraries  
✅ **Reduced Motion** - Full support across all 3D and animation components  
✅ **Loading States** - Specialized skeletons and progressive loading  
✅ **Performance Budgets** - Automatic enforcement with quality adjustment  
✅ **Service Worker** - Offline 3D model caching  
✅ **Error Boundaries** - Graceful degradation with retry mechanisms  
✅ **WebGL Detection** - Detailed capability detection with fallbacks  

## Recommended Reading

- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance)
- [Three.js Optimization Tips](https://discoverthreejs.com/tips-and-tricks/)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Service Worker Caching Strategies](https://web.dev/offline-cookbook/)