import * as React from 'react'

export default ({
  onSubmit,
  onUpdateDraft,
  draft,
  draftDisabled,
  onKeyDown
}: {
  draft: string
  draftDisabled: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onUpdateDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}) => (
  <form className="postForm" onSubmit={onSubmit}>
    <textarea
      className="postForm__textarea"
      onChange={onUpdateDraft}
      value={draft}
      disabled={draftDisabled}
      onKeyDown={onKeyDown}
      placeholder="What's up Otaku?"
    />
    <button className="postForm__button" type="submit" disabled={draftDisabled}>
      Send to Sea
    </button>
  </form>
)
