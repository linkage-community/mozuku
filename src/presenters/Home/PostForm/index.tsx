import * as React from 'react'
import * as styles from './postForm.css'
const { forwardRef, useState } = React

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
  setIsExpanded: (b: boolean) => void
  isExpanded: boolean
}
export default forwardRef<HTMLTextAreaElement, T>(
  (
    { draftDisabled, submitDraft, setDraft, draft, setIsExpanded, isExpanded },
    ref
  ) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitDraft()
    }
    const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!event.currentTarget.value.length) event.currentTarget.rows++
      if (event.currentTarget.clientWidth < 720)
        event.currentTarget.scrollIntoView(true)
    }
    const onBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!event.target.value.length) event.target.rows = 1
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
        submitDraft()
      }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.target.value)
      if (event.target.clientHeight < event.target.scrollHeight)
        event.target.rows++
    }

    return (
      <>
        <form className={styles.postForm} onSubmit={onSubmit}>
          <textarea
            rows={1}
            className={styles.textarea}
            disabled={draftDisabled}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={ref}
            placeholder="What's up Otaku?"
            value={draft}
          />
        </form>
        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.button}
            disabled={draftDisabled}
          >
            📎
          </button>
          <button
            type="submit"
            className={styles.button}
            disabled={draftDisabled}
          >
            ✈️
          </button>
        </div>
      </>
    )
  }
)
