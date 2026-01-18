// Service Worker for Aman Akshar Poetry Website
// Provides: Push Notifications, Offline Support, Background Sync

const CACHE_VERSION = 'v1.3.0'
const STATIC_CACHE = `amanakshar-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `amanakshar-dynamic-${CACHE_VERSION}`
const POEM_CACHE = `amanakshar-poems-${CACHE_VERSION}`
const THREE_CACHE = `amanakshar-three-${CACHE_VERSION}`
const MODEL_CACHE = `amanakshar-models-${CACHE_VERSION}`

// Static assets to cache on install
// NOTE: Removed '/' from static cache - homepage should use network-first strategy
// to avoid caching errors. Other pages can be cached safely.
const STATIC_ASSETS = [
  '/kavitayen',
  '/parichay',
  '/manifest.json',
  '/images/poet/signature.svg',
  '/images/poet/aman-akshar-portrait.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/textures/paper-grain.svg',
]

// Three.js chunks to cache (loaded dynamically)
const THREE_CHUNKS = [
  '/draco/draco_decoder.wasm',
  '/draco/draco_wasm_wrapper.js',
]

// Critical 3D models to cache
const CRITICAL_MODELS = [
  '/models/poet-portrait.glb',
]

// Pages that can work offline
const OFFLINE_PAGES = [
  '/kavitayen',
  '/parichay',
  '/pustakein',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      caches.open(THREE_CACHE).then((cache) => {
        console.log('[SW] Caching Three.js chunks')
        return cache.addAll(THREE_CHUNKS).catch((err) => {
          console.warn('[SW] Failed to cache some Three.js chunks:', err)
        })
      }),
      caches.open(MODEL_CACHE).then((cache) => {
        console.log('[SW] Caching critical 3D models')
        return cache.addAll(CRITICAL_MODELS).catch((err) => {
          console.warn('[SW] Failed to cache some 3D models:', err)
        })
      }),
    ]).then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('amanakshar-') && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE &&
                     name !== POEM_CACHE &&
                     name !== THREE_CACHE &&
                     name !== MODEL_CACHE
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return
  
  // Skip API requests except poems
  if (url.pathname.startsWith('/api/') && !url.pathname.includes('/poems/')) return
  
  // Skip admin pages
  if (url.pathname.startsWith('/admin')) return
  
  // Handle poem pages specially for offline reading
  if (url.pathname.startsWith('/kavita/')) {
    event.respondWith(handlePoemRequest(request))
    return
  }
  
  // Handle poem API requests for offline
  if (url.pathname.startsWith('/api/poems/')) {
    event.respondWith(handlePoemApiRequest(request))
    return
  }
  
  // Handle Three.js chunks (Draco, loaders, etc.) with cache-first
  if (url.pathname.startsWith('/draco/') || url.pathname.includes('three')) {
    event.respondWith(cacheFirst(request, THREE_CACHE))
    return
  }
  
  // Handle 3D models with cache-first, but allow network updates
  if (url.pathname.startsWith('/models/') && url.pathname.match(/\.(glb|gltf)$/)) {
    event.respondWith(cacheFirst(request, MODEL_CACHE))
    return
  }
  
  // Handle textures with stale-while-revalidate
  if (url.pathname.startsWith('/textures/')) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
    return
  }
  
  // Standard cache-first strategy for static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
  
  // Network-first for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }
  
  // Stale-while-revalidate for everything else
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return createOfflineResponse()
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    return createOfflineResponse()
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request)
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, response.clone())
        })
      }
      return response
    })
    .catch(() => null)
  
  return cached || fetchPromise || createOfflineResponse()
}

// Handle poem pages for offline reading
async function handlePoemRequest(request) {
  // Try network first
  try {
    const response = await fetch(request)
    if (response.ok) {
      // Cache the poem page for offline
      const cache = await caches.open(POEM_CACHE)
      cache.put(request, response.clone())
      return response
    }
  } catch (error) {
    // Network failed, try cache
    const cached = await caches.match(request)
    if (cached) {
      console.log('[SW] Serving poem from cache:', request.url)
      return cached
    }
  }
  
  return createOfflinePoemResponse()
}

// Handle poem API requests for offline
async function handlePoemApiRequest(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(POEM_CACHE)
      cache.put(request, response.clone())
      return response
    }
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
  }
  
  return new Response(JSON.stringify({ error: 'Offline' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}

// Check if path is a static asset
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/) ||
         pathname.startsWith('/icons/') ||
         pathname.startsWith('/images/') ||
         pathname.startsWith('/textures/')
}

// Offline fallback response
function createOfflineResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ऑफ़लाइन — अमन अक्षर</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Noto Serif Devanagari', Georgia, serif;
          background: #0a0908;
          color: #faf8f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        h1 { color: #d4a855; font-size: 2rem; margin-bottom: 1rem; }
        p { color: #c4b8a8; max-width: 400px; line-height: 1.8; }
        .icon { font-size: 4rem; margin-bottom: 2rem; }
        a { color: #d4a855; text-decoration: none; margin-top: 2rem; display: inline-block; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="icon">📶</div>
      <h1>ऑफ़लाइन</h1>
      <p>इंटरनेट कनेक्शन नहीं है। कृपया अपना कनेक्शन जाँचें और पुनः प्रयास करें।</p>
      <p style="margin-top: 1rem; font-size: 0.9rem;">
        पहले से पढ़ी कविताएँ ऑफ़लाइन उपलब्ध हैं।
      </p>
      <a href="/">घर वापस जाएँ</a>
    </body>
    </html>
  `, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}

