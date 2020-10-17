import * as React from 'react'
const { useState, useEffect } = React

import { AlbumFile, Post } from '../../furui/models'
import { appStore } from '../../furui/stores'
import LocalTimelineLayout from './local-timeline'

const LocalTimeline: React.FC = () => {
  const [draftDisabled, setDraftDisabled] = useState(false)
  const [files, setFiles] = useState([] as AlbumFile[])
  const [inReplyTo, setInReplyTo] = useState<number | null>(null)
  const [isDrop, setIsDrop] = useState(false)
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
  const [uploadState, setUploadState] = useState(0)

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrop(false)
    Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => uploadAlbumFile(file))
  }
  const uploadAlbumFile = async (file: File) => {
    appStore.setIsUploading(true)
    const albumFile = await appStore.uploadAlbumFile(
      file.name,
      file,
      setUploadState
    )
    setFiles((files) => [...files, albumFile])
    appStore.setIsUploading(false)
    setUploadState(0)
  }

  useEffect(() => {
    if (!inReplyTo) return
    const post = appStore.posts.get(inReplyTo) || null
    if (!post) {
      console.error(
        `replayToPost can not shown, failed to get post: ${inReplyTo}`
      )
    }
    setReplyToPost(post)
  }, [inReplyTo])

  return (
    <LocalTimelineLayout
      draftDisabled={draftDisabled}
      files={files}
      inReplyTo={inReplyTo}
      isDrop={isDrop}
      isUploading={appStore.isUploading}
      onDrop={onDrop}
      replyToPost={replyToPost}
      setDraftDisabled={setDraftDisabled}
      setFiles={setFiles}
      setInReplyTo={setInReplyTo}
      setIsDrop={setIsDrop}
      uploadAlbumFile={uploadAlbumFile}
      uploadState={uploadState}
    />
  )
}
export default LocalTimeline
