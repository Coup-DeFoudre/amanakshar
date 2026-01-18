'use client'

// ===== NOISE PRESETS =====

export type NoisePreset = 'film-grain' | 'fog' | 'smoke' | 'paper-texture'

interface NoiseConfig {
  colorA: string
  colorB: string
  blendMode: 'overlay' | 'multiply' | 'screen' | 'normal'
  opacity: number
}

const noisePresets: Record<NoisePreset, NoiseConfig> = {
  'film-grain': {
    colorA: '#000000',
    colorB: '#ffffff',
    blendMode: 'overlay',
    opacity: 0.08,
  },
  fog: {
    colorA: '#0a0908',
    colorB: '#1a1512',
    blendMode: 'normal',
    opacity: 0.4,
  },
  smoke: {
    colorA: '#0d0b09',
    colorB: '#2a1f18',
    blendMode: 'screen',
    opacity: 0.3,
  },
  'paper-texture': {
    colorA: '#c4b8a8',
    colorB: '#d4c4b0',
    blendMode: 'multiply',
    opacity: 0.1,
  },
}

// ===== MAIN COMPONENT =====

export interface AtmosphericNoiseProps {
  preset?: NoisePreset
  customConfig?: Partial<NoiseConfig>
  className?: string
  enableWebGL?: boolean
}

/**
 * AtmosphericNoise - CSS-based noise effect for atmospheric backgrounds
 * No 3D/WebGL dependencies - pure CSS implementation
 */
export function AtmosphericNoise({
  preset = 'fog',
}: AtmosphericNoiseProps) {
  const config = noisePresets[preset]
  
  return (
    <div
      className="fixed inset-0 -z-25 pointer-events-none"
      style={{
        mixBlendMode: config.blendMode,
        opacity: config.opacity,
      }}
    >
      {/* Noise texture using CSS */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          filter: 'contrast(180%) brightness(80%)',
          animation: preset === 'film-grain' ? 'noise-drift 0.5s steps(10) infinite' : undefined,
        }}
      />
      
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${config.colorA}00 0%, ${config.colorA}40 50%, ${config.colorB}60 100%)`,
        }}
      />
      
      <style jsx>{`
        @keyframes noise-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-5%, -5%); }
        }
      `}</style>
    </div>
  )
}

export default AtmosphericNoise
