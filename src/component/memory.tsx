import * as React from 'react'
import style from './memory.css'

const MemoryComponent = ({ total, available }) => {
  const memoryStyle = {
    width: `${100 * (1 - (available / total))}%`,
  }

  return (
    <div>
      <h2>Memory</h2>
      <p className={style.tip}>{`total: ${total}G / available: ${available}G`}</p>
      <div className={style.data}>
        <div className={style.usage} style={memoryStyle} />
      </div>
    </div>
  )
}

MemoryComponent.propTypes = {
  total: React.PropTypes.string.isRequired,
  available: React.PropTypes.string.isRequired,
}

export default MemoryComponent
