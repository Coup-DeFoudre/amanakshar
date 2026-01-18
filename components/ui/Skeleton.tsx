'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
  animate?: boolean
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true,
  style: styleProp,
  children,
}: SkeletonProps) {
  const baseClasses = cn(
    'bg-bg-elevated/60 relative overflow-hidden',
    animate && 'shimmer-refined',
    variant === 'circular' && 'rounded-full',
    variant === 'rounded' && 'rounded-lg',
    variant === 'text' && 'rounded h-4',
    className
  )

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...styleProp,
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={baseClasses}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : style.width,
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    )
  }

  return <div className={baseClasses} style={style}>{children}</div>
}

/**
 * Skeleton for poem cards
 */
export function PoemCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <div className="py-4 px-4 -mx-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
            <Skeleton variant="text" className="h-3 w-1/4" />
          </div>
          <Skeleton variant="rounded" className="w-5 h-5 flex-shrink-0" />
        </div>
      </div>
    )
  }

  if (variant === 'featured') {
    return (
      <div className="p-5 sm:p-6 bg-bg-elevated/50 border border-divider rounded-lg">
        <Skeleton variant="text" className="h-7 w-2/3 mb-4" />
        <Skeleton variant="text" lines={3} className="mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton variant="rounded" className="h-6 w-16" />
            <Skeleton variant="rounded" className="h-6 w-12" />
          </div>
          <Skeleton variant="text" className="h-4 w-12" />
        </div>
      </div>
    )
  }

  return (
    <div className="py-5 px-4 -mx-4 sm:mx-0 sm:px-5">
      <Skeleton variant="text" className="h-7 w-3/4 mb-3" />
      <Skeleton variant="text" lines={2} className="mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton variant="text" className="h-4 w-12" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
        <Skeleton variant="rounded" className="w-5 h-5" />
      </div>
    </div>
  )
}

/**
 * Skeleton for performance cards
 */
