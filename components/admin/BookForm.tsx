'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploadField } from './ImageUploadField'

interface Book {
  id: string
  title: string
  slug: string
  description: string | null
  year: number | null
  purchaseUrl: string | null
  coverImageUrl?: string | null
  isFeatured: boolean
  isPublished: boolean
}

interface BookFormProps {
  book?: Book
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

export function BookForm({ book }: BookFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(book?.coverImageUrl || null)
  const [formData, setFormData] = useState({
    title: book?.title || '',
    slug: book?.slug || '',
    description: book?.description || '',
    year: book?.year?.toString() || '',
    purchaseUrl: book?.purchaseUrl || '',
    coverImageUrl: book?.coverImageUrl || '',
    isFeatured: book?.isFeatured || false,
    isPublished: book?.isPublished || false,
  })

  // Auto-generate slug when title changes (only for new books)
  useEffect(() => {
    if (!book && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.title),
      }))
    }
  }, [formData.title, book, formData.slug])

  const handleImageChange = (value: string | null, file?: File) => {
    setImagePreview(value)
    if (file) {
      setImageFile(file)
      setFormData(prev => ({ ...prev, coverImageUrl: '' }))
    } else {
      setImageFile(null)
      setFormData(prev => ({ ...prev, coverImageUrl: value || '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = book ? `/api/admin/books/${book.id}` : '/api/admin/books'
      const method = book ? 'PUT' : 'POST'

      // Prepare the data to send
      const dataToSend = {
        ...formData,
        // If we have a file, include the base64 data
        coverImageData: imageFile ? imagePreview : undefined,
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
        router.push('/admin/books')
        router.refresh()
      } else {
        setError(data.error || 'पुस्तक सहेजने में त्रुटि')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('पुस्तक सहेजने में त्रुटि')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
          placeholder="पुस्तक का शीर्षक"
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
          placeholder="pustak-ka-slug"
        />
        <p className="font-ui text-text-muted text-xs mt-1">
          URL में उपयोग होगा: /pustak/{formData.slug || 'slug'}
        </p>
      </div>

      {/* Cover Image Upload */}
      <ImageUploadField
        label="पुस्तक का आवरण (Cover Image)"
        value={formData.coverImageUrl}
        onChange={handleImageChange}
        preview={imagePreview}
        accept=".jpg,.jpeg,.png,.webp"
        maxSize={5}
        helperText="अनुशंसित आकार: 400×600 पिक्सेल (3:4 अनुपात)"
        aspectRatio="portrait"
      />

      <div>
        <label htmlFor="description" className="block font-ui text-text-secondary text-sm mb-2">
          विवरण
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold resize-none"
          placeholder="पुस्तक का विवरण..."
        />
      </div>

      <div>
        <label htmlFor="year" className="block font-ui text-text-secondary text-sm mb-2">
          प्रकाशन वर्ष
        </label>
        <input
          type="number"
          id="year"
          name="year"
          min="1900"
          max="2100"
          value={formData.year}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="2024"
        />
      </div>

      <div>
        <label htmlFor="purchaseUrl" className="block font-ui text-text-secondary text-sm mb-2">
          खरीद लिंक (URL)
        </label>
        <input
          type="url"
          id="purchaseUrl"
          name="purchaseUrl"
          value={formData.purchaseUrl}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="https://amazon.in/..."
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
