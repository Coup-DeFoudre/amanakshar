import {
  OpeningSection,
  VoiceSection,
  BhavSection,
  StageSection,
  PoetSection,
  WordSection,
  ConnectionSection,
} from '@/components/home'

// Homepage data - Aman Akshar
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
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with actual Ram Geet video
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
    bio: 'खंडवा के छोटे से गाँव मुंदी से निकलकर, बड़े पैकेज की नौकरी छोड़कर, शब्दों को मंच तक ले जाने वाले कवि। जो कहा नहीं जा सकता, वह कविता में उतरता है।',
    imageUrl: undefined, // Add poet image path when available
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
  featuredPoems: [
    {
      title: 'भाव सिर्फ़ राम हैं',
      slug: 'bhav-sirf-ram-hain',
      openingLines: [
        'सारा जग है प्रेरणा, प्रभाव सिर्फ़ राम हैं',
        'भाव सूचियाँ बहुत हैं, भाव सिर्फ़ राम हैं',
        'राम एक सत्य जिसका है प्रमाण जानकी',
      ],
      bhav: 'भक्ति',
      bhavSlug: 'bhakti',
    },
    {
      title: 'हम यहाँ तक',
      slug: 'ham-yahan-tak',
      openingLines: [
        'हम यहाँ तक अचानक नहीं आये हैं',
        'हर मोड़ पर कुछ खोकर आये हैं',
      ],
      bhav: 'जीवन',
      bhavSlug: 'jeevan',
    },
    {
      title: 'तुम इतने प्यारे थे',
      slug: 'tum-itne-pyare-the',
      openingLines: [
        'तुम इतने प्यारे थे तुमसे पूरी दुनिया सरल हुई',
        'हम इतने मुश्किल थे जो तुमसे भी हल न हो पाए',
      ],
      bhav: 'प्रेम',
      bhavSlug: 'prem',
    },
  ],
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

export default function Home() {
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
        collaborations={homeData.poet.collaborations}
        achievements={homeData.poet.achievements}
      />

      {/* Section 6: The Word */}
      <WordSection poems={homeData.featuredPoems} />

      {/* Section 7: The Connection */}
      <ConnectionSection
        email={homeData.connection.email}
        poetName={homeData.connection.poetName}
        socialLinks={homeData.connection.socialLinks}
      />
    </main>
  )
}
