import * as React from 'react'
const { useState } = React
import { useObserver } from 'mobx-react-lite'

import timelineStore, { useTimeline } from '../../stores/timeline'
import Timeline from '../../presenters/Home/Timeline'

export default () => {
  useTimeline()

  const [readMoreDisabled, setDisabled] = useState(false)
  const readMore = async () => {
    setDisabled(true)
    try {
      await timelineStore.readMore()
    } catch (e) {
      // TODO: Add error report
    } finally {
      setDisabled(false)
    }
  }

  return useObserver(() => {
    document.title = timelineStore.title
    return (
      <Timeline
        timeline={timelineStore.timeline}
        readMore={readMore}
        readMoreDisabled={readMoreDisabled}
      />
    )
  })
}
