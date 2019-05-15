import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import {
  appStore,
  PREFERENCE_DISPLAY_META_ENABLED,
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
        postMetaEnabled={appStore.preferences.get(
          PREFERENCE_DISPLAY_META_ENABLED
        )}
      />
    )
  })
}
