const version = 'template-v1'
const assets = [
  'index.html',
  'style.css',
  'manifest.json',
  'js/main.js',
  'js/serviceworker.js',
  'images/icon-180.png',
  'images/icon-192.png',
  'images/icon-512.png'
]

async function install() {
  const cache = await caches.open(version)
  await cache.addAll(assets)  
}

async function handle(request) {
  const cached = await caches.match(request)
  
  if (cached) {
    return cached
  }
  
  const response = await fetch(request)
  const cache = await caches.open(version)
  
  cache.put(request, response.clone())
  return response
}

self.addEventListener('install', e => {
  e.waitUntil(install())
})

self.addEventListener('fetch', e => {
  const request = e.request
  e.respondWith(handle(request))
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    Promise.all(keys.map(key => {
      if (key !== version) {
        caches.delete(key)
      }
    }))
  })
})
