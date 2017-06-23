import { h } from 'preact'
import { giga } from '../util'

const StorageComponent = ({ storage }) => (
  <div>
    <h2>Storage</h2>
    {
      storage.map(({ name, capacity, id }) => (
        <p style={{fontSize: '14px'}} key={id}>{`${name || 'Unknown'} / ${giga(capacity)}G`}</p>
      ))
    }
  </div>
)

export default StorageComponent
