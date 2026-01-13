'use client'

import { useState, useEffect } from 'react'
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
  
  const handleShare = async () => {
    if (!navigator.share || !imageUrl) {
      // Fallback: copy text
      await navigator.clipboard.writeText(`"${line}" — ${poetName}`)
      alert('पंक्ति कॉपी हो गई!')
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
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative bg-bg-primary border border-divider rounded-sm p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h3 className="font-heading text-xl text-text-primary mb-4 text-center">
              पंक्ति साझा करें
            </h3>
            
            {/* Preview */}
            <div className="bg-bg-secondary p-4 rounded-sm mb-6">
              <p className="font-poem text-text-primary text-center leading-relaxed">
                "{line}"
              </p>
              <p className="font-ui text-text-secondary text-center text-sm mt-2">
                — {poetName}
              </p>
            </div>
            
            {/* Image Preview */}
            {imageUrl && (
              <div className="mb-6">
                {isLoading ? (
                  <div className="aspect-square bg-bg-secondary flex items-center justify-center">
                    <span className="text-text-muted">लोड हो रहा है...</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={imageUrl} 
                    alt="Share preview"
                    className="w-full rounded-sm"
                  />
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <TextButton onClick={handleDownload} icon="↓">
                डाउनलोड करें
              </TextButton>
              <TextButton onClick={handleShare} icon="↗">
                साझा करें
              </TextButton>
            </div>
            
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              aria-label="बंद करें"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

