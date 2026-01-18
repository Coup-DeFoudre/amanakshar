'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const adminMenuItems = [
  {
    title: 'डैशबोर्ड',
    href: '/admin',
    icon: '📊',
  },
  {
    title: 'कविताएँ',
    href: '/admin/poems',
    icon: '📝',
  },
  {
    title: 'प्रस्तुतियाँ',
    href: '/admin/performances',
    icon: '🎬',
    description: 'YouTube वीडियो',
  },
  {
    title: 'आयोजन',
    href: '/admin/events',
    icon: '📅',
    description: 'लाइव शो',
  },
  {
    title: 'पुस्तकें',
    href: '/admin/books',
    icon: '📚',
  },
  {
    title: 'संपर्क',
    href: '/admin/enquiries',
    icon: '📧',
  },
  {
    title: 'सूचनाएं',
    href: '/admin/notifications',
    icon: '🔔',
  },
  {
    title: 'सेटिंग्स',
    href: '/admin/settings',
    icon: '⚙️',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-divider min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-divider">
        <h1 className="font-heading text-xl text-text-primary">
          प्रबंधक पैनल
        </h1>
        <p className="font-ui text-xs text-text-muted mt-1">
          अमन अक्षर
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-sm transition-colors
                    ${isActive
                      ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-ui text-sm font-medium">
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="font-ui text-xs text-text-muted">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-divider">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <span>←</span>
          <span className="font-ui text-sm">वेबसाइट पर वापस</span>
        </Link>
      </div>
    </aside>
  )
}
