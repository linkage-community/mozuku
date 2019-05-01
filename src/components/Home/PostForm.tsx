import * as React from 'react'

export default ({ onSubmit, onUpdateDraft }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onUpdateDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }
) => (
  <form onSubmit={onSubmit}>
    <textarea onChange={onUpdateDraft}></textarea><br />
    <button type="submit">投下する</button>
  </form>
)
