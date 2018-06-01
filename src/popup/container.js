import React, { Component } from 'react'
import { trigger } from '../utils'
import CpuComponent from './components/cpu'
import MemoryComponent from './components/memory'
import StorageComponent from './components/storage'
import BatteryComponent from './components/battery'
import { lifecycle, compose, withState, withStateHandlers } from 'recompose'

export default class Container extends Component {
  state = {
    cpu: {
      modelName: '',
      usage: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: [],
    battery: {
      isSupported: false,
      isCharging: false,
      level: 0,
      chargingtime: 0,
      dischargingTime: 0,
    },
  }

  componentDidMount() {
    // console.log(this.state)
    // Trigger CPU, memory and storage status update periodly
    trigger(false, this.setState.bind(this))

    // Battery
    if (typeof navigator.getBattery === 'function') {
      ;(async () => {
        this.setState({
          battery: {
            ...this.state.battery,
            isSupported: true,
          },
        })
        const _battery = await navigator.getBattery()

        const handleBatteryChange = () => {
          this.setState({
            battery: {
              ...this.state.battery,
              isCharging: _battery.charging,
              level: _battery.level,
              chargingTime: _battery.chargingTime,
              dischargingTime: _battery.dischargingTime,
            },
          })
        }

        handleBatteryChange()
        ;[
          'chargingchange',
          'levelchange',
          'chargingtimechange',
          'dischargingtimechange',
        ].forEach(event => {
          _battery.addEventListener(event, handleBatteryChange)
        })
      })()
    }
  }

  render() {
    const { cpu, memory, storage, battery } = this.state
    return (
      <div style={{ width: 230 }}>
        <CpuComponent {...cpu} />
        <MemoryComponent {...memory} />
        <BatteryComponent {...battery} />
        <StorageComponent storage={storage} />
        {location.search === '' && (
          <a
            href="#"
            style={{ outline: 'none' }}
            onClick={e => {
              e.preventDefault()
              const { clientWidth, clientHeight } = document.documentElement
              window.open(
                chrome.runtime.getURL('popup.html?window=1'),
                undefined,
                `width=${clientWidth},height=${clientHeight + 24}`,
              )
            }}
          >
            Open as new window
          </a>
        )}
      </div>
    )
  }
}
