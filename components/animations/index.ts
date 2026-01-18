// Static exports (for components that need immediate rendering)
export { SplitText } from './SplitText'
export { BlurText } from './BlurText'
export { GradientText } from './GradientText'
export { TextReveal } from './TextReveal'
export { ShinyText } from './ShinyText'
export { CinematicReveal, LayeredReveal } from './CinematicReveal'
export { ParallaxText, ParallaxContainer } from './ParallaxText'
export { FluidMorph, FluidMorphGroup, PathMorph, PresenceMorph } from './FluidMorph'

// Dynamic exports (for lazy loading - reduces initial bundle)
export {
  DynamicSplitText,
  DynamicBlurText,
  DynamicGradientText,
  DynamicTextReveal,
  DynamicShinyText,
  DynamicCinematicReveal,
  DynamicParallaxText,
  DynamicFluidMorph,
} from './dynamic'

// Type exports
export type { SplitTextProps, StaggerPattern, AnimationType, SpringConfig } from './SplitText'
export type { 
  CinematicRevealProps, 
  LayeredRevealProps, 
  RevealPattern, 
  RevealEasing, 
  RevealFrom 
} from './CinematicReveal'
export type { 
  ParallaxTextProps, 
  ParallaxContainerProps, 
  ParallaxDirection, 
  ParallaxSplitBy,
  ParallaxSpringConfig,
} from './ParallaxText'
export type { 
  FluidMorphProps, 
  FluidMorphGroupProps, 
  PathMorphProps, 
  PresenceMorphProps,
  MorphState,
  MorphEase,
  FluidMorphSpringConfig,
  MorphGroupItem,
} from './FluidMorph'