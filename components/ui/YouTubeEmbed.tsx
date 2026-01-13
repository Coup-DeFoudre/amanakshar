'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { extractYouTubeId } from '@/lib/utils'

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ url, title = 'Video', className }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = extractYouTubeId(url)
  
  if (!videoId) {
    return null
  }

  // Get thumbnail - use maxresdefault for high quality
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  
  const handlePlay = () => {
    setIsPlaying(true)
  }
  
  return (
    <div className={cn('youtube-embed', className)}>
      {!isPlaying ? (
        // Custom facade with dark overlay and subtle play button
        <button 
          onClick={handlePlay}
          className="youtube-facade"
          aria-label={`${title} चलाएँ`}
        >
          {/* Thumbnail with dark overlay */}
          <div 
            className="youtube-thumbnail"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          />
          
          {/* Dark overlay */}
          <div className="youtube-overlay" />
          
          {/* Subtle play button */}
          <div className="youtube-play-btn">
            <svg 
              viewBox="0 0 68 48" 
              className="youtube-play-icon"
            >
              <path 
                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                fill="rgba(255,255,255,0.15)"
              />
              <path d="M 45,24 27,14 27,34" fill="rgba(255,255,255,0.9)" />
            </svg>
          </div>
        </button>
      ) : (
        // Actual YouTube iframe (loads only when clicked)
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white&iv_load_policy=3&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  )
}
