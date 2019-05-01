/*
 * mozuku - One Mozuku
 * Copyright (C) 2019 otofune <otofune@otofune.me>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as React from 'react'
const { useState } = React

import { Switch, Redirect } from "react-router"
import { Route, Link } from 'react-router-dom'

import My from './My'

export default () => {
  return (
    <div className="mozuku-layout">
      <Switch>
        <Route exact path="/my" component={My} />
        <Route component={() => {
          const [path, setPath] = useState('')
          const [go, setGo] = useState(false)
          return (<>
            <h1>Not Found</h1>
            <input onChange={(ev) => setPath(ev.target.value)} />
            <button onClick={(ev) => { ev.preventDefault(); setGo(true) }} />
            { go && <Redirect to={{ pathname: path }} /> }
          </>)
        }} />
      </Switch>
    </div>
  )
}
