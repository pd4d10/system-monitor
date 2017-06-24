import { h, Component } from 'preact'
import { trigger, giga } from './util'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
// import BatteryComponent from './component/battery'
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
    // if (typeof navigator.getBattery !== 'function') {
    //   return
    // }
    // this.setState({
    //   battery: {
    //     ...this.state.battery,
    //     isSupported: true,
    //   }
    // })
    // this._battery = await navigator.getBattery()
    // this.handleBatteryChange()
    // ;['chargingchange', 'levelchange', 'chargingtimechange', 'dischargingtimechange'].forEach(event => {
    //   this._battery.addEventListener(event, this.handleBatteryChange)
    // })
  }

  handleBatteryChange = () => {
    this.setState({
      battery: {
        ...this.state.battery,
        isCharging: this._battery.charging,
        level: this._battery.level,
        chargingTime: this._battery.chargingTime,
        dischargingTime: this._battery.dischargingTime,
      }
    })
  }

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
        {/*<BatteryComponent
          {...this.state.battery}
        />*/}
      </div>
    )
  }
}
