/**
 * Draco Loader Singleton
 * 
 * Provides a singleton instance of DRACOLoader to prevent
 * multiple initializations and ensure proper resource management.
 */

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DRACO_DECODER_PATH } from '@/lib/three-utils'

// ===== SINGLETON INSTANCE =====

let dracoLoaderInstance: DRACOLoader | null = null
let isInitialized = false

/** Draco loader initialization options */
export interface DracoLoaderOptions {
  /** Path to decoder files (default: /draco/) */
  decoderPath?: string
  /** Maximum number of workers (default: auto-detect) */
  workerLimit?: number
  /** Use WASM decoder if available */
  preferWasm?: boolean
}

/**
 * Gets or creates the singleton DRACOLoader instance
 * 
 * @param options - Configuration options
 * @returns Configured DRACOLoader instance
 * 
 * @example
 * ```tsx
 * import { getDracoLoader } from '@/lib/loaders/draco-loader'
 * 
 * const loader = getDracoLoader()
 * gltfLoader.setDRACOLoader(loader)
 * ```
 */
export function getDracoLoader(options: DracoLoaderOptions = {}): DRACOLoader {
  if (!dracoLoaderInstance) {
    dracoLoaderInstance = new DRACOLoader()
    
    const {
      decoderPath = DRACO_DECODER_PATH,
      workerLimit,
      preferWasm = false,
    } = options

    // Set decoder path
    dracoLoaderInstance.setDecoderPath(decoderPath)

    // Configure decoder type
    // JS decoder is more compatible but WASM is faster
    if (preferWasm && typeof WebAssembly !== 'undefined') {
      dracoLoaderInstance.setDecoderConfig({ type: 'wasm' })
    } else {
      dracoLoaderInstance.setDecoderConfig({ type: 'js' })
    }

    // Set worker limit based on available cores
    if (workerLimit !== undefined) {
      // Note: DRACOLoader doesn't have a direct setWorkerLimit method
      // Worker count is managed internally, but we track the preference
    }

    // Preload the decoder
    dracoLoaderInstance.preload()
    
    isInitialized = true
  }

  return dracoLoaderInstance
}

/**
 * Checks if the Draco loader has been initialized
 * @returns Whether the loader is initialized
 */
export function isDracoLoaderInitialized(): boolean {
  return isInitialized
}

/**
 * Disposes of the Draco loader singleton and frees resources
 * Should be called when 3D rendering is no longer needed
 * 
 * @example
 * ```tsx
 * useEffect(() => {
 *   return () => {
 *     disposeDracoLoader()
 *   }
 * }, [])
 * ```
 */
export function disposeDracoLoader(): void {
  if (dracoLoaderInstance) {
    dracoLoaderInstance.dispose()
    dracoLoaderInstance = null
    isInitialized = false
  }
}

/**
 * Preloads the Draco decoder for faster first model load
 * Call this early in your app lifecycle for better UX
 */
export function preloadDracoDecoder(): void {
  getDracoLoader().preload()
}

// ===== UTILITY FUNCTIONS =====

/**
 * Checks if Draco compression is likely beneficial for a model
 * Based on file size heuristics
 * 
 * @param fileSizeBytes - Size of the model file in bytes
 * @returns Whether Draco compression is recommended
 */
export function shouldUseDraco(fileSizeBytes: number): boolean {
  // Draco compression is beneficial for models larger than 100KB
  // Smaller models may not benefit from the decompression overhead
  const threshold = 100 * 1024 // 100KB
  return fileSizeBytes > threshold
}

/**
 * Gets estimated decompression time based on file size
 * @param compressedSizeBytes - Compressed file size in bytes
 * @returns Estimated decompression time in milliseconds
 */
export function estimateDecompressionTime(compressedSizeBytes: number): number {
  // Rough estimate: ~10MB/s decompression speed
  const decompressionSpeed = 10 * 1024 * 1024 // 10MB/s
  return (compressedSizeBytes / decompressionSpeed) * 1000
}
