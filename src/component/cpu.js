import React, { Component, PropTypes } from 'react'
import style from './cpu.css'

export default class CPUComponent extends PureComponent {
  render() {
    const { modelName, processors } = this.props

    return (
      <div>
        <h3>{modelName}</h3>
        <ul>
          {
            processors.map(({ user, kernel, total }) => {
              const userStyle = {
                float: 'left',
                background: '#f00',
                width: `${user / total * 100}%`,
                height: '10px',
                transition: 'width 0.5s'
              }
              const kernelStyle = {
                float: 'left',
                background: '#00f',
                width: `${kernel / total * 100}%`,
                height: '10px'
              }
              return (
                <li style={{width: '100px',background: '#0f0'}}>
                  <div style={userStyle}></div>
                  <div style={kernelStyle}></div>
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
