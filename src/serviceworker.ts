const ctx: ServiceWorkerGlobalScope = self as any
ctx.addEventListener('activate', (ev) => {
  console.log('ServiceWorker is activated.')
  ev.waitUntil(async () => {
    await ctx.registration.navigationPreload?.enable()
  })
})

// To make the App installable, SW must have a 'fetch' event listener.
ctx.addEventListener('fetch', () => {
  /* noop */
})
