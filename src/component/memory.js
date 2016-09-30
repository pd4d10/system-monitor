import React, { Component, PropTypes } from 'react'
import style from './memory.css'

const GEGA = 1024 * 1024 * 102

export default class MemoryComponent extends Component {
  render() {
    const { total, available, ratio } = this.props
    const memoryStyle = {
      width: `${100 - available / total * 100}%`,
    }

    return (
      <div>
        <h2>Memory</h2>
        <p className={style.tip}>{`total: ${total}G / available: ${available}G`}</p>
        <div className={style.data}>
          <div className={style.usage} style={memoryStyle}></div>
        </div>
      </div>
    )
  }
}

MemoryComponent.propTypes = {
  total: PropTypes.string.isRequired,
  available: PropTypes.string.isRequired,
}
