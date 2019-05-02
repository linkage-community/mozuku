import * as React from 'react'
import moment from 'moment-timezone'

import { Post, BODYPART_TYPE_LINK } from '../models'

export default ({ post }: { post: Post }) => (
  <div className="post">
    <div className="post__head post-head">
      <div className="post-head__name">
        <span className="post-head__name__name">{post.author.name}</span>
        <span className="post-head__name__screenName">
          @{post.author.screenName}
        </span>
      </div>
      <div className="post-head__time">
        {moment(post.createdAt.toString())
          .tz('Asia/Tokyo')
          .format('HH:mm:ss · D MMM YYYY')}
      </div>
    </div>
    <div className="post__body">{post.body.parts.map(p => {
      switch (p.type) {
        case BODYPART_TYPE_LINK:
          return (<a href={p.payload} target="_blank">{p.payload}</a>)
        default:
          return (<>{p.payload}</>)
      }
    })}</div>
    <div className="post__meta">This post from {post.application.name}</div>
  </div>
)
