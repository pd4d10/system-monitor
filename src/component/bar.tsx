import { h } from 'preact'

interface Usage {
  color: string
  ratio: number
}

interface Info {
  borderColor: string
  usages: Usage[]
}

const getContainerStyle = (color: string) => ({
  display: 'block',
  width: '220px',
  overflow: 'hidden',
  marginBottom: '4px',
  border: `1px solid ${color}`
})

const getChildSyle = (usage: Usage) => ({
  float: 'left',
  height: '10px',
  transition: 'width 0.5s',
  backgroundColor: usage.color,
  width: `${usage.ratio * 100}px`
})

const Bar = (info: Info) => (
  <div style={getContainerStyle(info.borderColor)}>
    {info.usages.map((usage, index) => (
      <div key={index.toString()} style={getChildSyle(usage)} />
    ))}
  </div>
)

export default Bar
