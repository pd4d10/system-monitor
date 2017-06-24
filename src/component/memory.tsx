import { h } from 'preact'
import Bar from './bar'
import Tip from './tip'

interface Info {
  total: number
  available: number
}

const borderColor = '#8fd8d4'

const MemoryComponent = ({ total, available }: Info) => {
  const memoryStyle = {
    width: `${100 * (1 - (available / total))}%`,
  }

  const usages = [
    {
      color: '#198e88',
      ratio: 1 - available / total
    }
  ]

  return (
    <div className="memory">
      <h2>Memory</h2>
      <Tip>{`total: ${total}G / available: ${available}G`}</Tip>
      <Bar borderColor={borderColor} usages={usages} />
    </div>
  )
}

export default MemoryComponent
