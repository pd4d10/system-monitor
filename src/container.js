import React, { Component } from 'react'
import { map, zipWith, fill } from 'lodash'
import { compose, pick } from 'lodash/fp'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import style from './container.css'

export default class Container extends Component {
  constructor() {
    super()
    this.state = {
      cpu: {
        modelName: '',
      },
      processors: [],
      memory: {
        capacity: 1,
        availableCapacity: 1,
      },
      storage: [],
    }
  }

  /**
   * get cpu and memory information
   * @param type
   */
  getSystemInfo(type) {
    return new Promise((resolve, reject) => {
      try {
        chrome.system[type].getInfo(resolve)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * set state period
   */
  updateStatePeriod() {
    Promise.all(map(['cpu', 'memory', 'storage'], this.getSystemInfo))
    .then(([cpu, memory, storage]) => {
      const num = cpu.numOfProcessors
      const data = cpu.processors
      const oldData = this.state.cpu.processors || this.getDefaultArray(num)
      const processors = zipWith(data, oldData, (a, b) => this.minus(a.usage, b.usage))

      this.setState({
        cpu,
        memory,
        processors,
        storage,
      })
    })

    setTimeout(() => {
      this.updateStatePeriod()
    }, 1000)
  }

  minus(a, b = {
    user: 0,
    kernel: 0,
    total: 0,
  }) {
    return {
      user: a.user - b.user,
      kernel: a.kernel - b.kernel,
      total: a.total - b.total,
    }
  }

  /**
   * 4 => [{}, {}, {}, {}]
   */
  getDefaultArray(num) {
    return fill(Array(num), {})
  }

  giga(byte) {
    return (byte / (1024 * 1024 * 1024)).toFixed(2)
  }

  componentDidMount() {
    this.updateStatePeriod()
  }

  render() {
    const { cpu, processors, memory, storage } = this.state

    return (
      <div className={style.container}>
        <CPUComponent
          modelName={cpu.modelName}
          processors={processors}
        />
        <MemoryComponent
          total={this.giga(memory.capacity)}
          available={this.giga(memory.availableCapacity)}
        />
        <StorageComponent
          storage={storage}
        />
      </div>
    )
  }
}
