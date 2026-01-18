'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => void
  error: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => void
  info: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => void
  warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ message, type: 'success', ...options })
  }, [addToast])

  const error = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ message, type: 'error', duration: 6000, ...options })
  }, [addToast])

  const info = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ message, type: 'info', ...options })
  }, [addToast])

  const warning = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    addToast({ message, type: 'warning', duration: 5000, ...options })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

// Toast Container
function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]
  removeToast: (id: string) => void 
}) {
  return (
    <div 
      className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none"
      role="region"
      aria-label="सूचनाएँ"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Individual Toast Item
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons: Record<ToastType, ReactNode> = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  }

  const colors: Record<ToastType, string> = {
    success: 'bg-accent-emerald/90 text-white border-accent-emerald',
    error: 'bg-accent-rose/90 text-white border-accent-rose',
    info: 'bg-accent-indigo/90 text-white border-accent-indigo',
    warning: 'bg-accent-warm/90 text-white border-accent-warm',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm',
        colors[toast.type]
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <span className="flex-shrink-0">{icons[toast.type]}</span>

      {/* Message */}
      <p className="flex-1 font-ui text-sm">{toast.message}</p>

      {/* Action button */}
      {toast.action && (
        <button
          onClick={() => {
            toast.action?.onClick()
            onDismiss()
          }}
          className="flex-shrink-0 font-ui text-sm font-medium underline underline-offset-2 hover:no-underline transition-all"
        >
          {toast.action.label}
        </button>
      )}

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="बंद करें"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

// Hindi-specific toast messages for common actions
export const toastMessages = {
  // Like actions
  liked: '❤️ पसंद किया गया',
  unliked: '💔 पसंद हटाया',
  
  // Share actions
  shared: '🔗 लिंक कॉपी किया गया',
  shareError: 'शेयर करने में त्रुटि',
  
  // Offline actions
  savedOffline: '📥 ऑफ़लाइन सहेजा गया',
  removedOffline: '🗑️ ऑफ़लाइन से हटाया',
  
  // Subscribe actions
  subscribed: '🔔 सूचनाएँ चालू की गईं',
  unsubscribed: '🔕 सूचनाएँ बंद की गईं',
  subscribeError: 'सूचनाएँ चालू करने में त्रुटि',
  
  // General
  copied: '📋 कॉपी किया गया',
  saved: '✓ सहेजा गया',
  deleted: '🗑️ हटाया गया',
  error: '⚠️ कुछ गलत हो गया',
  networkError: '📶 इंटरनेट कनेक्शन जांचें',
  tryAgain: 'कृपया फिर से प्रयास करें',
}
