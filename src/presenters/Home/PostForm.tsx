import * as React from 'react'
const { forwardRef } = React

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
}
export default forwardRef<HTMLTextAreaElement, T>(({
  draftDisabled,
  submitDraft,
  setDraft,
  draft,
}, ref) => {
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
    <form className="postForm" onSubmit={onSubmit}>
      <textarea
        className="postForm__textarea"
        disabled={draftDisabled}
        onKeyDown={onKeyDown}
        onChange={onChange}
        ref={ref}
        placeholder="What's up Otaku?"
        value={draft}
      />
      <button
        className="postForm__button"
        type="submit"
        disabled={draftDisabled}
      >
        Send to Sea
      </button>
    </form>
  )
})
