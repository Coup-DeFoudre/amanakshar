import prisma from './db'

// Types for homepage sections
export interface OpeningSectionContent {
  poetName: string
  primaryTagline: string
  secondaryCouplet: {
    line1: string
    line2: string
  }
}

export interface VoiceSectionContent {
  title: string
  quote: string
  youtubeUrl: string
  poemSlug?: string
}

export interface StageSectionContent {
  tagline: string
  signatureSong: string
  credentials: string[]
}

export interface PoetSectionContent {
  name: string
  bio: string
  achievements: Array<{ title: string; icon: string }>
  collaborations: Array<{ name: string; role?: string }>
}

export interface ConnectionSectionContent {
  email: string
  poetName: string
  socialLinks: Array<{ platform: 'facebook' | 'youtube' | 'instagram' | 'twitter'; url: string }>
}

export type SectionKey = 'opening' | 'voice' | 'stage' | 'poet' | 'bhav' | 'words' | 'connection'

// Default content for each section
export const defaultSections: Record<SectionKey, { title: string; content: object }> = {
  opening: {
    title: 'Opening Section',
    content: {
      poetName: 'अमन अक्षर',
      primaryTagline: 'हम यहाँ तक अचानक नहीं आये हैं',
      secondaryCouplet: {
        line1: 'तुम इतने प्यारे थे तुमसे पूरी दुनिया सरल हुई',
        line2: 'हम इतने मुश्किल थे जो तुमसे भी हल न हो पाए',
      },
    },
  },
  voice: {
    title: 'Voice Section',
    content: {
      title: 'भाव सिर्फ़ राम हैं',
      quote: 'सारा जग है प्रेरणा, प्रभाव सिर्फ़ राम हैं',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      poemSlug: 'bhav-sirf-ram-hain',
    },
  },
  stage: {
    title: 'Stage Section',
    content: {
      tagline: 'मंच पर शब्द जीवित होते हैं',
      signatureSong: 'भाव सिर्फ़ राम हैं',
      credentials: [
        'सभी IITs, IIMs, NITs में काव्य पाठ',
        'Lal Kila Kavi Sammelan',
        'सबसे व्यस्त कवि',
      ],
    },
  },
  poet: {
    title: 'Poet Section',
    content: {
      name: 'डॉ. अमन अक्षर',
      bio: 'खंडवा के छोटे से गाँव मुंदी से निकलकर, बड़े पैकेज की नौकरी छोड़कर, शब्दों को मंच तक ले जाने वाले कवि। जो कहा नहीं जा सकता, वह कविता में उतरता है।',
      achievements: [
        { title: 'मानद डॉक्टरेट', icon: '🎓' },
        { title: 'Ramyug गीतकार', icon: '🎬' },
        { title: 'JRF NET', icon: '📚' },
      ],
      collaborations: [
        { name: 'Pt. Hariprasad Chaurasia', role: 'बांसुरी' },
        { name: 'Shivkumar Sharma', role: 'संतूर' },
        { name: 'Zakir Hussain', role: 'तबला' },
        { name: 'Amitabh Bachchan' },
        { name: 'Sonu Nigam' },
        { name: 'Ustad Rashid Ali Khan' },
      ],
    },
  },
  bhav: {
    title: 'Bhav Section',
    content: {
      bhavs: [
        { name: 'प्रेम', slug: 'prem', icon: '❤️', sampleLine: 'तुम इतने प्यारे थे...', color: 'warm' },
        { name: 'भक्ति', slug: 'bhakti', icon: '🙏', sampleLine: 'भाव सूचियाँ बहुत हैं...', color: 'gold' },
        { name: 'जीवन', slug: 'jeevan', icon: '🌿', sampleLine: 'हम यहाँ तक अचानक नहीं आये हैं', color: 'muted' },
        { name: 'दर्शन', slug: 'darshan', icon: '✨', sampleLine: 'कुछ शब्द सिर्फ़ कहे नहीं जाते...', color: 'primary' },
      ],
    },
  },
  words: {
    title: 'Words Section',
    content: {
      featuredPoemSlugs: ['bhav-sirf-ram-hain', 'ham-yahan-tak', 'tum-itne-pyare-the'],
    },
  },
  connection: {
    title: 'Connection Section',
    content: {
      email: 'info@amanakshar.com',
      poetName: 'अमन अक्षर',
      socialLinks: [
        { platform: 'youtube', url: 'https://youtube.com/@amanakshar' },
        { platform: 'instagram', url: 'https://instagram.com/amanakshar' },
        { platform: 'facebook', url: 'https://facebook.com/amanakshar' },
      ],
    },
  },
}

// Get all homepage sections
export async function getHomepageSections() {
  try {
    const sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })
    return sections
  } catch {
    // Return empty array if database not available
    return []
  }
}

// Get a specific section
export async function getHomepageSection(sectionKey: SectionKey) {
  try {
    const section = await prisma.homepageSection.findUnique({
      where: { sectionKey },
    })
    
    if (!section) {
      // Return default content if not in database
      const defaultSection = defaultSections[sectionKey]
      return {
        sectionKey,
        content: defaultSection.content,
        title: defaultSection.title,
        isActive: true,
      }
    }
    
    return section
  } catch {
    // Return default if database error
    const defaultSection = defaultSections[sectionKey]
    return {
      sectionKey,
      content: defaultSection.content,
      title: defaultSection.title,
      isActive: true,
    }
  }
}

// Update a section
export async function updateHomepageSection(
  sectionKey: SectionKey,
  data: {
    title?: string
    subtitle?: string
    content?: object
    imageUrl?: string
    isActive?: boolean
  }
) {
  return prisma.homepageSection.upsert({
    where: { sectionKey },
    update: data,
    create: {
      sectionKey,
      title: data.title || defaultSections[sectionKey].title,
      content: data.content || defaultSections[sectionKey].content,
      ...data,
    },
  })
}

// Initialize all sections with defaults
export async function initializeHomepageSections() {
  const sections = Object.entries(defaultSections).map(([key, value], index) => ({
    sectionKey: key,
    title: value.title,
    content: value.content,
    displayOrder: index,
    isActive: true,
  }))
  
  for (const section of sections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: section.sectionKey },
      update: {},
      create: section,
    })
  }
}
