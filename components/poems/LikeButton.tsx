'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBrowserUuid } from '@/lib/utils'
import { useToast, toastMessages } from '@/components/shared/Toast'
import { fetchWithRetry, getErrorMessage, isRateLimitError } from '@/lib/api'

interface LikeButtonProps {
  poemSlug: string
}

export function LikeButton({ poemSlug }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const { success, error, warning } = useToast()

  useEffect(() => {
    fetchLikeStatus()
  }, [poemSlug])

  const fetchLikeStatus = async () => {
    try {
      const browserUuid = getBrowserUuid()
      if (!browserUuid) {
        setIsLoading(false)
        return
      }

      const response = await fetchWithRetry(`/api/poems/${poemSlug}/like`, {
        headers: {
          'x-browser-uuid': browserUuid,
        },
        retries: 2,
        timeout: 5000,
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setLikeCount(data.likeCount)
      }
    } catch (err) {
      console.error('Error fetching like status:', err)
      // Silently fail for initial load - don't show error toast
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLike = useCallback(async () => {
    if (isToggling) return

    setIsToggling(true)
    const browserUuid = getBrowserUuid()

    if (!browserUuid) {
      error('localStorage सक्षम करें')
      setIsToggling(false)
      return
    }

    // Optimistic update
    const previousIsLiked = isLiked
    const previousCount = likeCount
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      const response = await fetchWithRetry(`/api/poems/${poemSlug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ browserUuid }),
        retries: 2,
        timeout: 5000,
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setLikeCount(data.likeCount)
        
        // Show toast notification
        if (data.isLiked) {
          success(toastMessages.liked)
        } else {
          success(toastMessages.unliked)
        }
      } else {
        // Revert optimistic update
        setIsLiked(previousIsLiked)
        setLikeCount(previousCount)

        if (response.status === 429) {
          warning('बहुत अधिक अनुरोध — कृपया प्रतीक्षा करें')
        } else {
          const errorData = await response.json().catch(() => ({}))
          error(errorData.error || 'पसंद करने में त्रुटि')
        }
      }
    } catch (err) {
      // Revert optimistic update
      setIsLiked(previousIsLiked)
      setLikeCount(previousCount)

      if (isRateLimitError(err)) {
        warning('बहुत अधिक अनुरोध — कृपया प्रतीक्षा करें')
      } else {
        error(getErrorMessage(err))
      }
      console.error('Error toggling like:', err)
    } finally {
      setIsToggling(false)
    }
  }, [poemSlug, isLiked, likeCount, isToggling, success, error, warning])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text-muted">
        <motion.span 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-xl"
        >
          🤍
        </motion.span>
        <span className="font-ui text-sm w-4 h-4 rounded-full bg-bg-elevated animate-pulse" />
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleToggleLike}
      disabled={isToggling}
      className="relative flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors disabled:cursor-not-allowed group touch-manipulation"
      aria-label={isLiked ? 'पसंद हटाएँ' : 'पसंद करें'}
      aria-pressed={isLiked}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isLiked ? 'liked' : 'unliked'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`text-2xl ${
            isLiked
              ? 'text-red-500'
              : 'group-hover:scale-110 transition-transform'
          } ${isToggling ? 'opacity-50' : ''}`}
        >
          {isLiked ? '❤️' : '🤍'}
        </motion.span>
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {likeCount > 0 && (
          <motion.span 
            key={likeCount}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="font-ui text-sm tabular-nums"
          >
            {likeCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Like animation burst */}
      {isLiked && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: Math.cos(i * 60 * Math.PI / 180) * 20,
                y: Math.sin(i * 60 * Math.PI / 180) * 20,
              }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-red-400"
            >
              ✦
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.button>
  )
}
