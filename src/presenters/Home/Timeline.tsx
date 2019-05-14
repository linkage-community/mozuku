import * as React from 'react'

import { Post as PostModel } from '../../models'
import Post from '../Post'

export default ({
  posts,
  readMore,
  readMoreDisabled,
  enablePostMeta = false
}: {
  posts: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
  enablePostMeta?: boolean
}) => (
  <ul className="timeline">
    {posts.map(post => (
      <li className="timelineItem" key={post.id}>
        <Post post={post} enableMeta={enablePostMeta} />
      </li>
    ))}
    <li className="timelineItem">
      <button
        className="timelineItem__readMore"
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
