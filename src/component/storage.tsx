import { h } from 'preact'
import Tip from './tip'
import { giga } from '../util'

const StorageComponent = ({ storage }) => (
  <div>
    <h2>Storage</h2>
    {
      storage.map(({ name, capacity, id }) => (
        <Tip key={id}>{`${name || 'Unknown'} / ${giga(capacity)}G`}</Tip>
      ))
    }
  </div>
)

export default StorageComponent
