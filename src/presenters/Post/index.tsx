import * as React from 'react'
const { useMemo } = React

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../../models'
import DateTime from '../../components/DateTime'
import OGCard from '../OGCard'
import Image from './Image'
import DummyAvatar from './DummyAvatar'

import * as styles from './post.css'
import AlbumFile from '../../models/AlbumFile'

type PostProps = {
  post: Post
  metaEnabled: boolean
  setModalContent: (albumFile: AlbumFile | null) => void
}
export default ({
  post,
  post: { author },
  metaEnabled,
  setModalContent
}: PostProps) => {
  return useMemo(
    () => (
      <div className={styles.post}>
        {author.avatarFile ? (
          <picture className={styles.icon}>
            {author.avatarFile.thumbnails.map(t => (
              <source key={t.id} srcSet={t.url.href} type={t.mime} />
            ))}
            <img
              className={styles.icon__img}
              title={author.avatarFile.fileName}
            />
          </picture>
        ) : (
          <div className={styles.icon}>
            <DummyAvatar name={author.name} className={styles.icon__img} />
          </div>
        )}
        <div className={styles.head}>
          <span
            className={[
              styles.displayName,
              // FIXME: DIRTY!
              author.name.trim().length === 0 ? styles.empty : ''
            ].join(' ')}
          >
            {author.name}
          </span>
          <div className={styles.block}>
            <span className={styles.screenName}>@{author.screenName}</span>
            <DateTime className={styles.time} dt={post.createdAt} />
          </div>
        </div>
        <div className={styles.body}>
          {post.body.parts.map((p, i) => {
            switch (p.type) {
              case BODYPART_TYPE_LINK:
              case BODYPART_TYPE_LINK_IMAGE:
                return (
                  <a key={i} href={p.payload} target="_blank">
                    {(() => {
                      try {
                        return decodeURI(p.payload)
                      } catch (_) {
                        return p.payload
                      }
                    })()}
                  </a>
                )
              case BODYPART_TYPE_BOLD:
                return (
                  <span key={i} className={styles.bold}>
                    {p.payload}
                  </span>
                )
              default:
                return <React.Fragment key={i}>{p.payload}</React.Fragment>
            }
          })}
        </div>
        <Image
          albumFiles={post.files}
          images={post.images}
          setModalContent={setModalContent}
        />
        {post.body.parts.map((p, i) => {
          switch (p.type) {
            case BODYPART_TYPE_LINK:
              return (
                <OGCard key={i} url={p.payload} className={styles.ogcard} />
              )
            default:
              return <React.Fragment key={i} />
          }
        })}
        <div className={`${styles.meta} ${metaEnabled ? styles.enabled : ''}`}>
          via {post.application.name}
          {post.application.isAutomated && (
            <span className={styles.meta__badge}>bot</span>
          )}
        </div>
      </div>
    ),
    [author.name, author.avatarFile && author.avatarFile.id]
  )
}
