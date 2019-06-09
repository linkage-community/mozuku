import * as React from 'react'
import AlbumFile from '../../../models/AlbumFile'
import { PostImage } from '../../../models/Post'

import * as styles from './image.css'

export default ({
  albumFiles: files,
  images,
  setModalContent
}: {
  albumFiles: AlbumFile[]
  images: PostImage[]
  setModalContent: (albumFile: AlbumFile | null) => void
}) => {
  return React.useMemo(() => {
    const imageFiles = files.filter(f => f.type === 'image')
    if (imageFiles.length === 0 && images.length === 0) return <></>
    return (
      <div className={styles.image}>
        {imageFiles.length ? (
          imageFiles.map((im, k) => (
            <picture key={k}>
              {im.thumbnails.map(t => (
                <source key={t.id} srcSet={t.url.href} type={t.mime} />
              ))}
              <img
                title={im.fileName}
                onClick={() => {
                  history.pushState(
                    history.state,
                    im.fileName,
                    `#image_${im.id}`
                  )
                  setModalContent(im)
                }}
              />
            </picture>
          ))
        ) : (
          <></>
        )}
        {images.length ? (
          images.map((im, k) => (
            <a key={k} href={im.direct} target="_blank">
              <img src={im.thumbnail} />
            </a>
          ))
        ) : (
          <></>
        )}
      </div>
    )
  }, [files.length, images.length])
}
