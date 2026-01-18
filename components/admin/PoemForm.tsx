'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Bhav {
  id: string
  name: string
  slug: string
}

interface PoemWithBhavs {
  id: string
  title: string
  slug: string
  text: string
  poetName: string
  writtenDate: string | null
  firstPerformanceYear: number | null
  firstPerformancePlace: string | null
  youtubeUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  bhavs: Array<{ bhav: Bhav }>
}

interface PoemFormProps {
  poem?: PoemWithBhavs
  bhavs?: Bhav[]
}

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

export function PoemForm({ poem, bhavs = [] }: PoemFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: poem?.title || '',
    slug: poem?.slug || '',
    text: poem?.text || '',
    poetName: poem?.poetName || 'अमन अक्षर',
    writtenDate: poem?.writtenDate ? new Date(poem.writtenDate).toISOString().split('T')[0] : '',
    firstPerformanceYear: poem?.firstPerformanceYear?.toString() || '',
    firstPerformancePlace: poem?.firstPerformancePlace || '',
    youtubeUrl: poem?.youtubeUrl || '',
    isFeatured: poem?.isFeatured || false,
    isPublished: poem?.isPublished || false,
    bhavIds: poem?.bhavs?.map(b => b.bhav.id) || [],
  })

  // Auto-generate slug when title changes (only for new poems)
  useEffect(() => {
    if (!poem && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title),
      }))
    }
  }, [formData.title, poem, formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = poem ? `/api/admin/poems/${poem.id}` : '/api/admin/poems'
      const method = poem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          writtenDate: formData.writtenDate || null,
          firstPerformanceYear: formData.firstPerformanceYear || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/poems')
        router.refresh()
      } else {
        setError(data.error || 'कविता सहेजने में त्रुटि')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('कविता सहेजने में त्रुटि')
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
          placeholder="कविता का शीर्षक"
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
          placeholder="kavita-ka-slug"
        />
        <p className="font-ui text-text-muted text-xs mt-1">
          URL में उपयोग होगा: /kavita/{formData.slug || 'slug'}
        </p>
      </div>

      <div>
        <label htmlFor="text" className="block font-ui text-text-secondary text-sm mb-2">
          कविता का पाठ *
        </label>
        <textarea
          id="text"
          name="text"
          rows={12}
          required
          value={formData.text}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-poem text-text-primary focus:outline-none focus:border-accent-gold resize-none leading-relaxed"
          placeholder="यहाँ कविता लिखें..."
        />
      </div>

      <div>
        <label htmlFor="poetName" className="block font-ui text-text-secondary text-sm mb-2">
          कवि का नाम
        </label>
        <input
          type="text"
          id="poetName"
          name="poetName"
          value={formData.poetName}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="writtenDate" className="block font-ui text-text-secondary text-sm mb-2">
            लिखने की तिथि
          </label>
          <input
            type="date"
            id="writtenDate"
            name="writtenDate"
            value={formData.writtenDate}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          />
        </div>

        <div>
          <label htmlFor="firstPerformanceYear" className="block font-ui text-text-secondary text-sm mb-2">
            प्रथम प्रस्तुति वर्ष
          </label>
          <input
            type="number"
            id="firstPerformanceYear"
            name="firstPerformanceYear"
            min="1900"
            max="2100"
            value={formData.firstPerformanceYear}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
            placeholder="2024"
          />
        </div>
      </div>

      <div>
        <label htmlFor="firstPerformancePlace" className="block font-ui text-text-secondary text-sm mb-2">
          प्रथम प्रस्तुति स्थान
        </label>
        <input
          type="text"
          id="firstPerformancePlace"
          name="firstPerformancePlace"
          value={formData.firstPerformancePlace}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="इंदौर"
        />
      </div>

      <div>
        <label htmlFor="youtubeUrl" className="block font-ui text-text-secondary text-sm mb-2">
          YouTube URL
        </label>
        <input
          type="url"
          id="youtubeUrl"
          name="youtubeUrl"
          value={formData.youtubeUrl}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

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
