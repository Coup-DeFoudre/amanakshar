'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })
      
      if (result?.error) {
        setError('गलत उपयोगकर्ता नाम या पासवर्ड')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('कुछ गलत हो गया')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl text-text-primary text-center mb-8">
          प्रबंधक लॉगिन
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-center font-ui text-sm bg-red-400/10 py-2 rounded">
              {error}
            </p>
          )}
          
          <div>
            <label htmlFor="username" className="block font-ui text-text-secondary text-sm mb-2">
              उपयोगकर्ता नाम
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block font-ui text-text-secondary text-sm mb-2">
              पासवर्ड
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-divider-strong py-2 font-ui text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 font-ui text-text-primary border border-divider-strong rounded-sm hover:bg-bg-secondary transition-colors disabled:opacity-50"
          >
            {isLoading ? 'प्रवेश हो रहा है...' : 'प्रवेश करें'}
          </button>
        </form>
      </div>
    </main>
  )
}
