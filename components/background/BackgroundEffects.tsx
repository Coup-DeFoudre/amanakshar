'use client'

import { useState, useEffect, Suspense } from 'react'
import { MidnightInk } from './MidnightInk'
import type { AtmosphericNoiseProps, NoisePreset } from './AtmosphericNoise'
import type { DynamicGradientProps } from './DynamicGradient'
import type { AmbientParticlesProps } from './AmbientParticles'

/**
 * Background3DEffects - Loads 3D background effects after mount
 * Uses dynamic imports inside useEffect to ensure React is fully hydrated
 */
function Background3DEffects() {
  const [components, setComponents] = useState<{
    AtmosphericNoise: React.ComponentType<AtmosphericNoiseProps> | null
    DepthLayers: React.ComponentType<Record<string, never>> | null
    DynamicGradient: React.ComponentType<DynamicGradientProps> | null
    AmbientParticles: React.ComponentType<AmbientParticlesProps> | null
  }>({
    AtmosphericNoise: null,
    DepthLayers: null,
    DynamicGradient: null,
    AmbientParticles: null,
  })

  useEffect(() => {
    // Dynamically import 3D components only after mount
    const loadComponents = async () => {
      try {
        const [
          { AtmosphericNoise },
          { DepthLayers },
          { DynamicGradient },
          { AmbientParticles },
        ] = await Promise.all([
          import('./AtmosphericNoise'),
          import('./DepthLayers'),
          import('./DynamicGradient'),
          import('./AmbientParticles'),
        ])

        setComponents({
          AtmosphericNoise,
          DepthLayers,
          DynamicGradient,
          AmbientParticles,
        })
      } catch (error) {
        console.warn('Failed to load 3D background effects:', error)
      }
    }

    // Delay loading to ensure React is fully hydrated
    const timer = requestAnimationFrame(() => {
      loadComponents()
    })

    return () => cancelAnimationFrame(timer)
  }, [])

  const { AtmosphericNoise, DepthLayers, DynamicGradient, AmbientParticles } = components

  if (!AtmosphericNoise || !DepthLayers || !DynamicGradient || !AmbientParticles) {
    return null
  }

  return (
    <>
      <AtmosphericNoise preset="fog" />
      <DepthLayers />
      <DynamicGradient preset="midnight" />
      <AmbientParticles type="fireflies" count={50} />
    </>
  )
}

export function BackgroundEffects() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* Always render CSS fallback */}
      <MidnightInk />
      
      {/* Only attempt to load 3D effects on client */}
      {isClient && (
        <Suspense fallback={null}>
          <Background3DEffects />
        </Suspense>
      )}
    </>
  )
}

export default BackgroundEffects
