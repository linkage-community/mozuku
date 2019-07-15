import * as React from 'react'
import filesize from 'filesize'
import AlbumFile from '../../../models/AlbumFile'

import * as styles from './image.css'

export default ({
  albumFiles: files,
  setModalContent
}: {
  albumFiles: AlbumFile[]
  setModalContent: (albumFile: AlbumFile | null) => void
}) => {
  return React.useMemo(() => {
    const imageFiles = files.filter(f => f.type === 'image')
    if (imageFiles.length === 0) return <></>
    return (
      <>
        <div className={styles.imageCount}>{imageFiles.length} attachments</div>

        <div className={styles.image}>
          {imageFiles.length ? (
            imageFiles.map((im, k) => (
              <>
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
                <div className={styles.imageSize}>
                  <p>{filesize(im.direct.size)}</p>
                </div>
              </>
            ))
          ) : (
            <></>
          )}
        </div>
      </>
    )
  }, [files.length])
}
