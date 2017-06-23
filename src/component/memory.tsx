import { h } from 'preact'
import './memory.less'

const MemoryComponent = ({ total, available }) => {
  const memoryStyle = {
    width: `${100 * (1 - (available / total))}%`,
  }

  return (
    <div className="memory">
      <h2>Memory</h2>
      <p>{`total: ${total}G / available: ${available}G`}</p>
      <div className="usage">
        <div style={memoryStyle} />
      </div>
    </div>
  )
}

export default MemoryComponent
