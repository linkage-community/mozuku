import * as React from 'react'

import { Post as PostModel, AlbumFile } from '../../../models'
import { Post } from '../../../presenters'

import * as styles from './timeline.css'

import { InView } from 'react-intersection-observer'
import FileModal from '../../../../components/file-modal'

export default ({
  posts,
  readMore,
  readMoreDisabled,
  postMetaEnabled = false,
  modalContent,
  setModalContent,
  onModalClose,
  openInNewTab,
  inReplyTo,
  setInReplyTo
}: {
  posts: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
  postMetaEnabled?: boolean
  modalContent: AlbumFile | null
  setModalContent: (albumFile: AlbumFile | null) => void
  onModalClose: () => void
  openInNewTab: (path: string) => void
  inReplyTo: number | null
  setInReplyTo: (n: number | null) => void
}) => (
  <>
    {modalContent && (
      <FileModal
        file={modalContent}
        openInNewTab={openInNewTab}
        onClose={onModalClose}
      />
    )}
    <ul className={styles.timeline}>
      {posts.map(post => (
        <li key={post.id}>
          <Post
            post={post}
            metaEnabled={postMetaEnabled}
            setModalContent={setModalContent}
            inReplyTo={inReplyTo}
            setInReplyTo={setInReplyTo}
          />
        </li>
      ))}
      <InView
        as="li"
        threshold={1.0}
        onChange={inView => {
          if (inView && 0 < posts.length) {
            readMore()
          }
        }}
      >
        <button
          className={styles.readmore_button}
          disabled={readMoreDisabled}
          onClick={e => {
            e.preventDefault()
            readMore()
          }}
        >
          {readMoreDisabled ? 'LOADING...' : 'READ MORE'}
        </button>
      </InView>
    </ul>
  </>
)
