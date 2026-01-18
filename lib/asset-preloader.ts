/**
 * Intelligent Asset Preloading System
 * Manages priority-based preloading of 3D models, textures, and other assets
 */

import { useEffect, useState, useCallback } from 'react';

export type AssetPriority = 'critical' | 'high' | 'medium' | 'low';
export type AssetType = 'model' | 'texture' | 'draco' | 'generic';

interface AssetItem {
  url: string;
  type: AssetType;
  priority: AssetPriority;
  loaded: boolean;
  error: Error | null;
  size?: number;
}

interface PreloadProgress {
  total: number;
  loaded: number;
  percentage: number;
  estimatedTimeRemaining: number; // in seconds
}

const PRIORITY_WEIGHTS: Record<AssetPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

class AssetPreloaderClass {
  private static instance: AssetPreloaderClass;
  private queue: AssetItem[] = [];
  private loading: Set<string> = new Set();
  private loaded: Set<string> = new Set();
  private cache: Map<string, any> = new Map();
  private progressCallbacks: Set<(progress: PreloadProgress) => void> = new Set();
  private connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium';
  private maxConcurrent = 3;
  private loadStartTimes: Map<string, number> = new Map();
  private averageLoadTime = 0;

  private constructor() {
    this.detectConnectionSpeed();
  }

  static getInstance(): AssetPreloaderClass {
    if (!AssetPreloaderClass.instance) {
      AssetPreloaderClass.instance = new AssetPreloaderClass();
    }
    return AssetPreloaderClass.instance;
  }

  private detectConnectionSpeed(): void {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === '4g') {
        this.connectionSpeed = 'fast';
        this.maxConcurrent = 4;
      } else if (effectiveType === '3g') {
        this.connectionSpeed = 'medium';
        this.maxConcurrent = 2;
      } else {
        this.connectionSpeed = 'slow';
        this.maxConcurrent = 1;
      }

