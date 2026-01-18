'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const pathMap: Record<string, string> = {
  '/admin': 'डैशबोर्ड',
  '/admin/poems': 'कविताएँ',
  '/admin/performances': 'प्रस्तुतियाँ',
  '/admin/events': 'आयोजन',
  '/admin/books': 'पुस्तकें',
  '/admin/enquiries': 'संपर्क',
  '/admin/notifications': 'सूचनाएं',
  '/admin/settings': 'सेटिंग्स',
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  
  if (!pathname) return null

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = []

  // Build breadcrumbs
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    const path = '/' + pathSegments.slice(0, i + 1).join('/')
    const title = pathMap[path] || segment

    if (i === pathSegments.length - 1) {
      breadcrumbs.push({ path, title, isLast: true })
    } else {
      breadcrumbs.push({ path, title, isLast: false })
    }
  }

  return (
    <nav className="lg:hidden px-4 py-3 bg-bg-secondary border-b border-divider">
      <ol className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center gap-2">
            {index > 0 && <span className="text-text-muted">/</span>}
            {crumb.isLast ? (
              <span className="font-ui text-text-primary">{crumb.title}</span>
            ) : (
              <Link
                href={crumb.path}
                className="font-ui text-text-secondary hover:text-text-primary transition-colors"
              >
                {crumb.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
