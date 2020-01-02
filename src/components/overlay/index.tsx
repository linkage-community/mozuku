import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Overlay: React.FC = ({ children }) => {
  const overlayEl = document.getElementById('overlay')
  if (!overlayEl) {
    throw new Error('NO OVERLAY DOM')
  }
  return ReactDOM.createPortal(
    // FIXME
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        left: 0,
        top: 0
      }}
    >
      {children}
    </div>,
    overlayEl
  )
}
export default Overlay
