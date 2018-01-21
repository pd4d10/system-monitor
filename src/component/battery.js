import { h } from 'preact'
import Bar from './bar'
import Tip from './tip'
const BatteryComponent = info =>
  info.isSupported ? (
    <div className="battery">
      <h2>Battery</h2>
      <Tip>
        {(info.level * 100).toFixed(2)}% ({info.isCharging
          ? 'Charging'
          : 'Not charging'})
      </Tip>
      <Bar
        usages={[
          {
            color: '#B6C8F5',
            ratio: info.level,
          },
        ]}
        borderColor="#B6C8F5"
      />
    </div>
  ) : null
export default BatteryComponent
