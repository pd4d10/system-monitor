import React, { Component } from 'react'
import { map } from 'lodash'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'

export default class Root extends Component {
  constructor() {
    super()
    this.state = {
      archName: '',
      features: ''
    }
  }

  /**
   * get cpu and memory information
   * @param type
   */
  getInfo(type) {
    return new Promise((resolve, reject) => {
      try {
        chrome.system[type].getInfo(resolve)
      } catch (err) {
        reject(err)
      }
    })
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

  componentDidMount() {
    Promise.all(map(['cpu', 'memory'], this.getInfo))
    .then(([cpu, memory]) => {
      console.log(cpu, memory)
    })
  }

  render() {
    return (
      <div>
        <CPUComponent />
        <MemoryComponent />
      </div>
    )
  }
}