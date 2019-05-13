import * as React from 'react'
import moment from 'moment-timezone'

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'

export default ({ post, enableMeta }: { post: Post; enableMeta: boolean }) => (
  <div className="post">
    <div className="post__head post-head">
      <div className="post-head__name">
        <span
          className={`post-head__name__name ${
            // FIXME: DIRTY!
            post.author.name.trim().length === 0 ? 'empty' : ''
          }`}
        >
          {post.author.name}
        </span>
        <span className="post-head__name__screenName">
          @{post.author.screenName}
        </span>
      </div>
      <div className="post-head__time">
        {moment(post.createdAt)
          .tz('Asia/Tokyo')
          .format('HH:mm:ss · D MMM YYYY')}
      </div>
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
    {post.images.length ? (
      <div className="post__image">
        {post.images.map((im, k) => (
          <a key={k} href={im.direct} target="_blank">
            <img className="post-image__img" src={im.thumbnail} />
          </a>
        ))}
      </div>
    ) : (
      <></>
    )}
    {post.files.length ? (
      post.files.map(im => (
        <div className="post__image" key={im.id}>
          <picture>
            {im.variants.map(vr => (
              <source key={vr.id} srcSet={vr.url} type={vr.mime} />
            ))}
            <img
              title={im.name}
              className="post-image__img"
              onClick={e => window.open(e.currentTarget.currentSrc, '_blank')}
            />
          </picture>
        </div>
      ))
    ) : (
      <></>
    )}
    <div className={'post__meta ' + (enableMeta ? 'enabled' : '')}>
      via {post.application.name}
    </div>
  </div>
)
