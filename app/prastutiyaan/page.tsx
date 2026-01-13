'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { YouTubeEmbed } from '@/components/ui/YouTubeEmbed'
import { Divider } from '@/components/ui/Divider'

// Static data - will be replaced with DB queries
const staticPerformances = [
  {
    id: '1',
    title: 'कुछ शब्द सिर्फ़ कहे जाते',
    slug: 'kuch-shabd-sirf-kahe-jaate',
    context: 'इंदौर कवि सम्मेलन, 2023 में प्रस्तुत।',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'कवि-सम्मेलन',
    bhavs: ['प्रेम'],
  },
  {
    id: '2',
    title: 'भक्ति रस की प्रस्तुति',
    slug: 'bhakti-ras-ki-prastuti',
    context: 'उज्जैन महाकाल मंदिर, विशेष भक्ति संध्या।',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'भक्ति',
    bhavs: ['भक्ति'],
  },
  {
    id: '3',
    title: 'जीवन के रंग',
    slug: 'jeevan-ke-rang',
    context: 'भोपाल साहित्य उत्सव, 2023।',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'विशेष प्रस्तुति',
    bhavs: ['जीवन'],
  },
]

const performanceTypes = ['सभी', 'कवि-सम्मेलन', 'विशेष प्रस्तुति', 'भक्ति']
const bhavs = [
  { name: 'प्रेम', slug: 'prem' },
  { name: 'भक्ति', slug: 'bhakti' },
  { name: 'जीवन', slug: 'jeevan' },
  { name: 'दर्शन', slug: 'darshan' },
]

export default function PrastutiyaanPage() {
  const [selectedType, setSelectedType] = useState('सभी')
  const [selectedBhav, setSelectedBhav] = useState<string | null>(null)
  
  const filteredPerformances = staticPerformances.filter(p => {
    if (selectedType !== 'सभी' && p.type !== selectedType) return false
    if (selectedBhav && !p.bhavs.includes(selectedBhav)) return false
    return true
  })
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Page Title */}
          <header className="text-center mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
              प्रस्तुतियाँ
            </h1>
            <p className="font-ui text-text-secondary">
              कवि-सम्मेलनों और विशेष आयोजनों की प्रस्तुतियाँ
            </p>
          </header>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* Type Filter */}
            <div className="flex flex-wrap items-center gap-2 font-ui text-sm">
              <span className="text-text-muted">प्रकार:</span>
              {performanceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2 py-1 transition-colors ${
                    selectedType === type 
                      ? 'text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {/* Bhav Filter */}
            <div className="flex flex-wrap items-center gap-2 font-ui text-sm">
              <span className="text-text-muted">भाव:</span>
              <button
                onClick={() => setSelectedBhav(null)}
                className={`px-2 py-1 transition-colors ${
                  !selectedBhav ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                सभी
              </button>
              {bhavs.map((bhav) => (
                <button
                  key={bhav.slug}
                  onClick={() => setSelectedBhav(bhav.name)}
                  className={`px-2 py-1 transition-colors ${
                    selectedBhav === bhav.name 
                      ? 'text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {bhav.name}
                </button>
              ))}
            </div>
          </div>
          
          <Divider />
          
          {/* Performances List */}
          <div className="space-y-12">
            {filteredPerformances.length === 0 ? (
              <p className="text-center text-text-muted font-ui py-12">
                इस श्रेणी में कोई प्रस्तुति नहीं मिली
              </p>
            ) : (
              filteredPerformances.map((performance, index) => (
                <motion.article
                  key={performance.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h2 className="font-heading text-2xl text-text-primary mb-2">
                    {performance.title}
                  </h2>
                  
                  <p className="font-ui text-text-secondary text-sm mb-4">
                    {performance.context}
                  </p>
                  
                  <YouTubeEmbed 
                    url={performance.youtubeUrl} 
                    title={performance.title} 
                  />
                  
                  <div className="mt-4 flex flex-wrap gap-3 font-ui text-xs text-text-muted">
                    <span>प्रकार: {performance.type}</span>
                    {performance.bhavs.map((bhav) => (
                      <span key={bhav}>भाव: {bhav}</span>
                    ))}
                  </div>
                  
                  {index < filteredPerformances.length - 1 && (
                    <Divider />
                  )}
                </motion.article>
              ))
            )}
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

