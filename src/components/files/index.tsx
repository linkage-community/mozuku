import * as React from 'react'
import AlbumFile from '../../furui/models/album-file'
import { File } from './files'

import * as styles from './image.css'

export const Files = React.memo(
  ({
    albumFiles: files,
    setModalContent,
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
