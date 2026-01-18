export { useReducedMotion, getReducedMotionVariants, safeMotionConfig } from './useReducedMotion'
export { useApi, useMutation, getErrorMessage } from './useApi'
export { 
  useThreePerformance, 
  getQualitySettings, 
  getQualityFromTier,
  getFpsColor,
  getGpuLoadColor,
  type QualityLevel,
  type QualitySettings,
  type PerformanceMetrics,
  type PerformanceRecommendation,
  type UseThreePerformanceOptions,
  type UseThreePerformanceReturn,
} from './useThreePerformance'
export {
  useBackgroundPerformance,
  useBackgroundPerformanceContext,
  BackgroundPerformanceProvider,
  getAdjustedParticleCount,
  shouldEnableWebGL,
  getShaderComplexity,
  type BackgroundPerformanceState,
} from './useBackgroundPerformance'