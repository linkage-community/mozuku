import React, { useMemo, useRef, useState, useReducer } from 'react'
import { Overlay } from 'react-overlays'

import { Post } from '../../models'
import { DateTime } from '../../presenters'
import { OGCard } from '../../containers'

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
              <a key={i} href={node.raw} target="_blank">
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
  // |        |<-------------------------------(click)---|        |
  // |        |<---------------------------(rootClose)---|        |
  const [showState, dispatch] = useReducer(
    (
      state: 'closed' | 'hovered' | 'locked',
      action: 'click' | 'rootClose' | 'mouseEnter' | 'mouseLeave'
    ) => {
      switch (action) {
        case 'click':
          if (state === 'locked') return 'closed'
          return 'locked'
        case 'rootClose':
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
        show={showState !== 'closed'}
        placement="top-start"
        // FIXME: リンクのクリックもrootCloseのクリック判定の対象になるので、固定状態であるとき以外発火しないようにする
        // これをしないと、'click'と'rootClose'が同時に発行されて'closed'になってしまう
        rootClose={showState === 'locked'}
        onHide={() => dispatch('rootClose')}
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
  inReplyTo: number | null
  inReplyToContent?: React.ReactNode
  setInReplyTo: (n: number | null) => void
}
export default ({
  post,
  post: { author },
  metaEnabled,
  setModalContent,
  inReplyTo,
  inReplyToContent,
  setInReplyTo,
}: PostProps) => {
  return useMemo(
    () => (
      <div className={styles.post}>
        <div className={styles.icon}>
          <Avatar account={post.author} className={styles.icon__img} />
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
              <button
                className={styles.reply}
                onClick={() => {
                  setInReplyTo(inReplyTo === post.id ? null : post.id)
                }}
              >
                <span
                  className={`uil ${
                    inReplyTo === post.id
                      ? `uil-comment-dots ${styles.reply__rotate}`
                      : 'uil-comment'
                  }`}
                />
              </button>
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
    [author.name, author.avatarFile && author.avatarFile.id, inReplyTo]
  )
}
