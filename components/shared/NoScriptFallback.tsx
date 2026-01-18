/**
 * NoScriptFallback - Graceful degradation for JavaScript-disabled browsers
 * 
 * This component provides:
 * - Styled noscript message in Hindi
 * - Basic CSS-only functionality hints
 * - Critical content accessibility
 */

export function NoScriptFallback() {
  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Critical styles for no-JS experience */
        .noscript-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(135deg, #d4a855, #bf7a3d);
          color: #0a0908;
          padding: 16px 20px;
          text-align: center;
          font-family: 'Hind', sans-serif;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .noscript-banner h2 {
          font-size: 18px;
          margin: 0 0 8px 0;
          font-weight: 600;
        }
        
        .noscript-banner p {
          font-size: 14px;
          margin: 0;
          opacity: 0.9;
        }
        
        .noscript-banner a {
          color: inherit;
          text-decoration: underline;
          font-weight: 500;
        }
        
        /* Push content down to accommodate banner */
        body {
          padding-top: 80px !important;
        }
        
        /* Hide JS-dependent elements */
        .js-only {
          display: none !important;
        }
        
        /* Show no-JS alternatives */
        .no-js-show {
          display: block !important;
        }
        
        /* Disable custom cursor */
        body,
        body * {
          cursor: auto !important;
        }
        
        /* Simplify animations */
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        /* Navigation fallback - always visible */
        nav {
          position: sticky !important;
          top: 80px !important;
        }
        
        /* Mobile menu - show links directly */
        @media (max-width: 640px) {
          .mobile-nav-links {
            display: flex !important;
            flex-wrap: wrap;
            gap: 16px;
            padding: 16px;
            background: rgba(21, 19, 17, 0.95);
          }
        }
        
        /* Video embeds - show static thumbnail */
        .youtube-embed iframe {
          display: none;
        }
        
        .youtube-embed .youtube-thumbnail {
          display: block !important;
        }
        
        /* Interactive elements - show static states */
        button[disabled],
        .interactive-disabled {
          opacity: 0.7;
          pointer-events: none;
        }
        
        /* Search - link to Google */
        .search-fallback {
          display: block !important;
        }
      `}} />
      
      <div className="noscript-banner" role="alert">
        <h2>⚠️ JavaScript अक्षम है</h2>
        <p>
          इस वेबसाइट का पूर्ण अनुभव के लिए कृपया JavaScript सक्षम करें। 
          <a 
            href="https://www.enable-javascript.com/hi/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            JavaScript कैसे सक्षम करें?
          </a>
        </p>
      </div>
    </noscript>
  )
}

/**
 * NoScript alternative links for navigation
 */
export function NoScriptNavigation() {
  return (
    <noscript>
      <nav className="no-js-show mobile-nav-links" aria-label="मुख्य नेविगेशन (JavaScript के बिना)">
        <a href="/" className="nav-link">घर</a>
        <a href="/kavitayen" className="nav-link">कविताएँ</a>
        <a href="/prastutiyaan" className="nav-link">प्रस्तुतियाँ</a>
        <a href="/pustakein" className="nav-link">पुस्तकें</a>
        <a href="/parichay" className="nav-link">परिचय</a>
        <a href="/sampark" className="nav-link">संपर्क</a>
      </nav>
    </noscript>
  )
}

/**
 * NoScript search fallback - links to external search
 */
export function NoScriptSearch() {
  return (
    <noscript>
      <div className="search-fallback">
        <a 
          href="https://www.google.com/search?q=site:amanakshar.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent-gold hover:underline"
        >
          🔍 Google पर खोजें
        </a>
      </div>
    </noscript>
  )
}

/**
 * NoScript content wrapper - shows alternative content when JS is disabled
 */
export function NoScriptContent({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback: React.ReactNode 
}) {
  return (
    <>
      <div className="js-only">{children}</div>
      <noscript>
        <div className="no-js-show">{fallback}</div>
      </noscript>
    </>
  )
}
