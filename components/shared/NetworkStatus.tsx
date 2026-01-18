'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NetworkStatusState {
  isOnline: boolean
  wasOffline: boolean
  connectionType: string | null
  effectiveType: string | null
}

/**
 * NetworkStatus - Floating indicator showing network connectivity state
 * 
 * Features:
 * - Shows offline/online status
 * - Connection quality indicator
 * - Smooth transitions
 * - Auto-dismiss after reconnection
 */
export function NetworkStatus() {
  const [status, setStatus] = useState<NetworkStatusState>({
    isOnline: true,
    wasOffline: false,
    connectionType: null,
    effectiveType: null,
  })
  const [showBanner, setShowBanner] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Get connection info
  const getConnectionInfo = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as Navigator & { 
        connection?: { type?: string; effectiveType?: string } 
      }).connection
      return {
        connectionType: connection?.type || null,
        effectiveType: connection?.effectiveType || null,
      }
    }
    return { connectionType: null, effectiveType: null }
  }, [])

  useEffect(() => {
    // Initial state
    const initialOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    setStatus(prev => ({
      ...prev,
      isOnline: initialOnline,
      ...getConnectionInfo(),
    }))

    const handleOnline = () => {
      setIsReconnecting(true)
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        ...getConnectionInfo(),
      }))
      setShowBanner(true)

      // Auto-hide after successful reconnection
      setTimeout(() => {
        setShowBanner(false)
        setIsReconnecting(false)
        setStatus(prev => ({ ...prev, wasOffline: false }))
      }, 3000)
    }

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        wasOffline: true,
      }))
      setShowBanner(true)
    }

    const handleConnectionChange = () => {
      setStatus(prev => ({
        ...prev,
        ...getConnectionInfo(),
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listen for connection changes if supported
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as Navigator & { 
        connection?: EventTarget 
      }).connection
      connection?.addEventListener?.('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      if (typeof navigator !== 'undefined' && 'connection' in navigator) {
        const connection = (navigator as Navigator & { 
          connection?: EventTarget 
        }).connection
        connection?.removeEventListener?.('change', handleConnectionChange)
      }
    }
  }, [getConnectionInfo])

  // Don't render anything if online and was never offline
  if (status.isOnline && !showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`
            fixed top-0 left-0 right-0 z-[60] 
            ${status.isOnline 
              ? 'bg-accent-emerald/95' 
              : 'bg-accent-rose/95'
            }
            backdrop-blur-sm shadow-lg
          `}
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
            {/* Status Icon */}
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0"
            >
              {status.isOnline ? (
                isReconnecting ? (
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: 2, ease: 'linear' }}
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </motion.svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
              )}
            </motion.span>

            {/* Status Message */}
            <span className="font-ui text-sm text-white font-medium">
              {status.isOnline 
                ? isReconnecting 
                  ? 'पुनः कनेक्ट हो रहा है...'
                  : '✓ इंटरनेट कनेक्शन बहाल'
                : 'आप ऑफ़लाइन हैं'
              }
            </span>

            {/* Connection quality badge (when online) */}
            {status.isOnline && status.effectiveType && !isReconnecting && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:inline-flex items-center px-2 py-0.5 bg-white/20 rounded text-xs text-white font-ui"
              >
                {getConnectionQualityLabel(status.effectiveType)}
              </motion.span>
            )}

            {/* Offline actions */}
            {!status.isOnline && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-xs font-ui hidden sm:inline"
              >
                — सहेजी गई सामग्री उपलब्ध है
              </motion.span>
            )}

            {/* Close button */}
            <button
              onClick={() => setShowBanner(false)}
              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="बंद करें"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Compact network indicator for use in headers/footers
 */
export function NetworkIndicator({ className = '' }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div 
      className={`flex items-center gap-1.5 ${className}`}
      role="status"
      aria-label={isOnline ? 'ऑनलाइन' : 'ऑफ़लाइन'}
    >
      <span 
        className={`w-2 h-2 rounded-full transition-colors ${
          isOnline ? 'bg-accent-emerald' : 'bg-accent-rose animate-pulse'
        }`}
        aria-hidden="true"
      />
      <span className="text-xs font-ui text-text-muted">
        {isOnline ? 'ऑनलाइन' : 'ऑफ़लाइन'}
      </span>
    </div>
  )
}

/**
 * Hook for network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// Helper function to get connection quality label
function getConnectionQualityLabel(effectiveType: string): string {
  switch (effectiveType) {
    case '4g':
      return 'तेज़'
    case '3g':
      return 'मध्यम'
    case '2g':
      return 'धीमा'
    case 'slow-2g':
      return 'बहुत धीमा'
    default:
      return effectiveType
  }
}
