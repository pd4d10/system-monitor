import React, { PropTypes } from 'react'
import style from './cpu.css'

const CPUComponent = ({ modelName, usage }) => (
  <div className={style.cpu}>
    <h2>CPU</h2>
    <p>{modelName}</p>
    <ul className={style.tip}>
      <li className={style.kernel}>kernel</li>
      <li className={style.user}>user</li>
    </ul>
    <ul className={style.data}>
      {
        usage.map(({ user, kernel, total }, index) => {
          const userStyle = {
            width: `${(user / total) * 100}%`,
          }
          const kernelStyle = {
            width: `${(kernel / total) * 100}%`,
          }
          return (
            <li className={style.li} key={index}>
              <div className={style.kernel} style={kernelStyle} />
              <div className={style.user} style={userStyle} />
            </li>
          )
        })
      }
    </ul>
  </div>
)


CPUComponent.propTypes = {
  modelName: PropTypes.string.isRequired,
  usage: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default CPUComponent
