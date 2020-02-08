import * as React from 'react'
import filesize from 'filesize'
import AlbumFile from '../../../models/album-file'

import * as styles from './image.css'

const Nothing: React.FC = function Nothing() {
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

const Image: React.FC<{
  image: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}> = ({ image, openFileModal }) => {
  return (
    <div className={styles.image}>
      <picture>
        {image.thumbnails.map(t => (
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

const Video: React.FC<{
  video: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}> = ({ video, openFileModal }) => {
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

const File: React.FC<{
  file: AlbumFile
  openFileModal: (albumFile: AlbumFile) => void
}> = ({ file, openFileModal }) => {
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

export default React.memo(
  ({
    albumFiles: files,
    setModalContent
  }: {
    albumFiles: AlbumFile[]
    setModalContent: (albumFile: AlbumFile | null) => void
  }) => {
    const openFileModal = (file: AlbumFile) => {
      history.pushState(
        history.state,
        file.fileName,
        `#${file.type}_${file.id}`
      )
      setModalContent(file)
    }

    return (
      <div className={styles.images}>
        {files.map((im, k) => (
          <File file={im} openFileModal={openFileModal} key={k} />
        ))}
      </div>
    )
  },
  (prev, next) => prev.albumFiles.length === next.albumFiles.length
)
