import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { getSystemInfo, storage } from '../utils'
import CpuComponent from './cpu'
import MemoryComponent from './memory'
import StorageComponent from './storage'
import BatteryComponent from './battery'

class Container extends Component {
  state = {
    status: {
      cpu: false,
      memory: false,
      storage: false,
      battery: false,
    },
    supportBatteryAPI: false,
    cpu: {
      modelName: '',
      usage: [],
      temperatures: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: { storage: [] },
    battery: {
      isSupported: false,
      isCharging: false,
      level: 0,
      chargingtime: 0,
      dischargingTime: 0,
    },
  }

  addBatteryListener = async () => {
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
  }

  async componentDidMount() {
    const status = await storage.getPopupStatus()
    this.setState({ status }, async () => {
      // Trigger CPU, memory and storage status update periodly
      getSystemInfo(status, this.setState.bind(this))

      // Battery
      if (typeof navigator.getBattery === 'function') {
        this.setState({
          supportBatteryAPI: true,
        })
        this.addBatteryListener()
      }
    })
  }

  render() {
    const { state } = this

    return (
      <div style={{ width: 230 }}>
        {state.status.cpu && <CpuComponent {...state.cpu} />}
        {state.status.memory && <MemoryComponent {...state.memory} />}
        {state.status.battery && state.supportBatteryAPI && (
          <BatteryComponent {...state.battery} />
        )}
        {state.status.storage && <StorageComponent {...state.storage} />}
        {location.search === '' && (
          <div style={{ lineHeight: 1.5, marginTop: 8 }}>
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
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
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
              onClick={e => {
                e.preventDefault()
                chrome.runtime.openOptionsPage()
              }}
            >
              Settings
            </a>
          </div>
        )}
      </div>
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<Container />, root)
