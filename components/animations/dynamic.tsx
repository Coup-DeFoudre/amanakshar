'use client'

import dynamic from 'next/dynamic'

// Loading fallback for text animations
const TextFallback = ({ children }: { children?: string }) => (
  <span className="inline-block">{children || ''}</span>
)

// Loading fallback for container animations
const ContainerFallback = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
)

// Dynamic imports with loading fallbacks for heavy animation components
// These are loaded only when needed, reducing initial bundle size

export const DynamicSplitText = dynamic(
  () => import('./SplitText').then(mod => mod.SplitText),
  {
    loading: () => <TextFallback />,
    ssr: true, // Keep SSR for SEO
  }
)

export const DynamicBlurText = dynamic(
  () => import('./BlurText').then(mod => mod.BlurText),
  {
    loading: () => <TextFallback />,
    ssr: true,
  }
)

export const DynamicTextReveal = dynamic(
  () => import('./TextReveal').then(mod => mod.TextReveal),
  {
    loading: () => <TextFallback />,
    ssr: true,
  }
)

export const DynamicGradientText = dynamic(
  () => import('./GradientText').then(mod => mod.GradientText),
  {
    loading: () => <TextFallback />,
    ssr: true,
  }
)

export const DynamicShinyText = dynamic(
  () => import('./ShinyText').then(mod => mod.ShinyText),
  {
    loading: () => <TextFallback />,
    ssr: true,
  }
)

export const DynamicCinematicReveal = dynamic(
  () => import('./CinematicReveal').then(mod => mod.CinematicReveal),
  {
    loading: () => <ContainerFallback />,
    ssr: true,
  }
)

export const DynamicParallaxText = dynamic(
  () => import('./ParallaxText').then(mod => mod.ParallaxText),
  {
    loading: () => <TextFallback />,
    ssr: true,
  }
)

export const DynamicFluidMorph = dynamic(
  () => import('./FluidMorph').then(mod => mod.FluidMorph),
  {
    loading: () => <ContainerFallback />,
    ssr: true,
  }
)

// Type exports for dynamic components
export type { SplitTextProps, StaggerPattern, AnimationType, SpringConfig } from './SplitText'
export type { CinematicRevealProps, RevealPattern, RevealEasing, RevealFrom } from './CinematicReveal'
export type { ParallaxTextProps, ParallaxDirection, ParallaxSplitBy, ParallaxSpringConfig } from './ParallaxText'
export type { FluidMorphProps, MorphState, MorphEase, FluidMorphSpringConfig } from './FluidMorph'
