import * as React from 'react'

import { Post } from '../../models'

export default ({ timeline }: { timeline: Post[] }) => (
  <ul>
    { timeline.map(post => (
      <li key={post.id}>
        @{post.author.screenName} {post.text}
      </li>
    )) }
  </ul>)
