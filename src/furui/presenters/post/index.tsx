import React, { useMemo, useRef, useReducer } from 'react'
import { Overlay, useRootClose } from 'react-overlays'

import { Post } from '../../models'
import { DateTime } from '../../presenters'
import { OGCard } from '../../../components/og-card'

import Files from './files'

import * as styles from './post.css'
import { AlbumFile } from '../../models'

import {
  EmojiNameKind,
  MentionKind,
  LinkKind,
} from '@linkage-community/bottlemail'

import * as pictograph from 'pictograph'
import config from '../../../config'
import Avatar from '../../../components/avatar'

const Body: React.FC<{
  bodyNodes: Post['nodes']
  className: string
}> = ({ bodyNodes, className }) => {
  return (
    <div className={className}>
      {bodyNodes.map((node, i) => {
        switch (node.kind) {
          case LinkKind:
            return (
              <a
                key={i}
                href={node.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {(() => {
                  try {
                    return decodeURI(node.value)
                  } catch (_) {
                    return node.value || node.raw
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
  )
}

const InReplyTo: React.FC<{
  inReplyToId: number
  inReplyToContent?: React.ReactNode
}> = ({ inReplyToId, inReplyToContent }) => {
  const url = new URL(config.sea)
  url.pathname = `/posts/${inReplyToId}`
  const href = url.href

  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLAnchorElement>(null)
  // 固定状態からホバーを外しても(mouseLeave)ポップアップが出現されているようにするため、ポップアップがホバーされている状態(hovered)とクリックされて固定されている状態(locked)を区別する
  // |        |---(mouseEnter)-->| hovered |             |        |
  // |        |<--(mouseLeave)---|         |---(click)-->|        |
  // | closed |--------------------------------(click)-->| locked |
  // |        |<-------------------------------(close)---|        |
  const [showState, dispatch] = useReducer(
    (
      state: 'closed' | 'hovered' | 'locked',
      action: 'click' | 'close' | 'mouseEnter' | 'mouseLeave'
    ) => {
      switch (action) {
        case 'click':
          return 'locked'
        case 'close':
          if (state === 'locked') return 'closed'
          return state
        case 'mouseEnter':
          if (state === 'closed') return 'hovered'
          return state
        case 'mouseLeave':
          if (state === 'hovered') return 'closed'
          return state
      }
    },
    'closed'
  )
  const show = showState !== 'closed'
  // コンテナの外側をクリックされたら閉じる
  useRootClose(container, () => dispatch('close'))

  return (
    <div
      ref={container}
      className={styles.body__inReplyTo}
      onMouseLeave={() => dispatch('mouseLeave')}
    >
      <a
        ref={trigger}
        href={href}
        target="_blank"
        rel="noopener"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          dispatch('click')
        }}
        onMouseEnter={() => dispatch('mouseEnter')}
      >
        {'>>'}
        {inReplyToId}
      </a>
      <Overlay
        container={container}
        target={trigger}
        show={show}
        placement="top-start"
      >
        {({ props }) => (
          <div
            {...props}
            className={styles.overlay}
            onClick={() => dispatch('click')}
          >
            {inReplyToContent}
          </div>
        )}
      </Overlay>
    </div>
  )
}

type PostProps = {
  post: Post
  metaEnabled: boolean
  setModalContent: (albumFile: AlbumFile | null) => void
  inReplyToContent?: React.ReactNode
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
}
export default ({
  post,
  post: { author },
  metaEnabled,
  setModalContent,
  inReplyToContent,
  setInReplyTo,
}: PostProps) => {
  return useMemo(
    () => (
      <div className={styles.post}>
        <div
          className={styles.icon}
          onClick={() =>
            setInReplyTo((inReplyTo) =>
              inReplyTo === post.id ? null : post.id
            )
          }
        >
          <Avatar account={post.author} className={styles.icon__img} />
          <div className="uil uil-corner-up-left-alt"></div>
        </div>
        <div className={styles.head}>
          <span
            className={[
              styles.displayName,
              // FIXME: DIRTY!
              author.name.trim().length === 0 ? styles.empty : '',
            ].join(' ')}
          >
            {author.name}
          </span>
          <div className={styles.block}>
            <span className={styles.screenName}>@{author.screenName}</span>
            <span className={styles.right}>
              <a
                className={styles.time}
                target="_blank"
                href={`${(() => {
                  const u = new URL(config.sea)
                  u.pathname = `/posts/${post.id}`
                  return u.href
                })()}`}
              >
                <DateTime dt={post.createdAt} />
              </a>
            </span>
          </div>
        </div>
        {post.inReplyToId && (
          <InReplyTo
            inReplyToId={post.inReplyToId}
            inReplyToContent={inReplyToContent}
          />
        )}
        <Body bodyNodes={post.nodes} className={styles.body} />
        {0 < post.files.length && (
          <Files albumFiles={post.files} setModalContent={setModalContent} />
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
