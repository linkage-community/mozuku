import * as React from 'react'
import AlbumFile from '../../../models/AlbumFile'
import Image from './image'

import * as styles from './image.css'

export default ({
  albumFiles: files,
  spreadEnabled,
  setModalContent
}: {
  albumFiles: AlbumFile[]
  spreadEnabled: boolean
  setModalContent: (albumFile: AlbumFile | null) => void
}) => {
  return React.useMemo(() => {
    const imageFiles = files.filter(f => f.type === 'image')
    if (imageFiles.length === 0) return <></>
    return (
      <div className={styles.images}>
        {imageFiles.length ? (
          imageFiles.map((im, k) => (
            <Image
              key={k}
              albumFile={im}
              spreadEnabled={spreadEnabled}
              setModalContent={setModalContent}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    )
  }, [files.length])
}
