import { h } from 'preact'
// import './cpu.less'

interface Info {
  isSupported: boolean
  isCharging: boolean
  level: number
  chargingtime: number
  dischargingTime: number
}

const BatteryComponent = (info: Info) => info.isSupported && (
  <div className="battery">
    <div>{info.isCharging}</div>
    <div>{info.level}</div>
    <div>{info.chargingtime}</div>
    <div>{info.dischargingTime}</div>
  </div>
)

export default BatteryComponent
