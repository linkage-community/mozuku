import * as React from 'react'

export default ({ onSubmit, onUpdateDraft, draft, draftDisabled }: {
  draft: string,
  draftDisabled: boolean,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onUpdateDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }
) => (
  <form onSubmit={onSubmit}>
    <textarea onChange={onUpdateDraft} value={draft} disabled={draftDisabled} /><br />
    <button type="submit" disabled={draftDisabled} >海に流す</button>
  </form>
)
