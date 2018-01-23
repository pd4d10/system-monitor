import React from 'react'

export const Tip = ({ children }) => (
  <p
    style={{
      fontSize: 14,
      margin: '4px 0',
    }}
  >
    {children}
  </p>
)

export const Title = ({ children }) => (
  <h2
    style={{
      margin: '8px 0',
    }}
  >
    {children}
  </h2>
)

export default Tip
