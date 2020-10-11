import * as React from 'react'
const { useState, useRef } = React

import seaAPI from '../../sea-api'
import { appStore } from '../../furui/stores'
import parse, * as bottlemail from '@linkage-community/bottlemail'

import { useBrowserHooks } from '../browser-provider'

import PostFormLayout from './post-form'
import { AlbumFile, Post } from '../../furui/models'

const removeUselessCharactorFromLink = (nodes: bottlemail.NodeType[]) =>
  nodes
    .map((n) => {
      switch (n.kind) {
        case bottlemail.LinkKind:
          // bottlemail が除去するので、それに任せる
          return n.value
        default:
          return n.raw
      }
    })
    .join('')

export type PostFormProps = Readonly<{
  draftDisabled: boolean
  files: AlbumFile[]
  inReplyTo: number | null
  replyToPost: Post | null
  setDraftDisabled: (b: boolean) => void
  setFiles: (f: AlbumFile[]) => void
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
  uploadAlbumFile: (f: File) => void
}>

const PostForm: React.FC<PostFormProps> = ({
  draftDisabled,
  files,
  inReplyTo,
  replyToPost,
  setDraftDisabled,
  setFiles,
  setInReplyTo,
  uploadAlbumFile,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { useShortcut, usePreventUnload } = useBrowserHooks()
  useShortcut('n'.charCodeAt(0), (ev) => {
    const el = textareaRef.current!
    if (el.isEqualNode(document.activeElement)) return
    ev.preventDefault()
    textareaRef.current!.focus()
  })
  const [draft, setDraft] = useState('')
  usePreventUnload(() => draft.length !== 0)
  const submitDraft = async () => {
    setDraftDisabled(true)
    if (0 < draft.trim().length || 0 < files.length) {
      try {
        const payload: {
          text: string
          fileIds: number[]
          inReplyToId?: number
        } = {
          text: removeUselessCharactorFromLink(parse(draft)),
          fileIds: files.map((file) => file.id),
        }
        if (inReplyTo) {
          payload.inReplyToId = inReplyTo
        }
        await seaAPI.post('/v1/posts', payload)
        setDraft('')
        setFiles([])
        setInReplyTo(null)
      } catch (e) {
        // TODO: Add error reporting
        console.error(e)
      }
    }
    setDraftDisabled(false)
  }
  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files != null) {
      await Array.from(event.target.files).map(
        async (file) => await uploadAlbumFile(file)
      )
    }
  }
  const onPaste = async (event: React.ClipboardEvent) => {
    if (draftDisabled) return
    await Array.from(event.clipboardData.files)
      .filter((file) => file.type.split('/').shift() == 'image')
      .map(async (file) => await uploadAlbumFile(file))
  }
  const onFileCancelClick = async (fileId: number) => {
    setFiles(files.filter((file) => file.id != fileId))
  }

  return (
    <PostFormLayout
      ref={textareaRef}
      draft={draft}
      setDraft={setDraft}
      draftDisabled={draftDisabled}
      submitDraft={submitDraft}
      onPaste={onPaste}
      onFileSelect={onFileSelect}
      files={files}
      onFileCancelClick={onFileCancelClick}
      isUploading={appStore.isUploading}
      inReplyTo={inReplyTo}
      setInReplyTo={setInReplyTo}
      replyToPost={replyToPost}
    />
  )
}
export default PostForm