export function PerformanceCardSkeleton() {
  return (
    <div className="bg-bg-elevated/50 border border-divider rounded-lg overflow-hidden">
      {/* Video thumbnail */}
      <Skeleton variant="rectangular" className="aspect-video w-full" />
      
      {/* Content */}
      <div className="p-4">
        <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
        <Skeleton variant="text" className="h-4 w-1/2 mb-3" />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-4 h-4" />
          <Skeleton variant="text" className="h-3 w-24" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for book cards
 */
export function BookCardSkeleton() {
  return (
    <div className="bg-bg-elevated/50 border border-divider rounded-lg overflow-hidden">
      {/* Cover image */}
      <Skeleton variant="rectangular" className="aspect-[3/4] w-full" />
      
      {/* Content */}
      <div className="p-4">
        <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
        <Skeleton variant="text" className="h-4 w-1/2 mb-3" />
        <Skeleton variant="text" lines={2} className="h-3" />
      </div>
    </div>
  )
}

/**
 * Skeleton for event cards
 */
export function EventCardSkeleton() {
  return (
    <div className="bg-bg-elevated/50 border border-divider rounded-lg p-4 sm:p-5">
      <div className="flex gap-4">
        {/* Date badge */}
        <div className="flex-shrink-0">
          <Skeleton variant="rounded" className="w-14 h-16" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
          <Skeleton variant="text" className="h-4 w-1/2 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton variant="text" className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for poem detail page
 */
export function PoemDetailSkeleton() {
  return (
    <div className="py-8 sm:py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <Skeleton variant="text" className="h-10 w-2/3 mx-auto mb-4" />
        <div className="flex justify-center gap-2 mb-4">
          <Skeleton variant="rounded" className="h-6 w-16" />
          <Skeleton variant="rounded" className="h-6 w-20" />
        </div>
        <Skeleton variant="text" className="h-4 w-32 mx-auto" />
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-divider mx-auto mb-8" />

      {/* Poem content */}
      <div className="max-w-xl mx-auto space-y-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className="h-6"
            style={{
              width: `${60 + Math.random() * 40}%`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-12">
        <Skeleton variant="rounded" className="w-24 h-10" />
        <Skeleton variant="rounded" className="w-24 h-10" />
        <Skeleton variant="rounded" className="w-24 h-10" />
      </div>
    </div>
  )
}

/**
 * Skeleton for list page header with filters
 */
export function PageHeaderSkeleton() {
  return (
    <div className="text-center mb-8">
      <Skeleton variant="text" className="h-10 w-40 mx-auto mb-6" />
      <div className="flex justify-center gap-3">
        <Skeleton variant="rounded" className="h-9 w-24" />
        <Skeleton variant="rounded" className="h-9 w-28" />
      </div>
    </div>
  )
}

/**
 * Skeleton for profile/about section
 */
export function ProfileSkeleton() {
  return (
    <div className="text-center py-8">
      <Skeleton variant="circular" className="w-32 h-32 mx-auto mb-6" />
      <Skeleton variant="text" className="h-8 w-48 mx-auto mb-4" />
      <Skeleton variant="text" className="h-5 w-32 mx-auto mb-6" />
      <div className="max-w-md mx-auto">
        <Skeleton variant="text" lines={4} className="h-4" />
      </div>
    </div>
  )
}

/**
 * Skeleton for stats/metrics cards
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-bg-elevated/50 border border-divider rounded-lg p-4 text-center"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <Skeleton variant="text" className="h-8 w-12 mx-auto mb-2" />
          <Skeleton variant="text" className="h-4 w-16 mx-auto" />
        </div>
      ))}
    </div>
  )
}

/**
 * Full page loading skeleton
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <PageHeaderSkeleton />
        <div className="space-y-6 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
              <PoemCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 3D Portrait Skeleton - Circular with shimmer effect
 */
export function Portrait3DSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-64 h-64 mx-auto', className)}>
      {/* Main portrait circle */}
      <Skeleton variant="circular" className="w-full h-full relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </Skeleton>
      
      {/* Accent ring */}
      <div className="absolute inset-0 rounded-full border-2 border-accent-gold/20 animate-pulse" style={{ animationDuration: '3s' }} />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-accent-gold/10 blur-2xl animate-pulse" style={{ animationDuration: '2s' }} />
    </div>
  )
}

/**
 * 3D Stage Skeleton - Landscape with spotlight placeholders
 */
export function Stage3DSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full h-96 rounded-lg overflow-hidden', className)}>
      {/* Background gradient */}
      <Skeleton variant="rectangular" className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </Skeleton>
      
      {/* Central spotlight placeholder */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Side spotlights */}
      <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Stage floor indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-700/30 to-transparent" />
    </div>
  )
}

/**
 * 3D Gallery Skeleton - Grid of portrait placeholders
 */
export function Gallery3DSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-square rounded-lg overflow-hidden"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <Skeleton variant="rectangular" className="w-full h-full">
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          </Skeleton>
          
          {/* Circular frame indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border-2 border-accent-gold/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 3D Video Frame Skeleton - Aspect ratio preserved with glow
 */
export function VideoFrame3DSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full aspect-video rounded-lg overflow-hidden', className)}>
      {/* Base skeleton */}
      <Skeleton variant="rectangular" className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </Skeleton>
      
      {/* Holographic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" style={{ animationDuration: '3s' }} />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-gold/20" />
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-gold/20" />
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-gold/20" />
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent-gold/20" />
      
      {/* Play button placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Generic 3D Model Skeleton
 */
export function Model3DSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full h-64 rounded-lg overflow-hidden', className)}>
      <Skeleton variant="rectangular" className="w-full h-full">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </Skeleton>
      
      {/* Loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-sm text-text-tertiary">लोड हो रहा है...</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Progressive Loading State Component
 * Shows different states: loading → parsing → rendering → complete
 */
export interface LoadingProgressProps {
  state: 'loading' | 'parsing' | 'rendering' | 'complete'
  progress?: number
  className?: string
}

export function LoadingProgress3D({ state, progress = 0, className }: LoadingProgressProps) {
  const stateLabels = {
    loading: 'डाउनलोड हो रहा है...',
    parsing: 'प्रसंस्करण हो रहा है...',
    rendering: 'रेंडर हो रहा है...',
    complete: 'पूर्ण',
  }
  
  const stateColors = {
    loading: 'bg-blue-500',
    parsing: 'bg-purple-500',
    rendering: 'bg-accent-gold',
    complete: 'bg-green-500',
  }
  
  return (
    <div className={cn('text-center p-6', className)}>
      {/* Animated spinner */}
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-gray-700 dark:border-gray-300 rounded-full opacity-20" />
        <div className={cn(
          'absolute inset-0 border-4 border-transparent rounded-full animate-spin',
          stateColors[state]
        )} style={{ borderTopColor: 'currentColor' }} />
      </div>
      
      {/* State label */}
      <p className="text-sm font-medium text-text-secondary mb-2">
        {stateLabels[state]}
      </p>
      
      {/* Progress bar */}
      {progress > 0 && state !== 'complete' && (
        <div className="w-48 h-2 bg-gray-700 dark:bg-gray-300 rounded-full overflow-hidden mx-auto mb-2">
          <div
            className={cn('h-full transition-all duration-300', stateColors[state])}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Progress percentage */}
      {progress > 0 && state !== 'complete' && (
        <p className="text-xs text-text-tertiary">
          {Math.round(progress)}%
        </p>
      )}
    </div>
  )
}