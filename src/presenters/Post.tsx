import * as React from 'react'
const { useMemo } = React

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'
import DateTime from './DateTime'
import OGCard from './OGCard'
import Image from './Post/Image'

type PostProps = {
  post: Post
  metaEnabled: boolean
}
export default ({ post, post: { author }, metaEnabled }: PostProps) => {
  return useMemo(
    () => (
      <div className="post">
        <div className="post__head post-head">
          <div className="post-head__name">
            <span
              className={`post-head__name__name ${
                // FIXME: DIRTY!
                author.name.trim().length === 0 ? 'empty' : ''
              }`}
            >
              {author.name}
            </span>
            <span className="post-head__name__screenName">
              @{author.screenName}
            </span>
          </div>
          <DateTime className="post-head__time" dt={post.createdAt} />
        </div>
        <div className="post__body">
          {post.body.parts.map((p, i) => {
            switch (p.type) {
              case BODYPART_TYPE_LINK:
              case BODYPART_TYPE_LINK_IMAGE:
                return (
                  <a key={i} href={p.payload} target="_blank">
                    {decodeURI(p.payload)}
                  </a>
                )
              case BODYPART_TYPE_BOLD:
                return (
                  <span key={i} className="post__body__bold">
                    {p.payload}
                  </span>
                )
              default:
                return <React.Fragment key={i}>{p.payload}</React.Fragment>
            }
          })}
        </div>
        <Image albumFiles={post.files} images={post.images} />
        {post.body.parts.map((p, i) => {
          switch (p.type) {
            case BODYPART_TYPE_LINK:
              return (
                <OGCard key={i} url={p.payload} className={'post__ogcard'} />
              )
            default:
              return <React.Fragment key={i} />
          }
        })}
        <div className={'post__meta ' + (metaEnabled ? 'enabled' : '')}>
          via {post.application.name}
        </div>
      </div>
    ),
    [author.name]
  )
}
