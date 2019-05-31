import * as React from 'react'
const { useMemo } = React

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'
import DateTime from './DateTime'
import OGCard from './OGCard'

import * as styles from './Post/post.css'

type PostProps = {
  post: Post
  metaEnabled: boolean
}
export default ({ post, post: { author }, metaEnabled }: PostProps) => {
  return useMemo(
    () => (
      <div className={styles.post}>
        <div className={styles.head}>
          <div className={styles.name}>
            <span
              className={[
                styles.displayName,
                // FIXME: DIRTY!
                author.name.trim().length === 0 ? styles.empty : ''
              ].join(' ')}
            >
              {author.name}
            </span>
            <span className={styles.screenName}>@{author.screenName}</span>
          </div>
          <DateTime className={styles.time} dt={post.createdAt} />
        </div>
        <div className={styles.body}>
          {post.body.parts.map((p, i) => {
            switch (p.type) {
              case BODYPART_TYPE_LINK:
              case BODYPART_TYPE_LINK_IMAGE:
                return (
                  <a key={i} href={p.payload} target="_blank">
                    {decodeURI(p.payload)}
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
        {post.images.length ? (
          <div className={styles.image}>
            {post.images.map((im, k) => (
              <a key={k} href={im.direct} target="_blank">
                <img src={im.thumbnail} />
              </a>
            ))}
          </div>
        ) : (
          <></>
        )}
        {post.files.length ? (
          post.files.map(im => (
            <div className={styles.image} key={im.id}>
              <picture>
                {im.variants
                  .filter(vr => vr.type == 'thumbnail')
                  .map(vr => (
                    <source key={vr.id} srcSet={vr.url.href} type={vr.mime} />
                  ))}
                <img
                  title={im.fileName}
                  onClick={e => {
                    const src = im.variants.filter(
                      vr => vr.url.href == e.currentTarget.currentSrc
                    )[0]
                    const imopen = im.variants
                      .filter(vr => vr.mime == src.mime)
                      .sort((a, b) =>
                        a.score == b.score ? 0 : a.score < b.score ? 1 : -1
                      )[0]
                    window.open(imopen.url.href, '_blank')
                  }}
                />
              </picture>
            </div>
          ))
        ) : (
          <></>
        )}
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
        </div>
      </div>
    ),
    [author.name]
  )
}
