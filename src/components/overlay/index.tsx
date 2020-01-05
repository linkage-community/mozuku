import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Overlay: React.FC = ({ children }) => {
  const overlayEl = document.getElementById('overlay')
  if (!overlayEl) {
    throw new Error('NO OVERLAY DOM')
  }
  return ReactDOM.createPortal(
    // FIXME
    children,
    overlayEl
  )
}
export default Overlay
