import * as React from 'react'
const { useState, useRef } = React

import seaClient from '../../util/seaClient'
import { useShortcut, appStore } from '../../stores'

import PostForm from '../../presenters/Home/PostForm'
import AlbumFile from '../../models/AlbumFile'

export default () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // 110 = n
  useShortcut(110, ev => {
    const el = textareaRef.current!
    if (el.isEqualNode(document.activeElement)) return
    ev.preventDefault()
    textareaRef.current!.focus()
  })

  const [rows, setRows] = useState(1)
  const [files, setFiles] = useState([] as AlbumFile[])
  const [draft, setDraft] = useState('')
  const [draftDisabled, setDraftDisabled] = useState(false)
  const submitDraft = async () => {
    setDraftDisabled(true)
    if (draft.trim().length > 0 || 1 <= files.length) {
      try {
        await seaClient.post('/v1/posts', {
          text: draft,
          fileIds: files.map(file => file.id)
        })
        setDraft('')
        setFiles([])
        setRows(1)
      } catch (e) {
        // TODO: Add error reporting
        console.error(e)
      }
    }
    setDraftDisabled(false)
  }
  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setDraftDisabled(true)
      Array.from(event.target.files).map(async file => {
        const upload = await appStore.uploadAlbumFile(file.name, file)
        if (rows < 4) setRows(4)
        setFiles(files => [...files, upload])
      })
      setDraftDisabled(false)
    }
  }
  const onFileCancelClick = async (fileId: number) => {
    setFiles(files.filter(file => file.id != fileId))
  }

  return (
    <PostForm
      ref={textareaRef}
      draft={draft}
      setDraft={setDraft}
      draftDisabled={draftDisabled}
      submitDraft={submitDraft}
      rows={rows}
      setRows={setRows}
      onFileSelect={onFileSelect}
      files={files}
      onFileCancelClick={onFileCancelClick}
    />
  )
}
