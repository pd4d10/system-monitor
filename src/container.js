import React, { Component } from 'react'
import { trigger } from './util'
import CpuComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import BatteryComponent from './component/battery'
import { lifecycle, compose, withState, withStateHandlers } from 'recompose'

const Container = ({ cpu, memory, storage, battery }) => (
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

export default compose(
  lifecycle({
    state: {
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
    },
    componentDidMount() {
      console.log(this.state)
      // Trigger CPU, memory and storage status update periodly
      trigger(this.setState.bind(this))

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
    },
  }),
)(Container)