// Offline poem response
function createOfflinePoemResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>कविता ऑफ़लाइन — अमन अक्षर</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Noto Serif Devanagari', Georgia, serif;
          background: #0a0908;
          color: #faf8f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        h1 { color: #d4a855; font-size: 1.5rem; margin-bottom: 1rem; }
        p { color: #c4b8a8; max-width: 400px; line-height: 1.8; }
        .icon { font-size: 3rem; margin-bottom: 2rem; }
        a { color: #d4a855; text-decoration: none; margin-top: 2rem; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="icon">📖</div>
      <h1>यह कविता ऑफ़लाइन उपलब्ध नहीं है</h1>
      <p>इस कविता को पढ़ने के लिए इंटरनेट कनेक्शन आवश्यक है।</p>
      <p style="margin-top: 1rem; font-size: 0.9rem;">
        कविताएँ जो आपने पहले पढ़ी हैं, वे स्वचालित रूप से ऑफ़लाइन सहेज ली जाती हैं।
      </p>
      <a href="/kavitayen">कविताएँ देखें</a>
    </body>
    </html>
  `, {
    status: 503,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'अमन अक्षर'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.svg',
    badge: data.badge || '/icons/icon-192.svg',
    image: data.image,
    vibrate: [200, 100, 200],
    tag: data.tag || 'amanakshar-notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      { action: 'open', title: 'देखें' },
      { action: 'close', title: 'बंद करें' }
    ],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const action = event.action
  const url = event.notification.data?.url || '/'
  
  if (action === 'close') return
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-likes') {
    event.waitUntil(syncLikes())
  }
})

// Sync cached likes when back online
async function syncLikes() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    
    const likeRequests = requests.filter(req => 
      req.url.includes('/api/poems/') && req.url.includes('/like')
    )
    
    for (const request of likeRequests) {
      try {
        await fetch(request)
        await cache.delete(request)
      } catch (error) {
        console.log('[SW] Failed to sync like:', error)
      }
    }
  } catch (error) {
    console.log('[SW] Sync failed:', error)
  }
}

// Periodic background sync for fresh content
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-poems') {
    event.waitUntil(updatePoemsCache())
  }
})

async function updatePoemsCache() {
  try {
    const response = await fetch('/api/poems?featured=true')
    if (response.ok) {
      const cache = await caches.open(POEM_CACHE)
      await cache.put('/api/poems?featured=true', response)
    }
  } catch (error) {
    console.log('[SW] Periodic sync failed:', error)
  }
}

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_POEM') {
    const { slug, url } = event.data
    cachePoem(slug, url)
  }
  
  if (event.data.type === 'CLEAR_POEM_CACHE') {
    caches.delete(POEM_CACHE)
  }
  
  if (event.data.type === 'GET_CACHED_POEMS') {
    getCachedPoems().then(poems => {
      event.ports[0].postMessage({ poems })
    })
  }
})

async function cachePoem(slug, url) {
  try {
    const cache = await caches.open(POEM_CACHE)
    const response = await fetch(url)
    if (response.ok) {
      await cache.put(url, response)
      console.log('[SW] Cached poem:', slug)
    }
  } catch (error) {
    console.log('[SW] Failed to cache poem:', error)
  }
}

async function getCachedPoems() {
  try {
    const cache = await caches.open(POEM_CACHE)
    const requests = await cache.keys()
    return requests
      .filter(req => req.url.includes('/kavita/'))
      .map(req => {
        const url = new URL(req.url)
        return url.pathname.replace('/kavita/', '')
      })
  } catch (error) {
    return []
  }
}
