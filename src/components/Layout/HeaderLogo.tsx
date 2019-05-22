import * as React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../static/logo.png'

const LogoImg = <img src={logo} width="64" height="64" alt="Mozuku" />

export default ({ disabled = false }: { disabled?: boolean }) => (
  <h1 className="mozuku-header__logo">
    {disabled ? LogoImg : <Link to={{ pathname: '/' }}>{LogoImg}</Link>}
  </h1>
)
