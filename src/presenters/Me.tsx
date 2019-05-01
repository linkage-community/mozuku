import * as React from 'react'
import { Moment } from 'moment'

export default ({name, screenName, createdAt }: { name: string, screenName: string, createdAt: Moment }) => {
  return (
    <>
      You are "{name}" (@{screenName}). This account was created at {createdAt.toLocaleString()}.
    </>
  )
}
