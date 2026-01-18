'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
  fallbackClassName?: string
  fallbackGradient?: string
}

// Default gradient fallbacks based on common use cases
const defaultGradients = {
  dark: 'linear-gradient(135deg, #1a1512 0%, #2a1f18 50%, #0a0908 100%)',
  warm: 'linear-gradient(135deg, #2a1810 0%, #3a2820 50%, #1a0f08 100%)',
  gold: 'linear-gradient(135deg, #1a1008 0%, #2a1810 50%, #3a2018 100%)',
  cool: 'linear-gradient(135deg, #0a1020 0%, #0d1825 50%, #102030 100%)',
}

/**
 * SafeImage - Image component with graceful fallback on error
 * 
 * When the image fails to load, it shows a gradient background instead
 * of breaking the page or showing a broken image icon.
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackClassName = '',
  fallbackGradient = defaultGradients.dark,
  className = '',
  fill,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If there's an error and no fallback src, show gradient
  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={`${className} ${fallbackClassName}`}
        style={{ 
          background: fallbackGradient,
          position: fill ? 'absolute' : 'relative',
          inset: fill ? 0 : undefined,
          width: fill ? '100%' : props.width,
          height: fill ? '100%' : props.height,
        }}
        role="img"
        aria-label={alt}
      />
    )
  }

  return (
    <>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={`absolute inset-0 animate-pulse ${fallbackClassName}`}
          style={{ background: fallbackGradient }}
        />
      )}
      <Image
        src={hasError && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        fill={fill}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        {...props}
      />
    </>
  )
}

// Pre-defined gradient styles for different sections
export const imageGradients = {
  hero: defaultGradients.warm,
  stage: defaultGradients.dark,
  bhav: defaultGradients.gold,
  poem: defaultGradients.cool,
  poet: defaultGradients.warm,
}
