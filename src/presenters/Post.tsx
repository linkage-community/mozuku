import * as React from 'react'
import moment from 'moment-timezone'

import { Post } from '../models'

export default ({ post }: { post: Post }) => (
  <div className="post">
    <div className="post__head post-head">
      <div className="post-head__name">
        <span className="post-head__name__name">{post.author.name}</span>
        <span className="post-head__name__screenName">@{post.author.screenName}</span>
      </div>
      <div className="post-head__time">
        {moment(post.createdAt.toString()).tz('Asia/Tokyo').format('HH:mm:ss · D MMM YYYY')}
      </div>
    </div>
    <div className="post__body">
      {post.text}
    </div>
    <div className="post__meta">
      This post from {post.application.name}
    </div>
  </div>
)
