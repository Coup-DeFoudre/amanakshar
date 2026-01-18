'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type SoundTrack = 'tabla' | 'flute' | 'sitar' | 'rain'

interface Track {
  id: SoundTrack
  name: string
  nameHindi: string
  icon: string
  file: string
}

const TRACKS: Track[] = [
  { 
    id: 'tabla', 
    name: 'Tabla', 
    nameHindi: 'तबला', 
    icon: '🥁',
    file: '/sounds/tabla-ambient.mp3' 
  },
  { 
    id: 'flute', 
    name: 'Flute', 
    nameHindi: 'बांसुरी', 
    icon: '🎵',
    file: '/sounds/flute-ambient.mp3' 
  },
  { 
    id: 'sitar', 
    name: 'Sitar', 
    nameHindi: 'सितार', 
    icon: '🎸',
    file: '/sounds/sitar-ambient.mp3' 
  },
  { 
    id: 'rain', 
    name: 'Rain', 
    nameHindi: 'बारिश', 
    icon: '🌧️',
    file: '/sounds/rain-ambient.mp3' 
  },
]

/**
 * AmbientSound - Toggle for ambient reading music
 * 
 * Features:
 * - Multiple ambient sound options (tabla, flute, sitar, rain)
 * - Volume control
 * - Crossfade between tracks
 * - Persists preference in localStorage
 * - Elegant expandable UI
 */
export function AmbientSound() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>('flute')
  const [volume, setVolume] = useState(0.3)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Initialize from localStorage
  useEffect(() => {
    const savedTrack = localStorage.getItem('ambient-track') as SoundTrack | null
    const savedVolume = localStorage.getItem('ambient-volume')
    
    if (savedTrack && TRACKS.find(t => t.id === savedTrack)) {
      setCurrentTrack(savedTrack)
    }
    if (savedVolume) {
      setVolume(parseFloat(savedVolume))
    }
  }, [])
  
  // Create or update audio element
  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
      audioRef.current.volume = 0
    }
    
    const track = TRACKS.find(t => t.id === currentTrack)
    if (track) {
      audioRef.current.src = track.file
    }
  }, [currentTrack])
  
  // Fade in/out audio
  const fadeAudio = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!audioRef.current) return
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current)
    }
    
    const startVolume = audioRef.current.volume
    const volumeDiff = targetVolume - startVolume
    const steps = 20
    const stepDuration = duration / steps
    let currentStep = 0
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++
      if (audioRef.current) {
        const progress = currentStep / steps
        // Ease-out curve for smoother fade
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        audioRef.current.volume = startVolume + volumeDiff * easedProgress
      }
      
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current)
        }
        if (targetVolume === 0 && audioRef.current) {
          audioRef.current.pause()
        }
      }
    }, stepDuration)
  }, [])
  
  // Toggle play/pause
  const togglePlay = async () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
    }
    
    if (!audioRef.current) {
      initAudio()
    }
    
    if (isPlaying) {
      fadeAudio(0, 800)
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      try {
        initAudio()
        if (audioRef.current) {
          audioRef.current.volume = 0
          await audioRef.current.play()
          fadeAudio(volume, 1000)
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Audio playback failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  // Change track
  const changeTrack = async (trackId: SoundTrack) => {
    if (trackId === currentTrack) return
    
    localStorage.setItem('ambient-track', trackId)
    setCurrentTrack(trackId)
    
    if (isPlaying && audioRef.current) {
      // Crossfade to new track
      fadeAudio(0, 500)
      
      setTimeout(async () => {
        const track = TRACKS.find(t => t.id === trackId)
        if (track && audioRef.current) {
          audioRef.current.src = track.file
          audioRef.current.volume = 0
          try {
            await audioRef.current.play()
            fadeAudio(volume, 500)
          } catch (error) {
            console.error('Track change failed:', error)
          }
        }
      }, 500)
    }
  }
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    localStorage.setItem('ambient-volume', newVolume.toString())
    
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = newVolume
    }
  }
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])
  
  const currentTrackData = TRACKS.find(t => t.id === currentTrack)
  
  return (
    <div className="fixed bottom-24 right-4 z-50 sm:bottom-6">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 right-0 w-64 p-4 rounded-xl bg-bg-elevated border border-divider backdrop-blur-lg shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary font-medium">
                🎶 वातावरण संगीत
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            {/* Track selection */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => changeTrack(track.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    ${currentTrack === track.id
                      ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-primary hover:text-text-primary border border-transparent'
                    }
                  `}
                >
                  <span>{track.icon}</span>
                  <span>{track.nameHindi}</span>
                </button>
              ))}
            </div>
            
            {/* Volume slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>ध्वनि</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-accent-gold"
                style={{
                  background: `linear-gradient(to right, var(--accent-gold) 0%, var(--accent-gold) ${volume * 100}%, var(--bg-secondary) ${volume * 100}%, var(--bg-secondary) 100%)`,
                }}
              />
            </div>
            
            {/* Note */}
            <p className="mt-4 text-xs text-text-muted text-center">
              पढ़ते समय शांत संगीत का आनंद लें
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main toggle button */}
      <motion.button
        onClick={isExpanded ? togglePlay : () => setIsExpanded(true)}
        onDoubleClick={() => isExpanded && setIsExpanded(false)}
        className={`
          relative flex items-center justify-center
          w-12 h-12 rounded-full
          transition-all duration-300
          ${isPlaying 
            ? 'bg-accent-gold text-bg-primary shadow-[0_0_20px_rgba(212,168,85,0.4)]' 
            : 'bg-bg-elevated text-text-secondary border border-divider hover:border-accent-gold/30 hover:text-accent-gold'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
        data-cursor-hover
      >
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="16" r="3" fill="currentColor" />
          </svg>
        )}
        
        {/* Playing indicator */}
        {isPlaying && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-gold"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        
        {/* Track indicator when expanded */}
        {isExpanded && currentTrackData && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 text-sm text-text-secondary whitespace-nowrap"
          >
            {currentTrackData.icon} {currentTrackData.nameHindi}
          </motion.span>
        )}
      </motion.button>
    </div>
  )
}
