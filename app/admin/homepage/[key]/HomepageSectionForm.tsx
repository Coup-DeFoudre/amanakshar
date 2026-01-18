'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type SectionKey } from '@/lib/homepage'

interface HomepageSectionFormProps {
  sectionKey: SectionKey
  initialData: {
    sectionKey: string
    title: string
    content: Record<string, unknown>
    isActive: boolean
  }
}

export function HomepageSectionForm({ sectionKey, initialData }: HomepageSectionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [title, setTitle] = useState(initialData.title)
  const [isActive, setIsActive] = useState(initialData.isActive)
  const [contentJson, setContentJson] = useState(JSON.stringify(initialData.content, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleContentChange = (value: string) => {
    setContentJson(value)
    try {
      JSON.parse(value)
      setJsonError(null)
    } catch {
      setJsonError('Invalid JSON format')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (jsonError) {
      setSaveMessage({ type: 'error', text: 'Please fix JSON errors before saving' })
      return
    }

    setIsSubmitting(true)
    setSaveMessage(null)

    try {
      const content = JSON.parse(contentJson)
      
      const response = await fetch(`/api/admin/homepage/${sectionKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          isActive,
        }),
      })

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'सफलतापूर्वक सहेजा गया!' })
        router.refresh()
      } else {
        const error = await response.json()
        setSaveMessage({ type: 'error', text: error.error || 'Failed to save' })
      }
    } catch (error) {
      console.error('Error saving section:', error)
      setSaveMessage({ type: 'error', text: 'Error saving section' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setTitle(initialData.title)
    setIsActive(initialData.isActive)
    setContentJson(JSON.stringify(initialData.content, null, 2))
    setJsonError(null)
    setSaveMessage(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title field */}
      <div>
        <label htmlFor="title" className="block font-ui text-text-secondary text-sm mb-2">
          शीर्षक
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="Section title"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-divider-strong peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-text-muted after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold peer-checked:after:bg-bg-primary"></div>
        </label>
        <span className="font-ui text-text-secondary text-sm">
          {isActive ? 'सक्रिय' : 'निष्क्रिय'}
        </span>
      </div>

      {/* Content JSON editor */}
      <div>
        <label htmlFor="content" className="block font-ui text-text-secondary text-sm mb-2">
          सामग्री (JSON)
        </label>
        <textarea
          id="content"
          value={contentJson}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={15}
          className={`w-full bg-bg-primary border rounded-sm p-4 font-mono text-sm text-text-primary focus:outline-none transition-colors ${
            jsonError 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-divider-strong focus:border-accent-gold'
          }`}
          spellCheck={false}
        />
        {jsonError && (
          <p className="font-ui text-red-400 text-xs mt-1">{jsonError}</p>
        )}
        <p className="font-ui text-text-muted text-xs mt-1">
          सामग्री को JSON फ़ॉर्मेट में संपादित करें
        </p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div className={`p-4 rounded-sm ${
          saveMessage.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <p className="font-ui text-sm">{saveMessage.text}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-divider">
        <div className="flex gap-3">
          <Link
            href="/admin/homepage"
            className="px-4 py-2 font-ui text-text-muted hover:text-text-primary transition-colors"
          >
            रद्द करें
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 font-ui text-text-secondary hover:text-text-primary transition-colors"
          >
            रीसेट करें
          </button>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !!jsonError}
          className="px-6 py-2 font-ui bg-accent-gold text-bg-primary rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'सहेजा जा रहा है...' : 'सहेजें'}
        </button>
      </div>
    </form>
  )
}
