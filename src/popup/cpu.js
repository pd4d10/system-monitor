import React from 'react'
import { Tip, Title, Bar } from './styled'

const colors = {
  kernel: '#3a5eca',
  user: '#6687e7',
  border: '#b3c3f3',
}

const Icon = ({ color, text }) => (
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

const CpuComponent = info => (
  <div>
    <Title>CPU</Title>
    <Tip>
      {info.modelName}
      {info.temperatures.length > 0 &&
        ` | ${info.temperatures.map(t => `${t}°C`).join(', ')}`}
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
)

export default CpuComponent
