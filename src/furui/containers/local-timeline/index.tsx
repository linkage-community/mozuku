import * as React from 'react'
const { useState, useEffect } = React

import { LocalTimelinePage } from '../../presenters'
import { AlbumFile, Post } from '../../models'
import { appStore } from '../../stores'

export default () => {
  const [isDrop, setIsDrop] = useState(false)
  const [uploadState, setUploadState] = useState(0)
  const [files, setFiles] = useState([] as AlbumFile[])
  const [draftDisabled, setDraftDisabled] = useState(false)
  const [inReplyTo, setInReplyTo] = useState<number | null>(null)
  const [replyToPost, setReplyToPost] = useState<Post | null>(null)
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
    <LocalTimelinePage
      onDrop={onDrop}
      isDrop={isDrop}
      setIsDrop={setIsDrop}
      uploadAlbumFile={uploadAlbumFile}
      isUploading={appStore.isUploading}
      uploadState={uploadState}
      draftDisabled={draftDisabled}
      setDraftDisabled={setDraftDisabled}
      files={files}
      setFiles={setFiles}
      inReplyTo={inReplyTo}
      setInReplyTo={setInReplyTo}
      replyToPost={replyToPost}
    />
  )
}
