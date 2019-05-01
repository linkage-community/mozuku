import * as React from 'react'

import { Post as PostModel } from '../../models'
import Post from '../Post'

export default ({ timeline }: { timeline: PostModel[] }) => (
  <ul>
    { timeline.map(post => (
      <li key={post.id}>
        <Post post={post} />
      </li>
    )) }
  </ul>)
