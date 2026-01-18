'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OfflineIndicatorProps {
  poemSlug: string
  poemTitle: string
}

/**
 * OfflineIndicator - Shows offline status and save option
 * 
 * Features:
 * - Shows when poem is available offline
 * - Allows saving poem for offline reading
 * - Shows connection status
 */
export function OfflineIndicator({ poemSlug, poemTitle }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Check online status
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

  // Check if poem is cached
  useEffect(() => {
    checkIfCached()
  }, [poemSlug])

  const checkIfCached = async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('amanakshar-poems-v1.2.0')
        const cachedResponse = await cache.match(window.location.href)
        setIsSaved(!!cachedResponse)
      } catch (error) {
        console.error('Error checking cache:', error)
      }
    }
  }

  const handleSaveForOffline = async () => {
    if (!('serviceWorker' in navigator)) {
      showToastMessage('ऑफ़लाइन सुविधा उपलब्ध नहीं है')
      return
    }

    setIsSaving(true)
    
    try {
      // Send message to service worker to cache this poem
      const registration = await navigator.serviceWorker.ready
      
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_POEM',
          slug: poemSlug,
          url: window.location.href,
        })
        
        // Also cache via fetch to ensure it's saved
        const cache = await caches.open('amanakshar-poems-v1.2.0')
        const response = await fetch(window.location.href)
        await cache.put(window.location.href, response)
        
        setIsSaved(true)
        showToastMessage('कविता ऑफ़लाइन सहेजी गई!')
      }
    } catch (error) {
      console.error('Error saving for offline:', error)
      showToastMessage('सहेजने में त्रुटि हुई')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveOffline = async () => {
    try {
      const cache = await caches.open('amanakshar-poems-v1.2.0')
      await cache.delete(window.location.href)
      setIsSaved(false)
      showToastMessage('ऑफ़लाइन से हटाया गया')
    } catch (error) {
      console.error('Error removing from cache:', error)
    }
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      {/* Offline Status Indicator */}
      <div 
        className="flex items-center gap-3 text-sm"
        role="status"
        aria-live="polite"
      >
        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          <span 
            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-accent-emerald' : 'bg-accent-rose'}`}
            aria-hidden="true"
          />
          <span className="text-text-muted font-ui">
            {isOnline ? 'ऑनलाइन' : 'ऑफ़लाइन'}
          </span>
        </div>

        <span className="text-divider">•</span>

        {/* Save/Remove button */}
        {isSaved ? (
          <button
            onClick={handleRemoveOffline}
            className="flex items-center gap-1.5 text-accent-gold hover:text-accent-warm transition-colors font-ui"
            aria-label="ऑफ़लाइन से हटाएँ"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span>सहेजी गई</span>
          </button>
        ) : (
          <button
            onClick={handleSaveForOffline}
            disabled={isSaving || !isOnline}
            className="flex items-center gap-1.5 text-text-secondary hover:text-accent-gold transition-colors font-ui disabled:opacity-50"
            aria-label="ऑफ़लाइन के लिए सहेजें"
          >
            {isSaving ? (
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>{isSaving ? 'सहेज रहा है...' : 'ऑफ़लाइन सहेजें'}</span>
          </button>
        )}
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-bg-elevated border border-divider rounded-lg shadow-lg"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-ui text-sm text-text-primary">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * OfflineBanner - Shows when user is offline
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showBanner && isOnline) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center font-ui text-sm ${
            isOnline 
              ? 'bg-accent-emerald/90 text-bg-primary' 
              : 'bg-accent-rose/90 text-white'
          }`}
          role="alert"
          aria-live="assertive"
        >
          {isOnline ? (
            <span>✓ इंटरनेट कनेक्शन बहाल हुआ</span>
          ) : (
            <span>⚠ आप ऑफ़लाइन हैं — पहले से सहेजी कविताएँ उपलब्ध हैं</span>
          )}
          <button
            onClick={() => setShowBanner(false)}
            className="ml-4 opacity-70 hover:opacity-100"
            aria-label="बंद करें"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
