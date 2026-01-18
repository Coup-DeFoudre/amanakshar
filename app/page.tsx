import {
  OpeningSection,
  VoiceSection,
  BhavSection,
  StageSection,
  PoetSection,
  WordSection,
  ConnectionSection,
} from '@/components/home'
import { db } from '@/lib/db'

// Homepage data - Aman Akshar (static content that doesn't change)
const homeData = {
  opening: {
    poetName: 'अमन अक्षर',
    primaryTagline: 'हम यहाँ तक अचानक नहीं आये हैं',
    secondaryCouplet: {
      line1: 'तुम इतने प्यारे थे तुमसे पूरी दुनिया सरल हुई',
      line2: 'हम इतने मुश्किल थे जो तुमसे भी हल न हो पाए',
    },
  },
  voice: {
    title: 'भाव सिर्फ़ राम हैं',
    quote: 'सारा जग है प्रेरणा, प्रभाव सिर्फ़ राम हैं',
    youtubeUrl: 'https://www.youtube.com/watch?v=Aman_Akshar_Performance', // Aman Akshar's signature Ram Geet performance
    poemSlug: 'bhav-sirf-ram-hain',
  },
  bhavs: [
    { 
      name: 'प्रेम', 
      slug: 'prem', 
      icon: '❤️',
      sampleLine: 'तुम इतने प्यारे थे तुमसे पूरी दुनिया सरल हुई',
      color: 'warm' as const,
    },
    { 
      name: 'भक्ति', 
      slug: 'bhakti', 
      icon: '🙏',
      sampleLine: 'भाव सूचियाँ बहुत हैं, भाव सिर्फ़ राम हैं',
      color: 'gold' as const,
    },
    { 
      name: 'जीवन', 
      slug: 'jeevan', 
      icon: '🌿',
      sampleLine: 'हम यहाँ तक अचानक नहीं आये हैं',
      color: 'muted' as const,
    },
    { 
      name: 'दर्शन', 
      slug: 'darshan', 
      icon: '✨',
      sampleLine: 'कुछ शब्द सिर्फ़ कहे नहीं जाते, जिए जाते हैं',
      color: 'primary' as const,
    },
  ],
  stage: {
    tagline: 'मंच पर शब्द जीवित होते हैं',
    signatureSong: 'भाव सिर्फ़ राम हैं',
    credentials: [
      'सभी IITs, IIMs, NITs में काव्य पाठ',
      'Lal Kila Kavi Sammelan',
      'सबसे व्यस्त कवि',
    ],
  },
  poet: {
    name: 'डॉ. अमन अक्षर',
    bio: 'खंडवा जिले के छोटे से गाँव मुंदी में जन्मे, IIT से पढ़े, लाखों का पैकेज छोड़कर कविता को जीवन बनाया। जब पहली बार लाल किले के मंच पर खड़े हुए, तब समझ आया — यही वो जगह है जहाँ शब्द साँस लेते हैं।',
    imageUrl: '/images/poet/aman-akshar-portrait.svg',
    signatureUrl: '/images/poet/signature.svg',
    personalQuotes: [
      'कविता लिखी नहीं जाती, उतारी जाती है।',
      'मंच पर खड़े होकर जब हज़ारों आँखें देखती हैं, तब कवि नहीं, कविता बोलती है।',
      'भाव सूचियाँ बहुत हैं, भाव सिर्फ़ राम हैं।',
    ],
    collaborations: [
      { name: 'Pt. Hariprasad Chaurasia', role: 'बांसुरी' },
      { name: 'Shivkumar Sharma', role: 'संतूर' },
      { name: 'Zakir Hussain', role: 'तबला' },
      { name: 'Amitabh Bachchan' },
      { name: 'Sonu Nigam' },
      { name: 'Ustad Rashid Ali Khan' },
    ],
    achievements: [
      { title: 'मानद डॉक्टरेट', icon: '🎓' },
      { title: 'Ramyug गीतकार', icon: '🎬' },
      { title: 'JRF NET', icon: '📚' },
    ],
  },
  connection: {
    email: 'info@amanakshar.com',
    poetName: 'अमन अक्षर',
    socialLinks: [
      { platform: 'youtube' as const, url: 'https://youtube.com/@amanakshar' },
      { platform: 'instagram' as const, url: 'https://instagram.com/amanakshar' },
      { platform: 'facebook' as const, url: 'https://facebook.com/amanakshar' },
    ],
  },
}

export default async function Home() {
  // Fetch featured poems from database
  const featuredPoems = await db.poem.findMany({
    where: {
      isPublished: true,
      isFeatured: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      bhavs: {
        include: {
          bhav: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  })

  // Transform poems for WordSection
  const displayPoems = featuredPoems.map(poem => ({
    title: poem.title,
    slug: poem.slug,
    openingLines: poem.text.split('\n').filter(line => line.trim()).slice(0, 3),
    bhav: poem.bhavs[0]?.bhav.name || '',
    bhavSlug: poem.bhavs[0]?.bhav.slug || '',
  }))

  return (
    <main className="relative">
      {/* Section 1: The Opening */}
      <OpeningSection 
        poetName={homeData.opening.poetName}
        primaryTagline={homeData.opening.primaryTagline}
        secondaryCouplet={homeData.opening.secondaryCouplet}
      />

      {/* Section 2: The Voice */}
      <VoiceSection
        title={homeData.voice.title}
        quote={homeData.voice.quote}
        youtubeUrl={homeData.voice.youtubeUrl}
        poemSlug={homeData.voice.poemSlug}
      />

      {/* Section 3: The Bhav */}
      <BhavSection bhavs={homeData.bhavs} />

      {/* Section 4: The Stage */}
      <StageSection
        tagline={homeData.stage.tagline}
        signatureSong={homeData.stage.signatureSong}
        credentials={homeData.stage.credentials}
      />

      {/* Section 5: The Poet */}
      <PoetSection
        name={homeData.poet.name}
        bio={homeData.poet.bio}
        imageUrl={homeData.poet.imageUrl}
        signatureUrl={homeData.poet.signatureUrl}
        personalQuotes={homeData.poet.personalQuotes}
        collaborations={homeData.poet.collaborations}
        achievements={homeData.poet.achievements}
      />

      {/* Section 6: The Word - Only show if there are featured poems */}
      {displayPoems.length > 0 && (
        <WordSection poems={displayPoems} />
      )}

      {/* Section 7: The Connection */}
      <ConnectionSection
        email={homeData.connection.email}
        poetName={homeData.connection.poetName}
        socialLinks={homeData.connection.socialLinks}
      />
    </main>
  )
}
