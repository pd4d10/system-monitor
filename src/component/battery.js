import React from 'react'
import Bar from './bar'
import { Tip, Title } from './styled'

const BatteryComponent = info =>
  info.isSupported ? (
    <div>
      <Title>Battery</Title>
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
