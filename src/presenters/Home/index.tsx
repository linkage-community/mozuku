import * as React from 'react'

import { Line } from 'rc-progress'

import PostForm from '../../containers/Home/PostForm'
import Timeline from '../../containers/Home/Timeline'
import styles from './index.css'
import AlbumFile from '../../models/AlbumFile'

export default ({
  onDrop,
  isDrop,
  setIsDrop,
  uploadAlbumFile,
  isUploading,
  uploadState,
  draftDisabled,
  setDraftDisabled,
  files,
  setFiles
}: {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  isDrop: boolean
  setIsDrop: (b: boolean) => void
  uploadAlbumFile: (a: File) => void
  isUploading: boolean
  uploadState: number
  draftDisabled: boolean
  setDraftDisabled: (b: boolean) => void
  files: AlbumFile[]
  setFiles: (a: AlbumFile[]) => void
}) => {
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
      <div className={styles.progressContainer} hidden={!isUploading}>
        <Line
          percent={uploadState}
          strokeLinecap="square"
          strokeColor="var(--color-accent)"
        />
      </div>
      <PostForm
        draftDisabled={draftDisabled}
        setDraftDisabled={setDraftDisabled}
        files={files}
        setFiles={setFiles}
        uploadAlbumFile={uploadAlbumFile}
        isUploading={isUploading}
      />
      <Timeline />
    </div>
  )
}
