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

  const [draft, setDraft] = useState('')
  const [draftDisabled, setDraftDisabled] = useState(false)
  const submitDraft = async () => {
    setDraftDisabled(true)
    if (draft.trim().length > 0) {
      await seaClient.post('/v1/posts', { text: draft })
      setDraft('')
    }
    setDraftDisabled(false)
  }

  return useObserver(() => (
    <Home
      draft={draft}
      draftDisabled={draftDisabled}
      setDraft={setDraft}
      submitDraft={submitDraft}
      timeline={App.timeline}
    />
  ))
}
