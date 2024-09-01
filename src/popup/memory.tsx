import React from 'react'
import { Tip, Title, Bar } from './styled'
import { toGiga } from '../utils'

const MemoryComponent = ({ capacity, availableCapacity }) => {
  const memoryStyle = {
    width: `${100 * (1 - availableCapacity / capacity)}%`,
  }
  return (
    <div>
      <Title>Memory</Title>
      <Tip>
        Available: {toGiga(availableCapacity)}GB/{toGiga(capacity)}GB
      </Tip>
      <Bar
        borderColor="#8fd8d4"
        usages={[
          {
            color: '#198e88',
            ratio: 1 - availableCapacity / capacity,
          },
        ]}
      />
    </div>
  )
}

export default MemoryComponent
