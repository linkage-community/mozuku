import * as React from 'react'
const { useEffect } = React
import { useObserver } from 'mobx-react-lite'

import App from '../../stores/app'
import Timeline from '../../presenters/Home/Timeline'
import Helmet from 'react-helmet';

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
      if (openTimerID) window.clearTimeout(openTimerID)
      App.closeTimelineStream()
      App.resetTimeline()
    }
  }, [])

  return useObserver(() => (
    <>
      <Helmet title={App.timelineTitle} />
      <Timeline timeline={App.timeline} />
    </>
  ))
}