      // Listen for connection changes
      connection.addEventListener('change', () => {
        this.detectConnectionSpeed();
      });
    }
  }

  preloadModel(url: string, priority: AssetPriority = 'medium'): Promise<any> {
    return this.addToQueue(url, 'model', priority);
  }

  preloadTexture(url: string, priority: AssetPriority = 'medium'): Promise<HTMLImageElement> {
    return this.addToQueue(url, 'texture', priority);
  }

  preloadDraco(): Promise<void> {
    const dracoPath = '/draco/';
    return this.addToQueue(dracoPath, 'draco', 'critical');
  }

  private async addToQueue(url: string, type: AssetType, priority: AssetPriority): Promise<any> {
    // Check if already loaded
    if (this.loaded.has(url)) {
      return this.cache.get(url);
    }

    // Check if already in queue or loading
    if (this.loading.has(url) || this.queue.some(item => item.url === url)) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.loaded.has(url)) {
            clearInterval(checkInterval);
            resolve(this.cache.get(url));
          } else if (this.queue.find(item => item.url === url)?.error) {
            clearInterval(checkInterval);
            reject(this.queue.find(item => item.url === url)?.error);
          }
        }, 100);
      });
    }

    const item: AssetItem = {
      url,
      type,
      priority,
      loaded: false,
      error: null,
    };

    this.queue.push(item);
    this.sortQueue();
    this.processQueue();

    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.loaded.has(url)) {
          clearInterval(checkInterval);
          resolve(this.cache.get(url));
        } else if (item.error) {
          clearInterval(checkInterval);
          reject(item.error);
        }
      }, 100);
    });
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      return PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
    });
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.loading.size < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.loading.add(item.url);
      this.loadStartTimes.set(item.url, Date.now());

      try {
        const result = await this.loadAsset(item);
        this.cache.set(item.url, result);
        this.loaded.add(item.url);
        item.loaded = true;

        // Update average load time
        const loadTime = Date.now() - (this.loadStartTimes.get(item.url) || Date.now());
        this.averageLoadTime = this.averageLoadTime === 0 
          ? loadTime 
          : (this.averageLoadTime + loadTime) / 2;
        
        this.loadStartTimes.delete(item.url);
      } catch (error) {
        item.error = error as Error;
        console.error(`Failed to load asset: ${item.url}`, error);
      } finally {
        this.loading.delete(item.url);
        this.notifyProgress();
      }

      // Continue processing
      if (this.queue.length > 0) {
        this.processQueue();
      }
    }
  }

  private async loadAsset(item: AssetItem): Promise<any> {
    switch (item.type) {
      case 'model':
        return this.loadModel(item.url);
      case 'texture':
        return this.loadTexture(item.url);
      case 'draco':
        return this.loadDraco();
      default:
        return this.loadGeneric(item.url);
    }
  }

  private async loadModel(url: string): Promise<any> {
    const response = await fetch(url, {
      priority: 'high',
    } as any);
    
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  private loadTexture(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Try to use modern image formats
      const supportedFormats = this.getSupportedImageFormats();
      const optimizedUrl = this.getOptimizedImageUrl(url, supportedFormats);
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
      img.src = optimizedUrl;
    });
  }

  private getSupportedImageFormats(): string[] {
    const formats: string[] = ['jpg', 'png'];
    
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      
      // Check WebP support
      if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        formats.unshift('webp');
      }
      
      // Check AVIF support (basic check)
      const avifImg = new Image();
      avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      if (avifImg.complete || avifImg.width > 0) {
        formats.unshift('avif');
      }
    }
    
    return formats;
  }

  private getOptimizedImageUrl(url: string, supportedFormats: string[]): string {
    // Simple format substitution - adjust based on your CDN/storage setup
    for (const format of supportedFormats) {
      if (format !== 'jpg' && format !== 'png') {
        const optimizedUrl = url.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
        // In production, you'd check if this URL exists
        return optimizedUrl;
      }
    }
    return url;
  }

  private async loadDraco(): Promise<void> {
    // Preload Draco decoder files
    const dracoFiles = ['draco_decoder.wasm', 'draco_wasm_wrapper.js'];
    
    for (const file of dracoFiles) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = `/draco/${file}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }

  private async loadGeneric(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load asset: ${response.statusText}`);
    }
    return response.blob();
  }

  getPreloadLinks(): Array<{ rel: string; as: string; href: string; crossOrigin?: string }> {
    const links: Array<{ rel: string; as: string; href: string; crossOrigin?: string }> = [];
    
    // Add critical and high priority items
    const priorityItems = this.queue.filter(
      item => item.priority === 'critical' || item.priority === 'high'
    );

    for (const item of priorityItems) {
      links.push({
        rel: 'preload',
        as: item.type === 'texture' ? 'image' : 'fetch',
        href: item.url,
        crossOrigin: 'anonymous',
      });
    }

    return links;
  }

  warmupConnection(urls: string[]): void {
    const domains = new Set<string>();
    
    urls.forEach(url => {
      try {
        const domain = new URL(url).origin;
        domains.add(domain);
      } catch (e) {
        // Invalid URL, skip
      }
    });

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  private notifyProgress(): void {
    const total = this.loaded.size + this.loading.size + this.queue.length;
    const loaded = this.loaded.size;
    const percentage = total > 0 ? (loaded / total) * 100 : 0;
    
    const remaining = this.loading.size + this.queue.length;
    const estimatedTimeRemaining = remaining * (this.averageLoadTime / 1000);

    const progress: PreloadProgress = {
      total,
      loaded,
      percentage,
      estimatedTimeRemaining,
    };

    this.progressCallbacks.forEach(callback => callback(progress));
  }

  onProgress(callback: (progress: PreloadProgress) => void): () => void {
    this.progressCallbacks.add(callback);
    return () => this.progressCallbacks.delete(callback);
  }

  clearCache(): void {
    this.cache.clear();
    this.loaded.clear();
  }

  getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
    return this.connectionSpeed;
  }
}

// Export singleton instance
export const AssetPreloader = AssetPreloaderClass.getInstance();

// React hook for component-level preloading
export function useAssetPreloader() {
  const [progress, setProgress] = useState<PreloadProgress>({
    total: 0,
    loaded: 0,
    percentage: 0,
    estimatedTimeRemaining: 0,
  });

  useEffect(() => {
    const unsubscribe = AssetPreloader.onProgress(setProgress);
    return unsubscribe;
  }, []);

  const preloadModel = useCallback((url: string, priority: AssetPriority = 'medium') => {
    return AssetPreloader.preloadModel(url, priority);
  }, []);

  const preloadTexture = useCallback((url: string, priority: AssetPriority = 'medium') => {
    return AssetPreloader.preloadTexture(url, priority);
  }, []);

  const warmupConnection = useCallback((urls: string[]) => {
    AssetPreloader.warmupConnection(urls);
  }, []);

  return {
    progress,
    preloadModel,
    preloadTexture,
    warmupConnection,
    connectionSpeed: AssetPreloader.getConnectionSpeed(),
  };
}

// Utility function for critical asset preloading
export function preloadCriticalAssets(assets: Array<{ url: string; type: AssetType }>) {
  assets.forEach(asset => {
    if (asset.type === 'model') {
      AssetPreloader.preloadModel(asset.url, 'critical');
    } else if (asset.type === 'texture') {
      AssetPreloader.preloadTexture(asset.url, 'critical');
    }
  });
}
