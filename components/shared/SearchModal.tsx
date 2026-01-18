'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SearchResult {
  type: 'poem' | 'performance' | 'book'
  title: string
  slug: string
  excerpt?: string
}

// Static search data - will be replaced with API
const searchableContent: SearchResult[] = [
  { type: 'poem', title: 'कुछ शब्द सिर्फ़ कहे जाते', slug: 'kuch-shabd-sirf-kahe-jaate', excerpt: 'कुछ शब्द सिर्फ़ कहे जाते, जिए जाते हैं' },
  { type: 'poem', title: 'दिल से निकली बात', slug: 'dil-se-nikli-baat', excerpt: 'रात थी मन्नतों की' },
  { type: 'poem', title: 'भक्ति का सार', slug: 'bhakti-ka-saar', excerpt: 'जब मन में बसे प्रभु का नाम' },
  { type: 'poem', title: 'जीवन की राह', slug: 'jeevan-ki-raah', excerpt: 'कठिन है राह, पर चलना है' },
  { type: 'book', title: 'शब्दों का सफर', slug: 'shabdon-ka-safar' },
  { type: 'book', title: 'दिल की बातें', slug: 'dil-ki-batein' },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)
  
  // Debounced search
  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    
    const filtered = searchableContent.filter(item => 
      item.title.includes(searchQuery) || 
      item.excerpt?.includes(searchQuery)
    )
    
    setResults(filtered)
    setSelectedIndex(-1)
  }, [])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [query, search])
  
  // Focus management - store and restore focus
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement
      
      // Focus the input after modal animation
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      // Restore focus when closing
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          onClose()
          break
          
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          )
          break
          
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          if (selectedIndex === 0) {
            inputRef.current?.focus()
          }
          break
          
        case 'Enter':
          if (selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault()
            const result = results[selectedIndex]
            const href = getHref(result)
            window.location.href = href
            onClose()
          }
          break
          
        case 'Tab':
          // Trap focus within modal
          if (!modalRef.current) return
          
          const focusableElements = modalRef.current.querySelectorAll(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
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
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, results, selectedIndex])
  
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'poem': return 'कविता'
      case 'performance': return 'प्रस्तुति'
      case 'book': return 'पुस्तक'
      default: return ''
    }
  }
  
  const getHref = (result: SearchResult) => {
    switch (result.type) {
      case 'poem': return `/kavita/${result.slug}`
      case 'book': return `/pustak/${result.slug}`
      default: return '/'
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Search Panel */}
          <motion.div
            ref={modalRef}
            className="relative bg-bg-primary border border-divider rounded-sm w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="search"
          >
            {/* Hidden title for screen readers */}
            <h2 id="search-modal-title" className="sr-only">
              खोज
            </h2>
            
            {/* Search Input */}
            <div className="p-4 border-b border-divider">
              <label htmlFor="search-input" className="sr-only">
                खोजें: कविता, पुस्तक, या पंक्ति
              </label>
              <div className="relative">
                <svg 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  id="search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="खोजें... कविता, पुस्तक, पंक्ति"
                  className="w-full bg-transparent font-ui text-lg text-text-primary placeholder:text-text-muted focus:outline-none pl-8"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  aria-describedby="search-hint"
                  aria-controls="search-results"
                  aria-expanded={results.length > 0}
                  aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
                />
              </div>
            </div>
            
            {/* Results */}
            <div 
              ref={resultsRef}
              id="search-results"
              className="max-h-80 overflow-y-auto"
              role="listbox"
              aria-label="खोज परिणाम"
            >
              {query && results.length === 0 && (
                <p 
                  className="p-4 text-center font-ui text-text-muted"
                  role="status"
                  aria-live="polite"
                >
                  कोई परिणाम नहीं मिला
                </p>
              )}
              
              {results.length > 0 && (
                <p className="sr-only" role="status" aria-live="polite">
                  {results.length} परिणाम मिले
                </p>
              )}
              
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.slug}`}
                  id={`result-${index}`}
                  href={getHref(result)}
                  onClick={onClose}
                  className={`block p-4 transition-colors border-b border-divider last:border-b-0 ${
                    selectedIndex === index 
                      ? 'bg-accent-gold/10 text-accent-gold' 
                      : 'hover:bg-bg-secondary'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-heading text-text-primary">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="font-ui text-text-muted text-sm mt-1 line-clamp-1">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="font-ui text-xs text-text-muted flex-shrink-0">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Hint */}
            <div 
              id="search-hint"
              className="p-2 border-t border-divider text-center"
            >
              <span className="font-ui text-xs text-text-muted">
                <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-text-secondary mr-1">↑↓</kbd>
                नेविगेट करें
                <span className="mx-2">•</span>
                <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-text-secondary mr-1">Enter</kbd>
                चुनें
                <span className="mx-2">•</span>
                <kbd className="px-1.5 py-0.5 bg-bg-secondary rounded text-text-secondary mr-1">Esc</kbd>
                बंद करें
              </span>
            </div>
            
            {/* Close button for screen readers */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors p-2"
              aria-label="खोज बंद करें"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
