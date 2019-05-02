import * as React from 'react'
const { useState, useEffect } = React
import { useObserver } from 'mobx-react-lite'

import seaClient from '../util/seaClient'
import App from '../stores/app'

import Home from '../presenters/Home'

export default () => {
  useEffect(() => {
    App.startTimelinePolling()
    return () => {
      App.stopTimelinePolling()
    }
  }, [])

  const [draftText, setDraftText] = useState('')
  const [draftDisabled, setDraftDisabled] = useState(false)
  const onUpdateDraft = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    setDraftText(event.target.value)
  }
  const onSubmitDraft = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDraftDisabled(true)
    if (draftText.trim().length > 0) {
      await seaClient.post('/v1/posts', { text: draftText })
      setDraftText('')
    }
    setDraftDisabled(false)
  }

  return useObserver(() => (
    <Home
      draftText={draftText}
      draftDisabled={draftDisabled}
      onSubmitDraft={onSubmitDraft}
      onUpdateDraft={onUpdateDraft}
      timeline={App.timeline}
    />
  ))
}
