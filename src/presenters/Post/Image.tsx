import * as React from 'react'
import AlbumFile from '../../models/AlbumFile'
import { PostImage } from '../../models/Post'

export default ({
  albumFiles: files,
  images
}: {
  albumFiles: AlbumFile[]
  images: PostImage[]
}) => {
  return React.useMemo(() => {
    const imageFiles = files.filter(f => f.type === 'image')
    if (imageFiles.length === 0 && images.length === 0) return <></>
    return (
      <div className="post__image">
        {imageFiles.length ? (
          imageFiles.map((im, k) => (
            <picture key={k}>
              {im.thumbnails.map(t => (
                <source key={t.id} srcSet={t.url.href} type={t.mime} />
              ))}
              <img
                title={im.fileName}
                className="post-image__img"
                onClick={e => {
                  // ここやだ
                  const src = im.thumbnails.filter(
                    vr => vr.url.href == e.currentTarget.currentSrc
                  )[0]
                  const imopen = im.directByMIME(src.mime) || im.direct
                  window.open(imopen.url.href, '_blank')
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
              <img className="post-image__img" src={im.thumbnail} />
            </a>
          ))
        ) : (
          <></>
        )}
      </div>
    )
  }, [files.length, images.length])
}
