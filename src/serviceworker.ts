/// <reference types="../node_modules/types-serviceworker" />

self.addEventListener('push', (evt) => {
  evt.data && evt.data.json()
})
