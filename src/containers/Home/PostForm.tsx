import * as React from 'react'
const { useState, useRef, useEffect } = React

import seaClient from '../../util/seaClient'
import App from '../../stores/app'

import PostForm from '../../presenters/Home/PostForm'

export default () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    // n key
    const key = 110    
    App.addShortcut(key, (ev) => {
      const el = textareaRef.current!
      if (el.isEqualNode(document.activeElement)) return
      ev.preventDefault()
      textareaRef.current!.focus()
    })
    return () => {
      App.removeShortcut(key)
    }
  }, [])

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
      ref={textareaRef}
      draft={draft}
      setDraft={setDraft}
      draftDisabled={draftDisabled}
      submitDraft={submitDraft}
    />
  )
}
