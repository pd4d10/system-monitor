import * as React from 'react'
import { trigger, giga } from './util'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import style from './container.css'

export default class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      cpu: {
        modelName: '',
        usage: [],
      },
      memory: {
        capacity: 1,
        availableCapacity: 1,
      },
      storage: [],
    }
  }

  componentDidMount() {
    trigger(this.setState.bind(this))
  }

  render() {
    const { cpu, memory, storage } = this.state

    return (
      <div className={style.container}>
        <CPUComponent
          modelName={cpu.modelName}
          usage={cpu.usage}
        />
        <MemoryComponent
          total={giga(memory.capacity)}
          available={giga(memory.availableCapacity)}
        />
        <StorageComponent
          storage={storage}
        />
      </div>
    )
  }
}
