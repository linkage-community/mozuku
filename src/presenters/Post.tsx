import * as React from 'react'

import { Post } from '../models'

export default ({ post }: { post: Post }) => (
  <div>
    <b>{post.author.name}</b> @{post.author.screenName} [{post.application.name}] {post.createdAt.toString()}
    <br />
    {post.text}
  </div>
)
