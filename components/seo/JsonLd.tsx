/**
 * JSON-LD Structured Data Components
 * 
 * Implements Schema.org structured data for:
 * - Person (Poet profile)
 * - CreativeWork (Poems)
 * - Event (Live performances)
 * - Book (Poetry collections)
 * - WebSite (Site-wide)
 * - BreadcrumbList (Navigation)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amanakshar.com'
const POET_NAME = 'अमन अक्षर'
const POET_NAME_EN = 'Aman Akshar'

interface JsonLdProps {
  data: Record<string, unknown>
}

function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Website structured data - for homepage
 */
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${POET_NAME} — कवि`,
    alternateName: `${POET_NAME_EN} - Hindi Poet`,
    url: SITE_URL,
    description: 'अमन अक्षर की कविताओं, मंचीय प्रस्तुतियों और पुस्तकों का साहित्यिक घर',
    inLanguage: 'hi',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Person',
      name: POET_NAME,
      alternateName: POET_NAME_EN,
    },
  }
  
  return <JsonLd data={data} />
}

/**
 * Poet profile structured data
 */
export function PoetJsonLd({
  imageUrl,
  description,
  sameAs = [],
}: {
  imageUrl?: string
  description?: string
  sameAs?: string[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: POET_NAME,
    alternateName: POET_NAME_EN,
    url: SITE_URL,
    image: imageUrl || `${SITE_URL}/images/poet/aman-akshar-portrait.svg`,
    description: description || 'हिंदी कवि, मंच प्रस्तुतकर्ता। IIT से शिक्षित, लाखों का पैकेज छोड़कर कविता को जीवन बनाया।',
    jobTitle: 'कवि',
    worksFor: {
      '@type': 'Organization',
      name: 'स्वतंत्र कवि',
    },
    nationality: {
      '@type': 'Country',
      name: 'India',
    },
    birthPlace: {
      '@type': 'Place',
      name: 'मुंदी, खंडवा, मध्य प्रदेश',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
    },
    knowsLanguage: ['hi', 'en'],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Poet',
      occupationalCategory: 'Writer',
    },
    sameAs: [
      'https://youtube.com/@amanakshar',
      'https://instagram.com/amanakshar',
      'https://facebook.com/amanakshar',
      ...sameAs,
    ],
  }
  
  return <JsonLd data={data} />
}

/**
 * Poem structured data
 */
export function PoemJsonLd({
  title,
  slug,
  text,
  poetName = POET_NAME,
  datePublished,
  bhav,
  imageUrl,
}: {
  title: string
  slug: string
  text: string
  poetName?: string
  datePublished?: Date
  bhav?: string
  imageUrl?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/kavita/${slug}`,
    name: title,
    headline: title,
    description: text.substring(0, 200).replace(/\n/g, ' ').trim(),
    text: text,
    author: {
      '@type': 'Person',
      name: poetName,
      url: SITE_URL,
    },
    creator: {
      '@type': 'Person',
      name: poetName,
    },
    publisher: {
      '@type': 'Person',
      name: poetName,
    },
    url: `${SITE_URL}/kavita/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/kavita/${slug}`,
    },
    inLanguage: 'hi',
    genre: bhav || 'Poetry',
    about: bhav ? {
      '@type': 'Thing',
      name: bhav,
    } : undefined,
    datePublished: datePublished?.toISOString() || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    image: imageUrl || `${SITE_URL}/api/og/poem?title=${encodeURIComponent(title)}`,
    isAccessibleForFree: true,
    copyrightHolder: {
      '@type': 'Person',
      name: poetName,
    },
  }
  
  return <JsonLd data={data} />
}

/**
 * Event structured data
 */
export function EventJsonLd({
  title,
  slug,
  description,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  city,
  state,
  isPaid,
  price,
  ticketUrl,
  imageUrl,
  isLive,
}: {
  title: string
  slug: string
  description?: string
  eventDate: Date
  eventTime?: string
  venue?: string
  venueAddress?: string
  city?: string
  state?: string
  isPaid?: boolean
  price?: number
  ticketUrl?: string
  imageUrl?: string
  isLive?: boolean
}) {
  // Parse event time
  let startDateTime = eventDate.toISOString()
  if (eventTime) {
    const [hours, minutes] = eventTime.split(':').map(Number)
    const dateWithTime = new Date(eventDate)
    dateWithTime.setHours(hours || 18, minutes || 0)
    startDateTime = dateWithTime.toISOString()
  }
  
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${SITE_URL}/prastutiyaan-live/${slug}`,
    name: title,
    description: description || `${POET_NAME} की कविता प्रस्तुति`,
    startDate: startDateTime,
    eventStatus: isLive 
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: venue ? {
      '@type': 'Place',
      name: venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venueAddress,
        addressLocality: city,
        addressRegion: state,
        addressCountry: 'IN',
      },
    } : undefined,
    organizer: {
      '@type': 'Person',
      name: POET_NAME,
      url: SITE_URL,
    },
    performer: {
      '@type': 'Person',
      name: POET_NAME,
      url: SITE_URL,
    },
    image: imageUrl || `${SITE_URL}/images/og/default.png`,
    url: `${SITE_URL}/prastutiyaan-live/${slug}`,
    offers: isPaid && price ? {
      '@type': 'Offer',
      url: ticketUrl || `${SITE_URL}/prastutiyaan-live/${slug}`,
      price: price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    } : {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    inLanguage: 'hi',
  }
  
  return <JsonLd data={data} />
}

/**
 * Book structured data
 */
export function BookJsonLd({
  title,
  slug,
  description,
  year,
  coverImageUrl,
  purchaseUrl,
}: {
  title: string
  slug: string
  description?: string
  year?: number
  coverImageUrl?: string
  purchaseUrl?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${SITE_URL}/pustak/${slug}`,
    name: title,
    description: description || `${POET_NAME} की कविता संग्रह`,
    author: {
      '@type': 'Person',
      name: POET_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: POET_NAME,
    },
    url: `${SITE_URL}/pustak/${slug}`,
    image: coverImageUrl,
    datePublished: year ? `${year}-01-01` : undefined,
    inLanguage: 'hi',
    genre: 'Poetry',
    workExample: purchaseUrl ? {
      '@type': 'Book',
      bookFormat: 'https://schema.org/Paperback',
      url: purchaseUrl,
    } : undefined,
  }
  
  return <JsonLd data={data} />
}

/**
 * Breadcrumb structured data
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
  
  return <JsonLd data={data} />
}

/**
 * FAQPage structured data for about page
 */
export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  
  return <JsonLd data={data} />
}

/**
 * ItemList for poem collections
 */
export function PoemListJsonLd({
  poems,
}: {
  poems: { title: string; slug: string }[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: poems.map((poem, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/kavita/${poem.slug}`,
      name: poem.title,
    })),
  }
  
  return <JsonLd data={data} />
}
