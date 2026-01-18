'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploadField } from './ImageUploadField'
import { extractYouTubeId, getYouTubeThumbnail } from '@/lib/utils'

interface Bhav {
  id: string
  name: string
  slug: string
}

interface PerformanceWithBhavs {
  id: string
  title: string
  slug: string
  context: string | null
  youtubeUrl: string
  thumbnailUrl?: string | null
  type: string
  isFeatured: boolean
  isPublished: boolean
  bhavs: Array<{ bhav: Bhav }>
}

interface PerformanceFormProps {
  performance?: PerformanceWithBhavs
  bhavs?: Bhav[]
}

const performanceTypes = [
  'कवि-सम्मेलन',
  'भक्ति',
  'विशेष प्रस्तुति',
  'मुशायरा',
  'अन्य',
]

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
}

export function PerformanceForm({ performance, bhavs = [] }: PerformanceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(performance?.thumbnailUrl || null)
  const [useCustomThumbnail, setUseCustomThumbnail] = useState(!!performance?.thumbnailUrl)
  const [formData, setFormData] = useState({
    title: performance?.title || '',
    slug: performance?.slug || '',
    context: performance?.context || '',
    youtubeUrl: performance?.youtubeUrl || '',
    thumbnailUrl: performance?.thumbnailUrl || '',
    type: performance?.type || 'कवि-सम्मेलन',
    isFeatured: performance?.isFeatured || false,
    isPublished: performance?.isPublished || false,
    bhavIds: performance?.bhavs?.map(b => b.bhav.id) || [],
  })

  // Auto-generate slug when title changes (only for new performances)
  useEffect(() => {
    if (!performance && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title),
      }))
    }
  }, [formData.title, performance, formData.slug])

  // Auto-fetch YouTube thumbnail when URL changes
  const fetchYouTubeThumbnail = useCallback((url: string) => {
    if (!useCustomThumbnail && url) {
      const thumbnail = getYouTubeThumbnail(url, 'hq')
      if (thumbnail) {
        setThumbnailPreview(thumbnail)
        setFormData(prev => ({ ...prev, thumbnailUrl: thumbnail }))
      }
    }
  }, [useCustomThumbnail])

  useEffect(() => {
    fetchYouTubeThumbnail(formData.youtubeUrl)
  }, [formData.youtubeUrl, fetchYouTubeThumbnail])

  const handleThumbnailChange = (value: string | null, file?: File) => {
    setThumbnailPreview(value)
    if (file) {
      setThumbnailFile(file)
      setUseCustomThumbnail(true)
      setFormData(prev => ({ ...prev, thumbnailUrl: '' }))
    } else {
      setThumbnailFile(null)
      setFormData(prev => ({ ...prev, thumbnailUrl: value || '' }))
    }
  }

  const handleUseYouTubeThumbnail = () => {
    setUseCustomThumbnail(false)
    setThumbnailFile(null)
    fetchYouTubeThumbnail(formData.youtubeUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = performance ? `/api/admin/performances/${performance.id}` : '/api/admin/performances'
      const method = performance ? 'PUT' : 'POST'

      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // If we have a custom thumbnail file, include the base64 data
        thumbnailData: thumbnailFile ? thumbnailPreview : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/performances')
        router.refresh()
      } else {
        setError(data.error || 'प्रस्तुति सहेजने में त्रुटि')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('प्रस्तुति सहेजने में त्रुटि')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleBhavToggle = (bhavId: string) => {
    setFormData(prev => ({
      ...prev,
      bhavIds: prev.bhavIds.includes(bhavId)
        ? prev.bhavIds.filter(id => id !== bhavId)
        : [...prev.bhavIds, bhavId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-sm">
          <p className="font-ui text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-ui text-text-secondary text-sm mb-2">
          शीर्षक *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="प्रस्तुति का शीर्षक"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block font-ui text-text-secondary text-sm mb-2">
          स्लग *
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          required
          value={formData.slug}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="prastuti-ka-slug"
        />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="block font-ui text-text-secondary text-sm mb-2">
          YouTube URL *
        </label>
        <input
          type="url"
          id="youtubeUrl"
          name="youtubeUrl"
          required
          value={formData.youtubeUrl}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div>
        <label htmlFor="type" className="block font-ui text-text-secondary text-sm mb-2">
          प्रकार
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full bg-bg-primary border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
        >
          {performanceTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Thumbnail Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-ui text-text-secondary text-sm">
            थंबनेल छवि (Thumbnail)
          </label>
          {formData.youtubeUrl && extractYouTubeId(formData.youtubeUrl) && (
            <button
              type="button"
              onClick={handleUseYouTubeThumbnail}
              className="font-ui text-xs text-accent-gold hover:text-accent-warm transition-colors"
            >
              YouTube थंबनेल उपयोग करें
            </button>
          )}
        </div>
        
        <ImageUploadField
          label=""
          value={formData.thumbnailUrl}
          onChange={handleThumbnailChange}
          preview={thumbnailPreview}
          accept=".jpg,.jpeg,.png,.webp"
          maxSize={5}
          helperText={useCustomThumbnail 
            ? "कस्टम थंबनेल अपलोड करें" 
            : "YouTube से स्वचालित थंबनेल या कस्टम अपलोड करें"
          }
          aspectRatio="video"
        />
      </div>

      <div>
        <label htmlFor="context" className="block font-ui text-text-secondary text-sm mb-2">
          संदर्भ / विवरण
        </label>
        <textarea
          id="context"
          name="context"
          rows={3}
          value={formData.context}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold resize-none"
          placeholder="इंदौर कवि सम्मेलन, 2024..."
        />
      </div>

      {/* Bhav Selection */}
      {bhavs.length > 0 && (
        <div>
          <label className="block font-ui text-text-secondary text-sm mb-2">
            भाव (विषय)
          </label>
          <div className="flex flex-wrap gap-2">
            {bhavs.map(bhav => (
              <button
                key={bhav.id}
                type="button"
                onClick={() => handleBhavToggle(bhav.id)}
                className={`px-3 py-1 rounded-sm font-ui text-sm transition-colors ${
                  formData.bhavIds.includes(bhav.id)
                    ? 'bg-accent-gold text-bg-primary'
                    : 'border border-divider-strong text-text-secondary hover:border-accent-gold'
                }`}
              >
                {bhav.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="font-ui text-text-secondary">विशेष (Featured)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="font-ui text-text-secondary">प्रकाशित</span>
        </label>
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'सहेजा जा रहा है...' : 'सहेजें'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-divider-strong text-text-secondary font-ui rounded-sm hover:border-text-secondary transition-colors"
        >
          रद्द करें
        </button>
      </div>
    </form>
  )
}
