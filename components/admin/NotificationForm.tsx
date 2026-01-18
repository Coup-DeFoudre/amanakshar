'use client'

import { useState } from 'react'

export function NotificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Notification sent to ${result.recipientCount} recipients!`)
        setFormData({ title: '', body: '' })
      } else {
        alert(result.error || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error sending notification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
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
          placeholder="नई कविता प्रकाशित"
        />
      </div>

      <div>
        <label htmlFor="body" className="block font-ui text-text-secondary text-sm mb-2">
          संदेश *
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          value={formData.body}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold resize-none"
          placeholder="नई कविता देखने के लिए वेबसाइट पर जाएं"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'भेजा जा रहा है...' : 'सूचना भेजें'}
        </button>
      </div>
    </form>
  )
}
