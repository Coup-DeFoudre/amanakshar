import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amanakshar.com'
const POET_NAME = 'अमन अक्षर'
const POET_NAME_EN = 'Aman Akshar'
const DEFAULT_IMAGE = '/images/og/default.png'
const POET_IMAGE = '/images/poet/aman-akshar-portrait.svg'

/**
 * Base metadata that applies to all pages
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${POET_NAME} — कवि`,
    template: `%s — ${POET_NAME}`,
  },
  description: 'अमन अक्षर की कविताओं, मंचीय प्रस्तुतियों और पुस्तकों का स्थायी, भावनात्मक और गंभीर साहित्यिक घर।',
  keywords: [
    'अमन अक्षर',
    'कवि',
    'हिंदी कविता',
    'कवि सम्मेलन',
    'Hindi poetry',
    'Aman Akshar',
    'Indian poet',
    'Hindi kavita',
    'मंचीय कवि',
  ],
  authors: [{ name: POET_NAME, url: SITE_URL }],
  creator: POET_NAME,
  publisher: POET_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    alternateLocale: 'en_US',
    url: SITE_URL,
    siteName: `${POET_NAME} — कवि`,
    title: `${POET_NAME} — कवि`,
    description: 'कविताओं, प्रस्तुतियों और पुस्तकों का साहित्यिक घर',
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: `${POET_NAME} - Hindi Poet`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${POET_NAME} — कवि`,
    description: 'कविताओं, प्रस्तुतियों और पुस्तकों का साहित्यिक घर',
    images: [DEFAULT_IMAGE],
    creator: '@amanakshar',
    site: '@amanakshar',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'literature',
  other: {
    'google': 'notranslate',
    'fb:app_id': process.env.FACEBOOK_APP_ID || '',
  },
}

/**
 * Generate metadata for poem pages
 */
export function generatePoemMetadata({
  title,
  slug,
  text,
  poetName = POET_NAME,
  bhav,
  imageUrl,
}: {
  title: string
  slug: string
  text: string
  poetName?: string
  bhav?: string
  imageUrl?: string
}): Metadata {
  const description = text.substring(0, 160).replace(/\n/g, ' ').trim()
  const ogImageUrl = imageUrl || `/api/og/poem?title=${encodeURIComponent(title)}&poet=${encodeURIComponent(poetName)}`
  
  return {
    title: title,
    description,
    keywords: [title, poetName, 'हिंदी कविता', bhav || '', 'Hindi poetry'].filter(Boolean),
    openGraph: {
      type: 'article',
      title: `${title} — ${poetName}`,
      description,
      url: `${SITE_URL}/kavita/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — ${poetName}`,
        },
      ],
      authors: [poetName],
      publishedTime: new Date().toISOString(),
      section: bhav || 'कविता',
      tags: [bhav || 'कविता', 'Hindi poetry', poetName],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${poetName}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/kavita/${slug}`,
    },
  }
}

/**
 * Generate metadata for event pages
 */
export function generateEventMetadata({
  title,
  slug,
  description,
  venue,
  city,
  eventDate,
  imageUrl,
}: {
  title: string
  slug: string
  description?: string
  venue?: string
  city?: string
  eventDate: Date
  imageUrl?: string
}): Metadata {
  const eventDescription = description || 
    `${POET_NAME} की कविता प्रस्तुति ${venue || ''} ${city || ''} में`.trim()
  const ogImageUrl = imageUrl || DEFAULT_IMAGE
  
  return {
    title: `${title} — आयोजन`,
    description: eventDescription,
    keywords: [title, POET_NAME, 'कवि सम्मेलन', city || '', venue || ''].filter(Boolean),
    openGraph: {
      type: 'website',
      title: `${title} — ${POET_NAME}`,
      description: eventDescription,
      url: `${SITE_URL}/prastutiyaan-live/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${POET_NAME}`,
      description: eventDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/prastutiyaan-live/${slug}`,
    },
  }
}

/**
 * Generate metadata for book pages
 */
export function generateBookMetadata({
  title,
  slug,
  description,
  year,
  coverImageUrl,
}: {
  title: string
  slug: string
  description?: string
  year?: number
  coverImageUrl?: string
}): Metadata {
  const bookDescription = description || 
    `${POET_NAME} की पुस्तक "${title}"${year ? ` (${year})` : ''}`
  
  return {
    title: `${title} — पुस्तक`,
    description: bookDescription,
    keywords: [title, POET_NAME, 'हिंदी पुस्तक', 'कविता संग्रह', 'Hindi book'],
    openGraph: {
      type: 'book',
      title: `${title} — ${POET_NAME}`,
      description: bookDescription,
      url: `${SITE_URL}/pustak/${slug}`,
      images: coverImageUrl ? [{ url: coverImageUrl, width: 1200, height: 630 }] : undefined,
      authors: [POET_NAME],
      releaseDate: year ? `${year}-01-01` : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${POET_NAME}`,
      description: bookDescription,
    },
    alternates: {
      canonical: `${SITE_URL}/pustak/${slug}`,
    },
  }
}

/**
 * Generate metadata for collection pages
 */
export function generateCollectionMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title: `${title} — ${POET_NAME}`,
      description,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${POET_NAME}`,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
  }
}
