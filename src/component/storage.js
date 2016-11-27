import React, { PropTypes } from 'react'
import { giga } from '../util'
import style from './storage.css'

const StorageComponent = ({ storage }) => (
  <div>
    <h2>Storage</h2>
    {
      storage.map(({ name, capacity, id }) => (
        <p className={style.tip} key={id}>{`${name} / ${giga(capacity)}G`}</p>
      ))
    }
  </div>
)

StorageComponent.propTypes = {
  storage: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
}

export default StorageComponent
