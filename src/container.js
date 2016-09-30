import React, { Component } from 'react'
import { map, zipWith, fill } from 'lodash'
import { compose, pick } from 'lodash/fp'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'

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
        availableCapacity: 1
      },
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
    Promise.all(map(['cpu', 'memory'], this.getSystemInfo))
    .then(([cpu, memory]) => {
      const num = cpu.numOfProcessors
      const data = cpu.processors
      const oldData = this.state.cpu.processors || this.getDefaultArray(num)
      const processors = zipWith(data, oldData, (a, b) => this.minus(a.usage, b.usage))

      this.setState({
        cpu,
        memory,
        processors,
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
      total: a.total - b.total
    }
  }

  /**
   * 4 => [{}, {}, {}, {}]
   */
  getDefaultArray(num) {
    return fill(Array(num), {})
  }

  giga(byte) {
    return byte / (1024 * 1024 * 1024)
  }

  componentDidMount() {
    this.updateStatePeriod()
  }

  render() {
    const { cpu, processors, memory } = this.state

    return (
      <div style={{ width: '220px' }}>
        <CPUComponent
          modelName={cpu.modelName}
          processors={processors}
        />
        <MemoryComponent
          total={this.giga(memory.capacity)}
          available={this.giga(memory.availableCapacity)}
        />
      </div>
    )
  }
}