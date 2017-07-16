import { h } from 'preact'
import Bar from './bar'
import Tip from './tip'
import { MemoryInfo, toGiga } from '../util'

const MemoryComponent = ({ capacity, availableCapacity }: MemoryInfo) => {
  const memoryStyle = {
    width: `${100 * (1 - availableCapacity / capacity)}%`,
  }

  const usages = [
    {
      color: '#198e88',
      ratio: 1 - availableCapacity / capacity,
    },
  ]

  return (
    <div className="memory">
      <h2>Memory</h2>
      <Tip>
        Available: {toGiga(availableCapacity)}GB/{toGiga(capacity)}GB
      </Tip>
      <Bar borderColor="#8fd8d4" usages={usages} />
    </div>
  )
}

export default MemoryComponent
