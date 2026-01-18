'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', label: 'डैशबोर्ड', icon: '📊' },
  { href: '/admin/poems', label: 'कविताएँ', icon: '📝' },
  { href: '/admin/performances', label: 'प्रस्तुतियाँ', icon: '🎤' },
  { href: '/admin/events', label: 'आयोजन', icon: '📅' },
  { href: '/admin/books', label: 'पुस्तकें', icon: '📚' },
  { href: '/admin/enquiries', label: 'पूछताछ', icon: '📧' },
  { href: '/admin/settings', label: 'सेटिंग्स', icon: '⚙️' },
]

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-bg-secondary border border-divider rounded-lg"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-bg-primary/95">
          <nav className="flex flex-col items-center justify-center h-full gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 font-ui text-lg transition-colors ${
                  pathname === item.href
                    ? 'text-accent-gold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
