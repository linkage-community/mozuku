import * as React from 'react'
import * as styles from './post-form.css'
import { AlbumFile, Post } from '../../furui/models'
import Textarea from 'react-textarea-autosize'
const { forwardRef } = React
import Avatar from '../avatar'

export type PostFormProps = Readonly<{
  draft: string
  draftDisabled: boolean
  files: AlbumFile[]
  inReplyTo: number | null
  isUploading: boolean
  onFileCancelClick: (n: number) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPaste: (e: React.ClipboardEvent) => void
  replyToPost: Post | null
  setDraft: (t: string) => void
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
  submitDraft: () => void
}>

const PostForm = forwardRef<HTMLTextAreaElement, PostFormProps>(
  (
    {
      draft,
      draftDisabled,
      files,
      inReplyTo,
      isUploading,
      onFileCancelClick,
      onFileSelect,
      onPaste,
      replyToPost,
      setDraft,
      setInReplyTo,
      submitDraft,
    },
    ref
  ) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      submitDraft()
    }
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
        submitDraft()
      }
    }
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(e.target.value)
    }

    return (
      <div className={styles.wrapper}>
        <div
          style={{
            height: inReplyTo ? '32px' : '0px',
            opacity: inReplyTo ? 1 : 0,
          }}
          className={styles.replyAreaContainer}
        >
          {replyToPost && (
            <div className={styles.replyArea}>
              <div className={styles.replyContent}>
                <Avatar
                  account={replyToPost.author}
                  className={styles.replyAvatar}
                />
                <div className={styles.replyContentText}>
                  @{replyToPost.author.screenName}: {replyToPost.text}
                </div>
              </div>
              <div
                className={styles.replyCancel}
                onClick={() => setInReplyTo(null)}
              >
                <span className="uil uil-times" />
              </div>
            </div>
          )}
        </div>
        <form className={styles.postForm} onSubmit={onSubmit}>
          <Textarea
            className={styles.textarea}
            disabled={draftDisabled}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onPaste={onPaste}
            // FIXME: Textareaの型がおかしい(string & ...は明らかに不正)
            ref={ref as any}
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
              disabled={draftDisabled || isUploading}
            />
          </label>
          <button
            type="submit"
            className={styles.postButton}
            disabled={draftDisabled || isUploading}
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
                  padding: '0',
                }
              : {}
          }
        >
          {files.map((file) => (
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
export default PostForm
