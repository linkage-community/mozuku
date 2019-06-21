import * as React from 'react'
import * as styles from './postForm.css'
import AlbumFile from '../../../models/AlbumFile'
import Textarea from 'react-textarea-autosize'
const { forwardRef, useState } = React

type T = {
  draftDisabled: boolean
  submitDraft: () => void
  setDraft: (t: string) => void
  draft: string
  onPaste: (e: React.ClipboardEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: AlbumFile[]
  onFileCancelClick: (n: number) => void
  isUploading: boolean
}
export default forwardRef<HTMLTextAreaElement, T>(
  (
    {
      draftDisabled,
      submitDraft,
      setDraft,
      draft,
      onPaste,
      onFileSelect,
      files,
      onFileCancelClick,
      isUploading
    },
    ref
  ) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitDraft()
    }
    const onFocus = (event: React.FocusEvent<HTMLFormElement>) => {
      if (event.currentTarget.clientWidth < 720) {
        event.currentTarget.scrollIntoView(true)
        window.scrollTo(0, event.currentTarget.offsetTop)
      }
    }
    const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
      const textarea = event.currentTarget.querySelector('textarea')!
      if (!textarea.value.trim().length) {
        setDraft('')
      }
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
      <div className={styles.wrapper}>
        <form
          className={styles.postForm}
          onSubmit={onSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <Textarea
            className={styles.textarea}
            disabled={draftDisabled}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onPaste={onPaste}
            inputRef={ref!}
            placeholder="What's up Otaku?"
            value={draft}
          ></Textarea>
          <label className={styles.attachButton} htmlFor="fileSelector">
            {isUploading ? (
              <i className={`uil uil-polygon ${styles.spin}`} />
            ) : (
              <i className="uil uil-image-v" />
            )}
            <input
              type="file"
              id="fileSelector"
              style={{ display: 'none' }}
              onChange={onFileSelect}
              disabled={draftDisabled}
            />
          </label>
          <button
            type="submit"
            className={styles.postButton}
            disabled={draftDisabled}
          >
            <i className="uil uil-anchor" />
            Post
          </button>
        </form>
        <div
          className={styles.files}
          style={
            !files.length
              ? {
                  height: '0px',
                  padding: '0'
                }
              : {}
          }
        >
          {files.map(file => (
            <div className={styles.file} key={file.id}>
              <div
                className={styles.fileThumbnail}
                style={{ backgroundImage: `url(${file.thumbnail.url})` }}
              />
              <div
                className={styles.fileCancelButton}
                onClick={() => onFileCancelClick(file.id)}
              >
                <i className="uil uil-times" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
