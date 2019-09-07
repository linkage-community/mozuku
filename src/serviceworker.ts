/// <reference types="../node_modules/types-serviceworker" />

import * as $ from 'transform-ts'
import logo from './static/logo.png'

const transformPushPost = $.obj({
  application: $.any,
  user: $.obj({
    id: $.number,
    name: $.string,
    screenName: $.string,
    icon: $.string
  }),
  text: $.string,
  id: $.number
})
const transformPush = $.obj({
  type: $.string,
  post: $.optional(transformPushPost)
})

self.addEventListener('activate', () => {
  console.log('ServiceWorker is activated.')
})

self.addEventListener('fetch', () => {})

self.addEventListener('push', async pushEvent => {
  const d: unknown = pushEvent.data && pushEvent.data.json()
  const reportError = async (message: string) => {
    await self.registration.showNotification(
      'An error occured at receiving push.',
      {
        body: message,
        badge: logo
      }
    )
  }
  try {
    const push = transformPush.transformOrThrow(d)
    switch (push.type) {
      case 'mention':
        if (!push.post) throw new Error('Invalid push sent.')
        await self.registration.showNotification(
          `"${push.post.user.name}" (@${push.post.user.screenName}) mentioned you.`,
          {
            icon: push.post.user.icon,
            body: push.post.text,
            badge: logo
          }
        )
        break
      default:
        throw new Error('Unknown push type.')
    }
  } catch (e) {
    // add error report
    await reportError(e.message + '\n' + d)
  }
})
self.addEventListener('notificationclick', notificationEvent => {
  // atode yaru
})
