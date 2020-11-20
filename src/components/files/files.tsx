import * as React from 'react'
import filesize from 'filesize'
import type AlbumFile from '../../furui/models/album-file'

import * as styles from './image.css'

export const Nothing: React.FC = () => {
  return (
    <div className={styles.image}>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
      <div className={styles.imageSize}>
        <p>-</p>
      </div>
      <div className={styles.imageCover}>😢</div>
    </div>
  )
}

export type ImageProps = {
  image: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}

export const Image: React.FC<ImageProps> = ({ image, openFileModal }) => {
  return (
    <div className={styles.image}>
      <picture>
        {image.thumbnails.map((t) => (
          <source key={t.id} srcSet={t.url.href} type={t.mime} />
        ))}
        <img title={image.fileName} onClick={() => openFileModal(image)} />
      </picture>
      <div className={styles.imageSize}>
        <p>{filesize(image.direct.size)}</p>
      </div>
    </div>
  )
}

export type VideoProps = {
  video: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}

export const Video: React.FC<VideoProps> = ({ video, openFileModal }) => {
  return (
    <div className={styles.image}>
      <img
        src={video.thumbnail.url.href}
        onClick={() => openFileModal(video)}
      />
      <div className={styles.imageSize}>
        <p>{filesize(video.variants.get('video')![0].size)}</p>
      </div>
      <div className={styles.imageCover}>
        <span className="uil uil-play"></span>
      </div>
    </div>
  )
}

export type FileProps = {
  file: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}

export const File: React.FC<FileProps> = ({ file, openFileModal }) => {
  if (file.thumbnail == null) {
    return <Nothing />
  }
  switch (file.type) {
    case 'image':
      return <Image image={file} openFileModal={openFileModal} />
    case 'video':
      return <Video video={file} openFileModal={openFileModal} />
    default:
      return <></>
  }
}
