import * as React from 'react'

import { Post as PostModel } from '../../models'
import Post from '../Post'

export default ({
  timeline,
  readMore,
  readMoreDisabled,
  enablePostMeta = false
}: {
  timeline: PostModel[]
  readMore: () => void
  readMoreDisabled: boolean
  enablePostMeta?: boolean
}) => (
  <ul className="timeline">
    {timeline.map(post => (
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
