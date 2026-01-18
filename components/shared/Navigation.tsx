'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SearchModal } from './SearchModal'

const navLinks = [
  { href: '/', label: 'घर', labelEn: 'Home', icon: 'home' },
  { href: '/kavitayen', label: 'कविताएँ', labelEn: 'Poems', icon: 'poems' },
  { href: '/prastutiyaan', label: 'प्रस्तुतियाँ', labelEn: 'Performances', icon: 'performances' },
  { href: '/prastutiyaan-live', label: 'आयोजन', labelEn: 'Events', icon: 'events' },
  { href: '/pustakein', label: 'पुस्तकें', labelEn: 'Books', icon: 'books' },
  { href: '/parichay', label: 'परिचय', labelEn: 'About', icon: 'about' },
  { href: '/sampark', label: 'संपर्क', labelEn: 'Contact', icon: 'contact' },
]

// Bottom nav links (subset for mobile)
const bottomNavLinks = [
  { href: '/', label: 'घर', icon: 'home' },
  { href: '/kavitayen', label: 'कविताएँ', icon: 'poems' },
  { href: '/prastutiyaan', label: 'प्रस्तुतियाँ', icon: 'performances' },
  { href: '/parichay', label: 'परिचय', icon: 'about' },
]

// Icon component for bottom nav
function NavIcon({ icon, className = '' }: { icon: string; className?: string }) {
  const iconClass = `w-6 h-6 ${className}`
  
  switch (icon) {
    case 'home':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    case 'poems':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'performances':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    case 'events':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    case 'books':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'about':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'contact':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    default:
      return null
  }
}

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  // Hide navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  // Track scroll for nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])
  
  return (
    <>
      {/* Top Navigation */}
      <nav 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-bg-primary/95 backdrop-blur-md border-b border-divider' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="font-heading text-xl text-text-primary hover:text-accent-gold transition-colors min-h-[44px] flex items-center"
            >
              अमन अक्षर
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center gap-6">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-ui text-sm transition-colors relative min-h-[44px] flex items-center ${
                    pathname === link.href 
                      ? 'text-accent-gold' 
                      : 'text-text-secondary hover:text-accent-gold'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent-gold" />
                  )}
                </Link>
              ))}
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary hover:text-accent-gold transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="खोजें"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Buttons */}
            <div className="flex items-center gap-1 sm:hidden">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-text-secondary hover:text-accent-gold transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="खोजें"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-text-secondary hover:text-accent-gold transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
                aria-expanded={isMenuOpen}
              >
                <motion.div
                  animate={isMenuOpen ? 'open' : 'closed'}
                  className="w-6 h-6 relative"
                >
                  <motion.span
                    className="absolute left-0 w-6 h-0.5 bg-current"
                    style={{ top: '25%' }}
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="absolute left-0 w-6 h-0.5 bg-current"
                    style={{ top: '50%', marginTop: -1 }}
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.span
                    className="absolute left-0 w-6 h-0.5 bg-current"
                    style={{ top: '75%' }}
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-bg-primary" />
            
            {/* Menu content */}
            <div className="relative h-full flex flex-col items-center justify-center px-8 pb-20">
              <nav className="space-y-2 text-center w-full max-w-xs">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: prefersReducedMotion ? 0.1 : 0.3, 
                        delay: prefersReducedMotion ? 0 : index * 0.05 
                      }
                    }}
                    exit={{ opacity: 0 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 min-h-[56px] ${
                        pathname === link.href ? 'text-accent-gold' : ''
                      }`}
                    >
                      <span className={`font-heading text-2xl sm:text-3xl transition-colors ${
                        pathname === link.href 
                          ? 'text-accent-gold' 
                          : 'text-text-primary hover:text-accent-gold'
                      }`}>
                        {link.label}
                      </span>
                      <span className="font-ui text-xs text-text-muted tracking-widest uppercase mt-1 block">
                        {link.labelEn}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-bg-primary/95 backdrop-blur-md border-t border-divider"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname?.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-accent-gold' 
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <NavIcon icon={link.icon} className={isActive ? 'text-accent-gold' : ''} />
                <span className="font-ui text-[10px] mt-1 leading-tight">{link.label}</span>
              </Link>
            )
          })}
          
          {/* More button to open full menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[56px] py-2 px-3 rounded-lg text-text-muted hover:text-text-secondary transition-colors"
            aria-label="और देखें"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-ui text-[10px] mt-1 leading-tight">और</span>
          </button>
        </div>
      </nav>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
