import * as React from 'react'

import { Post } from '../models'

import PostForm from './Home/PostForm'
import Timeline from './Home/Timeline'

export default ({
  timeline,
  draft,
  draftDisabled,
  setDraft,
  submitDraft
}: {
  timeline: Post[]
  draft: string
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
}) => (
  <>
    <PostForm
      draft={draft}
      draftDisabled={draftDisabled}
      setDraft={setDraft}
      submitDraft={submitDraft}
    />
    <Timeline timeline={timeline} />
  </>
)
