import * as React from 'react'
const { useState } = React

import Layout from '../components/Layout'

export default () => {
  const [path,updatePath] = useState('')
  return (<Layout path={path} onChange={updatePath} />)
}
