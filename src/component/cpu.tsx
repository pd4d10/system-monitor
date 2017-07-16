import { h } from 'preact'
import { ParsedCpuInfo } from '../util'
import Bar from './bar'
import Tip from './tip'
import './cpu.less'

const CPUComponent = (info: ParsedCpuInfo) =>
  <div className="cpu">
    <h2>CPU</h2>
    <Tip>
      {info.modelName}
    </Tip>
    <ul className="tips">
      <li className="kernel">kernel</li>
      <li className="user">user</li>
    </ul>
    <ul className="usage">
      {info.usage.map(({ user, kernel, total }, index) => {
        const usages = [
          {
            ratio: kernel / total,
            color: '#3a5eca',
          },
          {
            offset: kernel / total,
            ratio: user / total,
            color: '#6687e7',
          },
        ]
        return <Bar borderColor="#b3c3f3" usages={usages} />
      })}
    </ul>
  </div>

export default CPUComponent
