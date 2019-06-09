import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import {
  appStore,
  PREFERENCE_DISPLAY_META_ENABLED,
  timelineStore,
  useTimeline
} from '../../stores'
import Timeline from '../../presenters/Home/Timeline'
import AlbumFile from '../../models/AlbumFile'

export default () => {
  useTimeline()
  const [modalContent, setModalContent] = useState(null as AlbumFile | null)
  const onModalBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log('hatsudou')
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
    return (
      <Timeline
        posts={timelineStore.posts}
        readMore={timelineStore.readMore.bind(timelineStore)}
        readMoreDisabled={timelineStore.readMoreDisabled}
        postMetaEnabled={appStore.preferences.get(
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
