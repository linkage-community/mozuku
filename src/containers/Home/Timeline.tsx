import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import {
  appStore,
  PREFERENCE_SHOW_META,
  timelineStore,
  useTimeline
} from '../../stores'
import Timeline from '../../presenters/Home/Timeline'

export default () => {
  useTimeline()

  return useObserver(() => {
    document.title = timelineStore.title
    return (
      <Timeline
        posts={timelineStore.posts}
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
        enablePostMeta={appStore.preferences.get(PREFERENCE_SHOW_META)}
      />
    )
  })
}
