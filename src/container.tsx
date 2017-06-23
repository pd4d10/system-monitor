import { h, Component } from 'preact'
import { trigger, giga } from './util'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import BatteryComponent from './component/battery'
import './container.less'

export default class Container extends Component<undefined, undefined> {
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
    }
  }

  private _battery: any

  async componentDidMount() {
    // Trigger CPU, memory and storage status update periodly
    trigger(this.setState.bind(this))
     // Battery
    if (typeof navigator.getBattery !== 'function') {
      return
    }
    this.setBattery('isSupported', true)
    this._battery = await navigator.getBattery()
    this._battery.addEventListener('chargingchange', this.handleChargingChange)
    this._battery.addEventListener('levelchange', this.handleLevelChange)
    this._battery.addEventListener('chargingtimechange', this.handleChargingTimeChange)
    this._battery.addEventListener('dischargingtimechange', this.handleDischargingTimeChange);
  }

  setBattery = (key: string, value) => {
    this.setState({
      battery: {
        ...this.state.battery,
        [key]: value,
      }
    })
  }

  handleChargingChange = () => this.setBattery('isCharging', this._battery.charging)
  handleLevelChange = () => this.setBattery('level', this._battery.level)
  handleChargingTimeChange = () => this.setBattery('chargingTime', this._battery.chargingTime)
  handleDischargingTimeChange = () => this.setBattery('dischargingTime', this._battery.dischargingTime)

  render() {
    const { cpu, memory, storage } = this.state

    return (
      <div className="container">
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
        <BatteryComponent
          {...this.state.battery}
        />
      </div>
    )
  }
}
