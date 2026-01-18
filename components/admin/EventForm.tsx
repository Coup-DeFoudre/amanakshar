'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'
import { ImageUploadField } from './ImageUploadField'

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null)
  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    description: event?.description || '',
    eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
    eventTime: event?.eventTime || '',
    venue: event?.venue || '',
    venueAddress: event?.venueAddress || '',
    city: event?.city || '',
    state: event?.state || '',
    isLive: event?.isLive || false,
    isPublished: event?.isPublished || false,
    isPaid: event?.isPaid || false,
    price: event?.price?.toString() || '',
    imageUrl: event?.imageUrl || '',
    ticketUrl: event?.ticketUrl || '',
  })

  const handleImageChange = (value: string | null, file?: File) => {
    setImagePreview(value)
    if (file) {
      setImageFile(file)
      setFormData(prev => ({ ...prev, imageUrl: '' }))
    } else {
      setImageFile(null)
      setFormData(prev => ({ ...prev, imageUrl: value || '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = event ? `/api/admin/events/${event.id}` : '/api/admin/events'
      const method = event ? 'PUT' : 'POST'

      // Prepare the data to send
      const dataToSend = {
        ...formData,
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
        price: formData.isPaid && formData.price ? parseFloat(formData.price) : null,
        // If we have a file, include the base64 data
        imageData: imageFile ? imagePreview : undefined,
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
        router.push('/admin/events')
        router.refresh()
      } else {
        setError(data.error || 'कार्यक्रम सहेजने में त्रुटि')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('कार्यक्रम सहेजने में त्रुटि')
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
          placeholder="event-slug"
        />
      </div>

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
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventDate" className="block font-ui text-text-secondary text-sm mb-2">
            तिथि *
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            required
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          />
        </div>

        <div>
          <label htmlFor="eventTime" className="block font-ui text-text-secondary text-sm mb-2">
            समय
          </label>
          <input
            type="text"
            id="eventTime"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
            placeholder="7:00 PM"
          />
        </div>
      </div>

      <div>
        <label htmlFor="venue" className="block font-ui text-text-secondary text-sm mb-2">
          स्थान
        </label>
        <input
          type="text"
          id="venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
        />
      </div>

      <div>
        <label htmlFor="venueAddress" className="block font-ui text-text-secondary text-sm mb-2">
          पता
        </label>
        <textarea
          id="venueAddress"
          name="venueAddress"
          rows={2}
          value={formData.venueAddress}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block font-ui text-text-secondary text-sm mb-2">
            शहर
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          />
        </div>

        <div>
          <label htmlFor="state" className="block font-ui text-text-secondary text-sm mb-2">
            राज्य
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          />
        </div>
      </div>

      {/* Event Image Upload */}
      <ImageUploadField
        label="कार्यक्रम की छवि (Event Image)"
        value={formData.imageUrl}
        onChange={handleImageChange}
        preview={imagePreview}
        accept=".jpg,.jpeg,.png,.webp"
        maxSize={5}
        helperText="अनुशंसित आकार: 1200×630 पिक्सेल (लैंडस्केप)"
        aspectRatio="landscape"
      />

      <div>
        <label htmlFor="ticketUrl" className="block font-ui text-text-secondary text-sm mb-2">
          टिकट URL
        </label>
        <input
          type="url"
          id="ticketUrl"
          name="ticketUrl"
          value={formData.ticketUrl}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="font-ui text-text-secondary">भुगतान आयोजन</span>
        </label>
        {formData.isPaid && (
          <div>
            <label htmlFor="price" className="block font-ui text-text-secondary text-sm mb-2">
              मूल्य (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required={formData.isPaid}
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
              placeholder="0.00"
            />
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isLive"
            checked={formData.isLive}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="font-ui text-text-secondary">लाइव</span>
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
