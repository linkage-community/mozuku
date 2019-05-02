import * as React from 'react'

export default ({
  draft,
  draftDisabled,
  submitDraft,
  setDraft
}: {
  draft: string
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitDraft()
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
      submitDraft()
    }
  }
  const onChangeDraft = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value)
  }

  return (
    <form className="postForm" onSubmit={onSubmit}>
      <textarea
        className="postForm__textarea"
        onChange={onChangeDraft}
        value={draft}
        disabled={draftDisabled}
        onKeyDown={onKeyDown}
        placeholder="What's up Otaku?"
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
}
