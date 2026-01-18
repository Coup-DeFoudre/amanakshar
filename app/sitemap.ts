import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amanakshar.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/kavitayen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/prastutiyaan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/prastutiyaan-live`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pustakein`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/parichay`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sampark`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic poem pages
  let poemPages: MetadataRoute.Sitemap = []
  try {
    const poems = await db.poem.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })
    
    poemPages = poems.map((poem) => ({
      url: `${SITE_URL}/kavita/${poem.slug}`,
      lastModified: poem.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching poems for sitemap:', error)
  }

  // Dynamic book pages
  let bookPages: MetadataRoute.Sitemap = []
  try {
    const books = await db.book.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })
    
    bookPages = books.map((book) => ({
      url: `${SITE_URL}/pustak/${book.slug}`,
      lastModified: book.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching books for sitemap:', error)
  }

  // Dynamic event pages
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const events = await db.event.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })
    
    eventPages = events.map((event) => ({
      url: `${SITE_URL}/prastutiyaan-live/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching events for sitemap:', error)
  }

  // Dynamic bhav (theme) pages
  let bhavPages: MetadataRoute.Sitemap = []
  try {
    const bhavs = await db.bhav.findMany({
      select: { slug: true, updatedAt: true },
    })
    
    bhavPages = bhavs.map((bhav) => ({
      url: `${SITE_URL}/bhav/${bhav.slug}`,
      lastModified: bhav.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching bhavs for sitemap:', error)
  }

  return [
    ...staticPages,
    ...poemPages,
    ...bookPages,
    ...eventPages,
    ...bhavPages,
  ]
}
