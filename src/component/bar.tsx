import { h } from 'preact'

interface Usage {
  color: string
  offset?: number
  ratio: number
}

interface Info {
  borderColor: string
  usages: Usage[]
}

const width = 220

const getContainerStyle = (color: string) => ({
  display: 'block',
  width: `${width}px`,
  height: '10px',
  marginBottom: '4px',
  border: `1px solid ${color}`,
  position: 'relative',
})

const getChildSyle = ({ ratio, offset, color }: Usage) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  transition: 'transform 0.5s',
  backgroundColor: color,
  transformOrigin: 'left top',
  transform: `${typeof offset === 'undefined' ? '' : `translateX(${offset * width}px) `}scaleX(${ratio})`
})

const Bar = (info: Info) => (
  <div style={getContainerStyle(info.borderColor)}>
    {info.usages.map((usage, index) => (
      <div key={index.toString()} style={getChildSyle(usage)} />
    ))}
  </div>
)

export default Bar
