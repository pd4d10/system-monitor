import React, { Component, PropTypes } from 'react'

const GEGA = 1024 * 1024 * 102

export default class MemoryComponent extends PureComponent {
  render() {
    const { total, available, ratio } = this.props

    return (
      <div>
        {total} /
        {available} /
        {ratio}
      </div>
    )
  }
}

MemoryComponent.propTypes = {
  total: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
}
