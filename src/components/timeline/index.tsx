import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import { timelineStore, useTimeline } from '../../furui/stores'
import { Timeline as TimelineLayout, TimelineItem } from './timeline'
import { AlbumFile } from '../../furui/models'
import PostContainer from '../../furui/containers/post'

type Props = {
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
}

const Timeline: React.FC<Props> = ({ setInReplyTo }) => {
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
      <TimelineLayout
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
        modalContent={modalContent}
        onModalClose={onModalClose}
        openInNewTab={openTab}
      >
        {timelineStore.filteredPostIds.map((postId) => (
          <TimelineItem key={postId}>
            <PostContainer
              postId={postId}
              setModalContent={setModalContent}
              setInReplyTo={setInReplyTo}
            />
          </TimelineItem>
        ))}
      </TimelineLayout>
    )
  })
}
export default Timeline
