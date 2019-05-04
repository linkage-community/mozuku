import * as React from 'react'
const { useEffect, useState } = React
import { useObserver } from 'mobx-react-lite'

import App from '../../stores/app'
import Timeline from '../../presenters/Home/Timeline'

export default () => {
  useEffect(() => {
    let openTimerID: number
    const open = async () => {
      try {
        await App.fetchTimeline()
        await App.openTimelineStream()
      } catch (e) {
        console.error(e)
        window.setTimeout(open, 500)
      }
    }
    open()
    return () => {
      document.title = App.defaultTitle
      if (openTimerID) window.clearTimeout(openTimerID)
      App.closeTimelineStream()
      App.resetTimeline()
    }
  }, [])

  const [readMoreDisabled, setDisabled] = useState(false)
  const readMore = async () => {
    setDisabled(true)
    try {
      await App.readMoreTimeline()
    } catch (e) {
      // TODO: Add error report
    } finally {
      setDisabled(false)
    }
  }

  return useObserver(() => {
    document.title = App.timelineTitle
    return (<Timeline timeline={App.timeline} readMore={readMore} readMoreDisabled={readMoreDisabled} />)
  })
}
