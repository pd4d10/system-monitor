import React, { FC, Component } from 'react'
import { getSystemInfo, storage, toGiga } from './utils'

const width = 220

const Tip: FC = ({ children }) => (
  <p style={{ fontSize: 14, margin: '4px 0' }}>{children}</p>
)

const Title: FC = ({ children }) => (
  <h2 style={{ margin: '8px 0' }}>{children}</h2>
)

const Bar: FC<{
  borderColor: string
  usages: {
    offset?: number
    ratio: number
    color: string
  }[]
}> = (info) => (
  <div
    style={{
      display: 'block',
      width: `${width}px`,
      height: '10px',
      marginBottom: '4px',
      border: `1px solid ${info.borderColor}`,
      position: 'relative',
    }}
  >
    {info.usages.map(({ ratio, offset, color }, index) => (
      <div
        key={index.toString()}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          transition: 'transform 0.5s',
          backgroundColor: color,
          transformOrigin: 'left top',
          transform: `${
            typeof offset === 'undefined'
              ? ''
              : `translateX(${offset * width}px) `
          }scaleX(${ratio})`,
        }}
      />
    ))}
  </div>
)

const Icon: FC<{ color: string; text: string }> = ({ color, text }) => (
  <div
    style={{
      lineHeight: '12px',
      fontSize: 14,
      float: 'left',
      marginRight: 8,
    }}
  >
    <div
      style={{
        backgroundColor: color,
        verticalAlign: 'top',
        width: '12px',
        height: '12px',
        marginRight: '2px',
        display: 'inline-block',
      }}
    />
    {text}
  </div>
)

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
    storage: [],
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
    ].forEach((event) => {
      _battery.addEventListener(event, handleBatteryChange)
    })
  }

  async componentDidMount() {
    const status = await storage.getPopupStatus()
    this.setState({ status }, async () => {
      // Trigger CPU, memory and storage status update periodly
      getSystemInfo(status, (data) => {
        console.log(data)
        this.setState(data)
      })

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
    const info = state.cpu

    const colors = {
      kernel: '#3a5eca',
      user: '#6687e7',
      border: '#b3c3f3',
    }

    return (
      <div style={{ width: 230 }}>
        {state.status.cpu && (
          <div>
            <Title>CPU</Title>
            <Tip>
              {info.modelName}
              {info.temperatures.length > 0 &&
                ` | ${info.temperatures.map((t) => `${t}°C`).join(', ')}`}
            </Tip>
            <div style={{ overflow: 'hidden', margin: '8px 0' }}>
              <Icon color={colors.kernel} text="Kernel" />
              <Icon color={colors.user} text="User" />
            </div>
            {info.usage.map(({ user, kernel, total }, index) => (
              <Bar
                key={index}
                borderColor={colors.border}
                usages={[
                  {
                    ratio: kernel / total,
                    color: colors.kernel,
                  },
                  {
                    offset: kernel / total,
                    ratio: user / total,
                    color: colors.user,
                  },
                ]}
              />
            ))}
          </div>
        )}
        {state.status.memory && (
          <div>
            <Title>Memory</Title>
            <Tip>
              Available: {toGiga(state.memory.availableCapacity)}GB/
              {toGiga(state.memory.capacity)}GB
            </Tip>
            <Bar
              borderColor="#8fd8d4"
              usages={[
                {
                  color: '#198e88',
                  ratio:
                    1 - state.memory.availableCapacity / state.memory.capacity,
                },
              ]}
            />
          </div>
        )}
        {state.status.battery && state.supportBatteryAPI && (
          <div>
            <Title>Battery</Title>
            <Tip>
              {(state.battery.level * 100).toFixed(2)}% (
              {state.battery.isCharging ? 'Charging' : 'Not charging'})
            </Tip>
            <Bar
              usages={[
                {
                  color: '#B6C8F5',
                  ratio: state.battery.level,
                },
              ]}
              borderColor="#B6C8F5"
            />
          </div>
        )}
        {state.status.storage && (
          <div>
            <Title>Storage</Title>
            {state.storage.map(({ name, capacity, id }) => (
              <Tip key={id}>{`${name || 'Unknown'} / ${toGiga(
                capacity
              )}GB`}</Tip>
            ))}
          </div>
        )}
        {location.search === '' && (
          <div style={{ lineHeight: 1.5, marginTop: 8 }}>
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
              onClick={(e) => {
                e.preventDefault()
                const { clientWidth, clientHeight } = document.documentElement
                window.open(
                  chrome.runtime.getURL('dist/popup.html?window=1'),
                  undefined,
                  `width=${clientWidth},height=${clientHeight + 24}`
                )
              }}
            >
              Open as new window
            </a>
            <a
              href="#"
              style={{ outline: 'none', display: 'block' }}
              onClick={(e) => {
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

export default Container
