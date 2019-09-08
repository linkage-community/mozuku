import * as React from 'react'

import { Post as PostModel, AlbumFile } from '../../../models'
import { Post } from '../../'

import * as styles from './timeline.css'

export default ({
  posts,
  readMore,
  readMoreDisabled,
  postMetaEnabled = false,
  modalContent,
  setModalContent,
  onModalBackgroundClick,
  onModalImageClick
}: {
  posts: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
  postMetaEnabled?: boolean
  modalContent: AlbumFile | null
  setModalContent: (albumFile: AlbumFile | null) => void
  onModalBackgroundClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void
  onModalImageClick: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}) => (
  <>
    {modalContent && (
      <div className={styles.modal_background}>
        {modalContent.type === 'image' ? (
          <picture
            className={styles.modal_container}
            onClick={onModalBackgroundClick}
          >
            {modalContent.directs.map(variant => (
              <source
                key={variant.id}
                srcSet={variant.url.href}
                type={variant.mime}
              />
            ))}
            <img onClick={onModalImageClick} />
          </picture>
        ) : modalContent.type === 'video' ? (
          <div
            className={styles.modal_container}
            onClick={onModalBackgroundClick}
          >
            <video
              poster={modalContent.thumbnail.url.href}
              src={modalContent.variants.get('video')![0].url.href}
              controls
              autoPlay
              onClick={onModalImageClick}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    )}
    <ul className={styles.timeline}>
      {posts.map(post => (
        <li key={post.id}>
          <Post
            post={post}
            metaEnabled={postMetaEnabled}
            setModalContent={setModalContent}
          />
        </li>
      ))}
      <li>
        <button
          className={styles.readmore_button}
          disabled={readMoreDisabled}
          onClick={e => {
            e.preventDefault()
            readMore()
          }}
        >
          READ MORE
        </button>
      </li>
    </ul>
  </>
)
