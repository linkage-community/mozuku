import * as React from 'react'
const { useState } = React

import { LocalTimelinePage } from '../../presenters'
import { AlbumFile } from '../../models'
import { appStore } from '../../stores'

export default () => {
  const [isDrop, setIsDrop] = useState(false)
  const [uploadState, setUploadState] = useState(0)
  const [files, setFiles] = useState([] as AlbumFile[])
  const [draftDisabled, setDraftDisabled] = useState(false)
  const [inReplyTo, setInReplyTo] = useState(null as number | null)
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrop(false)
    Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => uploadAlbumFile(file))
  }
  const uploadAlbumFile = async (file: File) => {
    appStore.setIsUploading(true)
    const albumFile = await appStore.uploadAlbumFile(
      file.name,
      file,
      setUploadState
    )
    setFiles(files => [...files, albumFile])
    appStore.setIsUploading(false)
    setUploadState(0)
  }
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
    />
  )
}
