import * as React from 'react'

import { Post as PostModel } from '../../../models'
import Post from '../../Post'

import * as styles from './timeline.css'

export default ({
  posts,
  readMore,
  readMoreDisabled,
  postMetaEnabled = false
}: {
  posts: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
  postMetaEnabled?: boolean
}) => (
  <ul className={styles.timeline}>
    {posts.map(post => (
      <li key={post.id}>
        <Post post={post} metaEnabled={postMetaEnabled} />
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
)
