import React from 'react'
import Bar from './bar'
import { Tip, Title } from './styled'

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
    <Tip>{info.modelName}</Tip>
    <div style={{ overflow: 'hidden', margin: '8px 0' }}>
      <Icon color={colors.kernel} text="Kernel" />
      <Icon color={colors.user} text="User" />
    </div>
    {info.usage.map(({ user, kernel, total }, index) => (
      <Bar
        key={index}
        borderColor="#b3c3f3"
        usages={[
          {
            ratio: kernel / total,
            color: '#3a5eca',
          },
          {
            offset: kernel / total,
            ratio: user / total,
            color: '#6687e7',
          },
        ]}
      />
    ))}
  </div>
)

export default CpuComponent
