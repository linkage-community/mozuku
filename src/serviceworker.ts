self.addEventListener('activate', () => {
  console.log('ServiceWorker is activated.')
})

self.addEventListener('fetch', (event: any) => {
  const fetchEvent = event
  const url = new URL(fetchEvent.request.url)
  if (url.hostname !== 'analizzatore.prezzemolo.org') return
  url.host = 'ogp-syutoku-kun.herokuapp.com'
  url.pathname = '/api/v1/fetch'
  fetchEvent.respondWith(fetch(url.href))
})
