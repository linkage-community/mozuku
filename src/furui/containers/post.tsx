import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../stores'
import Post from '../presenters/post'
import { AlbumFile } from '../models'

export type PostContainerProps = Readonly<{
  postId: number
  setModalContent: (albumfile: AlbumFile | null) => void
  inReplyTo: number | null
  setInReplyTo: (id: number | null) => void
}>
const PostContainer = ({
  postId,
  setModalContent,
  inReplyTo,
  setInReplyTo,
}: PostContainerProps) => {
  return useObserver(() => {
    const post = appStore.posts.get(postId)
    if (post == null) return null

    const metaEnabled = appStore.getPreference(PREFERENCE_DISPLAY_META_ENABLED)

    return (
      <Post
        post={post}
        metaEnabled={metaEnabled}
        setModalContent={setModalContent}
        inReplyTo={inReplyTo}
        setInReplyTo={setInReplyTo}
        inReplyToContent={
          post.inReplyToId && (
            <PostContainer
              postId={post.inReplyToId}
              setModalContent={setModalContent}
              inReplyTo={inReplyTo}
              setInReplyTo={setInReplyTo}
            />
          )
        }
      />
    )
  })
}

export default PostContainer
