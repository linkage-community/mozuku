import * as React from 'react'

export default ({name, screenName}: { name: string, screenName: string }) => {
  return (
    <>
      {name} @{screenName}
    </>
  )
}
