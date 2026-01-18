'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextButton } from '@/components/ui/TextButton'

interface LineShareModalProps {
  isOpen: boolean
  onClose: () => void
  line: string
  poetName?: string
}

export function LineShareModal({ isOpen, onClose, line, poetName = 'अमन अक्षर' }: LineShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<Element | null>(null)
  
  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement
      
      // Focus close button after modal animation
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 100)
      
      // Lock body scroll
      document.body.style.overflow = 'hidden'
      
      return () => clearTimeout(timer)
    } else {
      // Restore focus when closing
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus()
      }
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  // Keyboard navigation and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      
      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, a, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
  
  useEffect(() => {
    if (isOpen && line) {
      setIsLoading(true)
      const url = `/api/share-image?line=${encodeURIComponent(line)}&poet=${encodeURIComponent(poetName)}`
      setImageUrl(url)
      setIsLoading(false)
    }
  }, [isOpen, line, poetName])
  
  const handleDownload = async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'kavita-line.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
  
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`"${line}" — ${poetName}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }
  
  const handleShare = async () => {
    if (!navigator.share || !imageUrl) {
      // Fallback: copy text
      await handleCopyText()
      return
    }
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], 'kavita-line.png', { type: 'image/png' })
      
      await navigator.share({
        files: [file],
        title: line,
        text: `"${line}" — ${poetName}`,
      })
    } catch (error) {
      // User cancelled or error
      console.error('Share failed:', error)
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          aria-describedby="share-modal-description"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative bg-bg-primary border border-divider rounded-sm p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            role="document"
          >
            <h3 
              id="share-modal-title"
              className="font-heading text-xl text-text-primary mb-4 text-center"
            >
              पंक्ति साझा करें
            </h3>
            
            {/* Preview */}
            <div 
              id="share-modal-description"
              className="bg-bg-secondary p-4 rounded-sm mb-6"
            >
              <blockquote className="font-poem text-text-primary text-center leading-relaxed">
                <p>"{line}"</p>
              </blockquote>
              <p className="font-ui text-text-secondary text-center text-sm mt-2">
                — {poetName}
              </p>
            </div>
            
            {/* Image Preview */}
            {imageUrl && (
              <div className="mb-6" aria-label="साझा करने के लिए छवि पूर्वावलोकन">
                {isLoading ? (
                  <div 
                    className="aspect-square bg-bg-secondary flex items-center justify-center"
                    role="status"
                    aria-label="छवि लोड हो रहा है"
                  >
                    <span className="text-text-muted">लोड हो रहा है...</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={imageUrl} 
                    alt={`"${line}" — ${poetName} - साझा करने के लिए छवि`}
                    className="w-full rounded-sm"
                  />
                )}
              </div>
            )}
            
            {/* Actions */}
            <div 
              className="flex flex-col sm:flex-row gap-3 justify-center"
              role="group"
              aria-label="साझा करने के विकल्प"
            >
              <TextButton 
                onClick={handleCopyText} 
                icon={copySuccess ? "✓" : "📋"}
                aria-label={copySuccess ? "कॉपी हो गया" : "पाठ कॉपी करें"}
              >
                {copySuccess ? "कॉपी हो गया!" : "कॉपी करें"}
              </TextButton>
              <TextButton 
                onClick={handleDownload} 
                icon="↓"
                aria-label="छवि डाउनलोड करें"
              >
                डाउनलोड करें
              </TextButton>
              <TextButton 
                onClick={handleShare} 
                icon="↗"
                aria-label="साझा करें"
              >
                साझा करें
              </TextButton>
            </div>
            
            {/* Close */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-2 rounded-full hover:bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              aria-label="बंद करें"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
