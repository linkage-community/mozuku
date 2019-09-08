import * as React from 'react'
const { useMemo } = React

import { Post } from '../../models'
import DateTime from '../DateTime'
import OGCard from '../../containers/OGCard'
import Image from './Image'
import DummyAvatar from './DummyAvatar'

import * as styles from './post.css'
import AlbumFile from '../../models/AlbumFile'

import {
  EmojiNameKind,
  MentionKind,
  LinkKind
} from '@linkage-community/bottlemail'

import pictograph = require('pictograph')

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
          {post.nodes.map((node, i) => {
            switch (node.kind) {
              case LinkKind:
                return (
                  <a key={i} href={node.raw} target="_blank">
                    {(() => {
                      try {
                        return decodeURI(node.raw)
                      } catch (_) {
                        return node.raw
                      }
                    })()}
                  </a>
                )
              case MentionKind:
                return (
                  <span key={i} className={styles.bold}>
                    {node.raw}
                  </span>
                )
              case EmojiNameKind:
                return (
                  <span key={i} title={node.raw}>
                    {pictograph.dic[node.value] || node.raw}
                  </span>
                )
              default:
                return <React.Fragment key={i}>{node.raw}</React.Fragment>
            }
          })}
        </div>
        {0 < post.files.length && (
          <Image albumFiles={post.files} setModalContent={setModalContent} />
        )}
        {post.nodes.map((node, i) => {
          switch (node.kind) {
            case LinkKind:
              return <OGCard key={i} url={node.raw} className={styles.ogcard} />
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
