import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { timelineStore, useTimeline } from '../../stores'
import {
  Timeline,
  TimelineItem,
} from '../../presenters/local-timeline-content/timeline'
import { AlbumFile } from '../../models'
import PostContainer from '../post'

export default ({
  inReplyTo,
  setInReplyTo,
}: {
  inReplyTo: number | null
  setInReplyTo: (n: number | null) => void
}) => {
  useTimeline()
  const [modalContent, setModalContent] = useState(null as AlbumFile | null)
  const onModalClose = () => {
    setModalContent(null)
    history.back()
  }
  const openTab = (url: string) => window.open(url, '_blank')
  useEffect(() => {
    const watchHistoryBack = () => {
      setModalContent(null)
      return
    }
    window.addEventListener('popstate', watchHistoryBack)
    return () => {
      window.removeEventListener('popstate', watchHistoryBack)
    }
  }, [])

  return useObserver(() => {
    document.title = timelineStore.title
    const faviconElement = document.head.querySelector("link[rel='icon']")
    if (faviconElement) {
      faviconElement.setAttribute('href', timelineStore.icon)
    }
    return (
      <Timeline
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
        modalContent={modalContent}
        onModalClose={onModalClose}
        openInNewTab={openTab}
      >
        {timelineStore.postIds.map((postId) => (
          <TimelineItem key={postId}>
            <PostContainer
              postId={postId}
              setModalContent={setModalContent}
              inReplyTo={inReplyTo}
              setInReplyTo={setInReplyTo}
            />
          </TimelineItem>
        ))}
      </Timeline>
    )
  })
}
