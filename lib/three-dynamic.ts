/**
 * Dynamic imports for Three.js libraries
 * Implements code splitting to reduce initial bundle size
 */

import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Cache for loaded modules
const moduleCache = new Map<string, any>();

/**
 * Dynamically load GLTFLoader
 */
export async function loadGLTFLoader(): Promise<typeof GLTFLoader> {
  if (moduleCache.has('GLTFLoader')) {
    return moduleCache.get('GLTFLoader');
  }

  const module = await import(
    /* webpackChunkName: "three-gltf" */
    'three/examples/jsm/loaders/GLTFLoader.js'
  );

  moduleCache.set('GLTFLoader', module.GLTFLoader);
  return module.GLTFLoader;
}

/**
 * Dynamically load DracoLoader
 */
export async function loadDracoLoader(): Promise<typeof DRACOLoader> {
  if (moduleCache.has('DRACOLoader')) {
    return moduleCache.get('DRACOLoader');
  }

  const module = await import(
    /* webpackChunkName: "three-draco" */
    'three/examples/jsm/loaders/DRACOLoader.js'
  );

  moduleCache.set('DRACOLoader', module.DRACOLoader);
  return module.DRACOLoader;
}

/**
 * Dynamically load post-processing effects
 */
export async function loadPostProcessing() {
  if (moduleCache.has('postprocessing')) {
    return moduleCache.get('postprocessing');
  }

  const [effectComposer, renderPass, unrealBloomPass, ssaoPass] = await Promise.all([
    import(
      /* webpackChunkName: "three-postprocessing" */
      'three/examples/jsm/postprocessing/EffectComposer.js'
    ),
    import(
      /* webpackChunkName: "three-postprocessing" */
      'three/examples/jsm/postprocessing/RenderPass.js'
    ),
    import(
      /* webpackChunkName: "three-postprocessing" */
      'three/examples/jsm/postprocessing/UnrealBloomPass.js'
    ),
    import(
      /* webpackChunkName: "three-postprocessing" */
      'three/examples/jsm/postprocessing/SSAOPass.js'
    ),
  ]);

  const postprocessing = {
    EffectComposer: effectComposer.EffectComposer,
    RenderPass: renderPass.RenderPass,
    UnrealBloomPass: unrealBloomPass.UnrealBloomPass,
    SSAOPass: ssaoPass.SSAOPass,
  };

  moduleCache.set('postprocessing', postprocessing);
  return postprocessing;
}

/**
 * Dynamically load OrbitControls (typically for dev/admin only)
 */
export async function loadOrbitControls() {
  if (moduleCache.has('OrbitControls')) {
    return moduleCache.get('OrbitControls');
  }

  const module = await import(
    /* webpackChunkName: "three-controls" */
    'three/examples/jsm/controls/OrbitControls.js'
  );

  moduleCache.set('OrbitControls', module.OrbitControls);
  return module.OrbitControls;
}

/**
 * Dynamically load TransformControls (dev/admin only)
 */
export async function loadTransformControls() {
  if (moduleCache.has('TransformControls')) {
    return moduleCache.get('TransformControls');
  }

  const module = await import(
    /* webpackChunkName: "three-controls" */
    'three/examples/jsm/controls/TransformControls.js'
  );

  moduleCache.set('TransformControls', module.TransformControls);
  return module.TransformControls;
}

/**
 * Preload core Three.js modules
 * Call this early in the application lifecycle
 */
export function preloadCoreModules() {
  if (typeof window === 'undefined') return;

  // Preload GLTF and Draco loaders as they're commonly used
  Promise.all([
    loadGLTFLoader(),
    loadDracoLoader(),
  ]).catch(err => {
    console.error('Failed to preload Three.js core modules:', err);
  });
}

/**
 * Clear module cache (useful for testing or memory management)
 */
export function clearModuleCache() {
  moduleCache.clear();
}

/**
 * Check if a module is already loaded
 */
export function isModuleLoaded(moduleName: string): boolean {
  return moduleCache.has(moduleName);
}
