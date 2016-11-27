import React, { Component } from 'react'
import { trigger } from './util'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import style from './container.css'

export default class Container extends Component {
  static giga(byte) {
    return (byte / (1024 * 1024 * 1024)).toFixed(2)
  }

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
    trigger(({ cpu, memory }) => {
      this.setState({
        cpu,
        memory,
      })
    })
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
          total={Container.giga(memory.capacity)}
          available={Container.giga(memory.availableCapacity)}
        />
        <StorageComponent
          storage={storage}
        />
      </div>
    )
  }
}
