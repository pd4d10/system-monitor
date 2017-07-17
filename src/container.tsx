import { h, Component } from 'preact';
import { trigger, toGiga, TriggerData, ParsedCpuInfo, MemoryInfo, StorageUnitInfo } from './util'
import CPUComponent from './component/cpu';
import MemoryComponent from './component/memory';
import StorageComponent from './component/storage';
import BatteryComponent from './component/battery'
import './container.less';

interface State {
  cpu: ParsedCpuInfo
  memory: MemoryInfo
  storage: StorageUnitInfo[]
  battery: {
     isSupported: boolean
      isCharging: boolean
      level: number
      chargingtime: number
      dischargingTime: number
  }
}
export default class Container extends Component<{}, State> {
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
  };

  private _battery: any;

  async componentDidMount() {
    // Trigger CPU, memory and storage status update periodly
    trigger(this.setState.bind(this));
    // Battery
    if (typeof navigator.getBattery !== 'function') {
      return
    }
    this.setState({
      battery: {
        ...this.state.battery,
        isSupported: true,
      }
    })
    this._battery = await navigator.getBattery()
    this.handleBatteryChange()
    ;['chargingchange', 'levelchange', 'chargingtimechange', 'dischargingtimechange'].forEach(event => {
      this._battery.addEventListener(event, this.handleBatteryChange)
    })
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

  handleOpen = (e: MouseEvent) => {
    e.preventDefault();
    const { clientWidth, clientHeight } = document.documentElement
    window.open(
      chrome.runtime.getURL('popup.html?window=1'),
      undefined,
      `width=${clientWidth},height=${clientHeight + 24}`
    );
  };

  render() {
    const { cpu, memory, storage } = this.state;
    return (
      <div className="container">
        <CPUComponent {...cpu} />
        <MemoryComponent {...memory} />
        <BatteryComponent
          {...this.state.battery}
        />
        <StorageComponent storage={storage} />
        {location.search === '' &&
          <a href="#" style={{ outline: 'none' }} onClick={this.handleOpen}>
            Open as new window
          </a>}
      </div>
    );
  }
}
