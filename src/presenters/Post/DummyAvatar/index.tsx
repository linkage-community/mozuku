import * as React from 'react'
import { noSelect } from './index.css'

export default ({ name, className }: { name: string; className: string }) => (
  <svg className={className}>
    <rect width="100%" height="100%" style={{ fill: 'var(--color-base)' }} />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      fontStyle="bold"
      dominantBaseline="central"
      className={noSelect}
    >
      {name.substr(0, 1).toUpperCase()}
    </text>
  </svg>
)
