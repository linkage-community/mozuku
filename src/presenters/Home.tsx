import * as React from 'react'

import { Post } from '../models'

import PostForm from './Home/PostForm'
import Timeline from './Home/Timeline'

export default ({
  timeline,
  onSubmitDraft,
  onUpdateDraft,
  draftText,
  draftDisabled,
  onKeyDown
}: {
  timeline: Post[]
  draftText: string
  draftDisabled: boolean
  onSubmitDraft: (e: React.FormEvent<HTMLFormElement>) => void
  onUpdateDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) => (
  <>
    <PostForm
      draft={draftText}
      draftDisabled={draftDisabled}
      onSubmit={onSubmitDraft}
      onUpdateDraft={onUpdateDraft}
      onKeyDown={onKeyDown}
    />
    <Timeline timeline={timeline} />
  </>
)
