import * as React from 'react'

import { Line } from 'rc-progress'

import PostForm from '../../furui/containers/local-timeline/post-form'
import Timeline from '../../furui/containers/local-timeline/timeline'
import styles from './index.css'
import { AlbumFile, Post } from '../../furui/models'

type Props = {
  draftDisabled: boolean
  files: AlbumFile[]
  inReplyTo: number | null
  isDrop: boolean
  isUploading: boolean
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  replyToPost: Post | null
  setDraftDisabled: (b: boolean) => void
  setFiles: (a: AlbumFile[]) => void
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
  setIsDrop: (b: boolean) => void
  uploadAlbumFile: (a: File) => void
  uploadState: number
}

const LocalTimelinePage: React.FC<Props> = ({
  draftDisabled,
  files,
  inReplyTo,
  isDrop,
  isUploading,
  onDrop,
  replyToPost,
  setDraftDisabled,
  setFiles,
  setInReplyTo,
  setIsDrop,
  uploadAlbumFile,
  uploadState,
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
    <div
      className={styles.dragAreaContainer}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ marginTop: inReplyTo ? '-32px' : '0px' }}
    >
      <div className={styles.dragAreaBackgrond} hidden={!isDrop}>
        <div className={styles.dragArea}>
          <p>ファイルをドラッグしてアップロード</p>
        </div>
      </div>
      <div className={styles.progressContainer} hidden={!isUploading}>
        <Line
          percent={uploadState}
          strokeColor="var(--color-accent)"
          strokeLinecap="square"
        />
      </div>
      <PostForm
        draftDisabled={draftDisabled}
        files={files}
        inReplyTo={inReplyTo}
        replyToPost={replyToPost}
        setDraftDisabled={setDraftDisabled}
        setFiles={setFiles}
        setInReplyTo={setInReplyTo}
        uploadAlbumFile={uploadAlbumFile}
      />
      <Timeline setInReplyTo={setInReplyTo} />
    </div>
  )
}
export default LocalTimelinePage
