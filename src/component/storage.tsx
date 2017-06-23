import * as React from 'react'
import { giga } from '../util'
import style from './storage.css'

const StorageComponent = ({ storage }) => (
  <div>
    <h2>Storage</h2>
    {
      storage.map(({ name, capacity, id }) => (
        <p className={style.tip} key={id}>{`${name || 'Unknown'} / ${giga(capacity)}G`}</p>
      ))
    }
  </div>
)

StorageComponent.propTypes = {
  storage: React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
}

export default StorageComponent
