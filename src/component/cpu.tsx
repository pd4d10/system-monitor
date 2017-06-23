import { h } from 'preact'
import './cpu.less'

interface Usage {
  user: number
  kernel: number
  total: number
}

interface Info {
  modelName: string
  usage: Usage[]
}

const CPUComponent = (info: Info) => (
  <div className="cpu">
    <h2>CPU</h2>
    <p>{info.modelName}</p>
    <ul className="tips">
      <li className="kernel">kernel</li>
      <li className="user">user</li>
    </ul>
    <ul className="usage">
      {info.usage.map(({ user, kernel, total }, index) => {
        const userStyle = {
          width: `${(user / total) * 100}%`,
        }
        const kernelStyle = {
          width: `${(kernel / total) * 100}%`,
        }
        return (
          <li key={index.toString()}>
            <div className="kernel" style={kernelStyle} />
            <div className="user" style={userStyle} />
          </li>
        )
      })}
    </ul>
  </div>
)

export default CPUComponent
