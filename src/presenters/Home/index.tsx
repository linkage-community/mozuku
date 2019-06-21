import * as React from 'react'
const { useState } = React

import { Line } from 'rc-progress'

import PostForm from '../../containers/Home/PostForm'
import Timeline from '../../containers/Home/Timeline'
import AlbumFile from '../../models/AlbumFile'
import { appStore } from '../../stores'
import styles from './index.css'

export default () => {
  const [isDrop, setIsDrop] = useState(false)
  const [uploadState, setUploadState] = useState(0)
  const [rows, setRows] = useState(1)
  const [files, setFiles] = useState([] as AlbumFile[])
  const [isUploading, setIsUploading] = useState(false)
  const [draftDisabled, setDraftDisabled] = useState(false)
  const uploadAlbumFile = async (file: File) => {
    setIsUploading(true)
    const albumFile = await appStore.uploadAlbumFile(
      file.name,
      file,
      setUploadState
    )
    setFiles(files => [...files, albumFile])
    if (rows < 3) {
      setRows(3)
    }
    setIsUploading(false)
    setUploadState(0)
  }
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrop(false)
    Array.from(e.dataTransfer.files)
      .filter(file => file.type.split('/').shift() == 'image')
      .map(file => uploadAlbumFile(file))
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrop(true)
  }
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDrop(false)
  }
  return (
    <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
      <div className={styles.dragAreaBackgrond} hidden={!isDrop}>
        <div className={styles.dragArea}>
          <p>ファイルをドラッグしてアップロード</p>
        </div>
      </div>
      <div hidden={!isUploading}>
        <Line percent={uploadState} strokeColor="var(--color-accent)" />
      </div>
      <PostForm
        draftDisabled={draftDisabled}
        setDraftDisabled={setDraftDisabled}
        rows={rows}
        setRows={setRows}
        files={files}
        setFiles={setFiles}
        uploadAlbumFile={uploadAlbumFile}
      />
      <Timeline />
    </div>
  )
}
