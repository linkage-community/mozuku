import * as React from 'react'
const { useState } = React
import filesize from 'filesize'
import AlbumFile from '../../../models/AlbumFile'

import * as styles from './image.css'

export default ({
  albumFile,
  spreadEnabled,
  setModalContent
}: {
  albumFile: AlbumFile
  spreadEnabled: boolean
  setModalContent: (albumFile: AlbumFile | null) => void
}) => {
  const [moveX, setMoveX] = useState(0)
  const [moveY, setMoveY] = useState(0)
  const [zoom, setZoom] = useState(false)
  const onMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (Math.round(Math.random())) return
    setZoom(true)
    setMoveX(
      100 -
        ((e.clientX - e.currentTarget.offsetLeft + e.currentTarget.width / 2) /
          e.currentTarget.width) *
          100
    )
    setMoveY(
      100 -
        ((e.pageY - e.currentTarget.offsetTop + e.currentTarget.height / 2) /
          e.currentTarget.height) *
          100
    )
  }
  const onClick = () => {
    history.pushState(
      history.state,
      albumFile.fileName,
      `#image_${albumFile.id}`
    )
    setModalContent(albumFile)
  }
  return (
    <div className={spreadEnabled ? styles.spreadImage : styles.image}>
      <div className={styles.imageCover}>
        <picture>
          {spreadEnabled
            ? albumFile.directs.map(t => (
                <source key={t.id} srcSet={t.url.href} type={t.mime} />
              ))
            : albumFile.thumbnails.map(t => (
                <source key={t.id} srcSet={t.url.href} type={t.mime} />
              ))}
          <img
            title={albumFile.fileName}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setZoom(false)}
            style={
              zoom
                ? {
                    transform: `translate(${zoom ? moveX : '0'}%, ${
                      zoom ? moveY : '0'
                    }%) scale(${zoom ? '2' : '1'})`
                  }
                : {}
            }
          />
        </picture>
      </div>
      <div className={styles.imageSize}>
        <p>{filesize(albumFile.direct.size)}</p>
      </div>
    </div>
  )
}
