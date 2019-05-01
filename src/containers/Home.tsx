import * as React from 'react'
const { useState } = React
import usePromise from 'react-use-promise'

import seaClient from '../util/seaClient'

import { Post } from '../models'

import Home from '../presenters/Home'

export default () => {
  const [timeline,,fetchTimelineState] = usePromise<Post[]>(() => seaClient.get('/v1/timelines/public').then(
    posts => posts.map((post: any) => new Post(post))
  ), [])

  const [draftText, setDraftText] = useState('')
  const onUpdateDraft = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    setDraftText(event.target.value)
  }
  const onSubmitDraft = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await seaClient.post('/v1/posts', { text: draftText })
    setDraftText('')
  }

  return (
    <Home
      onSubmitDraft={onSubmitDraft}
      onUpdateDraft={onUpdateDraft}
      timeline={timeline}
      isTimelineLoaded={fetchTimelineState === 'resolved'}
    />)
}
