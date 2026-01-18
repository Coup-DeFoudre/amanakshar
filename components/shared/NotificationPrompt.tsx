'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function NotificationPrompt() {
  const pathname = usePathname()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])
  
  // Hide on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const subscribeToNotifications = async () => {
    if (!isSupported) return

    setIsSubscribing(true)

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // Request notification permission
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission !== 'granted') {
        alert('Notification permission denied')
        setIsSubscribing(false)
        return
      }

      // Get subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ) as BufferSource,
      })

      // Send subscription to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(subscription.getKey('auth')!),
          },
        }),
      })

      if (response.ok) {
        alert('Notifications enabled successfully!')
      } else {
        alert('Failed to enable notifications')
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      alert('Error enabling notifications')
    } finally {
      setIsSubscribing(false)
    }
  }

  if (!isSupported) {
    return null
  }

  if (permission === 'granted') {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-bg-secondary border border-divider rounded-sm shadow-lg max-w-sm z-50">
        <p className="font-ui text-text-secondary text-sm">
          ✅ Notifications enabled
        </p>
      </div>
    )
  }

  if (permission === 'denied') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-bg-secondary border border-divider rounded-sm shadow-lg max-w-sm z-50">
      <p className="font-ui text-text-primary text-sm mb-3">
        नई कविताओं और आयोजनों की सूचना प्राप्त करें
      </p>
      <button
        onClick={subscribeToNotifications}
        disabled={isSubscribing}
        className="w-full px-4 py-2 bg-accent-gold text-bg-primary font-ui text-sm rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubscribing ? 'सक्षम किया जा रहा है...' : 'सूचनाएं सक्षम करें'}
      </button>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
