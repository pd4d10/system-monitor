import React, { PureComponent, PropTypes } from 'react'
import style from './cpu.css'

export default class CPUComponent extends PureComponent {
  render() {
    const { modelName, processors } = this.props

    return (
      <div className={style.cpu}>
        <h3>{modelName}</h3>
        <ul>
          {
            processors.map(({ user, kernel, total }) => {
              const userStyle = {
                width: `${user / total * 100}%`,
              }
              const kernelStyle = {
                width: `${kernel / total * 100}%`,
              }
              return (
                <li className={style.li}>
                  <div className={style.user} style={userStyle}></div>
                  <div className={style.kernel} style={kernelStyle}></div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

CPUComponent.propTypes = {
  modelName: PropTypes.string.isRequired,
  processors: PropTypes.arrayOf(PropTypes.Object).isRequired,
}
