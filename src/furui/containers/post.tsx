import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../stores'
import Post from '../presenters/post'
import { AlbumFile } from '../models'

export type PostContainerProps = Readonly<{
  postId: number
  setModalContent: (albumfile: AlbumFile | null) => void
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
}>
const PostContainer = ({
  postId,
  setModalContent,
  setInReplyTo,
}: PostContainerProps) => {
  return useObserver(() => {
    const post = appStore.posts.get(postId)
    if (post == null) {
      appStore.fetchPost(postId)
      return null
    }

    const metaEnabled = appStore.getPreference(PREFERENCE_DISPLAY_META_ENABLED)

    return (
      <Post
        post={post}
        metaEnabled={metaEnabled}
        setModalContent={setModalContent}
        setInReplyTo={setInReplyTo}
        inReplyToContent={
          post.inReplyToId && (
            <PostContainer
              postId={post.inReplyToId}
              setModalContent={setModalContent}
              setInReplyTo={setInReplyTo}
            />
          )
        }
      />
    )
  })
}

export default PostContainer
