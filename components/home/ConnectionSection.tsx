'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface SocialLink {
  platform: 'facebook' | 'youtube' | 'instagram' | 'twitter'
  url: string
}

interface ConnectionSectionProps {
  email: string
  socialLinks: SocialLink[]
  poetName: string
  signatureUrl?: string
}

const socialIcons = {
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
}

export function ConnectionSection({ 
  email, 
  socialLinks, 
  poetName,
  signatureUrl = '/images/poet/signature.svg'
}: ConnectionSectionProps) {
  return (
    <footer className="py-16 sm:py-20 px-6">
      {/* Top border */}
      <div className="max-w-lg mx-auto mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center">
        {/* Poetic invitation */}
        <motion.p
          className="font-poem text-lg text-text-muted mb-10 italic"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          "शब्दों से जुड़ें, भावों से मिलें"
        </motion.p>
        
        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 border border-divider text-text-muted hover:text-accent-gold hover:border-accent-gold/50 transition-colors rounded-lg"
            >
              {socialIcons[link.platform]}
            </a>
          ))}
        </motion.div>
        
        {/* Email */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 font-ui text-text-secondary hover:text-accent-gold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{email}</span>
          </a>
        </motion.div>
        
        {/* Navigation links */}
        <motion.nav
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { href: '/kavitayen', label: 'कविताएँ' },
            { href: '/prastutiyaan', label: 'प्रस्तुतियाँ' },
            { href: '/pustakein', label: 'पुस्तकें' },
            { href: '/parichay', label: 'परिचय' },
            { href: '/sampark', label: 'संपर्क' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-ui text-sm text-text-muted hover:text-accent-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>
        
        {/* Signature */}
        {signatureUrl && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <img 
              src={signatureUrl} 
              alt={`${poetName} हस्ताक्षर`}
              className="h-10 w-auto opacity-40"
            />
          </motion.div>
        )}
        
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-divider" />
          <span className="font-heading text-2xl text-accent-gold/30">अ</span>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-divider" />
        </div>
        
        {/* Copyright */}
        <p className="font-ui text-sm text-text-muted">
          © {new Date().getFullYear()} {poetName} — सर्वाधिकार सुरक्षित
        </p>
      </div>
    </footer>
  )
}
