import * as React from 'react'
import { useObserver } from 'mobx-react-lite'

import { timelineStore, useTimeline } from '../../stores'
import Timeline from '../../presenters/Home/Timeline'

export default () => {
  useTimeline()

  return useObserver(() => {
    document.title = timelineStore.title
    return (
      <Timeline
        timeline={timelineStore.timeline}
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
      />
    )
  })
}
