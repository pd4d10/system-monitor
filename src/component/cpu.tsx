import { h } from 'preact'
import './cpu.less'

const CPUComponent = ({ modelName, usage }) => (
  <div className="cpu">
    <h2>CPU</h2>
    <p>{modelName}</p>
    <ul className="tips">
      <li className="kernel">kernel</li>
      <li className="user">user</li>
    </ul>
    <ul className="usage">
      {usage.map(({ user, kernel, total }, index) => {
        const userStyle = {
          width: `${(user / total) * 100}%`,
        }
        const kernelStyle = {
          width: `${(kernel / total) * 100}%`,
        }
        return (
          <li key={index}>
            <div className="kernel" style={kernelStyle} />
            <div className="user" style={userStyle} />
          </li>
        )
      })}
    </ul>
  </div>
)

export default CPUComponent
