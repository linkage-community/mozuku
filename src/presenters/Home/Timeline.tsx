import * as React from 'react'

import { Post as PostModel } from '../../models'
import Post from '../Post'

export default ({ timeline }: { timeline: PostModel[] }) => (
  <ul className="timeline">
    {timeline.map(post => (
      <li className="timelineItem" key={post.id}>
        <Post post={post} />
      </li>
    ))}
  </ul>
)
