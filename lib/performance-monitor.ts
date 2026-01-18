/**
 * Centralized Performance Monitoring System
 * Tracks FPS, memory usage, device capabilities, and adaptive quality management
 */

import { useEffect, useState } from 'react';

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';
export type PerformanceTier = 'low' | 'medium' | 'high';

export interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  memory: {
    used: number;
    limit: number;
    percentage: number;
  } | null;
  triangles: number;
  drawCalls: number;
  textureMemory: number;
  qualityLevel: QualityLevel;
  performanceTier: PerformanceTier;
}

export interface PerformanceBudget {
  triangles: number;
  drawCalls: number;
  textureMemory: number; // in MB
  minFps: number;
}

export const PERFORMANCE_BUDGETS: Record<QualityLevel, PerformanceBudget> = {
  low: {
    triangles: 50000,
    drawCalls: 50,
    textureMemory: 50,
    minFps: 30,
  },
  medium: {
    triangles: 150000,
    drawCalls: 100,
    textureMemory: 150,
    minFps: 45,
  },
  high: {
    triangles: 300000,
    drawCalls: 150,
    textureMemory: 300,
    minFps: 55,
  },
  ultra: {
    triangles: 500000,
    drawCalls: 200,
    textureMemory: 500,
    minFps: 60,
  },
};

type PerformanceEventType = 'quality-change' | 'fps-drop' | 'memory-warning' | 'budget-violation';

interface PerformanceEvent {
  type: PerformanceEventType;
  data: any;
  timestamp: number;
}

class PerformanceMonitorClass {
  private static instance: PerformanceMonitorClass;
  private isMonitoring = false;
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private frameTimes: number[] = [];
  private readonly maxFrameSamples = 60;
  private currentFps = 0;
  private avgFps = 60;
  private qualityLevel: QualityLevel = 'high';
  private performanceTier: PerformanceTier = 'high';
  private triangles = 0;
  private drawCalls = 0;
  private textureMemory = 0;
  private fpsDropCount = 0;
  private lastQualityChange = 0;
  private readonly qualityChangeCooldown = 5000; // 5 seconds
  private eventListeners: Map<PerformanceEventType, Set<(data: any) => void>> = new Map();
  private updateCallbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private throttleInterval = 100; // Update every 100ms
  private lastUpdate = 0;

  private constructor() {
    this.detectPerformanceTier();
    this.setInitialQualityLevel();
  }

  static getInstance(): PerformanceMonitorClass {
    if (!PerformanceMonitorClass.instance) {
      PerformanceMonitorClass.instance = new PerformanceMonitorClass();
    }
    return PerformanceMonitorClass.instance;
  }

