'use client'

import { useState, useEffect, useCallback } from 'react'
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
  }, [])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [query, search])
  
  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
  
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
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
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />
          
          {/* Search Panel */}
          <motion.div
            className="relative bg-bg-primary border border-divider rounded-sm w-full max-w-lg overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-divider">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="खोजें... कविता, पुस्तक, पंक्ति"
                className="w-full bg-transparent font-ui text-lg text-text-primary placeholder:text-text-muted focus:outline-none"
                autoFocus
              />
            </div>
            
            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query && results.length === 0 && (
                <p className="p-4 text-center font-ui text-text-muted">
                  कोई परिणाम नहीं मिला
                </p>
              )}
              
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.slug}`}
                  href={getHref(result)}
                  onClick={onClose}
                  className="block p-4 hover:bg-bg-secondary transition-colors border-b border-divider last:border-b-0"
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
            <div className="p-2 border-t border-divider text-center">
              <span className="font-ui text-xs text-text-muted">
                Esc बंद करने के लिए
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

