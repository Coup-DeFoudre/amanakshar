'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchModal } from './SearchModal'

const navLinks = [
  { href: '/', label: 'घर' },
  { href: '/kavitayen', label: 'कविताएँ' },
  { href: '/prastutiyaan', label: 'प्रस्तुतियाँ' },
  { href: '/pustakein', label: 'पुस्तकें' },
  { href: '/parichay', label: 'परिचय' },
  { href: '/sampark', label: 'संपर्क' },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  return (
    <>
      <nav className="sticky top-0 z-40 bg-bg-secondary/90 backdrop-blur-md border-b border-divider">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-heading text-lg text-text-primary">
              अमन अक्षर
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-6">
              {navLinks.slice(1).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-ui text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="खोजें"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 sm:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="खोजें"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label={isMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="sm:hidden border-t border-divider bg-bg-secondary/95"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block font-ui text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

