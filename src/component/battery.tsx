import { h } from 'preact'
import Bar from './bar'

interface Info {
  isSupported: boolean
  isCharging: boolean
  level: number
  chargingtime: number
  dischargingTime: number
}

const BatteryComponent = (info: Info) =>
  info.isSupported
    ? <div className="battery">
        <h2>Battery</h2>
        <Bar
          usages={[
            {
              color: '#f00',
              ratio: info.level,
            },
          ]}
          borderColor="#f00"
        />
      </div>
    : null

export default BatteryComponent
