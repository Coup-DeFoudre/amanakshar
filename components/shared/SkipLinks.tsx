'use client'

/**
 * SkipLinks - Accessibility skip links for keyboard navigation
 * 
 * Provides quick navigation to:
 * - Main content
 * - Navigation
 * - Footer
 * 
 * Only visible when focused (keyboard navigation)
 */
export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only fixed top-0 left-0 z-[10000]">
      <a 
        href="#main-content" 
        className="absolute -top-full left-0 focus:top-0 px-6 py-4 bg-bg-secondary text-accent-gold font-ui text-sm border-2 border-accent-gold rounded-br-lg shadow-lg transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2"
        aria-label="मुख्य सामग्री पर जाएँ"
      >
        मुख्य सामग्री पर जाएँ
      </a>
    </div>
  )
}

/**
 * LandmarkRegion - Wrapper for accessible landmark regions
 */
export function MainContent({ 
  children,
  className = '',
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <main 
      id="main-content" 
      className={className}
      role="main"
      aria-label="मुख्य सामग्री"
      tabIndex={-1}
    >
      {children}
    </main>
  )
}

/**
 * Navigation landmark wrapper
 */
export function NavigationLandmark({ 
  children,
  label = 'मुख्य नेविगेशन',
}: { 
  children: React.ReactNode
  label?: string
}) {
  return (
    <nav 
      id="main-navigation"
      role="navigation"
      aria-label={label}
    >
      {children}
    </nav>
  )
}

/**
 * Footer landmark wrapper
 */
export function FooterLandmark({ 
  children,
  className = '',
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <footer 
      id="footer"
      role="contentinfo"
      aria-label="साइट पाद"
      className={className}
    >
      {children}
    </footer>
  )
}

/**
 * Complementary content (sidebar) landmark
 */
export function AsideLandmark({ 
  children,
  label,
  className = '',
}: { 
  children: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <aside 
      role="complementary"
      aria-label={label}
      className={className}
    >
      {children}
    </aside>
  )
}

/**
 * Search landmark wrapper
 */
export function SearchLandmark({ 
  children,
  label = 'खोज',
}: { 
  children: React.ReactNode
  label?: string
}) {
  return (
    <search 
      role="search"
      aria-label={label}
    >
      {children}
    </search>
  )
}
