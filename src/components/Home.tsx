import * as React from 'react'

import { Post } from '../models'

import PostForm from './Home/PostForm'
import Timeline from './Home/Timeline'

export default ({ timeline, isTimelineLoaded, onSubmitDraft, onUpdateDraft }: {
  timeline: Post[],
  isTimelineLoaded: boolean,
  onSubmitDraft: (e: React.FormEvent<HTMLFormElement>) => void,
  onUpdateDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => (<>
  <PostForm onSubmit={onSubmitDraft} onUpdateDraft={onUpdateDraft} />
  { isTimelineLoaded && <Timeline timeline={timeline} /> }
</>)
