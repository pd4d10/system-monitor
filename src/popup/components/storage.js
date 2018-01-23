import React from 'react'
import { Tip, Title } from './styled'
import { toGiga } from '../../utils'

const StorageComponent = ({ storage }) => (
  <div>
    <Title>Storage</Title>
    {storage.map(({ name, capacity, id }) => (
      <Tip key={id}>{`${name || 'Unknown'} / ${toGiga(capacity)}GB`}</Tip>
    ))}
  </div>
)

export default StorageComponent
