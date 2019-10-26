import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import {
  appStore,
  PREFERENCE_DISPLAY_META_ENABLED,
  timelineStore,
  useTimeline
} from '../../../stores'
import Timeline from '../../presenters/local-timeline-content/timeline'
import { AlbumFile } from '../../../models'

export default () => {
  useTimeline()
  const [modalContent, setModalContent] = useState(null as AlbumFile | null)
  const onModalBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setModalContent(null)
    history.back()
  }
  const onModalImageClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    window.open(e.currentTarget.currentSrc, '_blank')
  }
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
        posts={timelineStore.posts}
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
        postMetaEnabled={appStore.getPreference(
          PREFERENCE_DISPLAY_META_ENABLED
        )}
        modalContent={modalContent}
        setModalContent={setModalContent}
        onModalBackgroundClick={onModalBackgroundClick}
        onModalImageClick={onModalImageClick}
      />
    )
  })
}
