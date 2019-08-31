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
  return React.useMemo(
    () => (
      <div className={styles.images}>
        {files.map((im, k) => {
          switch (im.type) {
            case 'image':
              return (
                <div className={styles.image} key={k}>
                  <picture>
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
                </div>
              )
            case 'video':
              return (
                <div className={styles.image} key={k}>
                  <img
                    src={im.thumbnail.url.href}
                    onClick={() => {
                      history.pushState(
                        history.state,
                        im.fileName,
                        `#video_${im.id}`
                      )
                      setModalContent(im)
                    }}
                  />
                  <div className={styles.imageSize}>
                    <p>{filesize(im.variants.get('video')![0].size)}</p>
                  </div>
                </div>
              )
            default:
              return <></>
          }
        })}
      </div>
    ),
    [files.length]
  )
}
