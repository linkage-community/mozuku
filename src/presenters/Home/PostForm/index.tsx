import * as React from 'react'
import * as styles from './postForm.css'
const { forwardRef } = React

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
}
export default forwardRef<HTMLTextAreaElement, T>(
  ({ draftDisabled, submitDraft, setDraft, draft }, ref) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitDraft()
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
          className={styles.textarea}
          disabled={draftDisabled}
          onKeyDown={onKeyDown}
          onChange={onChange}
          ref={ref}
          placeholder="What's up Otaku?"
          value={draft}
        />
        <button
          className={styles.button}
          type="submit"
          disabled={draftDisabled}
        >
          Send to Sea
        </button>
      </form>
    )
  }
)
