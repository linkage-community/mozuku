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
      setIsExpanded(true)
    }
    const onBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!draft.length) setIsExpanded(false)
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
        submitDraft()
      }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.target.value)
    }

    return (
      <form className={styles.postForm} onSubmit={onSubmit}>
        <textarea
          style={{ height: isExpanded ? '128px' : '48px' }}
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
        <button
          style={{ bottom: isExpanded ? '20%' : '50%' }}
          className={styles.plusButton}
          type="submit"
          disabled={draftDisabled}
        >
          +
        </button>
        <button
          style={{ bottom: isExpanded ? '20%' : '50%' }}
          className={styles.submitButton}
          type="submit"
          disabled={draftDisabled}
        >
          Send to Sea
        </button>
      </form>
    )
  }
)
