'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { extractYouTubeId } from '@/lib/utils'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
  /** Enable 3D frame integration (opt-in) */
  enable3DFrame?: boolean
  /** Scroll progress for 3D frame animations */
  scrollProgress?: number
}

export function YouTubeEmbed({ 
  url, 
  title = 'Video', 
  className,
  enable3DFrame = false,
  scrollProgress = 0,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  
  const videoId = extractYouTubeId(url)
  
  // Detect mobile for optimized thumbnail
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  if (!videoId) {
    return null
  }

  // Use hqdefault for mobile, maxresdefault for desktop
  const thumbnailUrl = isMobile 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  
  const handlePlay = () => {
    setIsLoading(true)
    setIsPlaying(true)
  }
  
  const handleRetry = () => {
    setHasError(false)
    setIsPlaying(false)
    setIsLoading(false)
  }
  
  const handleIframeLoad = () => {
    setIsLoading(false)
  }
  
  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }
  
  // Error state
  if (hasError) {
    return (
      <div className={cn('youtube-embed', className)} ref={containerRef}>
        <div className="youtube-error">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-bg-elevated/80 backdrop-blur-sm">
            <svg className="w-12 h-12 text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-ui text-text-secondary mb-4">वीडियो लोड नहीं हो सका</p>
            <button
              onClick={handleRetry}
              className="font-ui text-sm text-accent-gold hover:text-accent-gold/80 border border-accent-gold/30 hover:border-accent-gold/50 px-4 py-2 rounded transition-colors"
            >
              पुनः प्रयास करें
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className={cn('youtube-embed', className)} 
      ref={containerRef}
      style={{
        // Add depth effect when 3D frame is enabled
        ...(enable3DFrame && {
          transform: `translateZ(${scrollProgress * -20}px)`,
          transformStyle: 'preserve-3d',
        }),
      }}
    >
      {!isPlaying ? (
        // Custom facade with dark overlay and enhanced play button
        <motion.button 
          onClick={handlePlay}
          className="youtube-facade group"
          aria-label={`${title} चलाएँ`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Thumbnail with dark overlay */}
          <div 
            className={cn(
              'youtube-thumbnail transition-opacity duration-300',
              thumbnailLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
          
          {/* Skeleton loader while thumbnail loads */}
          {!thumbnailLoaded && (
            <div className="absolute inset-0 bg-bg-elevated animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          )}
          
          {/* Preload thumbnail */}
          <img
            src={thumbnailUrl}
            alt=""
            className="hidden"
            onLoad={() => setThumbnailLoaded(true)}
            onError={() => setThumbnailLoaded(true)}
          />
          
          {/* Dark overlay with enhanced gradient */}
          <div className="youtube-overlay" />
          
          {/* Depth layer behind play button (3D effect) */}
          {enable3DFrame && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(212, 168, 85, 0.1) 0%, transparent 50%)',
                transform: 'translateZ(-10px)',
              }}
            />
          )}
          
          {/* Enhanced play button with 3D depth */}
          <motion.div 
            className="youtube-play-btn relative"
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer glow ring */}
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: '0 0 30px rgba(212, 168, 85, 0.4), 0 0 60px rgba(212, 168, 85, 0.2)',
              }}
            />
            
            {/* Play button background layers for depth */}
            <div 
              className="absolute inset-0 rounded-full bg-black/30 transform translate-y-1 blur-sm"
              aria-hidden="true"
            />
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"
              aria-hidden="true"
            />
            
            <svg 
              viewBox="0 0 68 48" 
              className="youtube-play-icon relative z-10"
            >
              <path 
                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                fill="rgba(255,255,255,0.15)"
                className="group-hover:fill-[rgba(212,168,85,0.3)] transition-colors duration-300"
              />
              <path 
                d="M 45,24 27,14 27,34" 
                fill="rgba(255,255,255,0.9)"
                className="group-hover:fill-white transition-colors duration-300"
              />
            </svg>
            
            {/* Holographic glow animation on hover */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(212, 168, 85, 0.3), transparent, rgba(129, 140, 248, 0.2), transparent)',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </motion.div>
          
          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-ui text-sm text-white/80 truncate">{title}</p>
          </div>
        </motion.button>
      ) : (
        // Actual YouTube iframe (loads only when clicked)
        <div className="relative w-full h-full">
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
                <p className="font-ui text-sm text-text-muted">लोड हो रहा है...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white&iv_load_policy=3&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className={cn(
              'w-full h-full transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
