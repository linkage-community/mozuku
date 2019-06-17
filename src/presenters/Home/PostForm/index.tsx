import * as React from 'react'
import * as styles from './postForm.css'
import AlbumFile from '../../../models/AlbumFile'
const { forwardRef, useState } = React

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
  rows: number
  setRows: (r: number) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: AlbumFile[]
  onFileCancelClick: (n: number) => void
}
export default forwardRef<HTMLTextAreaElement, T>(
  (
    {
      draftDisabled,
      submitDraft,
      setDraft,
      draft,
      rows,
      setRows,
      onFileSelect,
      files,
      onFileCancelClick
    },
    ref
  ) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitDraft()
    }
    const onFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!event.currentTarget.value.trim().length && rows < 2)
        setRows(rows + 1)
      if (event.currentTarget.clientWidth < 720)
        event.currentTarget.scrollIntoView(true)
    }
    const onBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!event.target.value.trim().length)
        if (files.length) setRows(4)
        else setRows(1)
    }
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
        submitDraft()
      }
    }
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.target.value)
      if (event.target.clientHeight < event.target.scrollHeight)
        setRows(rows + 1)
    }

    return (
      <form className={styles.postForm} onSubmit={onSubmit}>
        <textarea
          rows={rows}
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
        <div className={styles.files}>
          {files.map(file => (
            <div className={styles.file} key={file.id}>
              <picture>
                {file.thumbnails.map(thumbnail => (
                  <source
                    key={thumbnail.id}
                    srcSet={thumbnail.url.href}
                    type={thumbnail.mime}
                  />
                ))}
                <img title={file.fileName} />
              </picture>
              <div
                className={styles.fileCancelButton}
                onClick={() => onFileCancelClick(file.id)}
              >
                x
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttons}>
          <button className={styles.button} disabled={draftDisabled}>
            <label htmlFor="fileSelector">
              {draftDisabled ? '🤔' : '📎'}
              <input
                type="file"
                id="fileSelector"
                style={{ display: 'none' }}
                onChange={onFileSelect}
                disabled={draftDisabled}
              />
            </label>
          </button>
          <button
            type="submit"
            className={styles.button}
            disabled={draftDisabled}
          >
            ✈️
          </button>
        </div>
      </form>
    )
  }
)
