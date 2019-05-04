import * as React from 'react'
const { useState } = React

import seaClient from '../../util/seaClient'

import PostForm from '../../presenters/Home/PostForm'

export default () => {
  const [draft, setDraft] = useState('')
  const [draftDisabled, setDraftDisabled] = useState(false)
  const submitDraft = async () => {
    setDraftDisabled(true)
    if (draft.trim().length > 0) {
      try {
        await seaClient.post('/v1/posts', { text: draft })
        setDraft('')
      } catch (e) {
        // TODO: Add error reporting
        console.error(e)
      }
    }
    setDraftDisabled(false)
  }

  return (
    <PostForm
      draft={draft}
      setDraft={setDraft}
      draftDisabled={draftDisabled}
      submitDraft={submitDraft}  />
  )
}