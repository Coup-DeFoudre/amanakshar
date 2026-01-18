'use client'

import { useState, useCallback, useMemo } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn, generateImagePlaceholder } from '@/lib/utils'

type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad' | 'placeholder' | 'blurDataURL'> {
  fallback?: string
  objectFit?: ImageFit
  showSkeleton?: boolean
  blurDataURL?: string
  enableBlurPlaceholder?: boolean
}

/**
 * OptimizedImage - A wrapper around Next.js Image with error handling,
 * loading states, blur placeholders, and fallback support
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fallback = '/images/placeholders/poet.svg',
  objectFit = 'cover',
  priority = false,
  quality = 85,
  sizes,
  showSkeleton = true,
  fill,
  blurDataURL,
  enableBlurPlaceholder = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  // Determine if source is valid
  const imageSrc = hasError || !src ? fallback : src

  // Default sizes for responsive images
  const defaultSizes = sizes || (fill 
    ? '100vw' 
    : `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${width}px`
  )

  // Generate blur placeholder if not provided
  const computedBlurDataURL = useMemo(() => {
    if (blurDataURL) return blurDataURL
    if (!enableBlurPlaceholder) return undefined
    
    // Generate a blur placeholder based on dimensions
    const w = typeof width === 'number' ? width : 100
    const h = typeof height === 'number' ? height : 100
    return generateImagePlaceholder(w, h)
  }, [blurDataURL, enableBlurPlaceholder, width, height])

  // Determine if we should use blur placeholder
  // Blur placeholder works best with static images, not data URLs
  const shouldUseBlur = enableBlurPlaceholder && 
    computedBlurDataURL && 
    typeof imageSrc === 'string' && 
    !imageSrc.startsWith('data:')

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        fill && 'w-full h-full',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* Skeleton loader - shown when not using blur placeholder */}
      {showSkeleton && isLoading && !shouldUseBlur && (
        <div 
          className="absolute inset-0 bg-bg-secondary animate-pulse"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-elevated/50 to-transparent skeleton-shimmer" />
        </div>
      )}

      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={quality}
        priority={priority}
        sizes={defaultSizes}
        loading={priority ? undefined : 'lazy'}
        placeholder={shouldUseBlur ? 'blur' : 'empty'}
        blurDataURL={shouldUseBlur ? computedBlurDataURL : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading && !shouldUseBlur ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          fill && 'absolute inset-0'
        )}
        {...props}
      />
    </div>
  )
}

// Add CSS for skeleton shimmer animation
const styles = `
@keyframes skeleton-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.skeleton-shimmer {
  animation: skeleton-shimmer 1.5s infinite;
}
`

// Inject styles on client side
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  if (!document.head.querySelector('[data-optimized-image-styles]')) {
    styleSheet.setAttribute('data-optimized-image-styles', '')
    document.head.appendChild(styleSheet)
  }
}
