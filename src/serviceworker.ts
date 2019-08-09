/// <reference types="../node_modules/types-serviceworker" />

self.addEventListener('activate', () => {
  console.log('ServiceWorker is activated.')
})

self.addEventListener('fetch', () => {})
