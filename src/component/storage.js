import React, { Component, PropTypes } from 'react'
import style from './storage.css'

export default class StorageComponent extends Component {
  giga(byte) {
    return (byte / (1024 * 1024 * 1024)).toFixed(2)
  }

  render() {
    const { storage } = this.props

    return (
      <div>
        <h2>Storage</h2>
        {
          storage.map(({ name, capacity, id }) => (
            <p className={style.tip} key={id}>{`${name} / ${this.giga(capacity)}G`}</p>
          ))
        }
      </div>
    )
  }
}

StorageComponent.propTypes = {
  storage: PropTypes.array.isRequired,
}
