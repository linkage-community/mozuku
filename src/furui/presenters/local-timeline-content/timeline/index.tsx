import React from 'react'

import { AlbumFile } from '../../../models'

import * as styles from './timeline.css'

import { InView } from 'react-intersection-observer'
import FileModal from '../../../../components/file-modal'

export type TimelineProps = Readonly<{
  readMore: () => void
  readMoreDisabled: boolean
  modalContent: AlbumFile | null
  onModalClose: () => void
  openInNewTab: (path: string) => void
}>

export const Timeline: React.FC<TimelineProps> = ({
  children,
  readMore,
  readMoreDisabled,
  modalContent,
  onModalClose,
  openInNewTab,
}) => {
  const empty = React.Children.count(children) === 0
  return (
    <>
      {modalContent && (
        <FileModal
          file={modalContent}
          openInNewTab={openInNewTab}
          onClose={onModalClose}
        />
      )}
      <ul className={styles.timeline}>
        {children}
        <InView
          as="li"
          threshold={1.0}
          onChange={(inView) => {
            if (inView && !empty) {
              readMore()
            }
          }}
        >
          <button
            className={styles.readmore_button}
            disabled={readMoreDisabled}
            onClick={(e) => {
              e.preventDefault()
              readMore()
            }}
          >
            {readMoreDisabled ? 'LOADING...' : 'READ MORE'}
          </button>
        </InView>
      </ul>
    </>
  )
}

export const TimelineItem: React.FC = ({ children }) => <li>{children}</li>
