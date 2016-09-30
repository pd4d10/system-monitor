import React, { PureComponent, PropTypes } from 'react'
import style from './memory.css'

const GEGA = 1024 * 1024 * 102

export default class MemoryComponent extends PureComponent {
  render() {
    const { total, available, ratio } = this.props
    const memoryStyle = {
      width: `${100 - available / total * 100}%`,
    }

    return (
      <div>
        <h2>Memory</h2>
        <div>{total} / {available} / {ratio}</div>
        <div className={style.data}>
          <div className={style.usage} style={memoryStyle}></div>
        </div>
      </div>
    )
  }
}

MemoryComponent.propTypes = {
  total: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
}
