'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    email_service: initialSettings['email_service'] || 'resend',
    email_from: initialSettings['email_from'] || '',
    email_to: initialSettings['email_to'] || '',
    smtp_host: initialSettings['smtp_host'] || '',
    smtp_port: initialSettings['smtp_port'] || '587',
    smtp_user: initialSettings['smtp_user'] || '',
    smtp_password: initialSettings['smtp_password'] || '',
    resend_api_key: initialSettings['resend_api_key'] || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.refresh()
        alert('Settings saved successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Error saving settings')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving settings')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTestEmail = async () => {
    setIsSubmitting(true)
    setTestResult(null)

    try {
      // First save settings
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Then test email
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
      })

      const result = await response.json()
      setTestResult({
        success: result.success,
        message: result.message || (result.success ? 'Test email sent successfully!' : 'Failed to send test email'),
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error testing email',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="email_service" className="block font-ui text-text-secondary text-sm mb-2">
          ईमेल सेवा *
        </label>
        <select
          id="email_service"
          name="email_service"
          required
          value={formData.email_service}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
        >
          <option value="resend">Resend</option>
          <option value="smtp">SMTP</option>
        </select>
      </div>

      <div>
        <label htmlFor="email_from" className="block font-ui text-text-secondary text-sm mb-2">
          भेजने वाला ईमेल *
        </label>
        <input
          type="email"
          id="email_from"
          name="email_from"
          required
          value={formData.email_from}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="noreply@amanakshar.com"
        />
      </div>

      <div>
        <label htmlFor="email_to" className="block font-ui text-text-secondary text-sm mb-2">
          प्राप्त करने वाला ईमेल *
        </label>
        <input
          type="email"
          id="email_to"
          name="email_to"
          required
          value={formData.email_to}
          onChange={handleChange}
          className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
          placeholder="your@email.com"
        />
        <p className="font-ui text-text-muted text-xs mt-1">
          यहाँ सभी पूछताछ ईमेल भेजे जाएंगे
        </p>
      </div>

      {formData.email_service === 'resend' ? (
        <div>
          <label htmlFor="resend_api_key" className="block font-ui text-text-secondary text-sm mb-2">
            Resend API Key *
          </label>
          <input
            type="password"
            id="resend_api_key"
            name="resend_api_key"
            required={formData.email_service === 'resend'}
            value={formData.resend_api_key}
            onChange={handleChange}
            className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
            placeholder="re_..."
          />
          <p className="font-ui text-text-muted text-xs mt-1">
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-gold hover:underline"
            >
              Resend से API key प्राप्त करें
            </a>
          </p>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="smtp_host" className="block font-ui text-text-secondary text-sm mb-2">
              SMTP Host *
            </label>
            <input
              type="text"
              id="smtp_host"
              name="smtp_host"
              required={formData.email_service === 'smtp'}
              value={formData.smtp_host}
              onChange={handleChange}
              className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label htmlFor="smtp_port" className="block font-ui text-text-secondary text-sm mb-2">
              SMTP Port *
            </label>
            <input
              type="number"
              id="smtp_port"
              name="smtp_port"
              required={formData.email_service === 'smtp'}
              value={formData.smtp_port}
              onChange={handleChange}
              className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
              placeholder="587"
            />
          </div>

          <div>
            <label htmlFor="smtp_user" className="block font-ui text-text-secondary text-sm mb-2">
              SMTP User *
            </label>
            <input
              type="text"
              id="smtp_user"
              name="smtp_user"
              required={formData.email_service === 'smtp'}
              value={formData.smtp_user}
              onChange={handleChange}
              className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="smtp_password" className="block font-ui text-text-secondary text-sm mb-2">
              SMTP Password *
            </label>
            <input
              type="password"
              id="smtp_password"
              name="smtp_password"
              required={formData.email_service === 'smtp'}
              value={formData.smtp_password}
              onChange={handleChange}
              className="w-full bg-transparent border border-divider-strong rounded-sm p-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold"
            />
          </div>
        </>
      )}

      {testResult && (
        <div className={`p-4 rounded-sm ${
          testResult.success
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <p className="font-ui text-sm">{testResult.message}</p>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-accent-gold text-bg-primary font-ui rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'सहेजा जा रहा है...' : 'सहेजें'}
        </button>
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={isSubmitting}
          className="px-6 py-3 border border-divider-strong text-text-primary font-ui rounded-sm hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          टेस्ट ईमेल भेजें
        </button>
      </div>
    </form>
  )
}