  private detectPerformanceTier(): void {
    if (typeof window === 'undefined') {
      this.performanceTier = 'medium';
      return;
    }

    const nav = navigator as any;
    const hardwareConcurrency = nav.hardwareConcurrency || 4;
    const deviceMemory = nav.deviceMemory || 4;
    
    // Detect GPU tier using WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    let gpuTier: PerformanceTier = 'medium';
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        
        // Simple GPU tier detection based on common patterns
        const highEndGPUs = ['NVIDIA', 'GeForce RTX', 'GeForce GTX', 'Radeon RX', 'Apple M1', 'Apple M2', 'Apple M3'];
        const lowEndGPUs = ['Intel HD', 'Intel UHD 6', 'Mali-4', 'Adreno 5'];
        
        const gpuString = `${vendor} ${renderer}`;
        
        if (highEndGPUs.some(gpu => gpuString.includes(gpu))) {
          gpuTier = 'high';
        } else if (lowEndGPUs.some(gpu => gpuString.includes(gpu))) {
          gpuTier = 'low';
        }
      }
    }

    // Combine factors to determine overall tier
    let score = 0;
    
    if (hardwareConcurrency >= 8) score += 2;
    else if (hardwareConcurrency >= 4) score += 1;
    
    if (deviceMemory >= 8) score += 2;
    else if (deviceMemory >= 4) score += 1;
    
    if (gpuTier === 'high') score += 2;
    else if (gpuTier === 'medium') score += 1;

    if (score >= 5) this.performanceTier = 'high';
    else if (score >= 3) this.performanceTier = 'medium';
    else this.performanceTier = 'low';
  }

  private setInitialQualityLevel(): void {
    switch (this.performanceTier) {
      case 'high':
        this.qualityLevel = 'high';
        break;
      case 'medium':
        this.qualityLevel = 'medium';
        break;
      case 'low':
        this.qualityLevel = 'low';
        break;
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.measureFrame();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private measureFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.currentFps = fps;
      
      this.frameTimes.push(fps);
      if (this.frameTimes.length > this.maxFrameSamples) {
        this.frameTimes.shift();
      }
      
      this.avgFps = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      
      // Check for sustained FPS drops
      if (this.avgFps < PERFORMANCE_BUDGETS[this.qualityLevel].minFps) {
        this.fpsDropCount++;
        if (this.fpsDropCount >= 180) { // 3 seconds at 60fps
          this.handleFpsDrop();
          this.fpsDropCount = 0;
        }
      } else {
        this.fpsDropCount = Math.max(0, this.fpsDropCount - 1);
      }
      
      // Throttled update
      if (currentTime - this.lastUpdate >= this.throttleInterval) {
        this.notifyUpdateCallbacks();
        this.lastUpdate = currentTime;
      }
    }
    
    this.lastFrameTime = currentTime;
    this.rafId = requestAnimationFrame(this.measureFrame);
  };

  private handleFpsDrop(): void {
    const now = Date.now();
    if (now - this.lastQualityChange < this.qualityChangeCooldown) {
      return; // Cooldown period
    }

    const currentIndex = ['low', 'medium', 'high', 'ultra'].indexOf(this.qualityLevel);
    if (currentIndex > 0) {
      const newQuality = ['low', 'medium', 'high', 'ultra'][currentIndex - 1] as QualityLevel;
      this.setQualityLevel(newQuality);
      this.lastQualityChange = now;
      
      this.emit('fps-drop', {
        avgFps: this.avgFps,
        newQuality,
        oldQuality: this.qualityLevel,
      });
    }
  }

  getMetrics(): PerformanceMetrics {
    return {
      fps: this.currentFps,
      avgFps: this.avgFps,
      memory: this.getMemoryInfo(),
      triangles: this.triangles,
      drawCalls: this.drawCalls,
      textureMemory: this.textureMemory,
      qualityLevel: this.qualityLevel,
      performanceTier: this.performanceTier,
    };
  }

  private getMemoryInfo(): PerformanceMetrics['memory'] {
    if (typeof window === 'undefined') return null;
    
    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      used: memory.usedJSHeapSize / (1024 * 1024), // MB
      limit: memory.jsHeapSizeLimit / (1024 * 1024), // MB
      percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
    };
  }

  setQualityLevel(level: QualityLevel): void {
    const oldLevel = this.qualityLevel;
    this.qualityLevel = level;
    
    if (oldLevel !== level) {
      this.emit('quality-change', {
        oldLevel,
        newLevel: level,
        budget: PERFORMANCE_BUDGETS[level],
      });
    }
  }

  updateRenderStats(triangles: number, drawCalls: number, textureMemory: number): void {
    this.triangles = triangles;
    this.drawCalls = drawCalls;
    this.textureMemory = textureMemory;
    
    // Check budget violations
    const budget = PERFORMANCE_BUDGETS[this.qualityLevel];
    if (
      triangles > budget.triangles ||
      drawCalls > budget.drawCalls ||
      textureMemory > budget.textureMemory
    ) {
      this.emit('budget-violation', {
        triangles: { current: triangles, limit: budget.triangles },
        drawCalls: { current: drawCalls, limit: budget.drawCalls },
        textureMemory: { current: textureMemory, limit: budget.textureMemory },
      });
    }
    
    // Check memory warning
    const memoryInfo = this.getMemoryInfo();
    if (memoryInfo && memoryInfo.percentage > 90) {
      this.emit('memory-warning', {
        used: memoryInfo.used,
        limit: memoryInfo.limit,
        percentage: memoryInfo.percentage,
      });
    }
  }

  shouldUseFallback(): boolean {
    return this.performanceTier === 'low' || this.qualityLevel === 'low';
  }

  getQualityLevel(): QualityLevel {
    return this.qualityLevel;
  }

  getPerformanceTier(): PerformanceTier {
    return this.performanceTier;
  }

  getBudget(): PerformanceBudget {
    return PERFORMANCE_BUDGETS[this.qualityLevel];
  }

  // Event emitter methods
  on(event: PerformanceEventType, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: PerformanceEventType, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: PerformanceEventType, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Update callback for React hooks
  onUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  private notifyUpdateCallbacks(): void {
    const metrics = this.getMetrics();
    this.updateCallbacks.forEach(callback => callback(metrics));
  }
}

// Export singleton instance
export const PerformanceMonitor = PerformanceMonitorClass.getInstance();

// React hook for component integration
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(PerformanceMonitor.getMetrics());

  useEffect(() => {
    PerformanceMonitor.startMonitoring();
    const unsubscribe = PerformanceMonitor.onUpdate(setMetrics);

    return () => {
      unsubscribe();
      // Don't stop monitoring as other components might be using it
    };
  }, []);

  return {
    metrics,
    qualityLevel: metrics.qualityLevel,
    performanceTier: metrics.performanceTier,
    shouldUseFallback: PerformanceMonitor.shouldUseFallback(),
    setQualityLevel: (level: QualityLevel) => PerformanceMonitor.setQualityLevel(level),
  };
}
