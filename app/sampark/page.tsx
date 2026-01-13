'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionSpacing } from '@/components/ui/SectionSpacing'
import { Divider } from '@/components/ui/Divider'
import { TextButton } from '@/components/ui/TextButton'

const eventTypes = [
  'कवि-सम्मेलन',
  'सांस्कृतिक कार्यक्रम',
  'विशेष आयोजन',
  'निजी कार्यक्रम',
  'अन्य',
]

export default function SamparkPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <PageContainer>
          <SectionSpacing size="xl">
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
                धन्यवाद
              </h1>
              <p className="font-ui text-text-secondary mb-8">
                आपका संदेश प्राप्त हो गया है। जल्द ही संपर्क किया जाएगा।
              </p>
              <TextButton onClick={() => setIsSubmitted(false)}>
                नया संदेश भेजें
              </TextButton>
            </motion.div>
          </SectionSpacing>
        </PageContainer>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen">
      <PageContainer>
        <SectionSpacing size="lg">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl text-text-primary mb-4">
              आमंत्रण / संपर्क
            </h1>
            <p className="font-ui text-text-secondary">
              कवि-सम्मेलन या किसी विशेष आयोजन के लिए आमंत्रित करें
            </p>
          </header>
          
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-ui text-text-secondary text-sm mb-2">
                  नाम *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="आपका नाम"
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-ui text-text-secondary text-sm mb-2">
                  ईमेल *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-ui text-text-secondary text-sm mb-2">
                  फ़ोन नंबर
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              
              {/* Event Type */}
              <div>
                <label htmlFor="eventType" className="block font-ui text-text-secondary text-sm mb-2">
                  आयोजन का प्रकार
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors cursor-pointer"
                >
                  <option value="" className="bg-bg-primary">चुनें...</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type} className="bg-bg-primary">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block font-ui text-text-secondary text-sm mb-2">
                  संदेश *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-divider-strong rounded-sm p-3 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  placeholder="आयोजन की जानकारी, तिथि, स्थान आदि..."
                />
              </div>
              
              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 font-ui text-text-primary border border-divider-strong rounded-sm hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'भेजा जा रहा है...' : 'संदेश भेजें'}
                </button>
              </div>
            </div>
          </form>
          
          <Divider />
          
          {/* Contact Info */}
          <div className="text-center space-y-4">
            <h2 className="font-heading text-xl text-text-primary">
              सीधे संपर्क करें
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-ui text-text-secondary">
              <a 
                href="mailto:info@amanakshar.com" 
                className="hover:text-text-primary transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@amanakshar.com
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <a
                href="https://instagram.com/amanakshar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              
              <a
                href="https://youtube.com/@amanakshar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              
              <a
                href="https://facebook.com/amanakshar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </SectionSpacing>
      </PageContainer>
    </main>
  )
}

